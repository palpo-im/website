# 使用 Docker 部署

## Docker

要使用 Docker 运行 palpo，您可以自己构建镜像或从注册表拉取。

### 使用注册表

palpo 的 OCI 镜像可在以下注册表中找到。

| 注册表 | 镜像 | 大小 | 备注 |
|---|---|---|---|
| GitHub Registry | [ghcr.io/matrix-construct/palpo:latest][gh] | ![Image Size][shield-latest] | 稳定的最新标记镜像。 |
| Docker Hub | [docker.io/jevolk/palpo:latest][dh] | ![Image Size][shield-latest] | 稳定的最新标记镜像。 |
| GitHub Registry | [ghcr.io/matrix-construct/palpo:main][gh] | ![Image Size][shield-main] | 稳定的主分支。 |
| Docker Hub | [docker.io/jevolk/palpo:main][dh] | ![Image Size][shield-main] | 稳定的主分支。 |

[dh]: https://hub.docker.com/r/jevolk/palpo
[gh]: https://github.com/matrix-construct/palpo/pkgs/container/palpo
[shield-latest]: https://img.shields.io/docker/image-size/jevolk/palpo/latest
[shield-main]: https://img.shields.io/docker/image-size/jevolk/palpo/main

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

### Nix 构建

palpo 的 Nix 镜像使用 [`buildLayeredImage`][nix-buildlayeredimage] 构建。这确保了所有 OCI 镜像都是可重复和可重现的，保持镜像轻量级，并且可以离线构建。

这也确保了我们镜像的可移植性，因为 `buildLayeredImage` 构建的是 OCI 镜像，而不是 Docker 镜像，并且适用于其他容器软件。

OCI 镜像不带操作系统，只有一个非常小的环境，包括 `tini` init 系统、CA 证书和 palpo 二进制文件。这意味着没有 shell，但理论上您可以通过向分层镜像添加必要的层来获得 shell。但是，您不太可能需要 shell 来进行任何真正的故障排除。

OCI 镜像定义的 flake 文件位于 [`nix/pkgs/oci-image/default.nix`][oci-image-def]。

要使用 Nix 构建 OCI 镜像，可以构建以下输出：
- `nix build -L .#oci-image`（默认功能，x86_64 glibc）
- `nix build -L .#oci-image-x86_64-linux-musl`（默认功能，x86_64 musl）
- `nix build -L .#oci-image-aarch64-linux-musl`（默认功能，aarch64 musl）
- `nix build -L .#oci-image-x86_64-linux-musl-all-features`（所有功能，x86_64 musl）
- `nix build -L .#oci-image-aarch64-linux-musl-all-features`（所有功能，aarch64 musl）

### 使用 Traefik 作为代理

作为容器用户，您可能了解 Traefik。它是一个易于使用的反向代理，用于通过 Web 提供容器化应用程序和服务。通过提供的两个文件，[`docker-compose.for-traefik.yml`](docker-compose.for-traefik.yml)（或 [`docker-compose.with-traefik.yml`](docker-compose.with-traefik.yml)）和 [`docker-compose.override.yml`](docker-compose.override.yml)，部署和使用 palpo 同样容易，但有一个小小的注意事项。如果您已经查看了这些文件，那么您应该已经看到了 `well-known` 服务，这就是这个小小的注意事项。Traefik 只是一个代理和负载均衡器，无法提供任何类型的内容，但为了 palpo 进行联邦，我们需要暴露端口 `443` 和 `8448`，或者提供两个端点 `.well-known/matrix/client` 和 `.well-known/matrix/server`。

通过 `well-known` 服务，我们使用单个 `nginx` 容器来提供这两个文件。

## 语音通信

请参阅 [TURN](../turn.md) 页面。

[nix-buildlayeredimage]: https://ryantm.github.io/nixpkgs/builders/images/dockertools/#ssec-pkgs-dockerTools-buildLayeredImage
[oci-image-def]: https://github.com/jevolk/palpo/blob/main/nix/pkgs/oci-image/default.nix