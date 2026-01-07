# Installing on macOS

## Installing PostgreSQL

Please refer to the [PostgreSQL Installation Guide](./postgres.md) to install and configure PostgreSQL.

You can install PostgreSQL via Homebrew:

```bash
brew install postgresql
```

After installation, create a database user and database for Palpo:

```bash
# Start the postgresql service
brew services start postgresql
psql postgres

# Execute in the psql shell:
CREATE USER palpo WITH PASSWORD 'your_secure_password';
CREATE DATABASE palpo OWNER palpo;
```

Replace `'your_secure_password'` with a strong password. This will create a PostgreSQL user and database named `palpo`, and set the user as the database owner.

## Downloading Palpo Distribution

Visit the official GitHub releases page:

[https://github.com/palpo-im/palpo/releases](https://github.com/palpo-im/palpo/releases)

Download the latest macOS version (e.g., `palpo-x.y.z-macos.zip`) and extract it.

## Configuring Palpo

Copy the example configuration file and rename it:

```bash
cp palpo-example.toml palpo.toml
```

Edit `palpo.toml` according to your environment and database settings. At minimum, you need to:

- Set `server_name` to your desired domain, for example:

    ```toml
    server_name = "your.domain.com"
    ```

- Set the database URL in the `[db]` section to match the database, user, and password you created above, for example:

    ```toml
    [db]
    url = "postgresql://palpo:your_secure_password@localhost:5432/palpo"
    ```

Replace `your.domain.com` and `your_secure_password` with your actual domain and password.

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

## Setting Up as a Launchd Service (Auto-start on Boot)

To automatically start Palpo on boot, you can create a launchd service:

1. Create a plist file at `~/Library/LaunchAgents/im.palpo.palpo.plist` with the following content:

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <dict>
        <key>Label</key>
        <string>im.palpo.palpo</string>
        <key>ProgramArguments</key>
        <array>
            <string>/path/to/palpo</string>
        </array>
        <key>WorkingDirectory</key>
        <string>/path/to</string>
        <key>RunAtLoad</key>
        <true/>
        <key>KeepAlive</key>
        <true/>
    </dict>
    </plist>
    ```

    Replace `/path/to/palpo` and `/path/to` with the actual paths to the Palpo executable and its directory.

2. Load the service:

    ```bash
    launchctl load ~/Library/LaunchAgents/im.palpo.palpo.plist
    ```

Palpo will now start automatically upon login.
{/* 本行由工具自动生成,原文哈希值:74ae6f66a9f43b899d7aa61cf4e2a720 */}