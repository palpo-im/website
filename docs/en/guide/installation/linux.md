# Installing on Linux

## Installing PostgreSQL

Please refer to the [PostgreSQL Installation Guide](./postgres.md) to install and configure PostgreSQL.

After installation, create a database user and database for Palpo:

```bash
# Switch to the postgres user
sudo -u postgres psql

# Execute in the psql shell:
CREATE USER palpo WITH PASSWORD 'your_secure_password';
CREATE DATABASE palpo OWNER palpo;
```

Replace `'your_secure_password'` with a strong password. This will create a PostgreSQL user and database named `palpo`, and set the user as the database owner.

## Downloading Palpo Release

Visit the official GitHub releases page:

[https://github.com/palpo-im/palpo/releases](https://github.com/palpo-im/palpo/releases)

Download the latest version suitable for your Linux distribution and architecture, and extract it.

## Configuring Palpo

Copy the example configuration file and rename it:

```bash
cp palpo-example.toml palpo.toml
```

Edit `palpo.toml` according to your environment and database settings. At minimum, you need to:

- Set `server_name` to your desired domain name, for example:

    ```toml
    server_name = "your.domain.com"
    ```

- Set the database URL in the `[db]` section to match the database, user, and password you created above, for example:

    ```toml
    [db]
    url = "postgresql://palpo:your_secure_password@localhost:5432/palpo"
    ```

Replace `your.domain.com` and `your_secure_password` with your actual domain name and password.

For more advanced configurations, please refer to the [Configuration Page](../configuration/index.md).

## Initialize Database Schema

Palpo does not automatically create database tables. You need to run database migrations before the first startup. First, install the `diesel_cli` tool:

```bash
# Install diesel_cli (PostgreSQL support only)
cargo install diesel_cli --no-default-features --features postgres
```

Then run migrations in the directory containing the Palpo executable:

```bash
# Set the database connection URL
export DATABASE_URL="postgresql://palpo:your_secure_password@localhost:5432/palpo"

# Run migrations
diesel migration run --migration-dir crates/data/migrations
```

If you don't have the `crates/data/migrations` directory from the source code, you can download it from GitHub:

```bash
# Clone the migrations directory
git clone --depth=1 --filter=blob:none --sparse https://github.com/palpo-im/palpo.git
cd palpo
git sparse-checkout set crates/data/migrations
```

Alternatively, download the migrations folder directly from the [GitHub repository](https://github.com/palpo-im/palpo/tree/main/crates/data/migrations).

## Running Palpo

Start Palpo from the command line:

```bash
./palpo
```

## Setting Up as a Systemd Service (Auto-start on Boot)

To automatically start Palpo on boot, you can create a systemd service file:

1. Create `/etc/systemd/system/palpo.service` with the following content:

    ```ini
    [Unit]
    Description=Palpo Matrix Homeserver
    After=network.target

    [Service]
    Type=simple
    User=palpo
    WorkingDirectory=/path/to/palpo
    ExecStart=/path/to/palpo
    Restart=on-failure

    [Install]
    WantedBy=multi-user.target
    ```

    Replace `/path/to/palpo` with the actual path to Palpo and set the correct user.

2. Reload systemd and enable the service:

    ```bash
    sudo systemctl daemon-reload
    sudo systemctl enable palpo
    sudo systemctl start palpo
    ```

Palpo will now start automatically on boot.
{/* 本行由工具自动生成,原文哈希值:1aa1fcad7cf160df6695b28d5a649411 */}