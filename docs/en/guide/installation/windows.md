# Installing on Windows

## Installing PostgreSQL

Please refer to the [PostgreSQL Installation Guide](./postgres.md) to install and configure PostgreSQL.

After installation, create a database user and database for Palpo:

1. Open "SQL Shell (psql)" from the Start Menu, or run `psql` in the terminal.
2. Execute the following in the psql shell:

    ```sql
    CREATE USER palpo WITH PASSWORD 'your_secure_password';
    CREATE DATABASE palpo OWNER palpo;
    \q
    ```

Replace `'your_secure_password'` with a strong password. This creates a PostgreSQL user and database named `palpo`, and sets the user as the database owner.

## Downloading Palpo Release

Visit the official GitHub releases page:

[https://github.com/palpo-im/palpo/releases](https://github.com/palpo-im/palpo/releases)

Download the latest Windows version (e.g., `palpo-x.y.z-windows.zip`) and extract it.

## Configuring Palpo

Copy the example configuration file and rename it:

```powershell
copy palpo-example.toml palpo.toml
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

For more advanced configuration, please refer to the [Configuration Page](../configuration/index.md).

## Initialize Database Schema

Palpo does not automatically create database tables. You need to run database migrations before the first startup. First, install the `diesel_cli` tool:

```powershell
# Install diesel_cli (PostgreSQL support only)
cargo install diesel_cli --no-default-features --features postgres
```

Then run migrations in the directory containing the Palpo executable:

```powershell
# Set the database connection URL
$env:DATABASE_URL="postgresql://palpo:your_secure_password@localhost:5432/palpo"

# Run migrations
diesel migration run --migration-dir crates/data/migrations
```

If you don't have the `crates/data/migrations` directory from the source code, you can download it from GitHub:

```powershell
# Clone the migrations directory
git clone --depth=1 --filter=blob:none --sparse https://github.com/palpo-im/palpo.git
cd palpo
git sparse-checkout set crates/data/migrations
```

Alternatively, download the migrations folder directly from the [GitHub repository](https://github.com/palpo-im/palpo/tree/main/crates/data/migrations).

## Running Palpo

Start Palpo from the command line:

```powershell
palpo.exe
```

## Setting Up as a Windows Service (Auto-start on Boot)

You can use the built-in `sc` command or NSSM (recommended, Non-Sucking Service Manager) to enable Palpo to start automatically on boot.

### Using NSSM (Recommended)

1. Download and install [NSSM](https://nssm.cc/download).
2. Open Command Prompt as Administrator and run:

    ```powershell
    nssm install Palpo
    ```
3. In the NSSM interface:
    - Set the path to `palpo.exe`
    - Set the startup directory to the folder containing `palpo.exe`
    - Click "Install service"
4. Start the service:

    ```powershell
    nssm start Palpo
    ```

### Using Windows Built-in Service Manager (Advanced)

You can also create a service using the `sc` command:

```powershell
sc create Palpo binPath= "C:\\path\\to\\palpo.exe" start= auto
```

Replace `C:\\path\\to\\palpo.exe` with the actual path to the Palpo executable.

Palpo will now start automatically on boot.
{/* 本行由工具自动生成,原文哈希值:8d6bf9b2dacdf6172cb54f60a30db81d */}