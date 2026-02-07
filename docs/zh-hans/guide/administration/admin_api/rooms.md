# 房间管理 API

管理 Palpo 服务器上的房间。

## 列出房间

列出服务器知道的所有房间，支持分页和过滤。

**端点：** `GET /_synapse/admin/v1/rooms`

**查询参数：**

| 参数 | 类型 | 描述 |
|-----|------|-----|
| `from` | 整数 | 分页偏移量（默认：0） |
| `limit` | 整数 | 最大返回数量（默认：100，最大：1000） |
| `order_by` | 字符串 | 排序字段：`name`、`joined_members`、`canonical_alias`、`joined_local_members`、`version`、`creator`、`encryption`、`federatable`、`public`、`join_rules`、`guest_access`、`history_visibility`、`state_events` |
| `dir` | 字符串 | 排序方向：`f`（正向）或 `b`（反向） |
| `search_term` | 字符串 | 按名称或别名过滤房间 |

**示例请求：**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/rooms?limit=10&order_by=joined_members&dir=b" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
```json
{
  "rooms": [
    {
      "room_id": "!roomid:example.com",
      "name": "综合聊天",
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

## 获取房间详情

获取特定房间的详细信息。

**端点：** `GET /_synapse/admin/v1/rooms/{room_id}`

**路径参数：**
- `room_id` - 房间 ID（例如 `!roomid:example.com`）

**示例请求：**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/rooms/!roomid:example.com" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
```json
{
  "room_id": "!roomid:example.com",
  "name": "综合聊天",
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
  "topic": "欢迎来到综合聊天室！"
}
```

## 获取房间层级

获取房间层级（用于空间）。

**端点：** `GET /_synapse/admin/v1/rooms/{room_id}/hierarchy`

**查询参数：**

| 参数 | 类型 | 描述 |
|-----|------|-----|
| `from` | 字符串 | 分页令牌 |
| `limit` | 整数 | 最大返回数量 |
| `max_depth` | 整数 | 最大遍历深度 |
| `suggested_only` | 布尔值 | 仅返回建议的房间 |

## 获取房间成员

列出房间中的所有成员。

**端点：** `GET /_synapse/admin/v1/rooms/{room_id}/members`

**示例响应：**
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

## 获取房间状态

获取房间中的所有状态事件。

**端点：** `GET /_synapse/admin/v1/rooms/{room_id}/state`

**示例响应：**
```json
{
  "state": [
    {
      "type": "m.room.name",
      "state_key": "",
      "content": {
        "name": "综合聊天"
      },
      "sender": "@admin:example.com",
      "origin_server_ts": 1609459200000
    },
    {
      "type": "m.room.topic",
      "state_key": "",
      "content": {
        "topic": "欢迎！"
      },
      "sender": "@admin:example.com",
      "origin_server_ts": 1609459300000
    }
  ]
}
```

## 获取房间消息

获取房间中的消息，支持分页。

**端点：** `GET /_synapse/admin/v1/rooms/{room_id}/messages`

**查询参数：**

| 参数 | 类型 | 描述 |
|-----|------|-----|
| `from` | 字符串 | 分页令牌 |
| `limit` | 整数 | 最大返回数量（默认：10，最大：1000） |
| `dir` | 字符串 | 方向：`f`（正向）或 `b`（反向，默认） |

**示例响应：**
```json
{
  "chunk": [
    {
      "type": "m.room.message",
      "content": {
        "msgtype": "m.text",
        "body": "大家好！"
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

## 封禁房间

获取或设置房间的封禁状态。封禁房间会阻止本地用户加入。

### 获取封禁状态

**端点：** `GET /_synapse/admin/v1/rooms/{room_id}/block`

**示例响应：**
```json
{
  "block": false,
  "user_id": null
}
```

### 设置封禁状态

**端点：** `PUT /_synapse/admin/v1/rooms/{room_id}/block`

**请求体：**

| 字段 | 类型 | 必需 | 描述 |
|-----|------|-----|-----|
| `block` | 布尔值 | 是 | 是否封禁房间 |

**示例请求：**
```bash
curl -X PUT "https://your-server/_synapse/admin/v1/rooms/!roomid:example.com/block" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"block": true}'
```

**示例响应：**
```json
{
  "block": true,
  "user_id": "@admin:example.com"
}
```

## 获取前向极值

获取房间的前向极值（用于诊断联邦问题）。

**端点：** `GET /_synapse/admin/v1/rooms/{room_id}/forward_extremities`

**示例响应：**
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

## 删除房间

删除房间，移除所有本地用户。

**端点：** `DELETE /_synapse/admin/v2/rooms/{room_id}`

**请求体：**

| 字段 | 类型 | 默认值 | 描述 |
|-----|------|-------|-----|
| `block` | 布尔值 | false | 封禁房间以防止重新加入 |
| `purge` | 布尔值 | true | 从数据库中清除房间数据 |

**示例请求：**
```bash
curl -X DELETE "https://your-server/_synapse/admin/v2/rooms/!roomid:example.com" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"block": true, "purge": true}'
```

**示例响应：**
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

## 房间字段参考

| 字段 | 类型 | 描述 |
|-----|------|-----|
| `room_id` | 字符串 | 房间唯一标识符 |
| `name` | 字符串 | 房间名称 |
| `canonical_alias` | 字符串 | 房间主别名 |
| `joined_members` | 整数 | 房间中的成员总数 |
| `joined_local_members` | 整数 | 本服务器成员数 |
| `version` | 字符串 | 房间版本 |
| `creator` | 字符串 | 创建房间的用户 |
| `encryption` | 字符串 | 加密算法（未加密则为 null） |
| `federatable` | 布尔值 | 是否与其他服务器联邦 |
| `public` | 布尔值 | 是否公开可见 |
| `join_rules` | 字符串 | 加入规则：`public`、`invite`、`knock`、`restricted` |
| `guest_access` | 字符串 | 访客权限：`can_join`、`forbidden` |
| `history_visibility` | 字符串 | 历史可见性：`invited`、`joined`、`shared`、`world_readable` |
| `state_events` | 整数 | 状态事件数量 |
