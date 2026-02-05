# Statistics API

Get server statistics and version information.

## Get Server Version

Get the Palpo server version.

**Endpoint:** `GET /_synapse/admin/v1/server_version`

**Example Request:**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/server_version" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "server_version": "0.1.0"
}
```

## Get User Media Statistics

Get statistics about media uploaded by users.

**Endpoint:** `GET /_synapse/admin/v1/statistics/users/media`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `from` | integer | Offset for pagination (default: 0) |
| `limit` | integer | Max results (default: 100) |
| `order_by` | string | Sort field |
| `dir` | string | Sort direction: `f` (forward) or `b` (backward) |
| `search_term` | string | Filter by user ID |

**Note:** This endpoint is planned but not yet implemented. It will return `501 Not Implemented`.

## Additional Server Endpoints

### Fetch Event

Fetch a single event by ID.

**Endpoint:** `GET /_synapse/admin/v1/fetch_event/{event_id}`

**Path Parameters:**
- `event_id` - Full event ID (e.g., `$eventid:example.com`)

**Example Request:**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/fetch_event/\$abc123:example.com" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "event": {
    "type": "m.room.message",
    "content": {
      "msgtype": "m.text",
      "body": "Hello world!"
    },
    "sender": "@alice:example.com",
    "room_id": "!roomid:example.com",
    "origin_server_ts": 1609459200000,
    "event_id": "$abc123:example.com"
  }
}
```

### Check Username Available

Check if a username is available for registration.

**Endpoint:** `GET /_synapse/admin/username_available`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | string | Yes | Username to check (without the `@` prefix or server name) |

**Example Request:**
```bash
curl -X GET "https://your-server/_synapse/admin/username_available?username=newuser" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "available": true
}
```

### User Lookup by External ID

Find a user by their external authentication provider ID.

**Endpoint:** `GET /_synapse/admin/v1/auth_providers/{provider}/users/{external_id}`

**Path Parameters:**
- `provider` - Auth provider ID (e.g., `oidc-google`)
- `external_id` - External user ID from the provider

**Example Request:**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/auth_providers/oidc-google/users/12345" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "user_id": "@alice:example.com"
}
```

### User Lookup by 3PID

Find a user by their third-party identifier (email, phone).

**Endpoint:** `GET /_synapse/admin/v1/threepid/{medium}/users/{address}`

**Path Parameters:**
- `medium` - Type of 3PID: `email` or `msisdn` (phone)
- `address` - The 3PID value

**Example Request:**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/threepid/email/users/alice@example.com" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "user_id": "@alice:example.com"
}
```

## Future Endpoints

The following endpoints are planned for future implementation:

### Server Statistics
- Database size
- Active users (daily, weekly, monthly)
- Message counts
- Federation statistics

### Room Statistics
- Messages per room
- Active users per room
- Media usage per room

### Federation Statistics
- Active destinations
- Failed destinations
- Federation queue depth
