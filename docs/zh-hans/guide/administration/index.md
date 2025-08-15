
# 管理

## 管理与审核

Palpo 支持通过管理员房间命令进行管理与审核。未来计划支持管理员 API 和 UI 界面。

Palpo 支持以下管理命令：

- 管理房间别名（`!admin rooms alias`）
- 管理房间目录（`!admin rooms directory`）
- 管理房间封禁/屏蔽和用户移除（`!admin rooms moderation`）
- 管理用户账户（`!admin users`）
- 从服务器获取 `/.well-known/matrix/support`（`!admin federation`）
- 阻止某些房间的联邦流量（与房间封禁不同）（`!admin federation`）
- 删除媒体（参见[媒体部分](#media)）

带有 `-list` 的命令需要在消息中以代码块形式提供，每个对象一行。例如：

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
