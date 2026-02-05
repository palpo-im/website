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

## Common Configuration Items

### Storage Path

You can set the default folder for storing application-related data using `space_path`.

```toml
space_path = "./data"
```

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

### Database Configuration

Configure database connection pool settings:

```toml
[db]
# Database connection URL
url = "postgres://palpo:changeme@localhost:5432/palpo"

# Connection pool size
pool_size = 10

# Minimum idle connections
min_idle = 2

# TCP keepalive timeout in seconds
tcp_timeout = 30

# Time to wait for a connection from the pool (seconds)
connection_timeout = 30

# Query timeout (seconds)
statement_timeout = 60

# Number of helper threads for async operations
helper_threads = 3

# Require TLS for database connections
enforce_tls = false
```

## Advanced Configuration

### Presence Configuration

Control online/offline presence status updates:

```toml
[presence]
# Allow local presence updates
allow_local = true

# Allow receiving presence from federated servers
allow_incoming = true

# Allow sending presence to federated servers
allow_outgoing = true

# Time without updates before user becomes idle (milliseconds)
idle_timeout = 300000  # 5 minutes

# Time without updates before user becomes offline (milliseconds)
offline_timeout = 1800000  # 30 minutes

# Apply idle timer to remote users
timeout_remote_users = true
```

### Typing Indicators Configuration

Control typing notification behavior:

```toml
[typing]
# Allow receiving typing updates from federation
allow_incoming = true

# Allow sending typing updates to federation
allow_outgoing = true

# Maximum typing duration for federated users (milliseconds)
federation_timeout = 30000

# Minimum typing duration for local clients (milliseconds)
client_timeout_min = 15000

# Maximum typing duration for local clients (milliseconds)
client_timeout_max = 45000
```

### Read Receipt Configuration

Control read receipt synchronization:

```toml
[read_receipt]
# Allow receiving read receipts from remote servers
allow_incoming = true

# Allow sending read receipts to remote servers
allow_outgoing = true
```

### Media Configuration

Configure media handling behavior:

```toml
[media]
# Enable legacy unauthenticated media endpoints
allow_legacy = true

# Freeze legacy media (prevent new uploads via legacy endpoints)
freeze_legacy = true

# Check media consistency at startup
startup_check = true

# Create Conduit-compatible symlinks
compat_file_link = false

# Remove database entries for missing media files
prune_missing = false

# Block media downloads from specific servers (regex patterns)
prevent_downloads_from = ["badserver\\.tld$", "spammer\\.example"]
```

### Blurhash Configuration

Configure image blur hash generation:

```toml
[blurhash]
# X component for blurhash (recommended: 4)
components_x = 4

# Y component for blurhash (recommended: 3)
components_y = 3

# Maximum raw image size for blurhash generation (bytes)
# Default: 33554432 (33.55 MB). Set to 0 to disable.
max_raw_size = 33554432
```

### Federation Configuration

Control federation with other Matrix servers:

```toml
[federation]
# Enable federation
enable = true

# Allow federation requests to self (development only)
allow_loopback = false

# Allow device names to be visible to federated users
allow_device_name = false

# Allow federated servers to query local user profiles
allow_inbound_profile_lookup = true
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

### URL Preview Configuration

Configure URL preview/unfurling behavior:

```toml
[url_preview]
# Network interface to bind for preview requests
# bound_interface = "eth0"

# Allow URL previews from domains containing these strings
domain_contains_allowlist = ["wikipedia.org", "github.com"]

# Allow URL previews from exact domain matches
domain_explicit_allowlist = ["example.com"]

# Block URL previews from these domains
domain_explicit_denylist = ["malicious.com"]

# Allow URL previews from URLs containing these strings
url_contains_allowlist = []

# Maximum body size for URL preview spidering (bytes)
max_spider_size = 256000

# Check root domain for allowlist matching
check_root_domain = false
```

### Admin Configuration

Configure administrative features:

```toml
[admin]
# Send notices for account events to admin room
room_notices = true

# Allow admin commands prefixed with \!admin in any room
escape_commands = true

# Auto-start admin console on launch
console_automatic = false

# Commands to run on startup
startup_execute = []

# Ignore errors in startup commands
execute_errors_ignore = false

# Commands to run on SIGUSR2
signal_execute = []

# Log level for admin command captures
log_capture = "info"

# Room tag for admin room
room_tag = "m.server_notice"
```

### HTTP Client Configuration

Configure outbound HTTP request behavior:

```toml
# Default connection timeout (milliseconds)
request_conn_timeout = 10000

# Default request timeout (milliseconds)
request_timeout = 35000

# Total request timeout (milliseconds)
request_total_timeout = 320000

# Idle connection timeout (milliseconds)
request_idle_timeout = 5000

# Max idle connections per host
request_idle_per_host = 1

# Appservice request timeout (seconds)
appservice_timeout = 35

# Appservice idle timeout (milliseconds)
appservice_idle_timeout = 300000

# Pusher idle timeout (milliseconds)
pusher_idle_timeout = 15000
```

### Client Timeout Configuration

Configure client connection timeouts:

```toml
# Time to receive a client request (milliseconds)
client_receive_timeout = 75000

# Time to process a client request (milliseconds)
client_request_timeout = 180000

# Time to send response to client (milliseconds)
client_response_timeout = 120000

# Shutdown grace period for clients (milliseconds)
client_shutdown_timeout = 10000

# Shutdown grace period for federation (milliseconds)
sender_shutdown_timeout = 5000
```

### Registration Configuration

Control user registration:

```toml
# Enable user registration
allow_registration = false

# Static registration token
registration_token = "your-secret-token"

# Or read token from file
registration_token_file = "/etc/palpo/.reg_token"

# Allow open registration (DANGEROUS - only for private networks)
yes_i_am_very_very_sure_i_want_an_open_registration_server_prone_to_abuse = false

# Allow guest registration
allow_guest_registration = false

# Rooms to auto-join new users
auto_join_rooms = ["#welcome:example.com"]
```

### Security Configuration

```toml
# Allow encryption in rooms
allow_encryption = true

# Allow standard users to create rooms
allow_room_creation = true

# Allow unstable room versions
allow_unstable_room_versions = true

# Default room version
default_room_version = 11

# Block invites for non-admin users
block_non_admin_invites = false

# Require auth for profile requests
require_auth_for_profile_requests = false

# Emergency admin password
# emergency_password = "your-emergency-password"
```

### Trusted Servers

Configure trusted key servers for federation:

```toml
# Servers to use for public key lookups
trusted_servers = ["matrix.org"]

# Query trusted servers first
query_trusted_key_servers_first = false

# Query trusted servers first for room joins
query_trusted_key_servers_first_on_join = true

# Only query trusted servers (never origin servers)
only_query_trusted_key_servers = false

# Batch size for trusted server queries
trusted_server_batch_size = 1024
```

### IP and Domain Filtering

```toml
# Block outbound requests to these IP ranges (CIDR)
ip_range_denylist = [
    "127.0.0.0/8",
    "10.0.0.0/8",
    "172.16.0.0/12",
    "192.168.0.0/16"
]

# Block federation with these server names (regex)
forbidden_remote_server_names = ["badserver\\.tld$"]

# Block room directory requests to these servers
forbidden_remote_room_directory_server_names = []

# Forbidden room alias patterns
forbidden_alias_names = []

# Forbidden username patterns
forbidden_usernames = []
```

## Server Name and User ID Domain Mismatch

When your server's public domain differs from the Matrix user IDs you want to use, see the [Delegation](./delegation) documentation for setup instructions.
