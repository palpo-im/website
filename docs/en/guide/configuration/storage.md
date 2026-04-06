# Storage Configuration

Palpo stores media files via a configurable storage backend. By default it uses the local filesystem. You can switch to S3-compatible object storage via the `[storage]` section.

Palpo uses [Apache OpenDAL](https://opendal.apache.org/) as its storage abstraction layer, which means the S3 backend is compatible with **any S3-compatible object storage service**, including:

- **AWS S3**
- **Cloudflare R2**
- **MinIO**
- **Backblaze B2**
- **Alibaba Cloud OSS** (S3-compatible mode)
- **Tencent Cloud COS** (S3-compatible mode)
- And any other service implementing the S3 API

## Local Filesystem (Default)

```toml
[storage]
backend = "fs"
root = "./space"    # default: "./space"
```

## S3-Compatible Storage

```toml
[storage]
backend = "s3"
bucket = "my-palpo-media"
region = "us-east-1"              # default: "us-east-1"
endpoint = "https://s3.amazonaws.com"  # required for non-AWS services
access_key_id = "YOUR_ACCESS_KEY"
secret_access_key = "YOUR_SECRET_KEY"
prefix = "media/"                 # default: "media/"
path_style = false                # default: false, set to true for MinIO
redirect = true                   # default: true, redirect clients to presigned S3 URLs
presign_expiry = 300              # default: 300 (5 minutes)
```

When `redirect` is enabled (the default), media download requests return a `302` redirect to a time-limited presigned S3 URL. Clients download directly from S3, which **saves server bandwidth and reduces latency**. The presigned URL is scoped to a single object and expires after `presign_expiry` seconds. Set `redirect = false` to proxy all media through the Palpo server instead.

## Configuration Reference

**Filesystem backend (`backend = "fs"`):**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storage.backend` | string | `"fs"` | Storage backend type |
| `storage.root` | string | `"./space"` | Root directory for media files |

**S3 backend (`backend = "s3"`):**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storage.backend` | string | — | Must be `"s3"` |
| `storage.bucket` | string | *required* | S3 bucket name |
| `storage.region` | string | `"us-east-1"` | S3 region |
| `storage.endpoint` | string | — | S3 endpoint URL (required for non-AWS services) |
| `storage.access_key_id` | string | — | Access key ID |
| `storage.secret_access_key` | string | — | Secret access key |
| `storage.prefix` | string | `"media/"` | Object key prefix in the bucket |
| `storage.path_style` | boolean | `false` | Enable path-style access (required for MinIO) |
| `storage.redirect` | boolean | `true` | Redirect clients to presigned S3 URLs for downloads |
| `storage.presign_expiry` | integer | `300` | Presigned URL expiry in seconds |

## Examples for Popular Providers

**Cloudflare R2:**
```toml
[storage]
backend = "s3"
bucket = "palpo-media"
region = "auto"
endpoint = "https://<ACCOUNT_ID>.r2.cloudflarestorage.com"
access_key_id = "YOUR_R2_ACCESS_KEY"
secret_access_key = "YOUR_R2_SECRET_KEY"
```

**MinIO:**
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
