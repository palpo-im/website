# 事件报告 API

管理用户提交的违规内容举报。

## 列出事件报告

列出所有事件报告，支持分页和过滤。

**端点：** `GET /_synapse/admin/v1/event_reports`

**查询参数：**

| 参数 | 类型 | 描述 |
|-----|------|-----|
| `from` | 整数 | 分页偏移量（默认：0） |
| `limit` | 整数 | 最大返回数量（默认：100，最大：1000） |
| `dir` | 字符串 | 排序方向：`f`（正向）或 `b`（反向，默认） |
| `user_id` | 字符串 | 按举报用户过滤 |
| `room_id` | 字符串 | 按房间过滤 |

**示例请求：**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/event_reports?limit=20&dir=b" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
```json
{
  "event_reports": [
    {
      "id": 12,
      "received_ts": 1609459200000,
      "room_id": "!roomid:example.com",
      "event_id": "$eventid:example.com",
      "user_id": "@reporter:example.com",
      "reason": "垃圾内容",
      "score": -100,
      "sender": "@spammer:example.com",
      "canonical_alias": "#general:example.com",
      "name": "综合聊天"
    }
  ],
  "total": 1,
  "next_token": null
}
```

## 获取事件报告详情

获取特定事件报告的详细信息，包括被举报事件的内容。

**端点：** `GET /_synapse/admin/v1/event_reports/{report_id}`

**路径参数：**
- `report_id` - 报告的数字标识符

**示例请求：**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/event_reports/12" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
```json
{
  "id": 12,
  "received_ts": 1609459200000,
  "room_id": "!roomid:example.com",
  "event_id": "$eventid:example.com",
  "user_id": "@reporter:example.com",
  "reason": "垃圾内容",
  "score": -100,
  "event_json": {
    "type": "m.room.message",
    "content": {
      "msgtype": "m.text",
      "body": "在 spam-site.example 购买便宜商品！"
    },
    "sender": "@spammer:example.com",
    "origin_server_ts": 1609458000000,
    "event_id": "$eventid:example.com"
  }
}
```

## 删除事件报告

处理完成后删除事件报告。

**端点：** `DELETE /_synapse/admin/v1/event_reports/{report_id}`

**示例请求：**
```bash
curl -X DELETE "https://your-server/_synapse/admin/v1/event_reports/12" \
  -H "Authorization: Bearer <access_token>"
```

**响应：** 成功时返回 `200 OK` 和空响应体。

## 事件报告字段参考

| 字段 | 类型 | 描述 |
|-----|------|-----|
| `id` | 整数 | 报告唯一标识符 |
| `received_ts` | 整数 | 收到报告的时间（毫秒） |
| `room_id` | 字符串 | 事件所在的房间 |
| `event_id` | 字符串 | 被举报事件的 ID |
| `user_id` | 字符串 | 提交举报的用户 |
| `reason` | 字符串 | 举报者提供的原因（可能为 null） |
| `score` | 整数 | 严重程度分数（-100 到 0，-100 最严重） |
| `sender` | 字符串 | 发送被举报事件的用户 |
| `canonical_alias` | 字符串 | 房间别名（如有） |
| `name` | 字符串 | 房间名称（如有） |
| `event_json` | 对象 | 被举报事件的完整内容 |

## 报告处理流程

1. **审查新报告** - 使用 `dir=b` 列出报告以先查看最新的。

2. **调查** - 获取报告详情以查看完整的事件内容。

3. **采取行动** - 根据严重程度，您可以：
   - 警告发送者
   - 删除事件
   - 影子封禁用户
   - 停用用户账户
   - 封禁房间

4. **清理** - 处理完成后删除报告。

## 示例：审核被举报内容

```bash
# 1. 列出最近的报告
curl -X GET "https://your-server/_synapse/admin/v1/event_reports?limit=10" \
  -H "Authorization: Bearer <access_token>"

# 2. 获取报告 #12 的详情
curl -X GET "https://your-server/_synapse/admin/v1/event_reports/12" \
  -H "Authorization: Bearer <access_token>"

# 3. 如果是垃圾信息，影子封禁发送者
curl -X POST "https://your-server/_synapse/admin/v1/users/@spammer:example.com/shadow_ban" \
  -H "Authorization: Bearer <access_token>"

# 4. 删除已处理的报告
curl -X DELETE "https://your-server/_synapse/admin/v1/event_reports/12" \
  -H "Authorization: Bearer <access_token>"
```
