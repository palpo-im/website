# 流量的委托

在以下文档中，我们使用 `server_name` 指 homeserver 配置文件中的该设置。它出现在用户 ID 的结尾，并告诉其他 homeserver 如何找到你的服务器。

默认情况下，其他 homeserver 会尝试通过你的 `server_name`，在 8448 端口访问你的服务器。例如，如果你将 `server_name` 设置为 `example.com`（这样你的用户名看起来像 `@user:example.com`），其他服务器会尝试连接 `https://example.com:8448/`。

委托（Delegation）是 Matrix 的一个特性，允许 homeserver 管理员保留 `example.com` 作为 `server_name`，这样用户 ID、房间别名等依然是 `*:example.com`，但联邦流量可以被路由到不同的服务器和/或端口（如 `synapse.example.com:443`）。

## .well-known 委托

要使用此方法，你需要能够配置 `https://<server_name>` 服务器，在 `https://<server_name>/.well-known/matrix/server` 路径下提供一个文件。下面有两种方式可以实现。

注意：`.well-known` 文件必须托管在 HTTPS 默认端口（443）上。

### 外部服务器

为了最大灵活性，你可以配置 nginx、Apache 或 HAProxy 等外部服务器来提供 `https://<server_name>/.well-known/matrix/server` 文件。如何搭建此类服务器超出了本文档范围，但通常可以在你的[反向代理](reverse-proxy.md)中配置。

`https://<server_name>/.well-known/matrix/server` 应返回如下包含 `m.server` 键的 JSON 结构：

```json
{
    "m.server": "<synapse.server.name>[:<yourport>]"
}
```

例如（我们希望联邦流量路由到 `https://synapse.example.com` 的 443 端口），那么 `https://example.com/.well-known/matrix/server` 应返回：

```json
{
    "m.server": "synapse.example.com:443"
}
```

注意，端口号可选。如果未指定端口，则默认为 8448。

### 使用 Synapse 提供 `.well-known/matrix/server` 文件

如果你能将 `https://<server_name>` 路由到 Synapse（即只需将联邦流量从 8448 改为 443 端口），可以通过配置 Synapse 来自动提供合适的 `.well-known/matrix/server` 文件。只需在 `homeserver.yaml` 文件中添加：

```yaml
serve_server_wellknown: true
```

**注意**：此方法仅在 `https://<server_name>` 路由到 Synapse 时有效，因此如果 Synapse 部署在子域（如 `https://synapse.example.com`）则不适用。

## SRV DNS 记录委托

也可以通过 SRV DNS 记录实现委托。但一般不推荐这种方式，因为 TLS 证书配置较为复杂，且相比 `.well-known` 委托没有明显优势。

请注意，服务器委托是服务器间通信的功能，因此使用 SRV DNS 记录无法覆盖客户端-服务器通信的场景。这意味着全局客户端设置（如 Jitsi 端点、默认新房间加密等）仍需通过 `https://<server_name>/.well-known/` 路径下的文件实现！如果你想用 SRV DNS 委托来避免提供该文件，请注意你将无法全局更改这些客户端默认值，只能在每个客户端单独配置。

如确有需要，可参考 [Matrix 规范](https://matrix.org/docs/spec/server_server/latest#resolving-server-names) 获取 SRV 记录格式及 Synapse 的使用方式。

## 委托常见问题

### 什么时候需要委托？

如果你的 homeserver API 能通过 `server_name` 指向的域名和默认联邦端口（8448）访问，则无需任何委托。

例如，你注册了 `example.com` 并将其 DNS A 记录指向一台新服务器，在该主机上安装 Synapse，`server_name` 设为 `example.com`，并配置反向代理将所有 8448 端口请求转发并为 `example.com` 提供 TLS 证书，则无需额外委托配置。

**但如果** 你的 homeserver API 不能通过 `server_name` 指向的域名和 8448 端口访问，则需要通过委托让其他服务器知道如何找到你的 homeserver。

### 联邦流量是否应使用反向代理？

通常，联邦和客户端流量都使用反向代理是个好主意，这样可以让 Synapse 不必直接处理 TLS 流量。关于如何设置反向代理，请参阅[反向代理文档](reverse-proxy.md)。
