# 反向代理

可以在 Palpo 前面放置一个反向代理，例如 nginx、 Apache、 Caddy、 HAProxy 或 relayd。

这样做的好处是能够将默认的 HTTPS 端口 (443) 暴露给 Matrix 客户端，而无需 Palpo 绑定到特权端口（小于 1024 的端口号）。

您应该配置反向代理以将请求转发到 `/_matrix`，并让其设置 `X-Forwarded-For` 和 `X-Forwarded-Proto` 请求标头。

请记住，Matrix 客户端和其他 Matrix 服务器不一定需要通过相同的服务器名称或端口连接到您的服务器。客户端默认使用端口 443，而服务器默认使用端口 8448。如果两者不同，我们将分别称为“客户端端口（client port）”和“联合端口（federation port）”。 有关用于联合连接的算法的更多详细信息， 请参阅 Matrix 规范；有关设置委托的说明，请参阅[委托](./delegation.html)。

注意：您的反向代理不得以任何方式（例如，通过解码转义符）对请求的 URI 进行 canonicalise 或 normalise 操作。

假设我们预期客户端连接到我们的服务器地址为 https://matrix.example.com，其他服务器则连接到 https://example.com:8448。以下部分详细介绍了反向代理和主服务器的配置。


## 主服务器配置

需要更新 HTTP 配置，以便 Palpo 在反向代理后面正确记录客户端 IP 地址并生成重定向 URL。

在您的 `palpo.toml` 配置文件中进行如下设置：

```toml
# 服务器侦听的本地地址
# 使用 127.0.0.1 只接受来自本地的连接（使用反向代理时推荐）
listen_addr = "127.0.0.1:8008"
```

使用反向代理时，您还应该配置 `[well_known]` 部分，以确保客户端和联邦服务器能够正确发现您的 homeserver：

```toml
[well_known]
# 客户端将使用的 URL（您的公开地址）
client = "https://matrix.example.com"
# 联邦地址（其他 Matrix 服务器）
server = "matrix.example.com:443"
```

注意：如果您在容器中运行 Palpo，请将 `listen_addr` 保持为 `0.0.0.0:8008`，以允许反向代理在容器网络内访问 Palpo。

