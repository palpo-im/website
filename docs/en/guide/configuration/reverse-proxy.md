# Reverse Proxy

You can place a reverse proxy in front of Palpo, such as nginx, Apache, Caddy, HAProxy, or relayd.

The advantage of doing so is that it allows exposing the default HTTPS port (443) to Matrix clients without requiring Palpo to bind to a privileged port (port numbers less than 1024).

You should configure the reverse proxy to forward requests to `/_matrix` and have it set the `X-Forwarded-For` and `X-Forwarded-Proto` request headers.

**Important Note**: Matrix clients and other Matrix servers do not necessarily connect to your server through the same server name or port. Clients use port 443 by default, while servers use port 8448 by default. We refer to these as the "client port" and the "federation port" respectively. 
> For more detailed information on the algorithm used for federation connections, refer to the Matrix specification (https://spec.matrix.org/latest/).
> For instructions on setting up delegation, see the [Delegation](./delegation.html) section.


**Note** 

> Your reverse proxy must not canonicalize or normalize the request URI in any way (e.g., by decoding escape characters).

> Core principle: The reverse proxy should be a transparent pipe, forwarding the raw request unchanged to the backend.

## Palpo Server Configuration

Assuming clients connect to the server via `https://matrix.example.com`. Other Matrix servers connect to the server via `https://example.com:8448`.
The HTTP configuration needs to be updated so that Palpo correctly logs client IP addresses and generates redirect URLs when behind a reverse proxy.

Set the following in your `palpo.toml` configuration file:

```toml
# Local address the server listens on
# Use 127.0.0.1 to only accept connections from localhost (recommended when using a reverse proxy)
listen_addr = "127.0.0.1:8008"
```

When using a reverse proxy, you should also configure the `[well_known]` section to ensure clients and federation servers can discover your homeserver correctly:

```toml
[well_known]
# URL that clients will use (your public address)
client = "https://matrix.example.com"
# Federation address (other Matrix servers)
server = "matrix.example.com:443"
```

Note: If you are running Palpo in a container, keep `listen_addr` set to `0.0.0.0:8008` to allow the reverse proxy to access Palpo within the container network.


**Important**: It is recommended to set the server to only listen on localhost traffic. However, please note that if using containerized Synapse, do not make this change as it will prevent it from responding to proxy traffic.

Alternatively, you can also configure: request_id_header, so that the server extracts and reuses the same request ID format used by the reverse proxy.

## Proxy Services


## Caddy
We provide an out-of-the-box [caddy-docker-proxy](https://github.com/palpo-im/palpo/blob/main/deploy/docker/compose.with-caddy.yml) setup. This configuration adds [Caddy](https://caddyserver.com/) as a reverse proxy server. When using it, replace all `example.com` placeholders with your own domain name. Also, you need to configure `palpo.toml` in the current directory, refer to [palpo.toml](https://github.com/palpo-im/palpo/blob/main/deploy/docker/palpo.toml).

Create the `caddy` network before starting:

```bash
docker network create caddy
```
Start services:
```bash
docker compose up -d
```
## traefik

We provide an out-of-the-box [traefik-docker-proxy](https://github.com/palpo-im/palpo/blob/main/deploy/docker/compose.with-traefik.yml) setup. This configuration adds [Traefik](https://traefik.io/) as a reverse proxy server. When using it, replace all `your_domain.com` placeholders with your own domain name. Also, you need to configure `palpo.toml` in the current directory, refer to [palpo.toml](https://github.com/palpo-im/palpo/blob/main/deploy/docker/palpo.toml).

If you have already set up `traefik`, please refer to this configuration [compose.for-traefik.yml](https://github.com/palpo-im/palpo/blob/main/deploy/docker/compose.for-traefik.yml).

Start services:

```bash
docker compose up -d
```
