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

### Storage Path

You can set the default folder for storing application-related data using `space_path`.

```toml
space_path = "./data"
```

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

### Compression Configuration

HTTP compression support can be enabled via the `[compression]` section. Supported compression methods include `zstd`, `zip`, and `brotli`, all of which are disabled by default. You can enable them with a configuration similar to the following:

```toml
[compression]
enable_zstd = true
enable_gzip = true
enable_brotli = true
```

### Server Name and User ID Domain Mismatch
{/* 本行由工具自动生成,原文哈希值:3ced4d576d67e7de7b159a7c4e54fb4e */}