# 快速开始

如果你第一次部署 Palpo，可以按照下面的步骤在几分钟内获得一个可用的 Matrix 服务器。本指南会引用其余文档中的章节，便于你在需要的时候深入了解具体细节。

## 必备条件

- 一台 64 位的 Linux、macOS 或 Windows 服务器，建议至少 2 vCPU / 4 GB RAM。
- PostgreSQL 14 及以上版本。安装方法见 [PostgreSQL 指南](./installation/postgres.md)。
- 一个可被公网访问的域名，以及可选的反向代理（Caddy、Traefik、Nginx 等）。
- 已安装 Docker（推荐）或可以运行 Palpo 可执行文件的 shell 环境。

## 1. 初始化数据库

1. 根据你的平台安装 PostgreSQL，参考 [安装章节](./installation/index.md) 中的系统指南。
2. 创建 palpo 专用的数据库用户与数据库：

   ```bash
   sudo -u postgres psql <<'SQL'
   CREATE USER palpo WITH PASSWORD 'change_me';
   CREATE DATABASE palpo OWNER palpo;
   SQL
   ```

   将 `change_me` 替换为强密码。如果你使用官方 Docker Compose 模板，可以在 Compose 文件中直接通过环境变量完成这一步。

## 2. 选择部署方式

### Docker Compose（推荐）

1. 下载示例配置 [`palpo.toml`](https://github.com/palpo-im/palpo/blob/main/deploy/docker/palpo.toml)。
2. 根据需要选择一个 [Compose 模板](https://github.com/palpo-im/palpo/tree/main/deploy/docker)（基础版、Caddy、Traefik 等），将 `compose.*.yml` 重命名为 `compose.yml`。
3. 修改 `POSTGRES_PASSWORD`、域名等占位符，并在需要时创建代理使用的 Docker 网络。
4. 启动服务：

   ```bash
   docker compose up -d
   ```

更多细节请参考 [Docker 部署](./installation/docker.md)。

### 直接运行二进制

1. 从 [GitHub Releases](https://github.com/palpo-im/palpo/releases) 下载与你系统匹配的压缩包。
2. 解压后复制示例配置并编辑：

   ```bash
   cp palpo-example.toml palpo.toml
   ```

3. 按照系统指南（[Linux](./installation/linux.md)、[macOS](./installation/macos.md)、[Windows](./installation/windows.md)）完成依赖安装与 systemd/launchd/服务配置。

## 3. 初始化配置

打开 `palpo.toml`，至少完成以下设置：

- `server_name`：设置为你的主域名，例如 `example.com`。
- `[db].url`：填写正确的 PostgreSQL 连接串，例如 `postgresql://palpo:change_me@localhost:5432/palpo`。
- `listen` 段落：确认 8008/8448 端口和 `x_forwarded`、`bind_addresses` 等符合你的部署拓扑。

更多可选项（注册策略、媒体目录、反向代理、TURN 等）详见 [配置章节](./configuration/index.md)。

## 4. 启动 Palpo

- Docker：运行 `docker compose up -d` 或在修改配置后执行 `docker compose restart palpo`。
- 本地二进制：在 Palpo 可执行文件所在目录运行：

  ```bash
  ./palpo --config palpo.toml
  ```

日志中看到 `Server started` 表示服务已经监听在 8008/8448 端口。

## 5. 验证与下一步

1. 访问 `https://your.domain/_matrix/client/versions`，应返回包含 `palpo` 的 JSON，或直接访问 `https://your.domain` 确认看到 “Hello Palpo!”。
2. 使用支持注册令牌的客户端（例如 Element Web）连接你的服务器，创建首个管理员帐户。
3. 在 `#admins` 房间或通过 `palpo --console` 执行管理命令，生成更多注册令牌或管理房间，详见 [管理指南](./administration/index.md)。

完成基础部署后，建议继续：

- 为生产环境配置 [反向代理与委托](./configuration/delegation.md)。
- 配置 [TURN 服务](./configuration/turn.md) 以启用语音通话。
- 浏览 [开发章节](./development/index.md) 了解如何参与贡献。

现在你已经拥有一台可用的 Palpo 服务器，可以开始邀请用户进行通信了。
