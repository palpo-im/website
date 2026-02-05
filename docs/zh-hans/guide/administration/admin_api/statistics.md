# 统计信息 API

获取服务器统计和版本信息。

## 获取服务器版本

获取 Palpo 服务器版本。

**端点：** `GET /_synapse/admin/v1/server_version`

**示例请求：**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/server_version" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
```json
{
  "server_version": "0.1.0"
}
```

## 获取用户媒体统计

获取用户上传媒体的统计信息。

**端点：** `GET /_synapse/admin/v1/statistics/users/media`

**查询参数：**

| 参数 | 类型 | 描述 |
|-----|------|-----|
| `from` | 整数 | 分页偏移量（默认：0） |
| `limit` | 整数 | 最大返回数量（默认：100） |
| `order_by` | 字符串 | 排序字段 |
| `dir` | 字符串 | 排序方向：`f`（正向）或 `b`（反向） |
| `search_term` | 字符串 | 按用户 ID 过滤 |

**注意：** 此端点计划中但尚未实现，将返回 `501 Not Implemented`。

## 其他服务器端点

### 获取事件

通过 ID 获取单个事件。

**端点：** `GET /_synapse/admin/v1/fetch_event/{event_id}`

**路径参数：**
- `event_id` - 完整的事件 ID（例如 `$eventid:example.com`）

**示例请求：**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/fetch_event/\$abc123:example.com" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
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

### 检查用户名可用性

检查用户名是否可用于注册。

**端点：** `GET /_synapse/admin/username_available`

**查询参数：**

| 参数 | 类型 | 必需 | 描述 |
|-----|------|-----|-----|
| `username` | 字符串 | 是 | 要检查的用户名（不含 `@` 前缀或服务器名称） |

**示例请求：**
```bash
curl -X GET "https://your-server/_synapse/admin/username_available?username=newuser" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
```json
{
  "available": true
}
```

### 通过外部 ID 查找用户

通过外部认证提供商 ID 查找用户。

**端点：** `GET /_synapse/admin/v1/auth_providers/{provider}/users/{external_id}`

**路径参数：**
- `provider` - 认证提供商 ID（例如 `oidc-google`）
- `external_id` - 提供商的外部用户 ID

**示例请求：**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/auth_providers/oidc-google/users/12345" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
```json
{
  "user_id": "@alice:example.com"
}
```

### 通过 3PID 查找用户

通过第三方标识符（邮箱、电话）查找用户。

**端点：** `GET /_synapse/admin/v1/threepid/{medium}/users/{address}`

**路径参数：**
- `medium` - 3PID 类型：`email` 或 `msisdn`（电话）
- `address` - 3PID 值

**示例请求：**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/threepid/email/users/alice@example.com" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
```json
{
  "user_id": "@alice:example.com"
}
```

## 计划中的端点

以下端点计划在未来实现：

### 服务器统计
- 数据库大小
- 活跃用户（每日、每周、每月）
- 消息数量
- 联邦统计

### 房间统计
- 每个房间的消息数
- 每个房间的活跃用户
- 每个房间的媒体使用量

### 联邦统计
- 活跃目标
- 失败目标
- 联邦队列深度
