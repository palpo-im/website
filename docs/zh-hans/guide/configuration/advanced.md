# 高级配置

## Presence 配置

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

## 输入指示器配置

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

## 已读回执配置

控制已读回执同步：

```toml
[read_receipt]
# 允许从远程服务器接收已读回执
allow_incoming = true

# 允许向远程服务器发送已读回执
allow_outgoing = true
```

## 管理配置

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

## HTTP 客户端配置

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

## 客户端超时配置

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
