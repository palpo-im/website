# Admin FAQ

Frequently asked questions about administering a Palpo server.

## User Management

### How do I create the first admin user?

The first user created on a new Palpo server is automatically granted admin privileges. Use the console command:

```
user create-user admin
```

Or via the Admin API after creating a regular user first.

### How do I reset a user's password?

**Via console:**
```
user reset-password username newpassword123
```

**Via Admin API:**
```bash
curl -X POST "https://your-server/_synapse/admin/v1/reset_password/@username:your-server" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"new_password": "newpassword123"}'
```

### How do I make an existing user an admin?

**Via console:**
```
user make-user-admin @username:your-server
```

**Via Admin API:**
```bash
curl -X PUT "https://your-server/_synapse/admin/v1/users/@username:your-server/admin" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"admin": true}'
```

### How do I deal with spam accounts?

1. **Shadow ban** - User can still post but messages aren't delivered to others:
   ```
   # Via API
   POST /_synapse/admin/v1/users/@spammer:server/shadow_ban
   ```

2. **Deactivate** - Completely disable the account:
   ```
   user deactivate @spammer:your-server
   ```

3. **Prevent future registrations** - Use registration tokens or disable open registration.

## Room Management

### How do I ban a problematic room?

**Via console:**
```
room moderation ban-room !roomid:example.com
```

This will:
- Remove all local users from the room
- Prevent local users from rejoining
- Block invites to the room
- Disable federation for the room

### How do I delete a room?

**Via Admin API:**
```bash
curl -X DELETE "https://your-server/_synapse/admin/v2/rooms/!roomid:example.com" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"block": true, "purge": true}'
```

### How do I see what rooms a user is in?

**Via console:**
```
user list-joined-rooms @username:your-server
```

## Federation

### My server can't reach another server, what do I do?

1. Check the federation status:
   ```bash
   curl -X GET "https://your-server/_synapse/admin/v1/federation/destinations/other-server.com" \
     -H "Authorization: Bearer <admin_token>"
   ```

2. If there's a failure, reset the connection:
   ```bash
   curl -X POST "https://your-server/_synapse/admin/v1/federation/destinations/other-server.com/reset_connection" \
     -H "Authorization: Bearer <admin_token>"
   ```

3. Check your firewall allows outbound connections on port 8448.

4. Verify DNS and TLS certificates are correctly configured.

### How do I disable federation for a specific room?

**Via console:**
```
federation disable-room !roomid:your-server
```

To re-enable:
```
federation enable-room !roomid:your-server
```

## Media

### How do I free up disk space from old media?

**Delete old remote media cache:**
```bash
# Delete remote media not accessed in 30 days
curl -X POST "https://your-server/_synapse/admin/v1/purge_media_cache?before_ts=<timestamp_30_days_ago>" \
  -H "Authorization: Bearer <admin_token>"
```

**Delete old local media by size:**
```bash
# Delete local media older than 90 days and larger than 10MB
curl -X POST "https://your-server/_synapse/admin/v1/media/delete?before_ts=<timestamp>&size_gt=10485760" \
  -H "Authorization: Bearer <admin_token>"
```

### How do I find what media a user uploaded?

```bash
curl -X GET "https://your-server/_synapse/admin/v1/users/@username:your-server/media" \
  -H "Authorization: Bearer <admin_token>"
```

## Configuration

### How do I reload configuration without restarting?

**Via console:**
```
server reload-config
```

Or specify a path:
```
server reload-config /path/to/palpo.toml
```

### How do I see the current configuration?

**Via console:**
```
server show-config
```

### How do I see what features are enabled?

**Via console:**
```
server list-features --enabled
```

## Security

### How do I require registration tokens?

Add to your configuration:
```toml
[registration]
enable = true
token_required = true
```

Then create tokens via the Admin API:
```bash
curl -X POST "https://your-server/_synapse/admin/v1/registration_tokens/new" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"uses_allowed": 10}'
```

### How do I disable open registration?

```toml
[registration]
enable = false
```

Or require tokens (see above).

### How do I check for reported content?

**Via Admin API:**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/event_reports" \
  -H "Authorization: Bearer <admin_token>"
```

## Troubleshooting

### The server won't start

1. Check the configuration file for syntax errors
2. Ensure the database is accessible
3. Check file permissions on data directories
4. Review server logs for specific errors

### Users can't log in

1. Verify the database is running
2. Check for rate limiting
3. Ensure the server_name in config matches what users are using
4. Check TLS certificate validity

### Messages aren't federating

1. Check federation status for the destination server
2. Verify DNS records (especially `.well-known` if using delegation)
3. Ensure port 8448 is accessible
4. Check TLS certificate is valid and trusted
