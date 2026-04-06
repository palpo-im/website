# 配置文件

本章介绍配置 Palpo 的配置文件详细设置。

Palpo 支持使用 `yaml`, `toml`, `json` 作为配置文件格式，你可以按照你的喜好选择。推荐使用 `toml` 格式。

系统默认加载 Palpo 可执行文件同级目录下的 `palpo.toml` 文件。你可以通过设置环境变量 `PALPO_CONFIG`, 改变加载的配置文件路径。

## 必要配置项

下面这些必须配额项目如果没有配置，系统无法正确运行。

```toml
# 外部访问服务器所使用的域名或者服务器名字
server_name = "test.palpo.im"
# 服务器侦听的本地地址
listen_addr = "0.0.0.0:8008"

[db]
# Postgres 数据库服务器信息
url = "postgres://palpo:changeme@postgres:5432/palpo"
```

如果使用了代理，或用于本地测试，请务必配置`well_known`的 client 配置：

```toml
[well_known]
client = "hostname:port"
```

如果你没有配置文件，你可以复制项目根目录下的 `palpo-example.toml` 文件按照你自己需求修改此配置文件。

## 常见配置项

### 配置 TLS 证书

可以通过 `[tls]` 配置 TLS 证书。此项如果没有设置，则默认不启用 TLS, 如果设置，则 `enable` 默认为 `true`, 你也可以将 `enable` 设置为 `false`，临时禁用 TLS 而不必删除或者注释掉配置。

```toml
[tls]
enable = true
cert = "/path/to/cert.crt"
key = "/path/to/priv.key"
# 允许同时使用 HTTP 和 HTTPS 连接（不建议在生产环境使用）
dual_protocol = false
```

### 日志配置

使用 `[logger]` 部分配置日志行为：

```toml
[logger]
# 日志级别：debug, info, warn, error
level = "info"

# 输出格式（可选）
# format = "compact"

# 启用 ANSI 颜色输出
ansi_colors = true

# 配置 span 事件用于追踪
span_events = "none"

# 启用正则表达式过滤日志指令
filter_regex = true

# 在日志输出中显示线程 ID
thread_ids = false
```

### 压缩配置

可以通过 `[compression]` 的设置开启 HTTP 的压缩文件支持。支持 `zstd`, `gzip`, `brotli` 压缩，默认都未开启。你可以通过类似下面的配置启用他们：

```toml
[compression]
enable_zstd = true
enable_gzip = true
enable_brotli = true
```

### Well-Known 配置

配置 Matrix 服务发现端点：

```toml
[well_known]
# 客户端发现 URL（用于 Matrix 客户端）
client = "https://matrix.example.com"

# 服务器发现端点（用于联邦）
server = "matrix.example.com:8448"

# 支持页面 URL
support_page = "https://example.com/support"

# 支持联系人角色（如 "m.role.admin"）
support_role = "m.role.admin"

# 支持邮箱地址
support_email = "admin@example.com"

# 支持 Matrix 用户 ID
support_mxid = "@admin:example.com"
```

## 更多配置

- **[存储](./storage.md)** — 本地文件系统与 S3 兼容对象存储
- **[数据库](./database.md)** — 连接池与超时设置
- **[联邦](./federation-config.md)** — 联邦、信任的服务器与 IP/域名过滤
- **[安全与注册](./security.md)** — 用户注册、速率限制与安全设置
- **[媒体](./media.md)** — 媒体处理、Blurhash 与 URL 预览
- **[高级配置](./advanced.md)** — Presence、输入指示器、已读回执、管理与 HTTP 超时
- **[反向代理](./reverse-proxy.md)** — Nginx、Caddy、Traefik 配置
- **[委托](./delegation.md)** — 联邦域名委托
- **[TURN](./turn.md)** — 语音/视频通话中继服务器
- **[LDAP](./ldap.md)** — LDAP 目录认证
- **[OIDC](./oidc.md)** — OAuth/OpenID Connect 认证
- **[JWT](./jwt.md)** — JWT 令牌认证
- **[正向代理](./forward-proxy.md)** — 出站代理配置
