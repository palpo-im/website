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

如果你没有配置文件，你可以复制项目根目录下的 `palpo-example.toml` 文件按照你自己需求修改此配置文件。


## 常见配置项

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

### 存储配置

Palpo 通过可配置的存储后端管理媒体文件。默认使用本地文件系统，也可以通过 `[storage]` 配置段切换到 S3 兼容的对象存储。

Palpo 使用 [Apache OpenDAL](https://opendal.apache.org/) 作为存储抽象层，因此 S3 后端**兼容任何实现了 S3 协议的对象存储服务**，包括：

- **AWS S3**
- **Cloudflare R2**
- **MinIO**
- **Backblaze B2**
- **阿里云 OSS**（S3 兼容模式）
- **腾讯云 COS**（S3 兼容模式）
- 以及其他实现了 S3 API 的服务

#### 本地文件系统（默认）

```toml
[storage]
backend = "fs"
root = "./space"    # 默认值: "./space"
```

#### S3 兼容存储

```toml
[storage]
backend = "s3"
bucket = "my-palpo-media"
region = "us-east-1"              # 默认值: "us-east-1"
endpoint = "https://s3.amazonaws.com"  # 非 AWS 服务必须设置
access_key_id = "YOUR_ACCESS_KEY"
secret_access_key = "YOUR_SECRET_KEY"
prefix = "media/"                 # 默认值: "media/"
path_style = false                # 默认值: false，MinIO 需设为 true
```

#### 配置参考

**文件系统后端 (`backend = "fs"`)：**

| 选项 | 类型 | 默认值 | 说明 |
|-----|------|-------|------|
| `storage.backend` | string | `"fs"` | 存储后端类型 |
| `storage.root` | string | `"./space"` | 媒体文件根目录 |

**S3 后端 (`backend = "s3"`)：**

| 选项 | 类型 | 默认值 | 说明 |
|-----|------|-------|------|
| `storage.backend` | string | — | 必须为 `"s3"` |
| `storage.bucket` | string | *必填* | S3 存储桶名称 |
| `storage.region` | string | `"us-east-1"` | S3 区域 |
| `storage.endpoint` | string | — | S3 端点 URL（非 AWS 服务必填） |
| `storage.access_key_id` | string | — | 访问密钥 ID |
| `storage.secret_access_key` | string | — | 访问密钥 |
| `storage.prefix` | string | `"media/"` | 存储桶内的对象键前缀 |
| `storage.path_style` | boolean | `false` | 启用路径风格访问（MinIO 需要启用） |

#### 常见云服务商配置示例

**Cloudflare R2：**
```toml
[storage]
backend = "s3"
bucket = "palpo-media"
region = "auto"
endpoint = "https://<ACCOUNT_ID>.r2.cloudflarestorage.com"
access_key_id = "YOUR_R2_ACCESS_KEY"
secret_access_key = "YOUR_R2_SECRET_KEY"
```

**MinIO：**
```toml
[storage]
backend = "s3"
bucket = "palpo-media"
region = "us-east-1"
endpoint = "http://localhost:9000"
access_key_id = "minioadmin"
secret_access_key = "minioadmin"
path_style = true
```

### 压缩配置

可以通过 `[compression]` 的设置开启 HTTP 的压缩文件支持。支持 `zstd`, `zip`, `brotli` 压缩，默认都未开启。你可以通过类似下面的配置启用他们：

```toml
[compression]
enable_zstd = true
enable_zip = true
enable_brotli = true
```

### 服务器的Server Name 与 user id 的域名不一致