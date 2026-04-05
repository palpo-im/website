# 反向代理

可以在 Palpo 前面放置一个反向代理，例如 nginx、 Apache、 Caddy、 HAProxy 或 relayd。

这样做的好处是能够将默认的 HTTPS 端口 (443) 暴露给 Matrix 客户端，而无需 Palpo 绑定到特权端口（小于 1024 的端口号）。

您应该配置反向代理以将请求转发到 `/_matrix`，并让其设置 `X-Forwarded-For` 和 `X-Forwarded-Proto` 请求标头。

**需要注意**：Matrix 客户端、其他 Matrix 服务器不一定通过相同的服务器名称或端口连接到您的服务器。客户端默认使用端口 443，而服务器默认使用端口 8448。我们分别称为“客户端端口（client port）”和“联合端口（federation port）”。 
> 有关用于联合连接的算法的更多详细信息， 请参阅 Matrix 规范（https://spec.matrix.org/latest/）。
> 有关设置委托的说明，请参阅[委托](./delegation.html)章节。


**注意** 

> 您的反向代理不得以任何方式（例如，通过解码转义符）对请求的 URI 进行 canonicalise 或 normalise 操作。

> 核心原则：反向代理应该是透明的管道，将原始请求原封不动地转发给后端。

## Palpo服务器配置

假设客户端通过 `https://matrix.example.com` 连接服务器。其他 Matrix 服务器通过 `https://example.com:8448` 连接服务器。
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


**重要提示**：建议将服务器设置为仅监听本地主机上的流量。但请注意，如果使用容器化的 Synapse，请勿进行此更改，因为这会阻止其响应代理流量。

或者，您还可以进行设置：request_id_header， 以便服务器提取并重新使用反向代理正在使用的相同请求 ID 格式。

## 代理服务


## Caddy
我们提供了一个开箱即用的 [caddy-docker-proxy](https://github.com/palpo-im/palpo/blob/main/deploy/docker/compose.with-caddy.yml) 设置。此配置添加了 [Caddy](https://caddyserver.com/) 作为反向代理服务器。使用时需将所有 `example.com` 占位符替换为您自己的域名。并且需要在当前目录下配置好 `palpo.toml`,参考 [palpo.toml](https://github.com/palpo-im/palpo/blob/main/deploy/docker/palpo.toml)。

在启动前创建 `caddy` 网络：

```bash
docker network create caddy
```
启动服务:
```bash
docker compose up -d
```
## traefik

我们提供了一个开箱即用的[traefik-docker-proxy](https://github.com/palpo-im/palpo/blob/main/deploy/docker/compose.with-traefik.yml)设置。此配置添加了 [Traefik](https://traefik.io/) 作为反向代理服务器。使用时需将所有 `your_domain.com` 占位符替换为您自己的域名。并且需要在当前目录下配置好 `palpo.toml`,参考 [palpo.toml](https://github.com/palpo-im/palpo/blob/main/deploy/docker/palpo.toml)。

如果已经设置了`traefik`，请 参考此配置[compose.for-traefik.yml](https://github.com/palpo-im/palpo/blob/main/deploy/docker/compose.for-traefik.yml)

启动服务:

```bash
docker compose up -d
```




