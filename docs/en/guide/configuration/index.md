# Configuration File

This chapter introduces the detailed settings for configuring Palpo's configuration file.

Palpo supports using `yaml`, `toml`, and `json` as configuration file formats. You can choose according to your preference. The `toml` format is recommended.

By default, the system loads the `palpo.toml` file located in the same directory as the Palpo executable. You can change the path of the configuration file to be loaded by setting the environment variable `PALPO_CONFIG`.

## Required Configuration Items

The following required configuration items must be set; otherwise, the system will not function correctly.

```toml
# The domain name or server name used for external access to the server
server_name = "test.palpo.im"
# The local address the server listens on
listen_addr = "0.0.0.0:8008"

[db]
# Postgres database server information
url = "postgres://palpo:changeme@postgres:5432/palpo"
```

If you do not have a configuration file, you can copy the `palpo-example.toml` file from the project root directory and modify it according to your needs.

## Common Configuration Items

### Storage Files

You can set the default folder for storing application-related data using `space_path`.

```toml
space_path = "./data"
```

### Configuring TLS Certificates

You can configure TLS certificates using `[tls]`. If this item is not set, TLS is disabled by default. If set, `enable` defaults to `true`. You can also set `enable` to `false` to temporarily disable TLS without deleting or commenting out the configuration.

```toml
[tls]
enable = "true"
cert = "/path/to/cert.crt"
key = "/path/to/priv.key"
```

### Configuring Turn Server

### Management Configuration

TODO

### Logging Configuration

TODO

### Compression Configuration

You can enable HTTP compression support through the `[compression]` settings. Compression methods such as `zstd`, `zip`, and `brotli` are supported, all disabled by default. You can enable them with configurations similar to the following:

```toml
[compression]
enable_zstd = true
enable_zip = true
enable_brotli = true
```

### The Server Name and User ID Domain Do Not Match
{/* 本行由工具自动生成,原文哈希值:9d94ea2083877f5d24c7f5f0ec895d04 */}