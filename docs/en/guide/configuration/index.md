# Configuration

This chapter describes the detailed configuration of Palpo's configuration files.

Palpo supports `yaml`, `toml`, and `json` as configuration file formats. You can choose the format you prefer. The `toml` format is recommended.

By default, the system loads the `palpo.toml` file in the same directory as the Palpo executable. You can change the configuration file path by setting the `PALPO_CONFIG` environment variable.

## Required Configuration Items

If the following mandatory items are not configured, the system will not run correctly.

```toml
# The domain name or server name used for external access to the server
server_name = "matrix.palpo.im"
# The local address the server listens on
listen_addr = "0.0.0.0:8008"

[db]
# Postgres database server information
url = "postgres://palpo:changeme@postgres:5432/palpo"
```

If you don't have a configuration file, you can copy the `palpo-example.toml` file in the project root directory and modify it to suit your needs.

## Common Configuration Items

### Storage Files

Use `space_path` to set the default storage folder for application-related data.

```toml
space_path = "./data"
```

### Configuring TLS Certificates

Use `[tls]` to configure TLS certificates. If this option is not set, TLS is disabled by default. If set, `enable` defaults to `true`. You can also set `enable` to `false` to temporarily disable TLS without deleting or commenting out the configuration.

```toml
[tls]
enable = "true"
cert = "/path/to/cert.crt"
key = "/path/to/priv.key"
```

### Configuring the Turn Server

### Management Configuration

TODO

### Logging Configuration

TODO

### Compression Configuration

You can enable HTTP compression support using the `[compression]` setting. Support for `zstd`, `zip`, and `brotli` compression is disabled by default. You can enable them with a configuration similar to the following:

```toml
[compression]
enable_zstd = true
enable_zip = true
enable_brotli = true
```

### The server name does not match the domain name of the user ID.