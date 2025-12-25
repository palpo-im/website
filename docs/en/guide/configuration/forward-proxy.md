# Using Forward/Outbound Proxies

You can configure Palpo to work with forward or outbound proxies. This is often required in corporate environments (e.g., DMZ networks).  
Palpo supports routing outbound HTTP(S) requests through a proxy. Only HTTP(S) proxies are supported; SOCKS or other proxy types are not supported.

## Configuration

Proxy settings can be specified using the environment variables `http_proxy`, `https_proxy`, and `no_proxy`. Environment variable names are case-insensitive.  
- `http_proxy`: Proxy server for HTTP requests.  
- `https_proxy`: Proxy server for HTTPS requests.  
- `no_proxy`: Comma-separated list of hosts, IP addresses, or IP ranges in CIDR notation that should be accessed directly, bypassing the proxy.

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
Palpo does not apply IP blacklisting to connections made through a proxy (since DNS resolution is performed by the proxy). IP blacklisting should typically be handled by the proxy or firewall.

## Connection Types

The following scenarios **will use** the proxy:  
- Push  
- URL previews  
- Remote statistics (phone-home stats)  
- Recaptcha verification  
- CAS authentication verification  
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

If the proxy server uses TLS (HTTPS) and a connection cannot be established, it is often due to proxy certificate issues. You can temporarily disable Palpo's certificate validation for testing purposes.

**Note**: This operation carries security risks and should only be used for testing!  

To disable certificate validation, add the following configuration to [homeserver.yaml](../usage/configuration/homeserver_sample_config.md):  

```yaml
use_insecure_ssl_client_just_for_testing_do_not_use: true
```
{/* 本行由工具自动生成,原文哈希值:5039ede5608dfc76617e373ae7e4ee65 */}