# Room Admin API

Manage rooms on your Palpo server.

## List Rooms

List all rooms the server knows about with pagination and filtering.

**Endpoint:** `GET /_synapse/admin/v1/rooms`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `from` | integer | Offset for pagination (default: 0) |
| `limit` | integer | Max results (default: 100, max: 1000) |
| `order_by` | string | Sort field: `name`, `joined_members`, `canonical_alias`, `joined_local_members`, `version`, `creator`, `encryption`, `federatable`, `public`, `join_rules`, `guest_access`, `history_visibility`, `state_events` |
| `dir` | string | Sort direction: `f` (forward) or `b` (backward) |
| `search_term` | string | Filter rooms by name or alias |

**Example Request:**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/rooms?limit=10&order_by=joined_members&dir=b" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "rooms": [
    {
      "room_id": "!roomid:example.com",
      "name": "General Chat",
      "canonical_alias": "#general:example.com",
      "joined_members": 150,
      "joined_local_members": 100,
      "version": "10",
      "creator": "@admin:example.com",
      "encryption": "m.megolm.v1.aes-sha2",
      "federatable": true,
      "public": true,
      "join_rules": "public",
      "guest_access": "can_join",
      "history_visibility": "shared",
      "state_events": 500
    }
  ],
  "offset": 0,
  "total_rooms": 50,
  "next_batch": "10"
}
```

## Get Room Details

Get detailed information about a specific room.

**Endpoint:** `GET /_synapse/admin/v1/rooms/{room_id}`

**Path Parameters:**
- `room_id` - Room ID (e.g., `!roomid:example.com`)

**Example Request:**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/rooms/!roomid:example.com" \
  -H "Authorization: Bearer <access_token>"
```

**Example Response:**
```json
{
  "room_id": "!roomid:example.com",
  "name": "General Chat",
  "canonical_alias": "#general:example.com",
  "joined_members": 150,
  "joined_local_members": 100,
  "version": "10",
  "creator": "@admin:example.com",
  "encryption": "m.megolm.v1.aes-sha2",
  "federatable": true,
  "public": true,
  "join_rules": "public",
  "guest_access": "can_join",
  "history_visibility": "shared",
  "state_events": 500,
  "topic": "Welcome to the general chat room!"
}
```

## Get Room Hierarchy

Get the room hierarchy (for spaces).

**Endpoint:** `GET /_synapse/admin/v1/rooms/{room_id}/hierarchy`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `from` | string | Pagination token |
| `limit` | integer | Max results |
| `max_depth` | integer | Maximum depth to traverse |
| `suggested_only` | boolean | Only return suggested rooms |

## Get Room Members

List all members in a room.

**Endpoint:** `GET /_synapse/admin/v1/rooms/{room_id}/members`

**Example Response:**
```json
{
  "members": [
    "@alice:example.com",
    "@bob:example.com",
    "@charlie:other-server.org"
  ],
  "total": 3
}
```

## Get Room State

Get all state events in a room.

**Endpoint:** `GET /_synapse/admin/v1/rooms/{room_id}/state`

**Example Response:**
```json
{
  "state": [
    {
      "type": "m.room.name",
      "state_key": "",
      "content": {
        "name": "General Chat"
      },
      "sender": "@admin:example.com",
      "origin_server_ts": 1609459200000
    },
    {
      "type": "m.room.topic",
      "state_key": "",
      "content": {
        "topic": "Welcome!"
      },
      "sender": "@admin:example.com",
      "origin_server_ts": 1609459300000
    }
  ]
}
```

## Get Room Messages

Get messages from a room with pagination.

**Endpoint:** `GET /_synapse/admin/v1/rooms/{room_id}/messages`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `from` | string | Pagination token |
| `limit` | integer | Max results (default: 10, max: 1000) |
| `dir` | string | Direction: `f` (forward) or `b` (backward, default) |

**Example Response:**
```json
{
  "chunk": [
    {
      "type": "m.room.message",
      "content": {
        "msgtype": "m.text",
        "body": "Hello everyone!"
      },
      "sender": "@alice:example.com",
      "origin_server_ts": 1609459200000,
      "event_id": "$eventid1:example.com"
    }
  ],
  "start": "t1-2-3",
  "end": "t4-5-6"
}
```

## Block Room

Get or set the block status of a room. Blocking a room prevents local users from joining.

### Get Block Status

**Endpoint:** `GET /_synapse/admin/v1/rooms/{room_id}/block`

**Example Response:**
```json
{
  "block": false,
  "user_id": null
}
```

### Set Block Status

**Endpoint:** `PUT /_synapse/admin/v1/rooms/{room_id}/block`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `block` | boolean | Yes | Whether to block the room |

**Example Request:**
```bash
curl -X PUT "https://your-server/_synapse/admin/v1/rooms/!roomid:example.com/block" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"block": true}'
```

**Example Response:**
```json
{
  "block": true,
  "user_id": "@admin:example.com"
}
```

## Get Forward Extremities

Get the forward extremities of a room (useful for diagnosing federation issues).

**Endpoint:** `GET /_synapse/admin/v1/rooms/{room_id}/forward_extremities`

**Example Response:**
```json
{
  "count": 2,
  "results": [
    {
      "event_id": "$event1:example.com",
      "state_group": 12345,
      "depth": 100,
      "received_ts": 1609459200000
    }
  ]
}
```

## Delete Room

Delete a room, removing all local users.

**Endpoint:** `DELETE /_synapse/admin/v2/rooms/{room_id}`

**Request Body:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `block` | boolean | false | Block the room to prevent rejoining |
| `purge` | boolean | true | Purge room data from database |

**Example Request:**
```bash
curl -X DELETE "https://your-server/_synapse/admin/v2/rooms/!roomid:example.com" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"block": true, "purge": true}'
```

**Example Response:**
```json
{
  "kicked_users": [
    "@alice:example.com",
    "@bob:example.com"
  ],
  "failed_to_kick_users": [],
  "local_aliases": [
    "#general:example.com"
  ],
  "new_room_id": null
}
```

## Room Fields Reference

| Field | Type | Description |
|-------|------|-------------|
| `room_id` | string | Unique room identifier |
| `name` | string | Room name |
| `canonical_alias` | string | Primary room alias |
| `joined_members` | integer | Total members in the room |
| `joined_local_members` | integer | Local server members |
| `version` | string | Room version |
| `creator` | string | User who created the room |
| `encryption` | string | Encryption algorithm (null if unencrypted) |
| `federatable` | boolean | Whether room federates with other servers |
| `public` | boolean | Whether room is publicly visible |
| `join_rules` | string | Join rules: `public`, `invite`, `knock`, `restricted` |
| `guest_access` | string | Guest access: `can_join`, `forbidden` |
| `history_visibility` | string | History visibility: `invited`, `joined`, `shared`, `world_readable` |
| `state_events` | integer | Number of state events |
