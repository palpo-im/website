# Using a Reverse Proxy

It is recommended to place a reverse proxy such as
[nginx](https://nginx.org/en/docs/http/ngx_http_proxy_module.html),
[Apache](https://httpd.apache.org/docs/current/mod/mod_proxy_http.html),
[Caddy](https://caddyserver.com/docs/quick-starts/reverse-proxy),
[HAProxy](https://www.haproxy.org/) or
[relayd](https://man.openbsd.org/relayd.8) in front of Palpo.
Doing so lets you expose the default HTTPS port (443) to Matrix
clients without forcing Palpo to bind to a privileged port (any port below
1024).

Configure the proxy to forward any request whose path begins with `/_matrix` or `/_palpo/client` to Palpo, and make sure it adds the `X-Forwarded-For` and `X-Forwarded-Proto` headers.

Keep in mind that Matrix clients and remote homeservers don’t have to use the same hostname or port. Clients default to 443, while federation traffic normally arrives on 8448.
When these are different, we speak of a “client port” and a “federation port.” The [Matrix specification](https://matrix.org/docs/spec/server_server/latest#resolving-server-names) explains the algorithm in detail, and the [Delegation](delegation.md) page shows how to set it up.

**NOTE**: Your reverse proxy must not `canonicalize` or `normalize`
the requested URI in any way (for example, by decoding `%xx` escapes).

Let's assume that we expect clients to connect to our server at
`https://matrix.example.com`, and other servers to connect at
`https://example.com:8448`.  The following sections detail the configuration of
the reverse proxy and the homeserver.

## Homeserver Configuration

The HTTP configuration will need to be updated for Palpo to correctly record client IP addresses and generate redirect URLs while behind a reverse proxy.

In `palpo.toml` set `x_forwarded: true` in the port 8008 section and consider setting `bind_addresses: ['127.0.0.1']` so that the server only
listens to traffic on localhost. (Do not change `bind_addresses` to `127.0.0.1` when using a containerized Palpo, as that will prevent it from responding
to proxied traffic.)

Optionally, you can also set
[`request_id_header`](./usage/configuration/config_documentation.md#listeners)
so that the server extracts and re-uses the same request ID format that the
reverse proxy is using.

## Reverse-proxy configuration examples

**NOTE**: You only need one of these.

### nginx

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;

    # For the federation port
    listen 8448 ssl default_server;
    listen [::]:8448 ssl default_server;

    server_name matrix.example.com;

    location ~ ^(/_matrix|/_palpo/client) {
        # note: do not add a path (even a single /) after the port in `proxy_pass`,
        # otherwise nginx will canonicalise the URI and cause signature verification
        # errors.
        proxy_pass http://localhost:8008;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $host:$server_port;

        # Nginx by default only allows file uploads up to 1M in size
        # Increase client_max_body_size to match max_upload_size defined in homeserver.yaml
        client_max_body_size 50M;

        # Palpo responses may be chunked, which is an HTTP/1.1 feature.
        proxy_http_version 1.1;
    }
}
```

### Caddy v2

```
matrix.example.com {
  reverse_proxy /_matrix/* localhost:8008
  reverse_proxy /_palpo/client/* localhost:8008
}

example.com:8448 {
  reverse_proxy /_matrix/* localhost:8008
}
```

[Delegation](delegation.md) example:

```
example.com {
	header /.well-known/matrix/* Content-Type application/json
	header /.well-known/matrix/* Access-Control-Allow-Origin *
	respond /.well-known/matrix/server `{"m.server": "matrix.example.com:443"}`
	respond /.well-known/matrix/client `{"m.homeserver":{"base_url":"https://matrix.example.com"},"m.identity_server":{"base_url":"https://identity.example.com"}}`
}

matrix.example.com {
    reverse_proxy /_matrix/* localhost:8008
    reverse_proxy /_palpo/client/* localhost:8008
}
```

### Apache

```apache
<VirtualHost *:443>
    SSLEngine on
    ServerName matrix.example.com

    RequestHeader set "X-Forwarded-Proto" expr=%{REQUEST_SCHEME}
    AllowEncodedSlashes NoDecode
    ProxyPreserveHost on
    ProxyPass /_matrix http://127.0.0.1:8008/_matrix nocanon
    ProxyPassReverse /_matrix http://127.0.0.1:8008/_matrix
    ProxyPass /_palpo/client http://127.0.0.1:8008/_palpo/client nocanon
    ProxyPassReverse /_palpo/client http://127.0.0.1:8008/_palpo/client
</VirtualHost>

<VirtualHost *:8448>
    SSLEngine on
    ServerName example.com

    RequestHeader set "X-Forwarded-Proto" expr=%{REQUEST_SCHEME}
    AllowEncodedSlashes NoDecode
    ProxyPass /_matrix http://127.0.0.1:8008/_matrix nocanon
    ProxyPassReverse /_matrix http://127.0.0.1:8008/_matrix
</VirtualHost>
```

**NOTE**: ensure the  `nocanon` options are included.

**NOTE 2**: It appears that Palpo is currently incompatible with the ModSecurity module for Apache (`mod_security2`). If you need it enabled for other services on your web server, you can disable it for Palpo's two VirtualHosts by including the following lines before each of the two `</VirtualHost>` above:

```apache
<IfModule security2_module>
    SecRuleEngine off
</IfModule>
```

**NOTE 3**: Missing `ProxyPreserveHost on` can lead to a redirect loop.

### HAProxy

```
frontend https
  bind *:443,[::]:443 ssl crt /etc/ssl/haproxy/ strict-sni alpn h2,http/1.1
  http-request set-header X-Forwarded-Proto https if { ssl_fc }
  http-request set-header X-Forwarded-Proto http if !{ ssl_fc }
  http-request set-header X-Forwarded-For %[src]

  # Matrix client traffic
  acl matrix-host hdr(host) -i matrix.example.com matrix.example.com:443
  acl matrix-path path_beg /_matrix
  acl matrix-path path_beg /_palpo/client

  use_backend matrix if matrix-host matrix-path

frontend matrix-federation
  bind *:8448,[::]:8448 ssl crt /etc/ssl/haproxy/palpo.pem alpn h2,http/1.1
  http-request set-header X-Forwarded-Proto https if { ssl_fc }
  http-request set-header X-Forwarded-Proto http if !{ ssl_fc }
  http-request set-header X-Forwarded-For %[src]

  default_backend matrix

backend matrix
  server matrix 127.0.0.1:8008
```

Example configuration, if using a UNIX socket. The configuration lines regarding the frontends do not need to be modified.

```
backend matrix
  server matrix unix@/run/palpo/main_public.sock
```

Example configuration when using a single port for both client and federation traffic.

```
frontend https
  bind *:443,[::]:443 ssl crt /etc/ssl/haproxy/ strict-sni alpn h2,http/1.1
  http-request set-header X-Forwarded-Proto https if { ssl_fc }
  http-request set-header X-Forwarded-Proto http  if !{ ssl_fc }
  http-request set-header X-Forwarded-For %[src]

  acl matrix-host hdr(host) -i matrix.example.com matrix.example.com:443
  acl matrix-sni  ssl_fc_sni   matrix.example.com
  acl matrix-path path_beg     /_matrix
  acl matrix-path path_beg     /_palpo/client

  use_backend matrix if matrix-host matrix-path
  use_backend matrix if matrix-sni

backend matrix
  server matrix 127.0.0.1:8008
```

[Delegation](delegation.md) example:

```
frontend https
  acl matrix-well-known-client-path path /.well-known/matrix/client
  acl matrix-well-known-server-path path /.well-known/matrix/server
  use_backend matrix-well-known-client if matrix-well-known-client-path
  use_backend matrix-well-known-server if matrix-well-known-server-path
 
backend matrix-well-known-client
  http-after-response set-header Access-Control-Allow-Origin "*"
  http-after-response set-header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
  http-after-response set-header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  http-request return status 200 content-type application/json string '{"m.homeserver":{"base_url":"https://matrix.example.com"},"m.identity_server":{"base_url":"https://identity.example.com"}}'

backend matrix-well-known-server
  http-after-response set-header Access-Control-Allow-Origin "*"
  http-after-response set-header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
  http-after-response set-header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  http-request return status 200 content-type application/json string '{"m.server":"matrix.example.com:443"}'
```

### Relayd

```
table <webserver>    { 127.0.0.1 }
table <matrixserver> { 127.0.0.1 }

http protocol "https" {
    tls { no tlsv1.0, ciphers "HIGH" }
    tls keypair "example.com"
    match header set "X-Forwarded-For"   value "$REMOTE_ADDR"
    match header set "X-Forwarded-Proto" value "https"

    # set CORS header for .well-known/matrix/server, .well-known/matrix/client
    # httpd does not support setting headers, so do it here
    match request path "/.well-known/matrix/*" tag "matrix-cors"
    match response tagged "matrix-cors" header set "Access-Control-Allow-Origin" value "*"

    pass quick path "/_matrix/*"         forward to <matrixserver>
    pass quick path "/_palpo/client/*" forward to <matrixserver>

    # pass on non-matrix traffic to webserver
    pass                                 forward to <webserver>
}

relay "https_traffic" {
    listen on egress port 443 tls
    protocol "https"
    forward to <matrixserver> port 8008 check tcp
    forward to <webserver>    port 8080 check tcp
}

http protocol "matrix" {
    tls { no tlsv1.0, ciphers "HIGH" }
    tls keypair "example.com"
    block
    pass quick path "/_matrix/*"         forward to <matrixserver>
    pass quick path "/_palpo/client/*" forward to <matrixserver>
}

relay "matrix_federation" {
    listen on egress port 8448 tls
    protocol "matrix"
    forward to <matrixserver> port 8008 check tcp
}
```


## Health check endpoint

Palpo exposes a health check endpoint for use by reverse proxies.
Each configured HTTP listener has a `/health` endpoint which always returns
200 OK (and doesn't get logged).

## Palpo administration endpoints

Endpoints for administering your Palpo instance are placed under
`/_palpo/admin`. These require authentication through an access token of an
admin user. However as access to these endpoints grants the caller a lot of power,
we do not recommend exposing them to the public internet without good reason.
