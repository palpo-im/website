# Configuration File

This chapter details the configuration settings for Palpo.

Palpo supports using `yaml`, `toml`, and `json` as configuration file formats. You can choose based on your preference, with `toml` being the recommended format.

By default, the system loads the `palpo.toml` file located in the same directory as the Palpo executable. You can change the configuration file path by setting the environment variable `PALPO_CONFIG`.

## Required Configuration Items

The following items must be configured; otherwise, the system will not run correctly.

```toml
# Domain name or server name used for external access
server_name = "test.palpo.im"
# Local address the server listens on
listen_addr = "0.0.0.0:8008"

[db]
# PostgreSQL database server information
url = "postgres://palpo:changeme@postgres:5432/palpo"
```

If you do not have a configuration file, you can copy the `palpo-example.toml` file from the project root directory and modify it according to your needs.

## Common Configuration Items

### Configuring TLS Certificates

TLS certificates can be configured using the `[tls]` section. If this section is not set, TLS is disabled by default. If set, `enable` defaults to `true`. You can also set `enable` to `false` to temporarily disable TLS without deleting or commenting out the configuration.

```toml
[tls]
enable = "true"
cert = "/path/to/cert.crt"
key = "/path/to/priv.key"
```

### Configuring TURN Server

### Management Configuration

TODO

### Logging Configuration

TODO

### Storage Configuration

Palpo stores media files via a configurable storage backend. By default it uses the local filesystem. You can switch to S3-compatible object storage via the `[storage]` section.

Palpo uses [Apache OpenDAL](https://opendal.apache.org/) as its storage abstraction layer, which means the S3 backend is compatible with **any S3-compatible object storage service**, including:

- **AWS S3**
- **Cloudflare R2**
- **MinIO**
- **Backblaze B2**
- **Alibaba Cloud OSS** (S3-compatible mode)
- **Tencent Cloud COS** (S3-compatible mode)
- And any other service implementing the S3 API

#### Local Filesystem (Default)

```toml
[storage]
backend = "fs"
root = "./space"    # default: "./space"
```

#### S3-Compatible Storage

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
```

#### Configuration Reference

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

#### Examples for Popular Providers

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

### Compression Configuration

HTTP compression support can be enabled via the `[compression]` section. Supported compression methods include `zstd`, `zip`, and `brotli`, all of which are disabled by default. You can enable them with a configuration similar to the following:

```toml
[compression]
enable_zstd = true
enable_zip = true
enable_brotli = true
```

### Server Name and User ID Domain Mismatch
{/* 本行由工具自动生成,原文哈希值:3ced4d576d67e7de7b159a7c4e54fb4e */}