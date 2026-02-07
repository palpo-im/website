# User Devices API

Manage devices associated with user accounts.

## List User Devices

List all devices for a user.

**Endpoint:** `GET /_synapse/admin/v2/users/{user_id}/devices`

**Path Parameters:**
- `user_id` - Full Matrix user ID (e.g., `@alice:example.com`)

**Example Request:**
```bash
curl -X GET "https://your-server/_synapse/admin/v2/users/@alice:example.com/devices" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "devices": [
    {
      "device_id": "ABCDEFGHIJ",
      "display_name": "Alice's Phone",
      "last_seen_ip": "192.168.1.100",
      "last_seen_ts": 1609459200000,
      "last_seen_user_agent": "Element Android/1.0.0",
      "user_id": "@alice:example.com",
      "dehydrated": false
    },
    {
      "device_id": "KLMNOPQRST",
      "display_name": "Alice's Laptop",
      "last_seen_ip": "192.168.1.101",
      "last_seen_ts": 1609458000000,
      "last_seen_user_agent": "Element Desktop/1.7.0",
      "user_id": "@alice:example.com",
      "dehydrated": false
    }
  ],
  "total": 2
}
```

## Get Device Details

Get details of a specific device.

**Endpoint:** `GET /_synapse/admin/v2/users/{user_id}/devices/{device_id}`

**Path Parameters:**
- `user_id` - Full Matrix user ID
- `device_id` - Device ID

**Example Request:**
```bash
curl -X GET "https://your-server/_synapse/admin/v2/users/@alice:example.com/devices/ABCDEFGHIJ" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "device_id": "ABCDEFGHIJ",
  "display_name": "Alice's Phone",
  "last_seen_ip": "192.168.1.100",
  "last_seen_ts": 1609459200000,
  "last_seen_user_agent": "Element Android/1.0.0",
  "user_id": "@alice:example.com",
  "dehydrated": false
}
```

## Create Device

Create a new device for a user.

**Endpoint:** `POST /_synapse/admin/v2/users/{user_id}/devices`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `device_id` | string | Yes | Unique device identifier |
| `display_name` | string | No | Human-readable device name |

**Example Request:**
```bash
curl -X POST "https://your-server/_synapse/admin/v2/users/@alice:example.com/devices" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "NEWDEVICE01",
    "display_name": "Admin-created device"
  }'
```

## Update Device

Update device information (display name).

**Endpoint:** `PUT /_synapse/admin/v2/users/{user_id}/devices/{device_id}`

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| `display_name` | string | New display name for the device |

**Example Request:**
```bash
curl -X PUT "https://your-server/_synapse/admin/v2/users/@alice:example.com/devices/ABCDEFGHIJ" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"display_name": "Alice'\''s Work Phone"}'
```

## Delete Device

Delete a specific device, logging out that session.

**Endpoint:** `DELETE /_synapse/admin/v2/users/{user_id}/devices/{device_id}`

**Example Request:**
```bash
curl -X DELETE "https://your-server/_synapse/admin/v2/users/@alice:example.com/devices/ABCDEFGHIJ" \
  -H "Authorization: Bearer <access_token>"
```

**Response:** `200 OK` with empty body on success.

## Delete Multiple Devices

Delete multiple devices at once.

**Endpoint:** `POST /_synapse/admin/v2/users/{user_id}/delete_devices`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `devices` | array | Yes | List of device IDs to delete |

**Example Request:**
```bash
curl -X POST "https://your-server/_synapse/admin/v2/users/@alice:example.com/delete_devices" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "devices": ["DEVICE001", "DEVICE002", "DEVICE003"]
  }'
```

**Response:** `200 OK` with empty body on success.

## Device Fields Reference

| Field | Type | Description |
|-------|------|-------------|
| `device_id` | string | Unique identifier for the device |
| `display_name` | string | User-friendly device name |
| `last_seen_ip` | string | IP address of last activity |
| `last_seen_ts` | integer | Timestamp of last activity (ms since epoch) |
| `last_seen_user_agent` | string | User agent string of the client |
| `user_id` | string | User who owns the device |
| `dehydrated` | boolean | Whether this is a dehydrated device (for encryption backup) |
