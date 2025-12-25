# Quick Start

If you are deploying Palpo for the first time, follow the steps below to set up a functional Matrix server in minutes. This guide references other sections of the documentation for deeper exploration when needed.

## Prerequisites

- A 64-bit Linux, macOS, or Windows server with at least 2 vCPUs and 4 GB RAM recommended.
- PostgreSQL 14 or later. See the [PostgreSQL Guide](./installation/postgres.md) for installation instructions.
- A publicly accessible domain name, and optionally a reverse proxy (Caddy, Traefik, Nginx, etc.).
- Docker installed (recommended) or a shell environment capable of running the Palpo executable.

## 1. Initialize the Database

1. Install PostgreSQL for your platform by following the system-specific guides in the [Installation section](./installation/index.md).
2. Create a dedicated database user and database for Palpo:

   ```bash
   sudo -u postgres psql <<'SQL'
   CREATE USER palpo WITH PASSWORD 'change_me';
   CREATE DATABASE palpo OWNER palpo;
   SQL
   ```

   Replace `change_me` with a strong password. If using the official Docker Compose template, this step can be completed directly via environment variables in the Compose file.

## 2. Choose a Deployment Method

### Docker Compose (Recommended)

1. Download the example configuration [`palpo.toml`](https://github.com/palpo-im/palpo/blob/main/deploy/docker/palpo.toml).
2. Select a [Compose template](https://github.com/palpo-im/palpo/tree/main/deploy/docker) (basic, Caddy, Traefik, etc.) as needed, and rename `compose.*.yml` to `compose.yml`.
3. Modify placeholders such as `POSTGRES_PASSWORD` and domain name, and create the Docker network for the proxy if required.
4. Start the services:

   ```bash
   docker compose up -d
   ```

For more details, refer to [Docker Deployment](./installation/docker.md).

### Direct Binary Execution

1. Download the appropriate archive for your system from [GitHub Releases](https://github.com/palpo-im/palpo/releases).
2. Extract the archive, copy the example configuration, and edit it:

   ```bash
   cp palpo-example.toml palpo.toml
   ```

3. Follow the system-specific guides ([Linux](./installation/linux.md), [macOS](./installation/macos.md), [Windows](./installation/windows.md)) to install dependencies and configure systemd/launchd/services.

## 3. Initialize Configuration

Open `palpo.toml` and configure at least the following settings:

- `server_name`: Set to your primary domain, e.g., `example.com`.
- `[db].url`: Provide the correct PostgreSQL connection string, e.g., `postgresql://palpo:change_me@localhost:5432/palpo`.
- `listen` section: Ensure ports 8008/8448 and settings like `x_forwarded` and `bind_addresses` match your deployment topology.

For additional options (registration policies, media directory, reverse proxy, TURN, etc.), see the [Configuration section](./configuration/index.md).

## 4. Start Palpo

- Docker: Run `docker compose up -d` or, after modifying the configuration, execute `docker compose restart palpo`.
- Local binary: In the directory containing the Palpo executable, run:

  ```bash
  ./palpo --config palpo.toml
  ```

When you see `Server started` in the logs, the service is listening on ports 8008/8448.

## 5. Verify and Next Steps

1. Visit `https://your.domain/_matrix/client/versions`. It should return JSON containing `palpo`, or directly visit `https://your.domain` to confirm you see “Hello Palpo!”.
2. Use a client that supports registration tokens (e.g., Element Web) to connect to your server and create the first administrator account.
3. Execute administrative commands in the `#admins` room or via `palpo --console` to generate more registration tokens or manage rooms. For details, see the [Administration Guide](./administration/index.md).

After completing the basic deployment, it is recommended to:

- Configure [reverse proxy and delegation](./configuration/delegation.md) for production environments.
- Set up [TURN service](./configuration/turn.md) to enable voice calls.
- Browse the [Development section](./development/index.md) to learn how to contribute.

You now have a functional Palpo server ready to invite users and start communicating.
{/* 本行由工具自动生成,原文哈希值:d2d1763f7f988904c6851e070f837b11 */}