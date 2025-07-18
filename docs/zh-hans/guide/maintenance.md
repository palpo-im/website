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

有关更多信息，请参阅 `!admin media` 命令。Palpo 中的所有媒体都存储在 `$DATABASE_DIR/media`。这将很快可配置。

如果您发现自己需要对媒体进行广泛的精细控制，我们建议您查看 [Matrix Media Repo](https://github.com/t2bot/matrix-media-repo)。Palpo 打算为媒体实现各种实用程序，但 MMR 致力于广泛的媒体管理。

内置 S3 支持也已计划，但目前在 `media/` 上使用“S3 文件系统”有效。Palpo 还会为所有媒体请求（下载和缩略图）发送 1 年的 `Cache-Control` 标头和不可变，以减少浏览器不必要的媒体请求，减少带宽使用，并减少负载。