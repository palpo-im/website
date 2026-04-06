# Configuration File

This chapter details the configuration settings for Palpo.

Palpo supports using `yaml`, `toml`, and `json` as configuration file formats. You can choose based on your preference, with `toml` being the recommended format.

By default, the system loads the `palpo.toml` file located in the same directory as the Palpo executable. You can change the configuration file path by setting the environment variable `PALPO_CONFIG`.

## Required Configuration Items

The following items must be configured; otherwise, the system will not run correctly.

```toml
# Domain name or server name used for external access
server_name = "test.palpo.im"
# Local address the server listens on
listen_addr = "0.0.0.0:8008"

[db]
# PostgreSQL database server information
url = "postgres://palpo:changeme@postgres:5432/palpo"
```

If you do not have a configuration file, you can copy the `palpo-example.toml` file from the project root directory and modify it according to your needs.

If using a proxy or for local testing, make sure to configure the `well_known` client configuration:

```toml
[well_known]
client = "hostname:port"
```

## Common Configuration Items

### Configuring TLS Certificates

TLS certificates can be configured using the `[tls]` section. If this section is not set, TLS is disabled by default. If set, `enable` defaults to `true`. You can also set `enable` to `false` to temporarily disable TLS without deleting or commenting out the configuration.

```toml
[tls]
enable = true
cert = "/path/to/cert.crt"
key = "/path/to/priv.key"
# Allow both HTTP and HTTPS connections (not recommended for production)
dual_protocol = false
```

### Logging Configuration

Configure logging behavior using the `[logger]` section:

```toml
[logger]
# Log level: debug, info, warn, error
level = "info"

# Output format (optional)
# format = "compact"

# Enable ANSI colors in log output
ansi_colors = true

# Configure span events for tracing
span_events = "none"

# Enable regex filtering for log directives
filter_regex = true

# Display thread IDs in log output
thread_ids = false
```

### Compression Configuration

HTTP compression support can be enabled via the `[compression]` section. Supported compression methods include `zstd`, `gzip`, and `brotli`, all of which are disabled by default. You can enable them with a configuration similar to the following:

```toml
[compression]
enable_zstd = true
enable_gzip = true
enable_brotli = true
```

### Well-Known Configuration

Configure Matrix service discovery endpoints:

```toml
[well_known]
# Client discovery URL (for Matrix clients)
client = "https://matrix.example.com"

# Server discovery endpoint (for federation)
server = "matrix.example.com:8448"

# Support page URL
support_page = "https://example.com/support"

# Support contact role (e.g., "m.role.admin")
support_role = "m.role.admin"

# Support email address
support_email = "admin@example.com"

# Support Matrix user ID
support_mxid = "@admin:example.com"
```

## More Configuration

- **[Storage](./storage.md)** — Local filesystem and S3-compatible object storage
- **[Database](./database.md)** — Connection pool and timeout settings
- **[Federation](./federation-config.md)** — Federation, trusted servers, and IP/domain filtering
- **[Security & Registration](./security.md)** — User registration, rate limiting, and security settings
- **[Media](./media.md)** — Media handling, blurhash, and URL previews
- **[Advanced](./advanced.md)** — Presence, typing indicators, read receipts, admin, and HTTP timeouts
- **[Reverse Proxy](./reverse-proxy.md)** — Nginx, Caddy, Traefik configuration
- **[Delegation](./delegation.md)** — Domain delegation for federation
- **[TURN](./turn.md)** — Voice/video call relay server
- **[LDAP](./ldap.md)** — LDAP directory authentication
- **[OIDC](./oidc.md)** — OAuth/OpenID Connect authentication
- **[JWT](./jwt.md)** — JWT token authentication
- **[Forward Proxy](./forward-proxy.md)** — Outbound proxy configuration
