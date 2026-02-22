# Admin API

Palpo provides an HTTP Admin API for programmatic server management. These APIs are compatible with the Synapse Admin API format, allowing you to use existing tools and scripts.

## Authentication

All Admin API endpoints require authentication with an admin user's access token. Include the token in your request:

**Header method (recommended):**
```
Authorization: Bearer <access_token>
```

**Query parameter method:**
```
?access_token=<access_token>
```

Only users with admin privileges can access these endpoints. Non-admin users will receive a `403 Forbidden` response.

## API Base Paths

Palpo supports two equivalent base paths:
- `/_synapse/admin/` - Synapse-compatible path
- `/_palpo/admin/` - Palpo-specific path

Both paths provide identical functionality.

## API Categories

The Admin API is organized into the following categories:

### User Management
- [User Admin API](./admin_api/users) - Create, modify, deactivate users
- [User Devices API](./admin_api/devices) - Manage user devices

### Room Management
- [Room Admin API](./admin_api/rooms) - List, inspect, and delete rooms

### Media Management
- [Media Admin API](./admin_api/media) - Manage uploaded media files

### Federation
- [Federation Admin API](./admin_api/federation) - Manage federation with other servers

### Content Moderation
- [Event Reports API](./admin_api/event_reports) - Handle reported events

### Server Management
- [Registration Tokens API](./admin_api/registration_tokens) - Manage registration tokens
- [Statistics API](./admin_api/statistics) - Server statistics and version info

## Common Patterns

### Pagination

Most list endpoints support pagination with these parameters:
- `from` - Offset to start from (default: 0)
- `limit` - Maximum number of results (default: 100)
- `dir` - Sort direction: `f` (forward) or `b` (backward)

Response includes pagination tokens:
```json
{
  "results": [...],
  "total": 150,
  "next_token": "100"
}
```

### Error Responses

Errors follow the Matrix error format:
```json
{
  "errcode": "M_FORBIDDEN",
  "error": "You are not a server admin"
}
```

Common error codes:
- `M_FORBIDDEN` - Admin access required
- `M_NOT_FOUND` - Resource not found
- `M_INVALID_PARAM` - Invalid parameter
- `M_UNKNOWN` - Server error

## Quick Reference

| Category | Endpoints | Description |
|----------|-----------|-------------|
| Users | 19 | User account management |
| Devices | 6 | Device management |
| Rooms | 10 | Room administration |
| Media | 7 | Media file management |
| Federation | 4 | Federation control |
| Event Reports | 3 | Content moderation |
| Registration | 5 | Registration tokens |
| Statistics | 2 | Server info |

## Example: List All Users

```bash
curl -X GET "https://your-server/_synapse/admin/v2/users" \
  -H "Authorization: Bearer <admin_access_token>"
```

Response:
```json
{
  "users": [
    {
      "name": "@alice:example.com",
      "displayname": "Alice",
      "admin": false,
      "deactivated": false
    }
  ],
  "total": 1
}
```
