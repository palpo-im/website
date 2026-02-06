# Reverse Proxy

You can place a reverse proxy in front of Palpo, such as nginx, Apache, Caddy, HAProxy, or relayd.

The advantage of doing so is that it allows exposing the default HTTPS port (443) to Matrix clients without requiring Palpo to bind to a privileged port (port numbers less than 1024).

You should configure the reverse proxy to forward requests to `/_matrix` and have it set the `X-Forwarded-For` and `X-Forwarded-Proto` request headers.

Keep in mind that Matrix clients and other Matrix servers do not necessarily need to connect to your server via the same server name or port. Clients use port 443 by default, while servers use port 8448 by default. If these are different, we refer to them as the "client port" and the "federation port," respectively. For more detailed information on the algorithm used for federation connections, refer to the Matrix specification; for instructions on setting up delegation, see [Delegation](./delegation.html).

Note: Your reverse proxy must not canonicalize or normalize the request URI in any way (e.g., by decoding escape characters).

Assuming we expect clients to connect to our server at https://matrix.example.com, while other servers connect to https://example.com:8448. The following sections detail the configuration of the reverse proxy and the main server.

## Main Server Configuration

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
# URL that clients will use to connect (your public-facing address)
client = "https://matrix.example.com"
# Address for federation (other Matrix servers)
server = "matrix.example.com:443"
```

Note: If you are running Palpo in a container, keep `listen_addr` set to `0.0.0.0:8008` to allow the reverse proxy to reach Palpo within the container network.
{/* 本行由工具自动生成,原文哈希值:c32173f0a942657ba12cc2494100fb34 */}