# User Admin API

Manage user accounts on your Palpo server.

## List Users

List all local user accounts with pagination and filtering.

**Endpoint:** `GET /_synapse/admin/v2/users`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `from` | integer | Offset for pagination (default: 0) |
| `limit` | integer | Max results to return (default: 100) |
| `user_id` | string | Filter by user ID (partial match) |
| `name` | string | Filter by display name |
| `guests` | boolean | Filter by guest status |
| `deactivated` | boolean | Filter by deactivation status |
| `admins` | boolean | Filter by admin status |
| `order_by` | string | Sort field: `name`, `displayname`, `creation_ts`, `admin`, `deactivated` |
| `dir` | string | Sort direction: `f` (forward) or `b` (backward) |

**Example Request:**
```bash
curl -X GET "https://your-server/_synapse/admin/v2/users?limit=10&admins=true" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "users": [
    {
      "name": "@admin:example.com",
      "displayname": "Administrator",
      "admin": true,
      "deactivated": false,
      "creation_ts": 1609459200000,
      "avatar_url": "mxc://example.com/abc123"
    }
  ],
  "total": 1,
  "next_token": null
}
```

## Get User Details

Get detailed information about a specific user.

**Endpoint:** `GET /_synapse/admin/v2/users/{user_id}`

**Path Parameters:**
- `user_id` - Full Matrix user ID (e.g., `@alice:example.com`)

**Example Request:**
```bash
curl -X GET "https://your-server/_synapse/admin/v2/users/@alice:example.com" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "name": "@alice:example.com",
  "displayname": "Alice",
  "admin": false,
  "deactivated": false,
  "locked": false,
  "creation_ts": 1609459200000,
  "avatar_url": "mxc://example.com/abc123",
  "threepids": [
    {
      "medium": "email",
      "address": "alice@example.com"
    }
  ],
  "external_ids": []
}
```

## Create or Modify User

Create a new user or modify an existing user.

**Endpoint:** `PUT /_synapse/admin/v2/users/{user_id}`

**Path Parameters:**
- `user_id` - Full Matrix user ID

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| `password` | string | User password |
| `logout_devices` | boolean | Logout all devices after password change |
| `displayname` | string | Display name |
| `avatar_url` | string | Avatar MXC URL |
| `threepids` | array | List of 3PIDs (email, phone) |
| `external_ids` | array | External auth provider IDs |
| `admin` | boolean | Admin status |
| `deactivated` | boolean | Account deactivated |
| `locked` | boolean | Account locked |
| `user_type` | string | User type |

**Example Request:**
```bash
curl -X PUT "https://your-server/_synapse/admin/v2/users/@newuser:example.com" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "securepassword123",
    "displayname": "New User",
    "admin": false,
    "threepids": [
      {"medium": "email", "address": "newuser@example.com"}
    ]
  }'
```

## Deactivate User

Deactivate a user account, preventing login.

**Endpoint:** `POST /_synapse/admin/v1/deactivate/{user_id}`

**Path Parameters:**
- `user_id` - Full Matrix user ID

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| `erase` | boolean | Erase user's messages and data |

**Example Request:**
```bash
curl -X POST "https://your-server/_synapse/admin/v1/deactivate/@alice:example.com" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"erase": false}'
```

## Reset Password

Reset a user's password.

**Endpoint:** `POST /_synapse/admin/v1/reset_password/{user_id}`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `new_password` | string | Yes | New password |
| `logout_devices` | boolean | No | Logout all devices (default: true) |

**Example Request:**
```bash
curl -X POST "https://your-server/_synapse/admin/v1/reset_password/@alice:example.com" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"new_password": "newSecurePassword123", "logout_devices": true}'
```

## Get Admin Status

Check if a user has admin privileges.

**Endpoint:** `GET /_synapse/admin/v1/users/{user_id}/admin`

**Example Response:**
```json
{
  "admin": true
}
```

## Set Admin Status

Grant or revoke admin privileges.

**Endpoint:** `PUT /_synapse/admin/v1/users/{user_id}/admin`

**Request Body:**
```json
{
  "admin": true
}
```

## Get User Sessions (Whois)

Get information about a user's active sessions.

**Endpoint:** `GET /_synapse/admin/v1/whois/{user_id}`

**Example Response:**
```json
{
  "user_id": "@alice:example.com",
  "devices": {
    "DEVICEID1": {
      "sessions": [
        {
          "connections": [
            {
              "ip": "192.168.1.100",
              "last_seen": 1609459200000,
              "user_agent": "Element/1.0"
            }
          ]
        }
      ]
    }
  }
}
```

## Get User's Joined Rooms

List all rooms a user has joined.

**Endpoint:** `GET /_synapse/admin/v1/users/{user_id}/joined_rooms`

**Example Response:**
```json
{
  "joined_rooms": [
    "!roomid1:example.com",
    "!roomid2:example.com"
  ],
  "total": 2
}
```

## Get User's Pushers

List all push notification configurations for a user.

**Endpoint:** `GET /_synapse/admin/v1/users/{user_id}/pushers`

**Example Response:**
```json
{
  "pushers": [
    {
      "app_id": "com.example.app",
      "app_display_name": "Example App",
      "device_display_name": "Phone",
      "pushkey": "abc123",
      "kind": "http",
      "lang": "en"
    }
  ],
  "total": 1
}
```

## Get User Account Data

Get all account data for a user.

**Endpoint:** `GET /_synapse/admin/v1/users/{user_id}/accountdata`

**Example Response:**
```json
{
  "account_data": {
    "global": {
      "m.push_rules": {...}
    },
    "rooms": {
      "!roomid:example.com": {...}
    }
  }
}
```

## Shadow Ban User

Shadow ban a user. Their messages are accepted but not delivered to other users.

**Endpoint:** `POST /_synapse/admin/v1/users/{user_id}/shadow_ban`

**Example Request:**
```bash
curl -X POST "https://your-server/_synapse/admin/v1/users/@spammer:example.com/shadow_ban" \
  -H "Authorization: Bearer <access_token>"
```

## Remove Shadow Ban

Remove a shadow ban from a user.

**Endpoint:** `DELETE /_synapse/admin/v1/users/{user_id}/shadow_ban`

## Suspend User

Suspend or unsuspend a user account.

**Endpoint:** `PUT /_synapse/admin/v1/suspend/{user_id}`

**Request Body:**
```json
{
  "suspend": true
}
```

**Example Response:**
```json
{
  "user_id": "@alice:example.com",
  "suspended": true
}
```

## Rate Limit Override

### Get Rate Limit Override

**Endpoint:** `GET /_synapse/admin/v1/users/{user_id}/override_ratelimit`

**Example Response:**
```json
{
  "messages_per_second": 10,
  "burst_count": 100
}
```

### Set Rate Limit Override

**Endpoint:** `POST /_synapse/admin/v1/users/{user_id}/override_ratelimit`

**Request Body:**
```json
{
  "messages_per_second": 20,
  "burst_count": 200
}
```

### Delete Rate Limit Override

**Endpoint:** `DELETE /_synapse/admin/v1/users/{user_id}/override_ratelimit`

## Allow Cross-Signing Replacement

Allow a user to replace cross-signing keys without User Interactive Authentication (UIA) for 10 minutes.

**Endpoint:** `POST /_synapse/admin/v1/users/{user_id}/_allow_cross_signing_replacement_without_uia`

**Example Response:**
```json
{
  "updatable_without_uia_before_ms": 1609460400000
}
```
