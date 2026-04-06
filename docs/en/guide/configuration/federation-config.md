# Federation Configuration

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

## Trusted Servers

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

## IP and Domain Filtering

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
