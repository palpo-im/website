# 使用 Docker 部署

## Docker

要使用 Docker 运行 palpo，您可以自己构建镜像或从注册表拉取。

### 使用注册表

palpo 的 OCI 镜像可在以下注册表中找到。

| 注册表 | 镜像 | 大小 | 备注 |
|---|---|---|---|
| GitHub Registry | [ghcr.io/palpo-im/palpo:latest][gh] | ![Image Size][shield-latest] | 稳定的最新标记镜像。 |
| Docker Hub | [docker.io/chrislearn/palpo:latest][dh] | ![Image Size][shield-latest] | 稳定的最新标记镜像。 |
| GitHub Registry | [ghcr.io/palpo-im/palpo:main][gh] | ![Image Size][shield-main] | 稳定的主分支。 |
| Docker Hub | [docker.io/chrislearn/palpo:main][dh] | ![Image Size][shield-main] | 稳定的主分支。 |

[dh]: https://hub.docker.com/r/chrislearn/palpo
[gh]: https://github.com/palpo-im/palpo/pkgs/container/palpo
[shield-latest]: https://img.shields.io/docker/image-size/chrislearn/palpo/latest
[shield-main]: https://img.shields.io/docker/image-size/chrislearn/palpo/main

### 运行

拥有镜像后，您只需运行以下命令即可：

```bash
docker run -d -p 8448:6167 \
    -v db:/var/lib/palpo/ \
    -e PALPO_SERVER_NAME="your.server.name" \
    -e PALPO_ALLOW_REGISTRATION=false \
    --name palpo $LINK
```

或者您可以使用 [docker compose](#docker-compose)。

`-d` 标志让容器在分离模式下运行。您可以提供一个可选的 `palpo.toml` 配置文件，示例配置可以在 [这里](../configuration/examples.md) 找到。您可以传入不同的环境变量以动态更改配置值。您甚至可以通过使用环境变量完全配置 palpo。有关可能值的概述，请查看 [`docker-compose.yml`](docker-compose.yml) 文件。

如果您只想短期测试 palpo，可以使用 `--rm` 标志，它会在您停止容器后清理所有与容器相关的内容。

### Docker-compose

如果 `docker run` 命令不适合您或您的设置，您也可以使用提供的 `docker-compose` 文件之一。

根据您的代理设置，您可以使用以下文件之一；

- 如果您已经设置了 `traefik` 实例，请使用 [`docker-compose.for-traefik.yml`](docker-compose.for-traefik.yml)
- 如果您没有设置 `traefik` 实例并希望使用它，请使用 [`docker-compose.with-traefik.yml`](docker-compose.with-traefik.yml)
- 如果您想要一个开箱即用的 `caddy-docker-proxy` 设置，请使用 [`docker-compose.with-caddy.yml`](docker-compose.with-caddy.yml) 并将所有 `example.com` 占位符替换为您自己的域名
- 对于任何其他反向代理，请使用 [`docker-compose.yml`](docker-compose.yml)

选择与 traefik 相关的 compose 文件时，请将其重命名为 `docker-compose.yml`，并将覆盖文件重命名为 `docker-compose.override.yml`。使用您希望服务器使用的值编辑后者。

选择 `caddy-docker-proxy` compose 文件时，首先创建 `caddy` 网络非常重要，然后再启动容器：

```bash
docker network create caddy
```

之后，您可以将其重命名为 `docker-compose.yml` 并启动容器！

有关部署 palpo 的更多信息可以在 [这里](generic.md) 找到。

### 运行

如果您已经构建了镜像或想使用注册表中的镜像，您只需启动容器和 compose 文件中的所有其他内容，并以分离模式运行：

```bash
docker compose up -d
```

> **注意：** 不要忘记根据您的需求修改和调整 compose 文件。

## 语音通信

请参阅 [TURN](../turn.md) 页面。

[nix-buildlayeredimage]: https://ryantm.github.io/nixpkgs/builders/images/dockertools/#ssec-pkgs-dockerTools-buildLayeredImage
[oci-image-def]: https://github.com/chrislearn/palpo/blob/main/nix/pkgs/oci-image/default.nix