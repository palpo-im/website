# Media Configuration

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

## Blurhash Configuration

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

## URL Preview Configuration

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
