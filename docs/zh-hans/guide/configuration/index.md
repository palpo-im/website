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

可以通过 `[tls]` 配置 TLS 证书。此项如果没有设置，则默认不启用 TLS, 如果设置，则 `enable` 默认为 `true`, 你也可以将 `enable` 设置为 `false`，临时禁用 TLS 而不比删除或者注释掉配置。

```toml
[tls]
enable = "true"
cert = "/path/to/cert.crt"
key = "/path/to/priv.key"
```

### 配置 Turn 服务器


### 管理配置

TODO

### 日志配置

TODO

### 压缩配置

可以通过 `[compression]` 的设置开启 HTTP 的压缩文件支持。支持 `zstd`, `zip`, `brotli` 压缩，默认都未开启。你可以通过类似下面的配置启用他们：

```toml
[compression]
enable_zstd = true
enable_zip = true
enable_brotli = true
```

### 服务器的Server Name 与 user id 的域名不一致