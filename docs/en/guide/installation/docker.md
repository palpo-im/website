# Installing with Docker

Docker simplifies Palpo installation and is recommended. If you don't have Docker installed on your computer, you can download the installation file for your system from the [Docker](https://www.docker.com/) website.

## Using a Prefab Configuration Template

First, download the [palpo.toml][palpo_toml] configuration files. [palpo.toml][palpo_toml] only contains the necessary configuration items. Please make sure to modify them to the correct values before starting the server.

Then, download the following Docker Compose configuration files as needed and place them in the same folder.

- [compose.yml](https://github.com/palpo-im/palpo/blob/main/deploy/docker/compose.yml)

This only configures the Postgres database and the Palpo server. You will need to modify `POSTGRES_PASSWORD` in the configuration file before starting the server.

- [compose.with-caddy.yml](https://github.com/palpo-im/palpo/blob/main/deploy/docker/compose.with-caddy.yml)

If you want an out-of-the-box `caddy-docker-proxy` setup, use this configuration. This adds [Caddy](https://caddyserver.com/) as a reverse proxy server. Replace all `example.com` placeholders with your own domain name.
You will also need to create the `caddy` network before starting:

```bash
docker network create caddy
```

- [compose.with-traefik.yml](https://github.com/palpo-im/palpo/blob/main/deploy/docker/compose.with-traefik.yml)

If you don't have a `traefik` instance set up, use this configuration. This adds [Traefik](https://traefik.io/) as a reverse proxy server.

- [compose.for-traefik.yml](https://github.com/palpo-im/palpo/blob/main/deploy/docker/compose.for-traefik.yml)

If you already have a Traefik instance set up, use this configuration. This configuration adds the use of the existing Traefik instance as a reverse proxy server.

> **Note:** Don't forget to modify and adjust the `compose.yml` and `palpo.toml` files according to your needs.

Rename the downloaded compose.*.yml file to compose.yml and run the following command to start the server:

```bash
docker compose up -d
```

Open a browser and enter the service address you set. If everything is set up correctly, the page "Hello Palpo!" should display.


Congratulations, your server is now working. You can use any Matrix client of your choice (e.g., [Element](https://app.element.io/), [Cinny](https://app.cinny.in/), [Robrix](https://github.com/project-robius/robrix)) to connect to the current server.

You can find a list of more clients on the Matrix website.

## Using an Image Directly

If you want to run Palpo directly from its OCI image, you can find it in the following registry.

| Registry | Image | Size | Notes |
|---|---|---|---|
| GitHub Registry | [ghcr.io/palpo-im/palpo:latest][gh] | ![Image Size][shield-latest] | Stable, latest tagged image. |
| Docker Hub | [docker.io/ghcr.io/palpo-im/palpo:latest][dh] | ![Image Size][shield-latest] | Stable, latest tagged image. |

[dh]: https://hub.docker.com/r/chrislearn/palpo
[gh]: https://github.com/palpo-im/palpo/pkgs/container/palpo
[shield-latest]: https://img.shields.io/docker/image-size/chrislearn/palpo/latest

Once you have the image, you can simply run the following command:

```bash
docker run -d -p 8448:8448 -p 8008:8008 \
- palpo.toml:/var/palpo/palpo.toml \
-v data/media:/var/palpo/media \
--name palpo
```

Or you can use `docker compose`.

The `-d` flag runs the container in detached mode. You can provide an optional `palpo.toml` configuration file; a sample configuration can be found [here](../palpo.toml).

If you only want to test Palpo briefly, you can use the `--rm` flag, which will clean up all container-related content after you stop it.

## Voice Communication

See the [TURN](../configuration/turn.md) page.

[palpo_toml]: https://github.com/palpo-im/palpo/blob/main/deploy/docker/palpo.toml