# 设置应用服务

## 获取帮助

如果您在设置应用服务时遇到任何问题：请在 [#palpo:palpo.chat](https://matrix.to/#/#palpo:palpo.chat) 中提问，或 [在 GitHub 上提交问题](https://github.com/palpo-im/palpo/issues/new)。

## 设置应用服务 - 一般说明

遵循应用服务提供的任何说明。这通常包括下载、更改其配置（设置域、homeserver url、端口等），然后启动它。

在某个时候，应用服务指南应该要求您将注册 yaml 文件添加到 homeserver。在 Synapse 中，您可以通过将路径添加到 homeserver.yaml 来完成此操作，但在 palpo 中，您可以从 Matrix 内部完成此操作：

首先，进入您的 homeserver 的 `#admins` 房间。第一个在 homeserver 上注册的人会自动加入。然后向房间发送如下消息：

    !admin appservices register
    ```
    在此处
    粘贴
    yaml
    注册
    内容
    ```

您可以通过发送如下消息来确认它是否有效：
`!admin appservices list`

服务器机器人应该回答 `Appservices (1): your-bridge`

然后您就完成了。Palpo 会向应用服务发送消息，应用服务可以向 homeserver 发送请求。您无需重新启动 palpo，但如果它不起作用，在应用服务运行时重新启动可能会有所帮助。

## 应用服务特定说明

### 移除应用服务

要移除应用服务，请进入您的管理房间并执行

`!admin appservices unregister <name>`

其中 `<name>` 是 `appservices list` 的输出之一。

## 常见桥接示例

### mautrix-discord

[mautrix-discord](https://github.com/mautrix/discord) 将 Discord 服务器和私信桥接到 Matrix。

1. 按照 [mautrix-discord 安装指南](https://docs.mau.fi/bridges/go/discord/index.html) 下载并配置桥接程序。
2. 生成注册文件：
   ```bash
   mautrix-discord -g -c config.yaml -r registration.yaml
   ```
3. 通过管理房间在 Palpo 中注册：
   ```
   !admin appservices register
   ```yaml
   (粘贴 registration.yaml 的内容)
   ```
   ```
4. 启动桥接程序：`./mautrix-discord -c config.yaml`

### mautrix-telegram

[mautrix-telegram](https://github.com/mautrix/telegram) 将 Telegram 聊天和群组桥接到 Matrix。

1. 按照 [mautrix-telegram 安装指南](https://docs.mau.fi/bridges/python/telegram/index.html) 进行操作。
2. 生成注册文件并按照上述相同方式在 Palpo 中注册。
3. 启动桥接程序后，向 `@telegrambot:your.server` 发送消息以关联您的 Telegram 账户。

## 与 Synapse 的区别

在 Synapse 中，应用服务注册文件通过编辑 `homeserver.yaml` 并在 `app_service_config_files` 下列出文件路径来添加。在 Palpo 中，注册是通过管理房间**在运行时**完成的——无需重启服务器。

- **注册**：`!admin appservices register`，后跟包含 YAML 内容的代码块
- **注销**：`!admin appservices unregister <name>`
- **列表**：`!admin appservices list`

这意味着您无需拥有服务器的文件系统访问权限即可管理应用服务。

## 故障排除

- **桥接未接收到事件**：确认应用服务已注册（`!admin appservices list`），并且桥接进程正在运行且可通过注册 YAML 中指定的 URL 访问。
- **"Unknown appservice" 错误**：注册 YAML 中的 `id` 必须唯一。检查是否有拼写错误或重复项。
- **用户未被创建**：确保注册 YAML 中的 `namespaces.users` 正则表达式与桥接程序尝试创建的用户 ID 匹配。
- **连接被拒绝**：如果 Palpo 和桥接程序运行在不同的主机或容器中，请确保它们之间的网络连通性。注册 YAML 中的 `url` 字段必须可从 Palpo 访问。