# 管理

Palpo 支持通过命令行工具进行管理与审核。未来计划支持管理员 API 和 UI 界面。

## 启动管理交互界面

我们可以在 palpo 可执行文件所在的目录下运行以下命令启动命令行交互界面：

```bash
palpo --config palpo.toml --server false --console
```

这里的 `--config palpo.toml` 指定了使用的配置文件，如果是当前文件夹下的默认配置文件 `palpo.toml`，则可以省略。

`--server false` 代表不启动服务器，`--console` 代表启动命令行交互界面。

可以运行 `palpo --help` 查看具体使用说明。

**注意**：在 Windows 下可执行文件名字为 `palpo.exe`。

进入命令行交互界面，依然可以运行 `help` 命令查看可用的管理命令。

## 命令分类

Palpo 支持以下管理命令：

- `appservice`: 管理 Application Services（桥接）
- `user`: 管理本地用户
- `room`: 管理房间
- `federation`: 管理与其他服务器的联邦
- `server`: 管理服务器设置和操作
- `media`: 管理媒体文件

## 用户命令

### 创建用户

创建新的本地用户账户。

```
user create-user <username> [password]
```

- `<username>`: 新用户的用户名
- `[password]`: 可选的密码；如果未提供，将自动生成 25 个字符的密码

**注意**: 创建的第一个用户将自动获得管理员权限。

### 重置密码

重置用户密码。

```
user reset-password <username> [password]
```

- `<username>`: 用户的用户名
- `[password]`: 新密码；如果未提供，将自动生成

### 列出用户

列出所有本地用户账户。

```
user list-users
```

### 停用用户

停用单个用户账户。

```
user deactivate [--no-leave-rooms] <user_id>
```

- `<user_id>`: 完整的 Matrix ID（例如 `@username:example.com`）
- `--no-leave-rooms`: 不将用户从已加入的房间中移除

### 批量停用用户

从列表批量停用用户。

```
user deactivate-all [--no-leave-rooms] [--force]
```

- `--no-leave-rooms`: 不将用户从已加入的房间中移除
- `--force`: 同时停用管理员账户（默认跳过）

命令正文必须包含一个代码块，每行一个用户名：

````
```
user1
user2
user3
```
````

### 列出已加入的房间

列出用户已加入的所有房间。

```
user list-joined-rooms <user_id>
```

### 强制加入房间

强制本地用户加入房间。

```
user force-join-room <user_id> <room_id>
```

- `<user_id>`: 用户名或完整的 Matrix ID
- `<room_id>`: 房间 ID 或别名（例如 `!roomid:example.com` 或 `#alias:example.com`）

### 强制离开房间

强制本地用户离开房间。

```
user force-leave-room <user_id> <room_id>
```

### 设为管理员

授予本地用户服务器管理员权限。

```
user make-user-admin <user_id>
```

### 设置房间标签

为用户设置房间标签。

```
user put-room-tag <user_id> <room_id> <tag>
```

- `<tag>`: 标签名称（例如 `m.server_notice` 在 Element 中显示为"系统提醒"）

### 删除房间标签

移除房间标签。

```
user delete-room-tag <user_id> <room_id> <tag>
```

### 获取房间标签

列出用户在某个房间的所有标签。

```
user get-room-tags <user_id> <room_id>
```

### 编辑事件

强制编辑本地用户发送的事件。

```
user redact-event <event_id>
```

### 强制用户列表加入房间

强制用户列表中的本地用户加入房间。

```
user force-join-list-of-local-users <room_id> --yes-i-want-to-do-this
```

命令正文必须包含一个代码块，每行一个用户名。

### 强制所有本地用户加入房间

强制所有本地用户加入房间。

```
user force-join-all-local-users <room_id> --yes-i-want-to-do-this
```

## 房间命令

### 列出房间

列出服务器知道的所有房间。

```
room list-rooms [page] [--exclude-disabled] [--exclude-banned] [--no-details]
```

- `[page]`: 页码（默认：1，每页 100 个房间）
- `--exclude-disabled`: 跳过已禁用联邦的房间
- `--exclude-banned`: 跳过被封禁的房间
- `--no-details`: 仅输出房间 ID

### 房间是否存在

检查服务器是否知道某个房间。

```
room exists <room_id>
```

### 列出已加入的成员

列出房间中已加入的成员。

```
room info list-joined-members <room_id> [--local-only]
```

### 查看房间主题

显示房间主题。

```
room info view-room-topic <room_id>
```

### 封禁房间

禁止本地用户进入房间。

```
room moderation ban-room <room>
```

- `<room>`: 房间 ID 或别名

这将：
- 阻止本地用户加入
- 移除所有本地用户
- 阻止邀请
- 禁用与该房间的联邦
- 从房间目录中取消发布

