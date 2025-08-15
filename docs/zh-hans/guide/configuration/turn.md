# 设置 TURN

为了进行或接收呼叫，需要一个 TURN 服务器。Palpo 建议为此目的使用 [Coturn](https://github.com/coturn/coturn)，它也可用作 Docker 镜像。

### 配置

创建一个名为 `coturn.conf` 的配置文件，其中包含：

```conf
use-auth-secret
static-auth-secret=<一个密钥>
realm=<您的服务器域名>
```

生成合适的字母数字密钥的常用方法是使用 `pwgen -s 64 1`。

这些相同的值需要在 Palpo 中设置。请参阅 [示例配置](configuration/examples.md) 中 TURN 部分的配置，并在之后重新启动 Palpo。

`turn_secret` 或 `turn_secret_file` 的路径必须是您的 coturn `static-auth-secret` 的值，或者如果使用旧版 username:password TURN 身份验证（不推荐），则使用 `turn_username` 和 `turn_password`。

`turn_uris` 必须是您希望发送给客户端的 TURN URI 列表。通常，您只需将示例域名 `example.turn.uri` 替换为您在示例配置中设置的 `realm`。

如果您通过 TLS 使用 TURN，您可以在 `turn_uris` 配置选项中将 `turn:` 替换为 `turns:`，以指示客户端尝试通过 TLS 连接到 TURN。强烈建议这样做。

如果您需要对 TURN URI 进行未经身份验证的访问，或者某些客户端可能遇到问题，您可以在 Palpo 中启用 `turn_guest_access`，这将禁用 TURN URI 端点 `/_matrix/client/v3/voip/turnServer` 的身份验证。

### 运行

使用以下命令运行 [Coturn](https://hub.docker.com/r/coturn/coturn) 镜像：

```bash
docker run -d --network=host -v
$(pwd)/coturn.conf:/etc/coturn/turnserver.conf coturn/coturn
```

或 docker-compose。对于后者，将以下部分粘贴到名为 `docker-compose.yml` 的文件中，并在同一目录中运行 `docker compose up -d`。

```yml
version: 3
services:
    turn:
      container_name: coturn-server
      image: docker.io/coturn/coturn
      restart: unless-stopped
      network_mode: "host"
      volumes:
        - ./coturn.conf:/etc/coturn/turnserver.conf
```

要了解使用主机网络模式的原因并探索其他配置选项，请访问 [Coturn 的 Docker 文档](https://github.com/coturn/coturn/blob/master/docker/coturn/README.md)。

有关安全建议，请参阅 Synapse 的 [Coturn 文档](https://element-hq.github.io/synapse/latest/turn-howto.html)。