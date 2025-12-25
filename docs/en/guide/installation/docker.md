# Deploying with Docker

Docker simplifies the installation of Palpo, and using Docker for deployment is recommended. If Docker is not yet installed on your computer, you can download the appropriate installation files for your system from the [Docker](https://www.docker.com/) website.

## Using Pre-configured Templates

First, download the [palpo.toml][palpo_toml] configuration file. This file contains only essential configuration items, so ensure you modify it with the correct values before starting the server.

Next, download the Docker Compose configuration files below as needed and place them in the same directory.

- [compose.yml](https://github.com/palpo-im/palpo/blob/main/deploy/docker/compose.yml)

    This configuration includes only the PostgreSQL database and the Palpo server program. You need to modify the `POSTGRES_PASSWORD` in the configuration before starting.

- [compose.with-caddy.yml](https://github.com/palpo-im/palpo/blob/main/deploy/docker/compose.with-caddy.yml)

    If you want an out-of-the-box `caddy-docker-proxy` setup, use this configuration. It adds [Caddy](https://caddyserver.com/) as a reverse proxy server. Replace all `example.com` placeholders with your own domain name before use.
    You also need to create a `caddy` network before starting:

    ```bash
    docker network create caddy
    ```

- [compose.with-traefik.yml](https://github.com/palpo-im/palpo/blob/main/deploy/docker/compose.with-traefik.yml)

    If you do not have a `traefik` instance set up, use this configuration. It adds [Traefik](https://traefik.io/) as a reverse proxy server.

- [compose.for-traefik.yml](https://github.com/palpo-im/palpo/blob/main/deploy/docker/compose.for-traefik.yml)

    If you already have a `traefik` instance set up, use this configuration. It adds an existing [Traefik](https://traefik.io/) as a reverse proxy server.

> **Note:** Do not forget to modify and adjust the `compose.yml` and `palpo.toml` files according to your needs.

Rename the downloaded `compose.*.yml` file to `compose.yml`, then run the following command to start the server:

```bash
docker compose up -d
```

Open your browser and enter the service address you configured. If everything is set up correctly, the page will display: `Hello Palpo!`.

Congratulations, the server is now operational. You can choose any Matrix client you prefer (e.g., [Element](https://app.element.io/), [Cinny](https://app.cinny.in/), [Robrix](https://github.com/project-robius/robrix)) to connect to the current server.

You can find more [client lists](https://matrix.org/ecosystem/clients/) on the Matrix website.

## Using the Image Directly

If you want to run Palpo directly from its OCI image, you can find it in the following registries.

| Registry | Image | Size | Remarks |
|---|---|---|---|
| GitHub Registry | [ghcr.io/palpo-im/palpo:latest][gh] | ![Image Size][shield-latest] | Stable latest tagged image. |
| Docker Hub | [docker.io/ghcr.io/palpo-im/palpo:latest][dh] | ![Image Size][shield-latest] | Stable latest tagged image. |

[dh]: https://hub.docker.com/r/chrislearn/palpo
[gh]: https://github.com/palpo-im/palpo/pkgs/container/palpo
[shield-latest]: https://img.shields.io/docker/image-size/chrislearn/palpo/latest

Once you have the image, you can run it with the following command:

```bash
docker run -d -p 8448:8448 -p 8008:8008 \
    -v palpo.toml:/var/palpo/palpo.toml \
    -v data/media:/var/palpo/media \
    --name palpo
```

Alternatively, you can use `docker compose`.

The `-d` flag runs the container in detached mode. You can provide an optional `palpo.toml` configuration file, and an example configuration can be found [here](../palpo.toml).

If you only want to test Palpo temporarily, you can use the `--rm` flag, which will clean up all container-related content after you stop the container.

## Voice Communication

Please refer to the [TURN](../configuration/turn.md) page.

[palpo_toml]: https://github.com/palpo-im/palpo/blob/main/deploy/docker/palpo.toml
{/* 本行由工具自动生成,原文哈希值:b48982693fe7e2bd34c70561dc7fc75f */}