# 流量的委托


默认情况下，其他 homeserver 会尝试通过 `server_name` 配置的域名及 8448 端口访问你的服务器。`server_name` 会出现在用户 ID 的结尾，用于告知其他 homeserver 如何找到你的服务器。例如，若将 `server_name` 设置为 `example.com`（此时用户 ID 形如 `@user:example.com`），其他服务器将尝试连接 `https://example.com:8448/`。

委托（Delegation）是 Matrix 的一项特性，允许 homeserver 管理员保留 `example.com` 作为 `server_name`，使所有用户 ID 和房间别名保持 `*:example.com` 格式，同时将联邦流量路由到其他服务器或端口（如 `synapse.example.com:443`）。

## .well-known 委托

使用此方法需能配置 `https://<server_name>` 服务器，在 `https://<server_name>/.well-known/matrix/server` 路径下提供服务发现文件。

> **注意**：`.well-known` 文件必须托管在 HTTPS 默认端口（443）上。

### 外部服务器

若需最大灵活性，可配置 nginx、Apache 或 HAProxy 等外部服务器提供 `https://<server_name>/.well-known/matrix/server` 文件。配置方法通常可在[反向代理](reverse-proxy.md)文档中找到。

`https://<server_name>/.well-known/matrix/server` 应返回如下 JSON 结构，包含 `m.server` 键：

```json
{
    "m.server": "<synapse.server.name>[:<yourport>]"
}
```

例如，若需将联邦流量路由到 `https://synapse.example.com` 的 443 端口，`https://example.com/.well-known/matrix/server` 应返回：

```json
{
    "m.server": "synapse.example.com:443"
}
```

端口号可选，未指定时默认为 8448。

### 使用 Synapse 提供 `.well-known/matrix/server` 文件

若能将 `https://<server_name>` 路由到 Synapse（即只需将联邦流量端口从 8448 改为 443），可通过配置 Synapse 自动提供 `.well-known/matrix/server` 文件。在 `homeserver.yaml` 文件中添加：

```yaml
serve_server_wellknown: true
```

**注意**：此方法仅在 `https://<server_name>` 路由到 Synapse 时有效。若 Synapse 部署在子域（如 `https://synapse.example.com`），则不适用。

## SRV DNS 记录委托

也可通过 SRV DNS 记录实现委托，但一般不推荐此方式。原因包括 TLS 证书配置复杂，且相比 `.well-known` 委托无明显优势。

需注意，服务器委托仅用于服务器间通信，因此 SRV DNS 记录无法覆盖客户端-服务器通信场景。这意味着全局客户端设置（如 Jitsi 端点、默认房间加密等）仍需通过 `https://<server_name>/.well-known/` 路径下的文件实现。若使用 SRV DNS 委托以避免提供该文件，则无法全局更改客户端默认值，只能在每个客户端单独配置。

如确有需要，可参考 [Matrix 规范](https://matrix.org/docs/spec/server_server/latest#resolving-server-names) 了解 SRV 记录格式及使用方式。

## 委托常见问题

### 什么时候需要委托？

若 homeserver API 能通过 `server_name` 指向的域名和默认联邦端口（8448）访问，则无需委托配置。

例如：注册 `example.com` 并将其 DNS A 记录指向一台服务器，在该主机上安装 Synapse，`server_name` 设为 `example.com`，并配置反向代理将 8448 端口请求转发并为 `example.com` 提供 TLS 证书，此时无需额外委托配置。

**但若** homeserver API 无法通过 `server_name` 指向的域名和 8448 端口访问，则需通过委托让其他服务器知道如何找到你的 homeserver。

### 联邦流量是否应使用反向代理？

通常，联邦和客户端流量都使用反向代理是明智的选择，这样可让 Synapse 无需直接处理 TLS 流量。关于如何设置反向代理，请参阅[反向代理文档](reverse-proxy.md)。
