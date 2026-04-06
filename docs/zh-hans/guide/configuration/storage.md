# 存储配置

Palpo 通过可配置的存储后端管理媒体文件。默认使用本地文件系统，也可以通过 `[storage]` 配置段切换到 S3 兼容的对象存储。

Palpo 使用 [Apache OpenDAL](https://opendal.apache.org/) 作为存储抽象层，因此 S3 后端**兼容任何实现了 S3 协议的对象存储服务**，包括：

- **AWS S3**
- **Cloudflare R2**
- **MinIO**
- **Backblaze B2**
- **阿里云 OSS**（S3 兼容模式）
- **腾讯云 COS**（S3 兼容模式）
- 以及其他实现了 S3 API 的服务

## 本地文件系统（默认）

```toml
[storage]
backend = "fs"
root = "./space"    # 默认值: "./space"
```

## S3 兼容存储

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
redirect = true                   # 默认值: true，将客户端重定向到 S3 预签名 URL
presign_expiry = 300              # 默认值: 300（5 分钟）
```

启用 `redirect`（默认开启）后，媒体下载请求会返回 `302` 重定向到有时效限制的 S3 预签名 URL。客户端直接从 S3 下载，**节省服务器带宽并降低延迟**。预签名 URL 仅对单个文件有效，`presign_expiry` 秒后过期。设置 `redirect = false` 可改为通过 Palpo 服务器代理所有媒体。

## 配置参考

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
| `storage.redirect` | boolean | `true` | 将客户端重定向到 S3 预签名 URL 下载 |
| `storage.presign_expiry` | integer | `300` | 预签名 URL 有效期（秒） |

## 常见云服务商配置示例

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
