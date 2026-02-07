# Admin API

Palpo 提供 HTTP Admin API 用于服务器的程序化管理。这些 API 与 Synapse Admin API 格式兼容，允许您使用现有的工具和脚本。

## 认证

所有 Admin API 端点都需要使用管理员用户的访问令牌进行认证。在请求中包含令牌：

**请求头方式（推荐）：**
```
Authorization: Bearer <access_token>
```

**查询参数方式：**
```
?access_token=<access_token>
```

只有具有管理员权限的用户才能访问这些端点。非管理员用户将收到 `403 Forbidden` 响应。

## API 基础路径

Palpo 支持两个等效的基础路径：
- `/_synapse/admin/` - Synapse 兼容路径
- `/_palpo/admin/` - Palpo 专用路径

两个路径提供相同的功能。

## API 分类

Admin API 按以下类别组织：

### 用户管理
- [用户管理 API](./admin_api/users) - 创建、修改、停用用户
- [用户设备 API](./admin_api/devices) - 管理用户设备

### 房间管理
- [房间管理 API](./admin_api/rooms) - 列出、检查和删除房间

### 媒体管理
- [媒体管理 API](./admin_api/media) - 管理上传的媒体文件

### 联邦
- [联邦管理 API](./admin_api/federation) - 管理与其他服务器的联邦

### 内容审核
- [事件报告 API](./admin_api/event_reports) - 处理举报的事件

### 服务器管理
- [注册令牌 API](./admin_api/registration_tokens) - 管理注册令牌
- [统计信息 API](./admin_api/statistics) - 服务器统计和版本信息

## 通用模式

### 分页

大多数列表端点支持以下分页参数：
- `from` - 起始偏移量（默认：0）
- `limit` - 最大返回数量（默认：100）
- `dir` - 排序方向：`f`（正向）或 `b`（反向）

响应包含分页令牌：
```json
{
  "results": [...],
  "total": 150,
  "next_token": "100"
}
```

### 错误响应

错误遵循 Matrix 错误格式：
```json
{
  "errcode": "M_FORBIDDEN",
  "error": "You are not a server admin"
}
```

常见错误代码：
- `M_FORBIDDEN` - 需要管理员权限
- `M_NOT_FOUND` - 资源未找到
- `M_INVALID_PARAM` - 无效参数
- `M_UNKNOWN` - 服务器错误

## 快速参考

| 类别 | 端点数 | 描述 |
|-----|-------|------|
| 用户 | 19 | 用户账户管理 |
| 设备 | 6 | 设备管理 |
| 房间 | 10 | 房间管理 |
| 媒体 | 7 | 媒体文件管理 |
| 联邦 | 4 | 联邦控制 |
| 事件报告 | 3 | 内容审核 |
| 注册 | 5 | 注册令牌 |
| 统计 | 2 | 服务器信息 |

## 示例：列出所有用户

```bash
curl -X GET "https://your-server/_synapse/admin/v2/users" \
  -H "Authorization: Bearer <admin_access_token>"
```

响应：
```json
{
  "users": [
    {
      "name": "@alice:example.com",
      "displayname": "Alice",
      "admin": false,
      "deactivated": false
    }
  ],
  "total": 1
}
```
