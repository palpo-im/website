# 用户管理 API

管理 Palpo 服务器上的用户账户。

## 列出用户

列出所有本地用户账户，支持分页和过滤。

**端点：** `GET /_synapse/admin/v2/users`

**查询参数：**

| 参数 | 类型 | 描述 |
|-----|------|-----|
| `from` | 整数 | 分页偏移量（默认：0） |
| `limit` | 整数 | 最大返回数量（默认：100） |
| `user_id` | 字符串 | 按用户 ID 过滤（部分匹配） |
| `name` | 字符串 | 按显示名称过滤 |
| `guests` | 布尔值 | 按访客状态过滤 |
| `deactivated` | 布尔值 | 按停用状态过滤 |
| `admins` | 布尔值 | 按管理员状态过滤 |
| `order_by` | 字符串 | 排序字段：`name`、`displayname`、`creation_ts`、`admin`、`deactivated` |
| `dir` | 字符串 | 排序方向：`f`（正向）或 `b`（反向） |

**示例请求：**
```bash
curl -X GET "https://your-server/_synapse/admin/v2/users?limit=10&admins=true" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
```json
{
  "users": [
    {
      "name": "@admin:example.com",
      "displayname": "管理员",
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

## 获取用户详情

获取特定用户的详细信息。

**端点：** `GET /_synapse/admin/v2/users/{user_id}`

**路径参数：**
- `user_id` - 完整的 Matrix 用户 ID（例如 `@alice:example.com`）

**示例请求：**
```bash
curl -X GET "https://your-server/_synapse/admin/v2/users/@alice:example.com" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
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

## 创建或修改用户

创建新用户或修改现有用户。

**端点：** `PUT /_synapse/admin/v2/users/{user_id}`

**路径参数：**
- `user_id` - 完整的 Matrix 用户 ID

**请求体：**

| 字段 | 类型 | 描述 |
|-----|------|-----|
| `password` | 字符串 | 用户密码 |
| `logout_devices` | 布尔值 | 修改密码后登出所有设备 |
| `displayname` | 字符串 | 显示名称 |
| `avatar_url` | 字符串 | 头像 MXC URL |
| `threepids` | 数组 | 3PID 列表（邮箱、电话） |
| `external_ids` | 数组 | 外部认证提供商 ID |
| `admin` | 布尔值 | 管理员状态 |
| `deactivated` | 布尔值 | 账户已停用 |
| `locked` | 布尔值 | 账户已锁定 |
| `user_type` | 字符串 | 用户类型 |

**示例请求：**
```bash
curl -X PUT "https://your-server/_synapse/admin/v2/users/@newuser:example.com" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "securepassword123",
    "displayname": "新用户",
    "admin": false,
    "threepids": [
      {"medium": "email", "address": "newuser@example.com"}
    ]
  }'
```

## 停用用户

停用用户账户，阻止登录。

**端点：** `POST /_synapse/admin/v1/deactivate/{user_id}`

**路径参数：**
- `user_id` - 完整的 Matrix 用户 ID

**请求体：**

| 字段 | 类型 | 描述 |
|-----|------|-----|
| `erase` | 布尔值 | 删除用户的消息和数据 |

**示例请求：**
```bash
curl -X POST "https://your-server/_synapse/admin/v1/deactivate/@alice:example.com" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"erase": false}'
```

## 重置密码

重置用户的密码。

**端点：** `POST /_synapse/admin/v1/reset_password/{user_id}`

**请求体：**

| 字段 | 类型 | 必需 | 描述 |
|-----|------|-----|-----|
| `new_password` | 字符串 | 是 | 新密码 |
| `logout_devices` | 布尔值 | 否 | 登出所有设备（默认：true） |

**示例请求：**
```bash
curl -X POST "https://your-server/_synapse/admin/v1/reset_password/@alice:example.com" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"new_password": "newSecurePassword123", "logout_devices": true}'
```

## 获取管理员状态

检查用户是否具有管理员权限。

**端点：** `GET /_synapse/admin/v1/users/{user_id}/admin`

**示例响应：**
```json
{
  "admin": true
}
```

## 设置管理员状态

授予或撤销管理员权限。

**端点：** `PUT /_synapse/admin/v1/users/{user_id}/admin`

**请求体：**
```json
{
  "admin": true
}
```

## 获取用户会话（Whois）

获取用户活跃会话的信息。

**端点：** `GET /_synapse/admin/v1/whois/{user_id}`

**示例响应：**
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

## 获取用户已加入的房间

列出用户已加入的所有房间。

**端点：** `GET /_synapse/admin/v1/users/{user_id}/joined_rooms`

**示例响应：**
```json
{
  "joined_rooms": [
    "!roomid1:example.com",
    "!roomid2:example.com"
  ],
  "total": 2
}
```

## 获取用户推送器

列出用户的所有推送通知配置。

**端点：** `GET /_synapse/admin/v1/users/{user_id}/pushers`

**示例响应：**
```json
{
  "pushers": [
    {
      "app_id": "com.example.app",
      "app_display_name": "示例应用",
      "device_display_name": "手机",
      "pushkey": "abc123",
      "kind": "http",
      "lang": "zh"
    }
  ],
  "total": 1
}
```

## 获取用户账户数据

获取用户的所有账户数据。

**端点：** `GET /_synapse/admin/v1/users/{user_id}/accountdata`

**示例响应：**
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

## 影子封禁用户

影子封禁用户。用户的消息会被接受但不会传递给其他用户。

**端点：** `POST /_synapse/admin/v1/users/{user_id}/shadow_ban`

**示例请求：**
```bash
curl -X POST "https://your-server/_synapse/admin/v1/users/@spammer:example.com/shadow_ban" \
  -H "Authorization: Bearer <access_token>"
```

## 解除影子封禁

解除用户的影子封禁。

**端点：** `DELETE /_synapse/admin/v1/users/{user_id}/shadow_ban`

## 暂停用户

暂停或恢复用户账户。

**端点：** `PUT /_synapse/admin/v1/suspend/{user_id}`

**请求体：**
```json
{
  "suspend": true
}
```

**示例响应：**
```json
{
  "user_id": "@alice:example.com",
  "suspended": true
}
```

## 速率限制覆盖

### 获取速率限制覆盖

**端点：** `GET /_synapse/admin/v1/users/{user_id}/override_ratelimit`

**示例响应：**
```json
{
  "messages_per_second": 10,
  "burst_count": 100
}
```

### 设置速率限制覆盖

**端点：** `POST /_synapse/admin/v1/users/{user_id}/override_ratelimit`

**请求体：**
```json
{
  "messages_per_second": 20,
  "burst_count": 200
}
```

### 删除速率限制覆盖

**端点：** `DELETE /_synapse/admin/v1/users/{user_id}/override_ratelimit`

## 允许交叉签名替换

允许用户在 10 分钟内无需用户交互认证（UIA）即可替换交叉签名密钥。

**端点：** `POST /_synapse/admin/v1/users/{user_id}/_allow_cross_signing_replacement_without_uia`

**示例响应：**
```json
{
  "updatable_without_uia_before_ms": 1609460400000
}
```
