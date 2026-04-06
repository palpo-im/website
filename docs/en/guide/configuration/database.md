# Database Configuration

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