### 批量封禁房间

批量封禁多个房间。

```
room moderation ban-list-of-rooms
```

命令正文必须包含一个代码块，内含房间 ID/别名。

### 解除房间封禁

解除房间封禁。

```
room moderation unban-room <room>
```

### 列出被封禁的房间

列出所有被封禁的房间。

```
room moderation list-banned-rooms [--no-details]
```

### 设置房间别名

创建房间别名。

```
room alias set [--force] <room_id> <room_alias_localpart>
```

- `<room_alias_localpart>`: 别名名称（例如 `lobby` 而不是 `#lobby:example.com`）
- `--force`: 如果别名已在使用中则覆盖

### 移除房间别名

删除房间别名。

```
room alias remove <room_alias_localpart>
```

### 查询别名对应的房间

查找别名指向的房间。

```
room alias which <room_alias_localpart>
```

### 列出别名

列出当前的本地别名。

```
room alias list [room_id]
```

### 发布房间

将房间发布到目录。

```
room directory publish <room_id>
```

### 取消发布房间

从目录中移除房间。

```
room directory unpublish <room_id>
```

### 列出已发布的房间

列出目录中的房间。

```
room directory list [page]
```

## 联邦命令

### 禁用房间联邦

禁用房间的联邦。

```
federation disable-room <room_id>
```

### 启用房间联邦

重新启用房间的联邦。

```
federation enable-room <room_id>
```

### 获取支持 Well-Known

从服务器获取 `/.well-known/matrix/support`。

```
federation fetch-support-well-known <server_name>
```

### 远程用户在哪些房间

列出与远程用户共享的房间。

```
federation remote-user-in-rooms <user_id>
```

## 媒体命令

### 删除单个媒体

删除媒体文件。

```
media delete-media (--mxc <mxc_url> | --event-id <event_id>)
```

- `--mxc`: MXC URL（例如 `mxc://example.com/abcd1234`）
- `--event-id`: 包含媒体的事件 ID

### 批量删除媒体

批量删除 MXC URL。

```
media delete-media-list
```

命令正文必须包含一个代码块，内含 MXC URL。

### 删除过期远程媒体

按时间删除远程媒体。

```
media delete-past-remote-media <duration> (--before | --after) [--yes-i-want-to-delete-local-media]
```

- `<duration>`: 时间段（例如 `30s`、`5m`、`7d`、`2w`）
- `--before`: 删除在指定时间之前创建的媒体
- `--after`: 删除在指定时间之后创建的媒体
- `--yes-i-want-to-delete-local-media`: 同时删除本地媒体

### 获取文件信息

查找媒体文件的元数据。

```
media get-file-info <mxc>
```

## 服务器命令

### 显示配置

显示当前服务器配置。

```
server show-config
```

### 重新加载配置

从文件重新加载配置。

```
server reload-config [path]
```

### 列出功能

显示服务器功能及其状态。

```
server list-features [--available] [--enabled] [--comma]
```

- `--available`: 显示所有可用功能
- `--enabled`: 仅显示已启用的功能
- `--comma`: 使用逗号分隔

### 管理员通知

向管理员房间发送消息。

```
server admin-notice <message...>
```

### 热重载

热重载服务器。

```
server reload-mods
```

### 重启服务器

重启服务器。

```
server restart [--force]
```

- `--force`: 即使可执行文件已更改也强制重启

### 关闭服务器

关闭服务器。

```
server shutdown
```

## Appservice 命令

### 注册 Appservice

注册桥接/appservice。

```
appservice register
```

命令正文必须包含 YAML 注册信息：

````
```yaml
id: my_bridge
as_token: secret_token_here
hs_token: secret_token_here
namespaces:
  users:
    - regex: '@irc_.*'
  aliases:
    - regex: '#irc_.*'
  rooms: []
```
````

### 注销 Appservice

注销 appservice。

```
appservice unregister <appservice_identifier>
```

### 显示 Appservice 配置

显示 appservice 注册信息。

```
appservice show-appservice-config <appservice_identifier>
```

### 列出 Appservices

列出所有已注册的 appservices。

```
appservice list-registered
```

## 命令输入格式

### 代码块格式

许多命令接受通过代码块输入：

````
```
item1
item2
item3
```
````

### 时间格式

时间段使用以下单位：
- `s` - 秒
- `m` - 分钟
- `h` - 小时
- `d` - 天
- `w` - 周

示例：`7d` 表示 7 天，`2w` 表示 2 周。

## 安全功能

- 危险操作需要确认标志（`--yes-i-want-to-do-this`）
- 不能停用服务器服务账户
- 不能封禁管理员房间
- 没有 `--force` 不能覆盖别名
