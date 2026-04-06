# 数据库配置

配置数据库连接池设置：

```toml
[db]
# 数据库连接 URL
url = "postgres://palpo:changeme@localhost:5432/palpo"

# 连接池大小
pool_size = 10

# 最小空闲连接数
min_idle = 2

# TCP keepalive 超时（秒）
tcp_timeout = 30

# 等待连接池连接的超时时间（秒）
connection_timeout = 30

# 查询超时（秒）
statement_timeout = 60

# 异步操作的辅助线程数
helper_threads = 3

# 要求数据库连接使用 TLS
enforce_tls = false
```
