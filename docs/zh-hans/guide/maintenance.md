# 维护您的 Palpo 设置

## 审核

Palpo 通过管理房间命令进行审核。“二进制命令”（中等优先级）和管理 API（低优先级）正在计划中。示例配置中提供了一些与审核相关的配置选项，例如“全局 ACL”和阻止对某些服务器的媒体请求。请参阅示例配置中“审核/隐私/安全”部分下的审核配置选项。

Palpo 具有以下审核管理命令：

- 管理房间别名 (`!admin rooms alias`)
- 管理房间目录 (`!admin rooms directory`)
- 管理房间封禁/阻止和用户移除 (`!admin rooms moderation`)
- 管理用户帐户 (`!admin users`)
- 从服务器获取 `/.well-known/matrix/support` (`!admin federation`)
- 阻止某些房间的传入联邦（与房间封禁不同） (`!admin federation`)
- 删除媒体（请参阅 [媒体部分](#media)）

任何带有 `-list` 的命令都需要在消息中使用代码块，每个对象都以换行符分隔。示例如下：

````
!admin rooms moderation ban-list-of-rooms
```
!roomid1:server.name
#badroomalias1:server.name
!roomid2:server.name
!roomid3:server.name
#badroomalias2:server.name
```
````

## 媒体

媒体仍需要各种工作，但 Palpo 通过以下方式实现媒体删除：

- MXC URI 或事件 ID（未加密并尝试在事件中查找 MXC URI）
- 删除 MXC URI 列表
- 通过文件创建时间 (`btime`) 或文件修改时间 (`mtime`) 的文件系统元数据，删除过去 `N` 秒/分钟内的远程媒体

有关更多信息，请参阅 `!admin media` 命令。

### 存储后端

Palpo 通过 [Apache OpenDAL](https://opendal.apache.org/) 支持两种媒体存储后端：

- **本地文件系统**（默认）— 媒体文件存储在 `space_path` 目录下
- **S3 兼容存储** — 支持 AWS S3、Cloudflare R2、MinIO、Backblaze B2 及任何 S3 兼容服务

详细配置请参阅[存储配置](/zh-hans/guide/configuration/#存储配置)章节。

如果您需要对媒体进行广泛的精细控制，我们建议您查看 [Matrix Media Repo](https://github.com/t2bot/matrix-media-repo)。Palpo 打算为媒体实现各种实用程序，但 MMR 致力于广泛的媒体管理。

Palpo 会为所有媒体请求（下载和缩略图）发送 1 年的 `Cache-Control` 标头（immutable），以减少浏览器不必要的媒体请求，减少带宽使用，并降低负载。

## 升级 Palpo

### Docker

1. 拉取最新镜像：
   ```bash
   docker compose pull
   ```
2. 重启服务：
   ```bash
   docker compose up -d
   ```
   数据库迁移会在启动时自动运行。

### 二进制文件

1. 从 [GitHub Releases](https://github.com/palpo-im/palpo/releases) 下载新版本。
2. 停止正在运行的服务器：
   ```bash
   systemctl stop palpo
   ```
3. 用新的二进制文件替换旧文件。
4. 启动服务器：
   ```bash
   systemctl start palpo
   ```
   数据库迁移会在新版本首次启动时自动运行。

### 升级前注意事项

- 每次升级前**备份您的数据库**。请参阅[备份指南](./administration/backup.md)。
- 阅读版本发布说明，了解是否有破坏性更改或需要更新的配置。
- 如果条件允许，请先在测试环境中验证升级。

## 数据库维护

PostgreSQL 需要定期维护以保持最佳性能。

### 常规 VACUUM

PostgreSQL 的 autovacuum 会自动运行，但对于繁忙的服务器，您可能需要定期手动执行 vacuum：

```bash
# 标准 vacuum（非阻塞）
sudo -u postgres psql -d palpo -c "VACUUM ANALYZE;"

# 完全 vacuum（需要停机，可回收磁盘空间）
sudo -u postgres psql -d palpo -c "VACUUM FULL ANALYZE;"
```

### 重建索引

如果查询性能随时间下降，重建索引可能会有所帮助：

```bash
sudo -u postgres psql -d palpo -c "REINDEX DATABASE palpo;"
```

### 监控数据库大小

```bash
sudo -u postgres psql -d palpo -c "SELECT pg_size_pretty(pg_database_size('palpo'));"
```

## 日志管理

对于长期运行的 Palpo 服务器，日志轮转可以防止磁盘耗尽。请参阅[监控指南](./administration/monitoring.md)了解 logrotate 配置。

如果通过 systemd 运行，日志由 journald 管理：

```bash
# 查看最近的日志
journalctl -u palpo --since "1 hour ago"

# 检查日志磁盘使用情况
journalctl --disk-usage

# 清理 7 天前的日志
sudo journalctl --vacuum-time=7d
```

## TLS 证书续签

如果您直接在 Palpo 中配置了 TLS（而非通过反向代理），则需要在证书过期前进行续签。

### 使用 certbot 获取 Let's Encrypt 证书

```bash
# 续签证书
sudo certbot renew

# 重启 Palpo 以加载新证书
sudo systemctl restart palpo
```

通过 cron 设置自动续签：

```bash
# /etc/cron.d/certbot-palpo
0 3 * * * root certbot renew --quiet --post-hook "systemctl restart palpo"
```

如果使用反向代理（Caddy、Traefik、Nginx），证书管理由代理处理，无需重启 Palpo。