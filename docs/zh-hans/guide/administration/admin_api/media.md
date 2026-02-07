# 媒体管理 API

管理上传到 Palpo 服务器的媒体文件。

## 获取媒体信息

获取特定媒体文件的信息。

**端点：** `GET /_synapse/admin/v1/media/{server_name}/{media_id}`

**路径参数：**
- `server_name` - 托管媒体的服务器（例如 `example.com`）
- `media_id` - 媒体标识符

**示例请求：**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/media/example.com/abc123def456" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
```json
{
  "media_info": {
    "media_origin": "example.com",
    "media_id": "abc123def456",
    "user_id": "@alice:example.com",
    "media_type": "image/png",
    "media_length": 1048576,
    "upload_name": "profile.png",
    "created_ts": 1609459200000
  }
}
```

## 删除媒体

从服务器删除特定媒体文件。

**端点：** `DELETE /_synapse/admin/v1/media/{server_name}/{media_id}`

**注意：** 只能删除本地媒体。远程媒体是缓存的，无法通过此端点删除。

**示例请求：**
```bash
curl -X DELETE "https://your-server/_synapse/admin/v1/media/example.com/abc123def456" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
```json
{
  "deleted_media": ["abc123def456"],
  "total": 1
}
```

## 按日期和大小删除媒体

根据时间戳和大小条件删除多个媒体文件。

**端点：** `POST /_synapse/admin/v1/media/delete`

**查询参数：**

| 参数 | 类型 | 必需 | 描述 |
|-----|------|-----|-----|
| `before_ts` | 整数 | 是 | 删除此时间戳之前上传的媒体（毫秒） |
| `size_gt` | 整数 | 否 | 仅删除大于此大小的媒体（字节） |

**示例请求：**
```bash
# 删除 90 天前且大于 10MB 的所有媒体
curl -X POST "https://your-server/_synapse/admin/v1/media/delete?before_ts=1609459200000&size_gt=10485760" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
```json
{
  "deleted_media": [
    "media_id_1",
    "media_id_2",
    "media_id_3"
  ],
  "total": 3
}
```

## 列出房间中的媒体

列出特定房间中共享的所有媒体文件。

**端点：** `GET /_synapse/admin/v1/room/{room_id}/media`

**示例响应：**
```json
{
  "local": [
    "mxc://example.com/local123"
  ],
  "remote": [
    "mxc://other-server.org/remote456"
  ]
}
```

## 列出用户的媒体

列出特定用户上传的所有媒体文件。

**端点：** `GET /_synapse/admin/v1/users/{user_id}/media`

**查询参数：**

| 参数 | 类型 | 描述 |
|-----|------|-----|
| `from` | 整数 | 分页偏移量（默认：0） |
| `limit` | 整数 | 最大返回数量（默认：100，最大：1000） |
| `order_by` | 字符串 | 排序字段：`media_id`、`upload_name`、`created_ts`、`media_length`、`media_type` |
| `dir` | 字符串 | 排序方向：`f`（正向）或 `b`（反向） |

**示例请求：**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/users/@alice:example.com/media?limit=20&order_by=created_ts&dir=b" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
```json
{
  "media": [
    {
      "media_id": "abc123",
      "media_type": "image/jpeg",
      "media_length": 524288,
      "upload_name": "photo.jpg",
      "created_ts": 1609459200000,
      "last_access_ts": 1609545600000,
      "quarantined_by": null,
      "safe_from_quarantine": false
    }
  ],
  "total": 1,
  "next_token": null
}
```

## 删除用户的媒体

删除特定用户上传的所有媒体。

**端点：** `DELETE /_synapse/admin/v1/users/{user_id}/media`

**查询参数：**

与"列出用户的媒体"相同 - 使用分页参数进行批量删除。

**示例请求：**
```bash
curl -X DELETE "https://your-server/_synapse/admin/v1/users/@alice:example.com/media?limit=100" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
```json
{
  "deleted_media": [
    "media_id_1",
    "media_id_2"
  ],
  "total": 2
}
```

## 清除媒体缓存

删除最近未访问的缓存远程媒体。

**端点：** `POST /_synapse/admin/v1/purge_media_cache`

**查询参数：**

| 参数 | 类型 | 必需 | 描述 |
|-----|------|-----|-----|
| `before_ts` | 整数 | 是 | 删除自此时间戳以来未访问的缓存媒体（毫秒） |

**示例请求：**
```bash
# 清除 30 天未访问的远程媒体缓存
# 计算时间戳：当前时间减去 30 天（毫秒）
curl -X POST "https://your-server/_synapse/admin/v1/purge_media_cache?before_ts=1606867200000" \
  -H "Authorization: Bearer <access_token>"
```

**示例响应：**
```json
{
  "deleted": 150
}
```

## 媒体字段参考

| 字段 | 类型 | 描述 |
|-----|------|-----|
| `media_id` | 字符串 | 媒体的唯一标识符 |
| `media_origin` | 字符串 | 最初上传媒体的服务器 |
| `user_id` | 字符串 | 上传媒体的用户 |
| `media_type` | 字符串 | MIME 类型（例如 `image/png`、`video/mp4`） |
| `media_length` | 整数 | 文件大小（字节） |
| `upload_name` | 字符串 | 上传时的原始文件名 |
| `created_ts` | 整数 | 上传时间戳（毫秒） |
| `last_access_ts` | 整数 | 最后访问时间戳 |
| `quarantined_by` | 字符串 | 隔离媒体的管理员（如已隔离） |
| `safe_from_quarantine` | 布尔值 | 媒体是否免于隔离 |

## MXC URL 格式

媒体文件使用 MXC URL 引用：
```
mxc://<server_name>/<media_id>
```

例如：`mxc://example.com/abc123def456`

要通过 HTTP 下载媒体，转换 MXC URL：
```
https://<your-server>/_matrix/media/v3/download/<server_name>/<media_id>
```
