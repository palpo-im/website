# Using Forward/Outbound Proxies

You can configure Palpo to work with forward or outbound proxies. This is often required in corporate network environments (such as DMZs).

Palpo supports routing outbound HTTP(S) requests through a proxy. Only HTTP(S) proxies are supported; SOCKS proxies or other types are not supported.

## Configuration

Proxy settings can be specified using the environment variables `http_proxy`, `https_proxy`, and `no_proxy`. The environment variable names are case-insensitive.
- `http_proxy`: The proxy server for HTTP requests.
- `https_proxy`: The proxy server for HTTPS requests.
- `no_proxy`: A comma-separated list of hosts, IP addresses, or IP ranges in CIDR notation that should be accessed directly, bypassing the proxy. Palpo will connect directly to these hosts.

The format for `http_proxy` and `https_proxy` is: `[scheme://][<username>:<password>@]<host>[:<port>]`
- Supported schemes are `http://` and `https://`. The default scheme is `http://` (for compatibility), but it is recommended to explicitly specify the scheme. If the scheme is `https://`, the connection between Palpo and the proxy will use TLS.

  **Note**: Palpo validates certificates. If a certificate is invalid, the connection will be rejected.
- The default port is `1080` (if not specified).
- Username and password are optional and used for proxy authentication.

**Examples**
- HTTP_PROXY=http://USERNAME:PASSWORD@10.0.1.1:8080/
- HTTPS_PROXY=http://USERNAME:PASSWORD@proxy.example.com:8080/
- NO_PROXY=master.hostname.example.com,10.1.0.0/16,172.30.0.0/16

**Note**:
Palpo does not apply IP blacklists to connections made through a proxy (because DNS resolution is performed by the proxy). Typically, IP blacklisting should be handled by the proxy or firewall.

## Connection Types

The following scenarios **will use** the proxy:

- Push operations
- URL previews
- Remote statistics (phone-home stats)
- reCAPTCHA verification
- CAS authentication validation
- OpenID Connect
- Outbound federation
- Federation (checking public key revocation)
- Fetching public keys from other servers
- Downloading remote media

The following scenarios **will not use** the proxy:

- Application Services
- Identity servers
- In worker configurations:
  - Connections between workers
  - Connections from workers to Redis

## Troubleshooting

If the proxy server uses TLS (HTTPS) and a connection cannot be established, it is often due to a proxy certificate issue. You can temporarily disable certificate validation in Palpo for testing purposes.

**Note**: This operation carries security risks and should only be used for testing!
{/* 本行由工具自动生成,原文哈希值:78d55887749827f8fe3142bba8acbbee */}