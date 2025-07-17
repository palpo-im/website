# 设置应用服务

## 获取帮助

如果您在设置应用服务时遇到任何问题：请在 [#palpo:palpo.chat](https://matrix.to/#/#palpo:palpo.chat) 中提问，或 [在 GitHub 上提交问题](https://github.com/matrix-construct/palpo/issues/new)。

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