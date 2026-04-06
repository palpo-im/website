# 联邦配置

## 联邦设置

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

## 信任的服务器

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

## IP 和域名过滤

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
