# Security & Registration

## Registration Configuration

Control user registration:

```toml
# Enable user registration
allow_registration = false

# Static registration token
registration_token = "your-secret-token"

# Or read token from file
registration_token_file = "/etc/palpo/.reg_token"

# Allow open registration (DANGEROUS - only for private networks)
# This is the actual configuration key name — it is intentionally verbose as a safety measure
yes_i_am_very_very_sure_i_want_an_open_registration_server_prone_to_abuse = false

# Allow guest registration
allow_guest_registration = false

# Rooms to auto-join new users
auto_join_rooms = ["#welcome:example.com"]
```

## Security Configuration

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

## Rate Limiting

Palpo uses per-IP [token-bucket](https://en.wikipedia.org/wiki/Token_bucket) rate limiting to protect sensitive endpoints from brute-force and abuse. Each category maintains its own counter, so login attempts do not consume registration budget.

- **`per_second`** — tokens refilled per second (controls sustained rate).
- **`burst`** — maximum tokens that can accumulate (controls burst capacity).

Set `per_second` to `0` to disable a specific rate limiter entirely.

```toml
# Login endpoints (/login, /login/get_token)
# Default: ≈ 1 login every 5.5 minutes, burst of 5
[rc_login]
per_second = 0.003
burst = 5

# Registration endpoints (/register)
# Default: ~1 per 6 seconds, burst of 3
[rc_registration]
per_second = 0.17
burst = 3

# Password change and account deactivation
# Default: ~1 per 6 seconds, burst of 3
[rc_password]
per_second = 0.17
burst = 3

# General API endpoints (media, profile, rooms, etc.)
# Default: 10 per second, burst of 50
[rc_message]
per_second = 10.0
burst = 50
```

:::tip
For testing environments (e.g. Complement), you can effectively disable all rate limiting by setting very high values:

```toml
[rc_login]
per_second = 9999.0
burst = 9999

[rc_registration]
per_second = 9999.0
burst = 9999

[rc_password]
per_second = 9999.0
burst = 9999

[rc_message]
per_second = 9999.0
burst = 9999
```
:::
