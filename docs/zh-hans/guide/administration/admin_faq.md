# 管理员常见问题

管理 Palpo 服务器的常见问题解答。

## 用户管理

### 如何创建第一个管理员用户？

在新 Palpo 服务器上创建的第一个用户会自动获得管理员权限。使用控制台命令：

```
user create-user admin
```

或者先通过 Admin API 创建普通用户后再提升权限。

### 如何重置用户密码？

**通过控制台：**
```
user reset-password username newpassword123
```

**通过 Admin API：**
```bash
curl -X POST "https://your-server/_synapse/admin/v1/reset_password/@username:your-server" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"new_password": "newpassword123"}'
```

### 如何将现有用户设为管理员？

**通过控制台：**
```
user make-user-admin @username:your-server
```

**通过 Admin API：**
```bash
curl -X PUT "https://your-server/_synapse/admin/v1/users/@username:your-server/admin" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"admin": true}'
```

### 如何处理垃圾账户？

1. **影子封禁** - 用户仍可发帖但消息不会传递给其他人：
   ```
   # 通过 API
   POST /_synapse/admin/v1/users/@spammer:server/shadow_ban
   ```

2. **停用** - 完全禁用账户：
   ```
   user deactivate @spammer:your-server
   ```

3. **防止未来注册** - 使用注册令牌或禁用开放注册。

## 房间管理

### 如何封禁有问题的房间？

**通过控制台：**
```
room moderation ban-room !roomid:example.com
```

这将会：
- 将所有本地用户从房间中移除
- 阻止本地用户重新加入
- 阻止对该房间的邀请
- 禁用该房间的联邦

### 如何删除房间？

**通过 Admin API：**
```bash
curl -X DELETE "https://your-server/_synapse/admin/v2/rooms/!roomid:example.com" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"block": true, "purge": true}'
```

### 如何查看用户加入了哪些房间？

**通过控制台：**
```
user list-joined-rooms @username:your-server
```

## 联邦

### 我的服务器无法连接到另一台服务器，该怎么办？

1. 检查联邦状态：
   ```bash
   curl -X GET "https://your-server/_synapse/admin/v1/federation/destinations/other-server.com" \
     -H "Authorization: Bearer <admin_token>"
   ```

2. 如果有故障，重置连接：
   ```bash
   curl -X POST "https://your-server/_synapse/admin/v1/federation/destinations/other-server.com/reset_connection" \
     -H "Authorization: Bearer <admin_token>"
   ```

3. 检查防火墙是否允许端口 8448 的出站连接。

4. 验证 DNS 和 TLS 证书配置是否正确。

### 如何禁用特定房间的联邦？

**通过控制台：**
```
federation disable-room !roomid:your-server
```

重新启用：
```
federation enable-room !roomid:your-server
```

## 媒体

### 如何释放旧媒体占用的磁盘空间？

**删除旧的远程媒体缓存：**
```bash
# 删除 30 天未访问的远程媒体
curl -X POST "https://your-server/_synapse/admin/v1/purge_media_cache?before_ts=<30天前的时间戳>" \
  -H "Authorization: Bearer <admin_token>"
```

**按大小删除旧的本地媒体：**
```bash
# 删除 90 天前且大于 10MB 的本地媒体
curl -X POST "https://your-server/_synapse/admin/v1/media/delete?before_ts=<时间戳>&size_gt=10485760" \
  -H "Authorization: Bearer <admin_token>"
```

### 如何查找用户上传的媒体？

```bash
curl -X GET "https://your-server/_synapse/admin/v1/users/@username:your-server/media" \
  -H "Authorization: Bearer <admin_token>"
```

## 配置

### 如何不重启服务器重新加载配置？

**通过控制台：**
```
server reload-config
```

或指定路径：
```
server reload-config /path/to/palpo.toml
```

### 如何查看当前配置？

**通过控制台：**
```
server show-config
```

### 如何查看启用了哪些功能？

**通过控制台：**
```
server list-features --enabled
```

## 安全

### 如何要求注册令牌？

在配置中添加：
```toml
[registration]
enable = true
token_required = true
```

然后通过 Admin API 创建令牌：
```bash
curl -X POST "https://your-server/_synapse/admin/v1/registration_tokens/new" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"uses_allowed": 10}'
```

### 如何禁用开放注册？

```toml
[registration]
enable = false
```

或要求使用令牌（见上文）。

### 如何检查被举报的内容？

**通过 Admin API：**
```bash
curl -X GET "https://your-server/_synapse/admin/v1/event_reports" \
  -H "Authorization: Bearer <admin_token>"
```

## 故障排除

### 服务器无法启动

1. 检查配置文件是否有语法错误
2. 确保数据库可访问
3. 检查数据目录的文件权限
4. 查看服务器日志了解具体错误

### 用户无法登录

1. 验证数据库正在运行
2. 检查是否有速率限制
3. 确保配置中的 server_name 与用户使用的一致
4. 检查 TLS 证书有效性

### 消息不能联邦

1. 检查目标服务器的联邦状态
2. 验证 DNS 记录（如果使用委托，特别是 `.well-known`）
3. 确保端口 8448 可访问
4. 检查 TLS 证书是否有效且受信任
