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

### 存储文件

可以通过 `space_path` 设置应用相关数据的默认存储的文件夹。

```toml
space_path = "./data"
```

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

### 数据库配置

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

## 高级配置

### Presence 配置

控制在线/离线状态更新：

```toml
[presence]
# 允许本地 presence 更新
allow_local = true

# 允许接收来自联邦服务器的 presence
allow_incoming = true

# 允许向联邦服务器发送 presence
allow_outgoing = true

# 无更新后变为空闲状态的时间（毫秒）
idle_timeout = 300000  # 5 分钟

# 无更新后变为离线状态的时间（毫秒）
offline_timeout = 1800000  # 30 分钟

# 对远程用户应用空闲计时器
timeout_remote_users = true
```

### 输入指示器配置

控制输入状态通知行为：

```toml
[typing]
# 允许从联邦接收输入更新
allow_incoming = true

# 允许向联邦发送输入更新
allow_outgoing = true

# 联邦用户的最大输入时长（毫秒）
federation_timeout = 30000

# 本地客户端的最小输入时长（毫秒）
client_timeout_min = 15000

# 本地客户端的最大输入时长（毫秒）
client_timeout_max = 45000
```

### 已读回执配置

控制已读回执同步：

```toml
[read_receipt]
# 允许从远程服务器接收已读回执
allow_incoming = true

# 允许向远程服务器发送已读回执
allow_outgoing = true
```

### 媒体配置

配置媒体处理行为：

```toml
[media]
# 启用旧版未认证媒体端点
allow_legacy = true

# 冻结旧版媒体（阻止通过旧版端点上传新内容）
freeze_legacy = true

# 启动时检查媒体一致性
startup_check = true

# 创建 Conduit 兼容的符号链接
compat_file_link = false

# 删除缺失媒体文件的数据库条目
prune_missing = false

# 阻止从特定服务器下载媒体（正则表达式模式）
prevent_downloads_from = ["badserver\\.tld$", "spammer\\.example"]
```

### Blurhash 配置

配置图片模糊哈希生成：

```toml
[blurhash]
# blurhash X 分量（推荐：4）
components_x = 4

# blurhash Y 分量（推荐：3）
components_y = 3

# blurhash 生成的最大原始图片大小（字节）
# 默认：33554432（33.55 MB）。设为 0 禁用。
max_raw_size = 33554432
```

### 联邦配置

控制与其他 Matrix 服务器的联邦：

```toml
[federation]
# 启用联邦
enable = true

# 允许向自身发送联邦请求（仅用于开发）
allow_loopback = false

# 允许设备名称对联邦用户可见
allow_device_name = false

# 允许联邦服务器查询本地用户配置文件
allow_inbound_profile_lookup = true
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

### URL 预览配置

配置 URL 预览/展开行为：

```toml
[url_preview]
# 绑定预览请求的网络接口
# bound_interface = "eth0"

# 允许包含这些字符串的域名进行 URL 预览
domain_contains_allowlist = ["wikipedia.org", "github.com"]

# 允许精确匹配这些域名进行 URL 预览
domain_explicit_allowlist = ["example.com"]

# 阻止这些域名的 URL 预览
domain_explicit_denylist = ["malicious.com"]

# 允许包含这些字符串的 URL 进行预览
url_contains_allowlist = []

# URL 预览抓取的最大正文大小（字节）
max_spider_size = 256000

# 检查根域名以进行白名单匹配
check_root_domain = false
```

### 管理配置

配置管理功能：

```toml
[admin]
# 向管理员房间发送账户事件通知
room_notices = true

# 允许在任何房间使用 \!admin 前缀的管理命令
escape_commands = true

# 启动时自动启动管理控制台
console_automatic = false

# 启动时运行的命令
startup_execute = []

# 忽略启动命令中的错误
execute_errors_ignore = false

# 收到 SIGUSR2 时运行的命令
signal_execute = []

# 管理命令捕获的日志级别
log_capture = "info"

# 管理员房间的房间标签
room_tag = "m.server_notice"
```

### HTTP 客户端配置

配置出站 HTTP 请求行为：

```toml
# 默认连接超时（毫秒）
request_conn_timeout = 10000

# 默认请求超时（毫秒）
request_timeout = 35000

# 总请求超时（毫秒）
request_total_timeout = 320000

# 空闲连接超时（毫秒）
request_idle_timeout = 5000

# 每个主机的最大空闲连接数
request_idle_per_host = 1

# Appservice 请求超时（秒）
appservice_timeout = 35

# Appservice 空闲超时（毫秒）
appservice_idle_timeout = 300000

# Pusher 空闲超时（毫秒）
pusher_idle_timeout = 15000
```

### 客户端超时配置

配置客户端连接超时：

```toml
# 接收客户端请求的时间（毫秒）
client_receive_timeout = 75000

# 处理客户端请求的时间（毫秒）
client_request_timeout = 180000

# 向客户端发送响应的时间（毫秒）
client_response_timeout = 120000

# 客户端关闭宽限期（毫秒）
client_shutdown_timeout = 10000

# 联邦关闭宽限期（毫秒）
sender_shutdown_timeout = 5000
```

### 注册配置

控制用户注册：

```toml
# 启用用户注册
allow_registration = false

# 静态注册令牌
registration_token = "your-secret-token"

# 或从文件读取令牌
registration_token_file = "/etc/palpo/.reg_token"

# 允许开放注册（危险 - 仅用于私有网络）
yes_i_am_very_very_sure_i_want_an_open_registration_server_prone_to_abuse = false

# 允许访客注册
allow_guest_registration = false

# 新用户自动加入的房间
auto_join_rooms = ["#welcome:example.com"]
```

### 安全配置

```toml
# 允许房间加密
allow_encryption = true

# 允许普通用户创建房间
allow_room_creation = true

# 允许不稳定的房间版本
allow_unstable_room_versions = true

# 默认房间版本
default_room_version = 11

# 阻止非管理员用户发送邀请
block_non_admin_invites = false

# 要求配置文件请求进行认证
require_auth_for_profile_requests = false

# 紧急管理员密码
# emergency_password = "your-emergency-password"
```

### 信任的服务器

配置用于联邦的信任密钥服务器：

```toml
# 用于公钥查询的服务器
trusted_servers = ["matrix.org"]

# 优先查询信任的服务器
query_trusted_key_servers_first = false

# 加入房间时优先查询信任的服务器
query_trusted_key_servers_first_on_join = true

# 仅查询信任的服务器（永不查询源服务器）
only_query_trusted_key_servers = false

# 信任服务器查询的批量大小
trusted_server_batch_size = 1024
```

### IP 和域名过滤

```toml
# 阻止向这些 IP 范围发送出站请求（CIDR）
ip_range_denylist = [
    "127.0.0.0/8",
    "10.0.0.0/8",
    "172.16.0.0/12",
    "192.168.0.0/16"
]

# 阻止与这些服务器名称的联邦（正则表达式）
forbidden_remote_server_names = ["badserver\\.tld$"]

# 阻止向这些服务器的房间目录请求
forbidden_remote_room_directory_server_names = []

# 禁止的房间别名模式
forbidden_alias_names = []

# 禁止的用户名模式
forbidden_usernames = []
```

## 服务器的 Server Name 与 user id 的域名不一致

当您的服务器公共域名与您想使用的 Matrix 用户 ID 不同时，请参阅[委托](./delegation)文档了解设置说明。
