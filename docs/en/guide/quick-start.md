# Quick Start

Follow these steps to bring a Palpo homeserver online quickly. Each section links to the detailed guides so you can dive deeper whenever you need more context.

## Prerequisites

- A 64-bit Linux, macOS, or Windows host with at least 2 vCPUs and 4 GB RAM.
- PostgreSQL 14 or newer. See the [PostgreSQL guide](./installation/postgres.md) for installation options.
- A publicly reachable domain name and, optionally, a reverse proxy such as Caddy, Traefik, or Nginx.
- Docker (recommended) or a shell environment capable of running the Palpo binary.

## 1. Prepare PostgreSQL

1. Install PostgreSQL following the instructions for your platform in the [installation overview](./installation/index.md).
2. Create a dedicated Palpo database user and database:

   ```bash
   sudo -u postgres psql <<'SQL'
   CREATE USER palpo WITH PASSWORD 'change_me';
   CREATE DATABASE palpo OWNER palpo;
   SQL
   ```

   Replace `change_me` with a strong password. If you use the official Docker Compose templates, the database service and credentials are defined in the Compose file instead.

## 2. Pick a Deployment Option

### Docker Compose (recommended)

1. Download the sample [`palpo.toml`](https://github.com/palpo-im/palpo/blob/main/deploy/docker/palpo.toml).
2. Choose one of the [Compose templates](https://github.com/palpo-im/palpo/tree/main/deploy/docker) (base, Caddy, Traefik, etc.) and rename `compose.*.yml` to `compose.yml`.
3. Update `POSTGRES_PASSWORD`, domain placeholders, and create any required Docker networks for your proxy.
4. Start the stack:

   ```bash
   docker compose up -d
   ```

For complete instructions see [Installing with Docker](./installation/docker.md).

### Run the Binary Directly

1. Download a release archive for your platform from [GitHub Releases](https://github.com/palpo-im/palpo/releases) and extract it.
2. Copy the example configuration and edit it:

   ```bash
   cp palpo-example.toml palpo.toml
   ```

3. Follow the platform-specific documentation ([Linux](./installation/linux.md), [macOS](./installation/macos.md), [Windows](./installation/windows.md)) to install dependencies and, if needed, configure systemd/launchd/services.

## 3. Initialize the Configuration

Edit `palpo.toml` and make sure you set at least:

- `server_name`: your primary domain, for example `example.com`.
- `[db].url`: a valid PostgreSQL connection string such as `postgresql://palpo:change_me@localhost:5432/palpo`.
- The `listen` blocks: confirm ports 8008/8448, `x_forwarded`, and `bind_addresses` match your network layout.

Advanced options (registration policy, media storage, reverse proxy, TURN, etc.) live in the [configuration section](./configuration/index.md).

## 4. Start Palpo

- Docker: run `docker compose up -d` or `docker compose restart palpo` after editing configs.
- Binary: from the Palpo directory execute:

  ```bash
  ./palpo --config palpo.toml
  ```

Once you see `Server started` in the logs, Palpo is serving on ports 8008/8448.

## 5. Verify & Next Steps

1. Hit `https://your.domain/_matrix/client/versions`; you should receive JSON that includes `palpo`, or simply visit `https://your.domain` and confirm the “Hello Palpo!” splash screen.
2. Use a Matrix client that understands registration tokens (Element Web is a good default) to connect to your homeserver and create the first administrator account.
3. Join the `#admins` room or run `palpo --console` to execute management commands, mint new registration tokens, or moderate rooms. See the [administration guide](./administration/index.md) for details.

After the basics are in place, continue with:

- [Delegation & reverse proxy setup](./configuration/delegation.md).
- [TURN configuration](./configuration/turn.md) to unlock voice/video.
- The [development docs](./development/index.md) if you plan to contribute.

You now have a working Palpo homeserver and can start inviting users.
