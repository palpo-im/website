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

## 数据库 (RocksDB)

通常您需要做的事情很少。[压缩][rocksdb-compaction] 会根据为 Palpo 调整的各种定义阈值自动运行，以实现高性能和最小的 I/O 放大或开销。不建议手动运行压缩，或通过计时器进行压缩，因为这会产生不必要的 I/O 放大。RocksDB 内置了通过 liburing 支持 io_uring，以提高读取性能。

RocksDB 故障排除可以在 [故障排除的 RocksDB 部分](troubleshooting.md) 中找到。

### 压缩

可以调整一些 RocksDB 设置，例如选择的压缩方法。请参阅 [示例配置](configuration/examples.md) 中的 RocksDB 部分。

btrfs 用户报告说，Palpo 上不需要禁用数据库压缩，因为文件系统已经不尝试压缩。这可以通过在数据库中的 `.SST` 文件上使用 `filefrag -v` 来验证，并确保 `physical_offset` 匹配（没有文件系统压缩）。确保没有发生额外的文件系统压缩非常重要，因为这会使无缓冲的直接 I/O 无法操作，从而显著降低读写性能。请参阅 <https://btrfs.readthedocs.io/en/latest/Compression.html#compatibility>

> 压缩是使用 COW 机制完成的，因此它与 nodatacow 不兼容。直接 I/O 读取适用于压缩文件，但会回退到缓冲写入，即使设置了强制压缩也不会进行压缩。目前 nodatasum 和压缩不能一起工作。

### 数据库中的文件

不要触碰数据库目录中的任何文件。之所以必须这样说，是因为用户被 RocksDB 目录中的 `.log` 文件误导，认为它们是服务器日志或数据库日志，但它们是与 WAL 跟踪相关的关键 RocksDB 文件。

唯一可以安全删除的文件是 `LOG` 文件（全部大写）。这些是真正的 RocksDB 遥测/日志文件，但是 Palpo 已配置为仅存储最多 3 个 RocksDB `LOG` 文件，因为对于普通用户来说，除非需要进行低级故障排除，否则它们通常是无用的。如果您希望几乎不存储任何文件，请参阅 `rocksdb_max_log_files` 配置选项。

## 备份

目前只有 RocksDB 支持在线备份。如果您想在不停机的情况下在线备份数据库，请参阅 `!admin server` 命令以获取备份命令和示例配置中的 `database_backup_path` 配置选项。请注意，数据库备份的格式不完全相同。不幸的是，这是 Facebook 的一个糟糕设计选择，因为我们使用的是 RocksDB 的数据库备份引擎 API，但是数据仍然存在并且仍然可以连接在一起。

要从在线 RocksDB 备份中恢复备份：

- 关闭 Palpo
- 创建一个新目录以合并数据
- 在创建的在线备份中，将 `$DATABASE_BACKUP_PATH/shared_checksum` 中的所有 `.sst` 文件复制到您的新目录
- 修剪所有字符串，以便将 `######_sxxxxxxxxx.sst` 更改为 `######.sst`。使用 sed 和 bash 的方法是 `for file in *.sst; do mv "$file" "$(echo "$file" | sed 's/_s.*/.sst/')"; done`
- 将 `$DATABASE_BACKUP_PATH/1`（如果您有多个备份，则为最新的备份号）中的所有文件复制到您的新目录
- 将您的 `database_path` 配置选项设置为您的新目录，或用您创建的新目录替换旧目录
- 再次启动 Palpo，它应该正常打开

如果您想进行离线备份，请关闭 Palpo 并将您的 `database_path` 目录复制到其他位置。这可以在无需修改的情况下恢复。

备份媒体也只是复制数据库目录中的 `media/` 目录。

## 媒体

媒体仍需要各种工作，但 Palpo 通过以下方式实现媒体删除：

- MXC URI 或事件 ID（未加密并尝试在事件中查找 MXC URI）
- 删除 MXC URI 列表
- 通过文件创建时间 (`btime`) 或文件修改时间 (`mtime`) 的文件系统元数据，删除过去 `N` 秒/分钟内的远程媒体

有关更多信息，请参阅 `!admin media` 命令。Palpo 中的所有媒体都存储在 `$DATABASE_DIR/media`。这将很快可配置。

如果您发现自己需要对媒体进行广泛的精细控制，我们建议您查看 [Matrix Media Repo](https://github.com/t2bot/matrix-media-repo)。Palpo 打算为媒体实现各种实用程序，但 MMR 致力于广泛的媒体管理。

内置 S3 支持也已计划，但目前在 `media/` 上使用“S3 文件系统”有效。Palpo 还会为所有媒体请求（下载和缩略图）发送 1 年的 `Cache-Control` 标头和不可变，以减少浏览器不必要的媒体请求，减少带宽使用，并减少负载。

[rocksdb-compaction]: https://github.com/facebook/rocksdb/wiki/Compaction