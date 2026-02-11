# Backup and Recovery

This guide covers backup strategies for your Palpo server to ensure data safety and quick recovery.

## What to Backup

### Critical Data

1. **PostgreSQL Database** - Contains all user data, room state, messages, and server configuration
2. **Media Files** - User uploads stored in the `space_path` directory
3. **Configuration File** - Your `palpo.toml` or equivalent
4. **Signing Keys** - Server signing keys (if stored separately)

### Backup Priority

| Component | Priority | Recovery Impact |
|-----------|----------|-----------------|
| Database | Critical | Loss means complete data loss |
| Media | High | Loss means uploaded files unavailable |
| Config | Medium | Can be recreated but takes time |
| Logs | Low | Useful for debugging, not essential |

## Database Backup

### PostgreSQL Backup Methods

#### pg_dump (Recommended for small to medium servers)

**Full backup:**
```bash
pg_dump -h localhost -U palpo -d palpo -F c -f palpo_backup_$(date +%Y%m%d).dump
```

**With compression:**
```bash
pg_dump -h localhost -U palpo -d palpo | gzip > palpo_backup_$(date +%Y%m%d).sql.gz
```

#### pg_basebackup (For larger databases)

```bash
pg_basebackup -h localhost -U palpo -D /backup/pg_base -Ft -z -P
```

### Automated Backup Script

Create `/etc/cron.daily/palpo-backup`:

```bash
#!/bin/bash
BACKUP_DIR="/backup/palpo"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
pg_dump -h localhost -U palpo -d palpo -F c -f "$BACKUP_DIR/db_$DATE.dump"

# Backup media (incremental with rsync)
rsync -av --delete /var/lib/palpo/media/ "$BACKUP_DIR/media/"

# Backup config
cp /etc/palpo/palpo.toml "$BACKUP_DIR/palpo.toml"

# Cleanup old backups (keep 7 days)
find $BACKUP_DIR -name "db_*.dump" -mtime +7 -delete

# Log completion
echo "$(date): Backup completed" >> /var/log/palpo-backup.log
```

Make executable:
```bash
chmod +x /etc/cron.daily/palpo-backup
```

## Media Backup

### rsync Method

**Initial full backup:**
```bash
rsync -avz /var/lib/palpo/media/ /backup/palpo/media/
```

**Incremental backup:**
```bash
rsync -avz --delete /var/lib/palpo/media/ /backup/palpo/media/
```

### Remote Backup

**To remote server:**
```bash
rsync -avz -e ssh /var/lib/palpo/media/ user@backup-server:/backup/palpo/media/
```

**To S3-compatible storage:**
```bash
# Using rclone
rclone sync /var/lib/palpo/media/ s3:bucket-name/palpo-media/
```

## Configuration Backup

Keep your configuration in version control:

```bash
# Initial setup
cd /etc/palpo
git init
git add palpo.toml
git commit -m "Initial configuration"

# After changes
git add -A
git commit -m "Description of changes"
```

## Recovery Procedures

### Full Server Recovery

1. **Install Palpo** on the new server

2. **Restore PostgreSQL database:**
   ```bash
   # Create database
   createdb -U postgres palpo

   # Restore from dump
   pg_restore -h localhost -U palpo -d palpo palpo_backup.dump
   ```

3. **Restore media files:**
   ```bash
   rsync -avz backup-server:/backup/palpo/media/ /var/lib/palpo/media/
   ```

4. **Restore configuration:**
   ```bash
   cp /backup/palpo/palpo.toml /etc/palpo/palpo.toml
   ```

5. **Verify permissions:**
   ```bash
   chown -R palpo:palpo /var/lib/palpo
   ```

6. **Start Palpo:**
   ```bash
   systemctl start palpo
   ```

### Database-Only Recovery

```bash
# Stop Palpo
systemctl stop palpo

# Drop and recreate database
dropdb -U postgres palpo
createdb -U postgres palpo

# Restore
pg_restore -h localhost -U palpo -d palpo palpo_backup.dump

# Start Palpo
systemctl start palpo
```

### Point-in-Time Recovery (PITR)

For production servers requiring minimal data loss:

1. **Enable WAL archiving** in PostgreSQL:
   ```
   # postgresql.conf
   archive_mode = on
   archive_command = 'cp %p /backup/wal/%f'
   ```

2. **Create base backup:**
   ```bash
   pg_basebackup -h localhost -U palpo -D /backup/base -Ft -z -P
   ```

3. **Recovery to specific time:**
   ```bash
   # recovery.conf
   restore_command = 'cp /backup/wal/%f %p'
   recovery_target_time = '2024-01-15 14:30:00'
   ```

## Backup Verification

### Test Your Backups Regularly

**Database backup verification:**
```bash
# Restore to test database
createdb -U postgres palpo_test
pg_restore -h localhost -U postgres -d palpo_test palpo_backup.dump

# Verify data
psql -U postgres -d palpo_test -c "SELECT COUNT(*) FROM users;"

# Cleanup
dropdb -U postgres palpo_test
```

**Automated verification script:**
```bash
#!/bin/bash
BACKUP_FILE="/backup/palpo/db_latest.dump"

# Restore to test database
createdb -U postgres palpo_verify 2>/dev/null || dropdb -U postgres palpo_verify && createdb -U postgres palpo_verify
pg_restore -h localhost -U postgres -d palpo_verify $BACKUP_FILE

# Verify
USERS=$(psql -U postgres -d palpo_verify -t -c "SELECT COUNT(*) FROM users;")
ROOMS=$(psql -U postgres -d palpo_verify -t -c "SELECT COUNT(*) FROM rooms;")

echo "Verification: $USERS users, $ROOMS rooms"

# Cleanup
dropdb -U postgres palpo_verify
```

## Backup Storage Recommendations

### Local Storage
- Fast recovery
- Risk of loss if server fails
- Good for initial backup destination

### Remote/Offsite Storage
- Protection against site failure
- Slower recovery
- Essential for disaster recovery

### Cloud Storage
- Highly durable
- Pay for storage used
- Good for long-term archival

### Recommended Strategy: 3-2-1 Rule
- **3** copies of data
- **2** different storage media
- **1** offsite copy

## Backup Schedule Recommendations

| Server Size | Database | Media | Config |
|-------------|----------|-------|--------|
| Small (<100 users) | Daily | Weekly | On change |
| Medium (100-1000) | Every 6 hours | Daily | On change |
| Large (>1000) | Hourly + PITR | Daily incremental | On change |
