# Event Reports API

Manage reports of policy-violating content submitted by users.

## List Event Reports

List all event reports with pagination and filtering.

**Endpoint:** `GET /_synapse/admin/v1/event_reports`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `from` | integer | Offset for pagination (default: 0) |
| `limit` | integer | Max results (default: 100, max: 1000) |
| `dir` | string | Sort direction: `f` (forward) or `b` (backward, default) |
| `user_id` | string | Filter by reporting user |
| `room_id` | string | Filter by room |

**Example Request:**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/event_reports?limit=20&dir=b" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "event_reports": [
    {
      "id": 12,
      "received_ts": 1609459200000,
      "room_id": "!roomid:example.com",
      "event_id": "$eventid:example.com",
      "user_id": "@reporter:example.com",
      "reason": "Spam content",
      "score": -100,
      "sender": "@spammer:example.com",
      "canonical_alias": "#general:example.com",
      "name": "General Chat"
    }
  ],
  "total": 1,
  "next_token": null
}
```

## Get Event Report Details

Get detailed information about a specific event report, including the reported event content.

**Endpoint:** `GET /_synapse/admin/v1/event_reports/{report_id}`

**Path Parameters:**
- `report_id` - Numeric report identifier

**Example Request:**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/event_reports/12" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "id": 12,
  "received_ts": 1609459200000,
  "room_id": "!roomid:example.com",
  "event_id": "$eventid:example.com",
  "user_id": "@reporter:example.com",
  "reason": "Spam content",
  "score": -100,
  "event_json": {
    "type": "m.room.message",
    "content": {
      "msgtype": "m.text",
      "body": "Buy cheap products at spam-site.example!"
    },
    "sender": "@spammer:example.com",
    "origin_server_ts": 1609458000000,
    "event_id": "$eventid:example.com"
  }
}
```

## Delete Event Report

Delete an event report after it has been handled.

**Endpoint:** `DELETE /_synapse/admin/v1/event_reports/{report_id}`

**Example Request:**
```bash
curl -X DELETE "https://your-server/_synapse/admin/v1/event_reports/12" \
  -H "Authorization: Bearer <access_token>"
```

**Response:** `200 OK` with empty body on success.

## Event Report Fields Reference

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique report identifier |
| `received_ts` | integer | When the report was received (ms since epoch) |
| `room_id` | string | Room where the event was sent |
| `event_id` | string | ID of the reported event |
| `user_id` | string | User who submitted the report |
| `reason` | string | Reason provided by the reporter (may be null) |
| `score` | integer | Severity score (-100 to 0, where -100 is most severe) |
| `sender` | string | User who sent the reported event |
| `canonical_alias` | string | Room alias (if available) |
| `name` | string | Room name (if available) |
| `event_json` | object | Full content of the reported event |

## Handling Reports Workflow

1. **Review new reports** - List reports with `dir=b` to see most recent first.

2. **Investigate** - Get report details to see the full event content.

3. **Take action** - Based on severity, you may:
   - Warn the sender
   - Redact the event
   - Shadow ban the user
   - Deactivate the user account
   - Ban the room

4. **Clean up** - Delete the report after handling.

## Example: Moderate Reported Content

```bash
# 1. List recent reports
curl -X GET "https://your-server/_synapse/admin/v1/event_reports?limit=10" \
  -H "Authorization: Bearer <access_token>"

# 2. Get details of report #12
curl -X GET "https://your-server/_synapse/admin/v1/event_reports/12" \
  -H "Authorization: Bearer <access_token>"

# 3. If spam, shadow ban the sender
curl -X POST "https://your-server/_synapse/admin/v1/users/@spammer:example.com/shadow_ban" \
  -H "Authorization: Bearer <access_token>"

# 4. Delete the handled report
curl -X DELETE "https://your-server/_synapse/admin/v1/event_reports/12" \
  -H "Authorization: Bearer <access_token>"
```
