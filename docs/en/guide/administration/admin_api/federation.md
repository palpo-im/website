# Federation Admin API

Manage federation connections with other Matrix homeservers.

## List Federation Destinations

List all servers your server has communicated with.

**Endpoint:** `GET /_synapse/admin/v1/federation/destinations`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `from` | integer | Offset for pagination (default: 0) |
| `limit` | integer | Max results (default: 100) |
| `destination` | string | Filter by destination server name |
| `order_by` | string | Sort field |
| `dir` | string | Sort direction: `f` (forward) or `b` (backward) |

**Example Request:**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/federation/destinations?limit=20" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "destinations": [
    {
      "destination": "matrix.org",
      "retry_last_ts": 1609459200000,
      "retry_interval": 0,
      "failure_ts": null,
      "last_successful_stream_ordering": 12345
    },
    {
      "destination": "example.org",
      "retry_last_ts": 1609458000000,
      "retry_interval": 60000,
      "failure_ts": 1609457000000,
      "last_successful_stream_ordering": 11000
    }
  ],
  "total": 2,
  "next_token": null
}
```

## Get Destination Details

Get detailed information about a specific federation destination.

**Endpoint:** `GET /_synapse/admin/v1/federation/destinations/{destination}`

**Path Parameters:**
- `destination` - Server name (e.g., `matrix.org`)

**Example Request:**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/federation/destinations/matrix.org" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "destination": "matrix.org",
  "retry_last_ts": 1609459200000,
  "retry_interval": 0,
  "failure_ts": null,
  "last_successful_stream_ordering": 12345
}
```

## Get Destination Rooms

List rooms shared with a specific server.

**Endpoint:** `GET /_synapse/admin/v1/federation/destinations/{destination}/rooms`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `from` | integer | Offset for pagination (default: 0) |
| `limit` | integer | Max results (default: 100) |

**Example Request:**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/federation/destinations/matrix.org/rooms" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "rooms": [
    {
      "room_id": "!roomid1:example.com",
      "stream_ordering": 12345
    },
    {
      "room_id": "!roomid2:example.com",
      "stream_ordering": 12340
    }
  ],
  "total": 2,
  "next_token": null
}
```

## Reset Destination Connection

Reset the retry timing for a destination, allowing immediate reconnection attempts.

**Endpoint:** `POST /_synapse/admin/v1/federation/destinations/{destination}/reset_connection`

Use this when:
- A destination has been incorrectly marked as failing
- Network issues have been resolved
- You want to force a reconnection attempt

**Example Request:**
```bash
curl -X POST "https://your-server/_synapse/admin/v1/federation/destinations/example.org/reset_connection" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{}
```

## Federation Fields Reference

| Field | Type | Description |
|-------|------|-------------|
| `destination` | string | The remote server name |
| `retry_last_ts` | integer | Timestamp of last retry attempt (ms since epoch) |
| `retry_interval` | integer | Current retry interval in milliseconds (0 = not retrying) |
| `failure_ts` | integer | Timestamp when failure was first detected (null if not failing) |
| `last_successful_stream_ordering` | integer | Stream position of last successful delivery |

## Understanding Federation Status

### Healthy Connection
```json
{
  "retry_interval": 0,
  "failure_ts": null
}
```
The connection is healthy with no active retry attempts.

### Failing Connection
```json
{
  "retry_interval": 300000,
  "failure_ts": 1609457000000
}
```
The connection has been failing since `failure_ts`. The server will retry every `retry_interval` milliseconds (exponential backoff).

### Connection Recovery
After a successful reconnection, `failure_ts` becomes `null` and `retry_interval` returns to `0`.

## Troubleshooting Federation Issues

1. **Check destination status** - Use the Get Destination Details endpoint to see if there's an active failure.

2. **List shared rooms** - Identify which rooms are affected by the federation issue.

3. **Reset connection** - If the destination server is back online, reset the connection to force an immediate retry.

4. **Check server logs** - Look for federation-related errors in your server logs for more details.

5. **Verify DNS and certificates** - Ensure the destination server is properly configured with valid TLS certificates and DNS records.
