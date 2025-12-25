# Palpo Build Guide

This document provides detailed instructions for building the Palpo Matrix server on various platforms.

## Table of Contents

- [System Requirements](#system-requirements)
- [macOS/Linux Build](#macoslinux-build)
- [Windows Build](#windows-build)
- [Docker Build](#docker-build)
- [Database Setup and Migration](#database-setup-and-migration)
- [Development Environment Setup](#development-environment-setup)

## System Requirements

### Basic Requirements
- [Rust](https://www.rust-lang.org/) 1.70+ (latest stable version recommended)
- [PostgreSQL](https://www.postgresql.org/) 12+
- [Git](https://git-scm.com/)
- [Diesel CLI](https://diesel.rs/guides/getting-started) (for database migrations)

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

For more information, refer to:
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

For more information, refer to:
- [PostgreSQL Ubuntu Installation Guide](https://www.postgresql.org/download/linux/ubuntu/)
- [Ubuntu Development Tools Installation](https://ubuntu.com/server/docs/programming-c)

#### CentOS/RHEL/Fedora
```bash
# CentOS/RHEL
sudo yum install -y gcc gcc-c++ cmake postgresql-devel clang-devel

# Fedora
sudo dnf install -y gcc gcc-c++ cmake postgresql-devel clang-devel
```

For more information, refer to:
- [PostgreSQL Red Hat Installation Guide](https://www.postgresql.org/download/linux/redhat/)
- [Fedora Development Tools](https://docs.fedoraproject.org/en-US/quick-docs/installing-plugins-for-playing-movies-and-music/)

### 2. Install Rust and Diesel CLI
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Install Diesel CLI (with PostgreSQL support)
cargo install diesel_cli --no-default-features --features postgres
```

For more information, refer to:
- [Rust Official Installation Guide](https://www.rust-lang.org/tools/install)
- [Diesel CLI Documentation](https://diesel.rs/guides/getting-started)

### 3. Clone and Build the Project
```bash
# Clone the project
git clone https://github.com/palpo/palpo.git
cd palpo

# Build the project
cargo build --release

# After building, the executable is located at
./target/release/palpo
```

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

For more information, refer to:
- [Chocolatey Official Documentation](https://chocolatey.org/install)
- [PostgreSQL Windows Installation Guide](https://www.postgresql.org/download/windows/)
- [Rust Windows Installation Guide](https://forge.rust-lang.org/infra/channel-layout.html#windows)

### 2. Install Diesel CLI
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

### 4. Build the Project
```powershell
# Clone the project
git clone https://github.com/palpo/palpo.git
cd palpo

# Build the project
cargo build --release

# The executable is located at
.\target\release\palpo.exe
```

## Database Setup and Migration

### 1. Create Database and User

#### macOS/Linux
```bash
# Start PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS

# Create database and user
sudo -u postgres psql
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

For more information, refer to:
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

### 3. Run Database Migrations

```bash
# Navigate to data crate directory
cd crates/data

# Run migrations (creates all tables and indexes)
diesel migration run

# Verify migration status
diesel migration list
```

### 4. Migration Management Commands

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

For more information, refer to:
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

## Docker Build

### 1. Use Pre-built Image (Recommended)
```bash
# Clone project to get configuration files
git clone https://github.com/palpo/palpo.git
cd palpo/deploy/docker

# Edit configuration files
cp palpo.toml.example palpo.toml
# Edit palpo.toml to set your server name and database connection

# Start service (includes automatic database migration)
docker compose up -d
```

For more information, refer to:
- [Docker Official Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

### 2. Database Migration in Docker Environment

Database migrations in Docker environment are executed automatically, but you can also run them manually:

```bash
# Check migration status
docker compose exec palpo diesel migration list

# Run migrations manually
docker compose exec palpo diesel migration run

# Enter container for debugging if needed
docker compose exec palpo bash
```

### 3. Docker Compose Configuration Example

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: palpo
      POSTGRES_PASSWORD: changeme
      POSTGRES_DB: palpo
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U palpo"]
      interval: 10s
      timeout: 5s
      retries: 5

  palpo:
    image: palpo:latest
    ports:
      - "8008:8008"
      - "8448:8448"
    environment:
      DATABASE_URL: "postgres://palpo:changeme@postgres:5432/palpo"
      PALPO_CONFIG: '/var/palpo/palpo.toml'
    volumes:
      - ./palpo.toml:/var/palpo/palpo.toml
      - palpo_media:/var/palpo/media
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
  palpo_media:
```

## Development Environment Setup

### 1. Install Development Tools
```bash
# Install Rust development tools
rustup component add rustfmt clippy

# Install cargo extensions
cargo install cargo-watch cargo-edit
```

For more information, refer to:
- [Rustup Documentation](https://rust-lang.github.io/rustup/)
- [Cargo Tools Documentation](https://doc.rust-lang.org/cargo/)

### 2. Set Up Development Database
```bash
# Create development database
createdb palpo_dev

# Set development environment variables
export DATABASE_URL="postgres://palpo:your_password@localhost:5432/palpo_dev"

# Run migrations
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
After successful startup, use the following commands to test if the server is running properly:

```bash
# Check server version information
curl http://yourservername:6006/_matrix/client/versions

# Expected JSON-formatted version information, similar to:
{
  "versions": ["r0.5.0", "r0.6.0", "v1.1", "v1.2", "v1.3", "v1.4", "v1.5", "v1.6"],
  "unstable_features": {}
}
```

If the above JSON data is returned, it indicates that the Palpo server has successfully started and is running normally.

For more information about Matrix API, refer to:
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

Detailed structure of all tables can be viewed in the `crates/data/migrations/` directory.

## Troubleshooting

### Database-Related Issues

1. **Migration Failure**:
```bash
# Check database connection
psql $DATABASE_URL -c "SELECT version();"

# Check migration status
diesel migration list

# Reset database (use with caution)
dropdb palpo && createdb palpo
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

For more troubleshooting information, refer to:
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

For more debugging information, refer to:
- [Rust Log Configuration Documentation](https://docs.rs/env_logger/latest/env_logger/)
- [Tracing Documentation](https://docs.rs/tracing/latest/tracing/)
{/* 本行由工具自动生成,原文哈希值:d9a71879ae92864a955a7e949cf31e01 */}