# Advanced Configuration

## Presence Configuration

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

## Typing Indicators Configuration

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

## Read Receipt Configuration

Control read receipt synchronization:

```toml
[read_receipt]
# Allow receiving read receipts from remote servers
allow_incoming = true

# Allow sending read receipts to remote servers
allow_outgoing = true
```

## Admin Configuration

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

## HTTP Client Configuration

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

## Client Timeout Configuration

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
