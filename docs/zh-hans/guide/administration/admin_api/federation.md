# 联邦管理 API

管理与其他 Matrix 服务器的联邦连接。

## 列出联邦目标

列出您的服务器已通信的所有服务器。

**端点：** `GET /_synapse/admin/v1/federation/destinations`

**查询参数：**

| 参数 | 类型 | 描述 |
|-----|------|-----|
| `from` | 整数 | 分页偏移量（默认：0） |
| `limit` | 整数 | 最大返回数量（默认：100） |
| `destination` | 字符串 | 按目标服务器名称过滤 |
| `order_by` | 字符串 | 排序字段 |
| `dir` | 字符串 | 排序方向：`f`（正向）或 `b`（反向） |

**示例请求：**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/federation/destinations?limit=20" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
```json
{
  "destinations": [
    {
      "destination": "matrix.org",
      "retry_last_ts": 1609459200000,
      "retry_interval": 0,
      "failure_ts": null,
      "last_successful_stream_ordering": 12345
    },
    {
      "destination": "example.org",
      "retry_last_ts": 1609458000000,
      "retry_interval": 60000,
      "failure_ts": 1609457000000,
      "last_successful_stream_ordering": 11000
    }
  ],
  "total": 2,
  "next_token": null
}
```

## 获取目标详情

获取特定联邦目标的详细信息。

**端点：** `GET /_synapse/admin/v1/federation/destinations/{destination}`

**路径参数：**
- `destination` - 服务器名称（例如 `matrix.org`）

**示例请求：**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/federation/destinations/matrix.org" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
```json
{
  "destination": "matrix.org",
  "retry_last_ts": 1609459200000,
  "retry_interval": 0,
  "failure_ts": null,
  "last_successful_stream_ordering": 12345
}
```

## 获取目标房间

列出与特定服务器共享的房间。

**端点：** `GET /_synapse/admin/v1/federation/destinations/{destination}/rooms`

**查询参数：**

| 参数 | 类型 | 描述 |
|-----|------|-----|
| `from` | 整数 | 分页偏移量（默认：0） |
| `limit` | 整数 | 最大返回数量（默认：100） |

**示例请求：**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/federation/destinations/matrix.org/rooms" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
```json
{
  "rooms": [
    {
      "room_id": "!roomid1:example.com",
      "stream_ordering": 12345
    },
    {
      "room_id": "!roomid2:example.com",
      "stream_ordering": 12340
    }
  ],
  "total": 2,
  "next_token": null
}
```

## 重置目标连接

重置目标的重试计时，允许立即重新连接尝试。

**端点：** `POST /_synapse/admin/v1/federation/destinations/{destination}/reset_connection`

使用场景：
- 目标被错误标记为失败
- 网络问题已解决
- 您想强制进行重新连接尝试

**示例请求：**
```bash
curl -X POST "https://your-server/_synapse/admin/v1/federation/destinations/example.org/reset_connection" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
```json
{}
```

## 联邦字段参考

| 字段 | 类型 | 描述 |
|-----|------|-----|
| `destination` | 字符串 | 远程服务器名称 |
| `retry_last_ts` | 整数 | 上次重试尝试的时间戳（毫秒） |
| `retry_interval` | 整数 | 当前重试间隔（毫秒，0 = 未重试） |
| `failure_ts` | 整数 | 首次检测到失败的时间戳（如未失败则为 null） |
| `last_successful_stream_ordering` | 整数 | 上次成功传递的流位置 |

## 理解联邦状态

### 健康连接
```json
{
  "retry_interval": 0,
  "failure_ts": null
}
```
连接健康，没有活跃的重试尝试。

### 失败连接
```json
{
  "retry_interval": 300000,
  "failure_ts": 1609457000000
}
```
连接自 `failure_ts` 以来一直失败。服务器将每 `retry_interval` 毫秒重试一次（指数退避）。

### 连接恢复
成功重新连接后，`failure_ts` 变为 `null`，`retry_interval` 返回 `0`。

## 联邦问题排查

1. **检查目标状态** - 使用获取目标详情端点查看是否有活跃的故障。

2. **列出共享房间** - 识别哪些房间受联邦问题影响。

3. **重置连接** - 如果目标服务器已恢复在线，重置连接以强制立即重试。

4. **检查服务器日志** - 在服务器日志中查找联邦相关的错误以获取更多详情。

5. **验证 DNS 和证书** - 确保目标服务器正确配置了有效的 TLS 证书和 DNS 记录。
