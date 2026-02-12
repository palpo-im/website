# Palpo Build Guide

This document provides detailed instructions for building the Palpo Matrix server on various platforms.

## Table of Contents

- [System Requirements](#system-requirements "System Requirements")
- [macOS/Linux Build](#macoslinux-build "macOS/Linux Build")
- [Windows Build](#windows-build "Windows Build")
- [Docker Development Environment](#docker-development-environment "Docker Development Environment")
- [Database Configuration](#database-configuration "Database Configuration")
- [Development Environment Setup](#development-environment-setup "Development Environment Setup")

## System Requirements

### Basic Requirements
- [Rust](https://www.rust-lang.org/) 1.70+ (latest stable version recommended)
- [PostgreSQL](https://www.postgresql.org/) 12+
- [Git](https://git-scm.com/)
- [Diesel CLI](https://diesel.rs/guides/getting-started) (optional, for manual database migrations)

### Platform-Specific Requirements
- **Linux**: `libclang-dev`, `libpq-dev`, `cmake`
- **macOS**: [Xcode Command Line Tools](https://developer.apple.com/xcode/resources/)
- **Windows**: [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022) 2019+

## macOS/Linux Build

### 1. Install Dependencies

#### macOS
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install postgresql cmake
```

Additional resources:
- [Homebrew Official Documentation](https://brew.sh/)
- [PostgreSQL macOS Installation Guide](https://www.postgresql.org/download/macosx/)

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install -y \
    curl \
    build-essential \
    libclang-dev \
    libpq-dev \
    cmake \
    postgresql \
    postgresql-contrib
```

See also:
- [PostgreSQL Ubuntu Installation Guide](https://www.postgresql.org/download/linux/ubuntu/)
- [Ubuntu Development Tools Installation](https://ubuntu.com/server/docs/programming-c)

#### CentOS/RHEL/Fedora
```bash
# CentOS/RHEL
sudo yum install -y gcc gcc-c++ cmake postgresql-devel clang-devel

# Fedora
sudo dnf install -y gcc gcc-c++ cmake postgresql-devel clang-devel
```

Learn more:
- [PostgreSQL Red Hat Installation Guide](https://www.postgresql.org/download/linux/redhat/)
- [Fedora Development Tools](https://docs.fedoraproject.org/en-US/quick-docs/installing-plugins-for-playing-movies-and-music/)

### 2. Install Rust and Diesel CLI
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# (Optional) Install Diesel CLI (PostgreSQL support)
cargo install diesel_cli --no-default-features --features postgres
```

Additional resources:
- [Rust Official Installation Guide](https://www.rust-lang.org/tools/install)
- [Diesel CLI Documentation](https://diesel.rs/guides/getting-started)

### 3. Clone and Build Project
```bash
# Clone project
git clone https://github.com/palpo/palpo.git
cd palpo
```
Next:
Database Configuration: [Database Configuration](#database-configuration "Database Configuration")
Development Environment Setup: [Development Environment Setup](#development-environment-setup "Development Environment Setup")

## Windows Build

### 1. Install Dependencies

#### Using Chocolatey (Recommended)
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

# Install dependencies
choco install rust postgresql cmake git
```

See also:
- [Chocolatey Official Documentation](https://chocolatey.org/install)
- [PostgreSQL Windows Installation Guide](https://www.postgresql.org/download/windows/)
- [Rust Windows Installation Guide](https://forge.rust-lang.org/infra/channel-layout.html#windows)

### 2. Install Diesel CLI (Optional)
```powershell
# Install Diesel CLI
cargo install diesel_cli --no-default-features --features postgres
```

### 3. Set Environment Variables
```powershell
# Add to system PATH (adjust according to actual installation paths)
$env:PATH += ";C:\Program Files\PostgreSQL\15\bin"
$env:PATH += ";C:\Program Files\CMake\bin"
```

### 4. Build Project
```powershell
# Clone project
git clone https://github.com/palpo/palpo.git
cd palpo
```

Next:
Database Configuration: [Database Configuration](#database-configuration "Database Configuration")
Development Environment Setup: [Development Environment Setup](#development-environment-setup "Development Environment Setup")


### 5. Windows WSL Build (Optional)

We recommend using the WSL environment for development on Windows systems. WSL (Windows Subsystem for Linux) allows you to run Linux command-line tools on Windows. For installation instructions, see the official guide: [WSL Installation and Configuration](https://docs.microsoft.com/en-us/windows/wsl/install).

Choose a Linux distribution you're familiar with, such as Debian or Ubuntu, as your WSL subsystem. Then follow the Linux development configuration from the previous section.

You can also use WSL to cross-compile Windows executable files. See: [Cross-compilation and Installation in WSL Environment](https://palpo.im/en/guide/installation/windows.html#wsl-cross-compilation-and-installation)

Development Environment Setup: [Development Environment Setup](#development-environment-setup "Development Environment Setup")

## Database Configuration


### 1. Create Database and User

#### macOS/Linux
```bash
# Start PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS

# Create database and user
sudo -u postgres psql -c "CREATE USER palpo_dev WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "CREATE DATABASE palpo_dev OWNER palpo_dev;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE palpo_dev TO palpo_dev;"
```

#### Windows
```powershell
# Start PostgreSQL service
net start postgresql-x64-15  # Adjust according to version

# Connect to database
psql -U postgres
```

#### Execute in psql
```sql
-- Create user
CREATE USER palpo WITH PASSWORD 'your_password';

-- Create database
CREATE DATABASE palpo OWNER palpo;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE palpo TO palpo;

-- Exit
\q
```

Reference:
- [PostgreSQL User Management Documentation](https://www.postgresql.org/docs/current/user-manag.html)
- [PostgreSQL Database Creation Documentation](https://www.postgresql.org/docs/current/manage-ag-createdb.html)

### 2. Configure Database Connection

Set environment variables or create a `.env` file:

```bash
# Method 1: Set environment variables
export DATABASE_URL="postgres://palpo:your_password@localhost:5432/palpo"

# Method 2: Create .env file
echo "DATABASE_URL=postgres://palpo:your_password@localhost:5432/palpo" > .env
```

### 3. Run Database Migrations (Optional)

Palpo now supports automated migrations, so manual migration commands are usually not required.
If you need to run migrations manually, execute the following commands.

```bash
# Navigate to data crate directory
cd crates/data

# Run migrations (create all tables and indexes)
diesel migration run

# Verify migration status
diesel migration list
```

### 4. Migration Management Commands (Optional)

```bash
# Check migration status
diesel migration list

# Rollback last migration
diesel migration revert

# Rerun all migrations
diesel migration redo

# Generate new migration file (for development)
diesel migration generate migration_name
```

Learn more:
- [Diesel Migration Guide](https://diesel.rs/guides/migration)
- [PostgreSQL Connection String Format](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)

### 5. Verify Database Structure

Connect to the database to verify successful table creation:

```bash
psql -U palpo -d palpo -h localhost
```

```sql
-- View all tables
\dt

-- View table structure examples
\d users
\d rooms
\d events

-- Exit
\q
```

## Docker Development Environment

### 1. Build Palpo Container Image

We recommend using the official Rust Docker image to build Palpo. Reference configuration: [Dockerfile](https://github.com/palpo-im/palpo/blob/main/build/docker/Dockerfile.palpo)

```
FROM rust:bookworm AS builder

WORKDIR /work

RUN apt-get update && apt-get install -y --no-install-recommends \
    libclang-dev libpq-dev cmake postgresql postgresql-contrib

COPY Cargo.toml Cargo.toml
COPY crates crates
RUN cargo build --release

FROM debian:bookworm

WORKDIR /var/palpo

COPY --from=builder /work/target/release/palpo /var/palpo/palpo
# COPY crates/server/palpo-example.toml /var/palpo/palpo.toml

RUN apt-get update && apt-get install -y debian-keyring \
    debian-archive-keyring apt-transport-https ca-certificates \
    libpq-dev &&\
    mkdir -p /var/palpo/media /var/palpo/certs /var/palpo/acme

ENV PALPO_CONFIG=/var/palpo/palpo.toml
ENV RUST_LOG="palpo=warn,palpo_core=error,salvo=error"
ENV LOG_FORMAT=json

EXPOSE 8008 8448

CMD /var/palpo/palpo
```

Save the Dockerfile as `Dockerfile.palpo`, place it in a separate directory, and build the image:

```bash
docker build -t palpo-dev -f Dockerfile.palpo .
```
Verify the built image:
```bash
docker images | grep palpo-dev
```
To run and test the image using Docker Compose, see: [Docker Compose Configuration](https://github.com/palpo-im/palpo/blob/main/deploy/docker/compose.yml). Configure the palpo image to use your local palpo-dev image.

Before starting, edit the configuration file:
```bash
# Copy and edit configuration file
cp palpo.toml.example palpo.toml
# Edit palpo.toml to set your server name and database connection
```

Start services (includes automatic database migration): `docker compose up -d`.


Additional resources:
- [Docker Official Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

### 2. Docker Environment Database Migrations (Optional)

Database migrations in the Docker environment run automatically, but you can execute them manually if needed:

```bash
# Check migration status
docker compose exec palpo diesel migration list

# Run migrations manually
docker compose exec palpo diesel migration run

# Enter container for debugging if needed
docker compose exec palpo bash
```


## Development Environment Setup

### 1. Install Development Tools

- rustfmt is Rust's code formatting tool.
- clippy is a code analysis tool.
- cargo-watch is a cargo watch tool for auto-reloading.
- cargo-edit is a cargo dependency management tool for adding dependencies.

```bash
# Install Rust development tools
rustup component add rustfmt clippy

# Install cargo extensions
cargo install cargo-watch cargo-edit
```

Reference:
- [Rustup Documentation](https://rust-lang.github.io/rustup/)
- [Cargo Tools Documentation](https://doc.rust-lang.org/cargo/)

### 2. Set Up Development Database
```bash
# Create development database
createdb palpo_dev

# Set development environment variables
export DATABASE_URL="postgres://palpo:your_password@localhost:5432/palpo_dev"

# Run migrations (optional)
cd crates/data
diesel migration run
```

### 3. Run Development Server
```bash
# Copy example configuration
cp crates/server/palpo.toml palpo-dev.toml

# Edit configuration file for development environment
# Modify server_name, listen_addr, database connection, etc.

# Run development server
PALPO_CONFIG=palpo-dev.toml cargo run

# Or use cargo-watch for auto-reload
cargo watch -x 'run'
```

### 4. Verify Server Operation
After successful startup, test if the server is running properly:

```bash
# Check server version information
curl http://yourservername:6006/_matrix/client/versions

# Expected JSON-formatted version information, similar to:
{
  "versions": ["r0.5.0", "r0.6.0", "v1.1", "v1.2", "v1.3", "v1.4", "v1.5", "v1.6"],
  "unstable_features": {}
}
```

If you receive the above JSON response, the Palpo server is running successfully.

Learn more about the Matrix API:
- [Matrix Client-Server API Specification](https://spec.matrix.org/latest/client-server-api/)
- [Matrix Server Discovery Specification](https://spec.matrix.org/latest/server-server-api/#server-discovery)

## Database Schema Overview

Palpo uses the following main data tables:

- **User-related**: `users`, `user_passwords`, `user_sessions`, `user_profiles`, `user_access_tokens`
- **Room-related**: `rooms`, `room_aliases`, `room_tags`
- **Event-related**: `events`, `event_datas`, `event_points`, `threads`
- **Media-related**: `media_metadatas`, `media_thumbnails`, `media_url_previews`
- **End-to-end Encryption**: `e2e_device_keys`, `e2e_room_keys`, `e2e_room_keys_versions`
- **Statistics-related**: `stats_user_daily_visits`, `stats_monthly_active_users`, `stats_room_currents`
- **Others**: `threepid_*`, `user_pushers`, `server_signing_keys`

View detailed table structures in the `crates/data/migrations/` directory.

## Troubleshooting

### Database-Related Issues

1. **Migration Failure**:
```bash
# Check database connection
psql $DATABASE_URL -c "SELECT version();"

# Check migration status
diesel migration list

# Reset database (use with caution)
dropdb palpo_dev && createdb palpo_dev
diesel migration run
```

2. **Permission Issues**:
```sql
-- Ensure user has sufficient permissions
GRANT ALL PRIVILEGES ON DATABASE palpo TO palpo;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO palpo;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO palpo;
```

3. **Connection Issues**:
```bash
# Test database connection
pg_isready -h localhost -p 5432 -U palpo

# Check PostgreSQL status
sudo systemctl status postgresql  # Linux
brew services list | grep postgres  # macOS
```

Additional troubleshooting resources:
- [PostgreSQL Troubleshooting Documentation](https://www.postgresql.org/docs/current/troubleshooting.html)
- [Diesel Troubleshooting Guide](https://diesel.rs/guides/troubleshooting)

### Common Issues

1. **Compilation Errors**: Ensure all required system dependencies are installed
2. **Diesel CLI Installation Failure**: Ensure `libpq-dev` (Linux) or PostgreSQL development libraries are installed
3. **Port Conflicts**: Modify `listen_addr` to use a different port
4. **Permission Issues**: Ensure Palpo has permission to access configuration files and media directories

### Log Debugging
```bash
# Enable verbose logging
RUST_LOG=debug ./target/release/palpo

# Database query logging
RUST_LOG=diesel=debug ./target/release/palpo
```

Learn more about debugging:
- [Rust Log Configuration Documentation](https://docs.rs/env_logger/latest/env_logger/)
- [Tracing Documentation](https://docs.rs/tracing/latest/tracing/)
