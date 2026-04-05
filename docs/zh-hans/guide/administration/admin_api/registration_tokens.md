# 注册令牌 API

管理用于控制用户注册的注册令牌。

注册令牌允许您控制谁可以在您的服务器上创建账户。用户在注册过程中必须提供有效的令牌。

## 列出注册令牌

列出所有注册令牌。

**端点：** `GET /_synapse/admin/v1/registration_tokens`

**查询参数：**

| 参数 | 类型 | 描述 |
|-----|------|-----|
| `valid` | 布尔值 | 按有效性过滤（true = 仅有效令牌，false = 仅过期/用尽的令牌） |

**示例请求：**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/registration_tokens?valid=true" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
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

## 创建注册令牌

创建新的注册令牌。

**端点：** `POST /_synapse/admin/v1/registration_tokens/new`

**请求体：**

| 字段 | 类型 | 必需 | 描述 |
|-----|------|-----|-----|
| `token` | 字符串 | 否 | 自定义令牌字符串（如未提供则自动生成） |
| `length` | 整数 | 否 | 自动生成令牌的长度（默认：16，最大：64） |
| `uses_allowed` | 整数 | 否 | 最大使用次数（null = 无限制） |
| `expiry_time` | 整数 | 否 | 过期时间戳（毫秒，null = 不过期） |

**示例请求 - 创建自定义令牌：**
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

**示例请求 - 自动生成令牌：**
```bash
curl -X POST "https://your-server/_synapse/admin/v1/registration_tokens/new" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "length": 24,
    "uses_allowed": 10
  }'
```

**示例响应：**
```json
{
  "token": "invite-jan-2024",
  "uses_allowed": 50,
  "pending": 0,
  "completed": 0,
  "expiry_time": 1706745600000
}
```

## 获取注册令牌

获取特定注册令牌的详情。

**端点：** `GET /_synapse/admin/v1/registration_tokens/{token}`

**路径参数：**
- `token` - 注册令牌字符串

**示例请求：**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/registration_tokens/invite-jan-2024" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
```json
{
  "token": "invite-jan-2024",
  "uses_allowed": 50,
  "pending": 5,
  "completed": 20,
  "expiry_time": 1706745600000
}
```

## 更新注册令牌

更新现有令牌的限制或过期时间。

**端点：** `PUT /_synapse/admin/v1/registration_tokens/{token}`

**请求体：**

| 字段 | 类型 | 描述 |
|-----|------|-----|
| `uses_allowed` | 整数/null | 新的最大使用次数（null = 无限制） |
| `expiry_time` | 整数/null | 新的过期时间戳（null = 不过期） |

**示例请求：**
```bash
curl -X PUT "https://your-server/_synapse/admin/v1/registration_tokens/invite-jan-2024" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "uses_allowed": 100,
    "expiry_time": null
  }'
```

**示例响应：**
```json
{
  "token": "invite-jan-2024",
  "uses_allowed": 100,
  "pending": 5,
  "completed": 20,
  "expiry_time": null
}
```

## 删除注册令牌

删除注册令牌，阻止进一步使用。

**端点：** `DELETE /_synapse/admin/v1/registration_tokens/{token}`

**示例请求：**
```bash
curl -X DELETE "https://your-server/_synapse/admin/v1/registration_tokens/invite-jan-2024" \
  -H "Authorization: Bearer <access_token>"
```

**响应：** 成功时返回 `200 OK` 和空响应体。

## 令牌字段参考

| 字段 | 类型 | 描述 |
|-----|------|-----|
| `token` | 字符串 | 注册令牌字符串 |
| `uses_allowed` | 整数/null | 允许的最大注册数（null = 无限制） |
| `pending` | 整数 | 当前正在进行的注册数 |
| `completed` | 整数 | 使用此令牌成功注册的数量 |
| `expiry_time` | 整数/null | 过期时间戳（毫秒，null = 不过期） |

## 令牌有效性

令牌在以下情况下被视为有效：
1. 未过期（`expiry_time` 为 null 或在未来）
2. 还有剩余使用次数（`uses_allowed` 为 null 或 `completed + pending < uses_allowed`）

## 使用场景

### 活动注册
为会议参与者创建限时令牌：
```json
{
  "token": "conference-2024",
  "uses_allowed": 200,
  "expiry_time": 1704067200000
}
```

### 组织邀请
为您的组织创建无限制令牌：
```json
{
  "token": "acme-corp-invite",
  "uses_allowed": null,
  "expiry_time": null
}
```

### 一次性邀请
创建单次使用的邀请链接：
```json
{
  "length": 32,
  "uses_allowed": 1
}
```

## 启用基于令牌的注册

要要求注册令牌，在 Palpo 配置中添加：

```toml
[registration]
enable = true
token_required = true
```

然后用户在注册过程中需要提供有效的令牌。
