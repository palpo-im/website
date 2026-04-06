# Maintaining Your Palpo Setup

## Moderation

Palpo handles moderation through room management commands. "Binary commands" (medium priority) and admin APIs (low priority) are planned. Some moderation-related configuration options are provided in the example configuration, such as "global ACL" and blocking media requests to certain servers. Refer to the moderation configuration options under the "Moderation/Privacy/Security" section in the example configuration.

Palpo has the following moderation management commands:

- Manage room aliases (`!admin rooms alias`)
- Manage room directory (`!admin rooms directory`)
- Manage room bans/blocks and user removal (`!admin rooms moderation`)
- Manage user accounts (`!admin users`)
- Fetch `/.well-known/matrix/support` from servers (`!admin federation`)
- Block incoming federation for certain rooms (different from room bans) (`!admin federation`)
- Delete media (see [Media section](#media))

Any command with `-list` requires a code block in the message, with each object separated by a newline. Example:

````
!admin rooms moderation ban-list-of-rooms
```
!roomid1:server.name
#badroomalias1:server.name
!roomid2:server.name
!roomid3:server.name
#badroomalias2:server.name
```
````

## Media

Media still requires various improvements, but Palpo implements media deletion through:

- MXC URI or event ID (unencrypted and attempts to find MXC URI in the event)
- Deleting a list of MXC URIs
- File system metadata via file creation time (`btime`) or file modification time (`mtime`) to delete remote media from the past `N` seconds/minutes

For more information, refer to the `!admin media` command.

### Storage Backends

Palpo supports two storage backends for media via [Apache OpenDAL](https://opendal.apache.org/):

- **Local filesystem** (default) — media stored under the `space_path` directory
- **S3-compatible storage** — works with AWS S3, Cloudflare R2, MinIO, Backblaze B2, and any S3-compatible service

See the [Storage Configuration](/guide/configuration/#storage-configuration) section for setup details.

If you find yourself needing extensive fine-grained control over media, we recommend checking out [Matrix Media Repo](https://github.com/t2bot/matrix-media-repo). Palpo plans to implement various utilities for media, but MMR is dedicated to extensive media management.

Palpo sends a 1-year `Cache-Control` header with immutable for all media requests (downloads and thumbnails) to reduce unnecessary media requests from browsers, decrease bandwidth usage, and lower load.

## Upgrading Palpo

### Docker

1. Pull the latest image:
   ```bash
   docker compose pull
   ```
2. Restart services:
   ```bash
   docker compose up -d
   ```
   Database migrations run automatically on startup.

### Binary

1. Download the new release from [GitHub Releases](https://github.com/palpo-im/palpo/releases).
2. Stop the running server:
   ```bash
   systemctl stop palpo
   ```
3. Replace the old binary with the new one.
4. Start the server:
   ```bash
   systemctl start palpo
   ```
   Database migrations run automatically on first startup with the new version.

### Before Upgrading

- **Back up your database** before every upgrade. See the [Backup Guide](./administration/backup.md).
- Read the release notes for any breaking changes or required configuration updates.
- Test the upgrade in a staging environment if possible.

## Database Maintenance

PostgreSQL requires periodic maintenance for optimal performance.

### Routine VACUUM

PostgreSQL's autovacuum runs automatically, but for busy servers you may want to run a manual vacuum periodically:

```bash
# Standard vacuum (non-blocking)
sudo -u postgres psql -d palpo -c "VACUUM ANALYZE;"

# Full vacuum (requires downtime, reclaims disk space)
sudo -u postgres psql -d palpo -c "VACUUM FULL ANALYZE;"
```

### Reindexing

If query performance degrades over time, reindexing can help:

```bash
sudo -u postgres psql -d palpo -c "REINDEX DATABASE palpo;"
```

### Monitoring Database Size

```bash
sudo -u postgres psql -d palpo -c "SELECT pg_size_pretty(pg_database_size('palpo'));"
```

## Log Management

For long-running Palpo servers, log rotation prevents disk exhaustion. See the [Monitoring Guide](./administration/monitoring.md) for logrotate configuration.

If running via systemd, logs are managed by journald:

```bash
# View recent logs
journalctl -u palpo --since "1 hour ago"

# Check log disk usage
journalctl --disk-usage

# Trim logs older than 7 days
sudo journalctl --vacuum-time=7d
```

## TLS Certificate Renewal

If you configured TLS directly in Palpo (not via a reverse proxy), you need to renew certificates before they expire.

### Let's Encrypt with certbot

```bash
# Renew certificates
sudo certbot renew

# Restart Palpo to load new certificates
sudo systemctl restart palpo
```

Set up automatic renewal via cron:

```bash
# /etc/cron.d/certbot-palpo
0 3 * * * root certbot renew --quiet --post-hook "systemctl restart palpo"
```

If using a reverse proxy (Caddy, Traefik, Nginx), certificate management is handled by the proxy — no Palpo restart is needed.