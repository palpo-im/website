# Media Admin API

Manage media files uploaded to your Palpo server.

## Get Media Info

Get information about a specific media file.

**Endpoint:** `GET /_synapse/admin/v1/media/{server_name}/{media_id}`

**Path Parameters:**
- `server_name` - Server that hosts the media (e.g., `example.com`)
- `media_id` - Media identifier

**Example Request:**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/media/example.com/abc123def456" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "media_info": {
    "media_origin": "example.com",
    "media_id": "abc123def456",
    "user_id": "@alice:example.com",
    "media_type": "image/png",
    "media_length": 1048576,
    "upload_name": "profile.png",
    "created_ts": 1609459200000
  }
}
```

## Delete Media

Delete a specific media file from the server.

**Endpoint:** `DELETE /_synapse/admin/v1/media/{server_name}/{media_id}`

**Note:** Only local media can be deleted. Remote media is cached and cannot be deleted through this endpoint.

**Example Request:**
```bash
curl -X DELETE "https://your-server/_synapse/admin/v1/media/example.com/abc123def456" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "deleted_media": ["abc123def456"],
  "total": 1
}
```

## Delete Media by Date and Size

Delete multiple media files based on timestamp and size criteria.

**Endpoint:** `POST /_synapse/admin/v1/media/delete`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `before_ts` | integer | Yes | Delete media uploaded before this timestamp (milliseconds since epoch) |
| `size_gt` | integer | No | Only delete media larger than this size (bytes) |

**Example Request:**
```bash
# Delete all media older than 90 days and larger than 10MB
curl -X POST "https://your-server/_synapse/admin/v1/media/delete?before_ts=1609459200000&size_gt=10485760" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "deleted_media": [
    "media_id_1",
    "media_id_2",
    "media_id_3"
  ],
  "total": 3
}
```

## List Media in Room

List all media files shared in a specific room.

**Endpoint:** `GET /_synapse/admin/v1/room/{room_id}/media`

**Example Response:**
```json
{
  "local": [
    "mxc://example.com/local123"
  ],
  "remote": [
    "mxc://other-server.org/remote456"
  ]
}
```

## List User's Media

List all media files uploaded by a specific user.

**Endpoint:** `GET /_synapse/admin/v1/users/{user_id}/media`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `from` | integer | Offset for pagination (default: 0) |
| `limit` | integer | Max results (default: 100, max: 1000) |
| `order_by` | string | Sort field: `media_id`, `upload_name`, `created_ts`, `media_length`, `media_type` |
| `dir` | string | Sort direction: `f` (forward) or `b` (backward) |

**Example Request:**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/users/@alice:example.com/media?limit=20&order_by=created_ts&dir=b" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "media": [
    {
      "media_id": "abc123",
      "media_type": "image/jpeg",
      "media_length": 524288,
      "upload_name": "photo.jpg",
      "created_ts": 1609459200000,
      "last_access_ts": 1609545600000,
      "quarantined_by": null,
      "safe_from_quarantine": false
    }
  ],
  "total": 1,
  "next_token": null
}
```

## Delete User's Media

Delete all media uploaded by a specific user.

**Endpoint:** `DELETE /_synapse/admin/v1/users/{user_id}/media`

**Query Parameters:**

Same as "List User's Media" - use pagination parameters to delete in batches.

**Example Request:**
```bash
curl -X DELETE "https://your-server/_synapse/admin/v1/users/@alice:example.com/media?limit=100" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "deleted_media": [
    "media_id_1",
    "media_id_2"
  ],
  "total": 2
}
```

## Purge Media Cache

Delete cached remote media that hasn't been accessed recently.

**Endpoint:** `POST /_synapse/admin/v1/purge_media_cache`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `before_ts` | integer | Yes | Delete cached media not accessed since this timestamp (milliseconds since epoch) |

**Example Request:**
```bash
# Purge remote media cache older than 30 days
# Calculate timestamp: current time minus 30 days in milliseconds
curl -X POST "https://your-server/_synapse/admin/v1/purge_media_cache?before_ts=1606867200000" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "deleted": 150
}
```

## Media Fields Reference

| Field | Type | Description |
|-------|------|-------------|
| `media_id` | string | Unique identifier for the media |
| `media_origin` | string | Server that originally uploaded the media |
| `user_id` | string | User who uploaded the media |
| `media_type` | string | MIME type (e.g., `image/png`, `video/mp4`) |
| `media_length` | integer | File size in bytes |
| `upload_name` | string | Original filename when uploaded |
| `created_ts` | integer | Upload timestamp (milliseconds since epoch) |
| `last_access_ts` | integer | Last access timestamp |
| `quarantined_by` | string | Admin who quarantined the media (if quarantined) |
| `safe_from_quarantine` | boolean | Whether media is exempt from quarantine |

## MXC URL Format

Media files are referenced using MXC URLs:
```
mxc://<server_name>/<media_id>
```

For example: `mxc://example.com/abc123def456`

To download media via HTTP, convert the MXC URL:
```
https://<your-server>/_matrix/media/v3/download/<server_name>/<media_id>
```
