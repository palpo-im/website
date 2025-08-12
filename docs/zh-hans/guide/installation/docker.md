# 使用 Docker 部署

Docker 可以让 Palpo 的安装变得简单，推荐使用 Docker 方式安装部署 Palpo. 如果你的电脑上还没有安装 Docker, 可以从 [Docker](https://www.docker.com/) 网站下载对应系统的安装文件。


## 使用预制模板配置

首先下载 [palpo.toml][palpo_toml] 配置文件，[palpo.toml][palpo_toml] 仅仅只有一些必要配置项，请确保在启动服务器前已经修改为正确的值。

然后根据需要下载下面的 Docker compose 配置文件，将他们放在同一个文件夹下面。

- [compose.yml](https://github.com/palpo-im/palpo/blob/main/deploy/docker/compose.yml)

    仅仅配置了 Postgres 数据库和 Palpo 服务器程序。你需要修改配置里面的 `POSTGRES_PASSWORD` 之后启动。

- [compose.with-caddy.yml](https://github.com/palpo-im/palpo/blob/main/deploy/docker/compose.with-caddy.yml)

    如果您想要一个开箱即用的 `caddy-docker-proxy` 设置，请使用次配置，此配置添加了 [Caddy](https://caddyserver.com/) 作为反向代理服务器。使用时需将所有 `example.com` 占位符替换为您自己的域名。
    你还需要在启动前创建 `caddy` 网络：

    ```bash
    docker network create caddy
    ```

- [compose.with-traefik.yml](https://github.com/palpo-im/palpo/blob/main/deploy/docker/compose.with-traefik.yml)

    如果您没有设置了 `traefik` 实例，请使用此配置, 此配置添加了使用 [Traefik](https://traefik.io/) 作为反向代理服务器。

- [compose.for-traefik.yml](https://github.com/palpo-im/palpo/blob/main/deploy/docker/compose.for-traefik.yml)

    如果您已经设置了 `traefik` 实例，请使用此配置, 此配置添加了使用现有 [Traefik](https://traefik.io/) 作为反向代理服务器。


> **注意：** 不要忘记根据您的需求修改和调整 `compose.yml` 和 `palpo.toml` 文件。

将下载的 compose.*.yml 文件改名为 compose.yml，然后运行下面的命令启动服务器：

```bash
docker compose up -d
```

打开浏览器，输入你设置的服务地址，如果一切设置正确，则页面会显示：`Hello Palpo!`。
r
恭喜你，服务器已经正常工作。你可以选择任意你喜欢的 Matrix 客户端 (比如：[Element](https://app.element.io/), [Cinny](https://app.cinny.in/), [Robrix](https://github.com/project-robius/robrix)) 连接当前服务器。

你可以从 Matrix 网站找到更多的[客户端列表](https://matrix.org/ecosystem/clients/)。


## 直接使用镜像

如果你想直接从 Palpo 的 OCI 镜像运行 Palpo, 可在以下注册表中找到。

| 注册表 | 镜像 | 大小 | 备注 |
|---|---|---|---|
| GitHub Registry | [ghcr.io/palpo-im/palpo:latest][gh] | ![Image Size][shield-latest] | 稳定的最新标记镜像。 |
| Docker Hub | [docker.io/ghcr.io/palpo-im/palpo:latest][dh] | ![Image Size][shield-latest] | 稳定的最新标记镜像。 |

[dh]: https://hub.docker.com/r/chrislearn/palpo
[gh]: https://github.com/palpo-im/palpo/pkgs/container/palpo
[shield-latest]: https://img.shields.io/docker/image-size/chrislearn/palpo/latest

拥有镜像后，您只需运行以下命令即可：

```bash
docker run -d -p 8448:8448 -p 8008:8008 \
    - palpo.toml:/var/palpo/palpo.toml \
    -v data/media:/var/palpo/media \
    --name palpo
```

或者您可以使用 `docker compose`。

`-d` 标志让容器在分离模式下运行。您可以提供一个可选的 `palpo.toml` 配置文件，示例配置可以在 [这里](../palpo.toml) 找到。

如果您只想短期测试 palpo，可以使用 `--rm` 标志，它会在您停止容器后清理所有与容器相关的内容。


## 语音通信

请参阅 [TURN](../configuration/turn.md) 页面。


[palpo_toml]: https://github.com/palpo-im/palpo/blob/main/deploy/docker/palpo.toml