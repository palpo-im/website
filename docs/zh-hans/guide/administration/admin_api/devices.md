# 用户设备 API

管理与用户账户关联的设备。

## 列出用户设备

列出用户的所有设备。

**端点：** `GET /_synapse/admin/v2/users/{user_id}/devices`

**路径参数：**
- `user_id` - 完整的 Matrix 用户 ID（例如 `@alice:example.com`）

**示例请求：**
```bash
curl -X GET "https://your-server/_synapse/admin/v2/users/@alice:example.com/devices" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
```json
{
  "devices": [
    {
      "device_id": "ABCDEFGHIJ",
      "display_name": "Alice 的手机",
      "last_seen_ip": "192.168.1.100",
      "last_seen_ts": 1609459200000,
      "last_seen_user_agent": "Element Android/1.0.0",
      "user_id": "@alice:example.com",
      "dehydrated": false
    },
    {
      "device_id": "KLMNOPQRST",
      "display_name": "Alice 的笔记本",
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

## 获取设备详情

获取特定设备的详细信息。

**端点：** `GET /_synapse/admin/v2/users/{user_id}/devices/{device_id}`

**路径参数：**
- `user_id` - 完整的 Matrix 用户 ID
- `device_id` - 设备 ID

**示例请求：**
```bash
curl -X GET "https://your-server/_synapse/admin/v2/users/@alice:example.com/devices/ABCDEFGHIJ" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
```json
{
  "device_id": "ABCDEFGHIJ",
  "display_name": "Alice 的手机",
  "last_seen_ip": "192.168.1.100",
  "last_seen_ts": 1609459200000,
  "last_seen_user_agent": "Element Android/1.0.0",
  "user_id": "@alice:example.com",
  "dehydrated": false
}
```

## 创建设备

为用户创建新设备。

**端点：** `POST /_synapse/admin/v2/users/{user_id}/devices`

**请求体：**

| 字段 | 类型 | 必需 | 描述 |
|-----|------|-----|-----|
| `device_id` | 字符串 | 是 | 唯一的设备标识符 |
| `display_name` | 字符串 | 否 | 人类可读的设备名称 |

**示例请求：**
```bash
curl -X POST "https://your-server/_synapse/admin/v2/users/@alice:example.com/devices" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "NEWDEVICE01",
    "display_name": "管理员创建的设备"
  }'
```

## 更新设备

更新设备信息（显示名称）。

**端点：** `PUT /_synapse/admin/v2/users/{user_id}/devices/{device_id}`

**请求体：**

| 字段 | 类型 | 描述 |
|-----|------|-----|
| `display_name` | 字符串 | 设备的新显示名称 |

**示例请求：**
```bash
curl -X PUT "https://your-server/_synapse/admin/v2/users/@alice:example.com/devices/ABCDEFGHIJ" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"display_name": "Alice 的工作手机"}'
```

## 删除设备

删除特定设备，登出该会话。

**端点：** `DELETE /_synapse/admin/v2/users/{user_id}/devices/{device_id}`

**示例请求：**
```bash
curl -X DELETE "https://your-server/_synapse/admin/v2/users/@alice:example.com/devices/ABCDEFGHIJ" \
  -H "Authorization: Bearer <access_token>"
```

**响应：** 成功时返回 `200 OK` 和空响应体。

## 删除多个设备

一次删除多个设备。

**端点：** `POST /_synapse/admin/v2/users/{user_id}/delete_devices`

**请求体：**

| 字段 | 类型 | 必需 | 描述 |
|-----|------|-----|-----|
| `devices` | 数组 | 是 | 要删除的设备 ID 列表 |

**示例请求：**
```bash
curl -X POST "https://your-server/_synapse/admin/v2/users/@alice:example.com/delete_devices" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "devices": ["DEVICE001", "DEVICE002", "DEVICE003"]
  }'
```

**响应：** 成功时返回 `200 OK` 和空响应体。

## 设备字段参考

| 字段 | 类型 | 描述 |
|-----|------|-----|
| `device_id` | 字符串 | 设备的唯一标识符 |
| `display_name` | 字符串 | 用户友好的设备名称 |
| `last_seen_ip` | 字符串 | 最后活动的 IP 地址 |
| `last_seen_ts` | 整数 | 最后活动时间戳（毫秒） |
| `last_seen_user_agent` | 字符串 | 客户端的用户代理字符串 |
| `user_id` | 字符串 | 设备所属的用户 |
| `dehydrated` | 布尔值 | 是否为脱水设备（用于加密备份） |
