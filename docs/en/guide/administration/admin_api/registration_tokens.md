# Registration Tokens API

Manage registration tokens for controlled user sign-ups.

Registration tokens allow you to control who can create accounts on your server. Users must provide a valid token during registration.

## List Registration Tokens

List all registration tokens.

**Endpoint:** `GET /_synapse/admin/v1/registration_tokens`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `valid` | boolean | Filter by validity (true = valid tokens only, false = expired/exhausted only) |

**Example Request:**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/registration_tokens?valid=true" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "registration_tokens": [
    {
      "token": "abc123xyz",
      "uses_allowed": 10,
      "pending": 2,
      "completed": 5,
      "expiry_time": 1640995200000
    },
    {
      "token": "unlimited_token",
      "uses_allowed": null,
      "pending": 0,
      "completed": 100,
      "expiry_time": null
    }
  ]
}
```

## Create Registration Token

Create a new registration token.

**Endpoint:** `POST /_synapse/admin/v1/registration_tokens/new`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | string | No | Custom token string (auto-generated if not provided) |
| `length` | integer | No | Length of auto-generated token (default: 16, max: 64) |
| `uses_allowed` | integer | No | Maximum number of uses (null = unlimited) |
| `expiry_time` | integer | No | Expiry timestamp in milliseconds (null = no expiry) |

**Example Request - Create custom token:**
```bash
curl -X POST "https://your-server/_synapse/admin/v1/registration_tokens/new" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "invite-jan-2024",
    "uses_allowed": 50,
    "expiry_time": 1706745600000
  }'
```

**Example Request - Auto-generate token:**
```bash
curl -X POST "https://your-server/_synapse/admin/v1/registration_tokens/new" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "length": 24,
    "uses_allowed": 10
  }'
```

**Example Response:**
```json
{
  "token": "invite-jan-2024",
  "uses_allowed": 50,
  "pending": 0,
  "completed": 0,
  "expiry_time": 1706745600000
}
```

## Get Registration Token

Get details of a specific registration token.

**Endpoint:** `GET /_synapse/admin/v1/registration_tokens/{token}`

**Path Parameters:**
- `token` - The registration token string

**Example Request:**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/registration_tokens/invite-jan-2024" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "token": "invite-jan-2024",
  "uses_allowed": 50,
  "pending": 5,
  "completed": 20,
  "expiry_time": 1706745600000
}
```

## Update Registration Token

Update the limits or expiry of an existing token.

**Endpoint:** `PUT /_synapse/admin/v1/registration_tokens/{token}`

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| `uses_allowed` | integer/null | New max uses (null = unlimited) |
| `expiry_time` | integer/null | New expiry timestamp (null = no expiry) |

**Example Request:**
```bash
curl -X PUT "https://your-server/_synapse/admin/v1/registration_tokens/invite-jan-2024" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "uses_allowed": 100,
    "expiry_time": null
  }'
```

**Example Response:**
```json
{
  "token": "invite-jan-2024",
  "uses_allowed": 100,
  "pending": 5,
  "completed": 20,
  "expiry_time": null
}
```

## Delete Registration Token

Delete a registration token, preventing any further use.

**Endpoint:** `DELETE /_synapse/admin/v1/registration_tokens/{token}`

**Example Request:**
```bash
curl -X DELETE "https://your-server/_synapse/admin/v1/registration_tokens/invite-jan-2024" \
  -H "Authorization: Bearer <access_token>"
```

**Response:** `200 OK` with empty body on success.

## Token Fields Reference

| Field | Type | Description |
|-------|------|-------------|
| `token` | string | The registration token string |
| `uses_allowed` | integer/null | Maximum number of registrations allowed (null = unlimited) |
| `pending` | integer | Number of registrations currently in progress |
| `completed` | integer | Number of successful registrations using this token |
| `expiry_time` | integer/null | Expiry timestamp in milliseconds (null = no expiry) |

## Token Validity

A token is considered valid if:
1. It has not expired (`expiry_time` is null or in the future)
2. It has remaining uses (`uses_allowed` is null or `completed + pending < uses_allowed`)

## Use Cases

### Event Registration
Create a time-limited token for conference attendees:
```json
{
  "token": "conference-2024",
  "uses_allowed": 200,
  "expiry_time": 1704067200000
}
```

### Organization Invite
Create an unlimited token for your organization:
```json
{
  "token": "acme-corp-invite",
  "uses_allowed": null,
  "expiry_time": null
}
```

### One-Time Invite
Create a single-use invite link:
```json
{
  "length": 32,
  "uses_allowed": 1
}
```

## Enabling Token-Based Registration

To require registration tokens, add to your Palpo configuration:

```toml
[registration]
enable = true
token_required = true
```

Users will then need to provide a valid token during the registration process.
