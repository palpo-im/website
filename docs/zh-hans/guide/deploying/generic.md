# 通用部署文档

> ### 获取帮助
>
> 如果您在设置 Palpo 时遇到任何问题，请 [在 GitHub 上提交问题](https://github.com/palpo-im/palpo/issues/new)。

## 安装 Palpo

### 预构建的静态二进制文件

您可以直接下载适合您机器架构（x86_64 或 aarch64）的二进制文件。运行 `uname -m` 查看您需要什么。

预构建的完全静态 musl 二进制文件可以从最新标记的 [发布版本](https://github.com/palpo-im/palpo/releases/latest) 或 `main` CI 分支工作流 artifact 输出中下载。这些还包括 Debian/Ubuntu 包。

这些可以直接通过 curl 下载。`ci-bins` 是通过提交哈希/修订的 CI 工作流二进制文件，`releases` 是标记的发布版本。按上次修改时间降序排序以获取最新版本。

这些二进制文件静态链接并包含了 jemalloc 和 io_uring，因此无需安装额外的动态依赖项。

### 编译

TODO

## 添加 Palpo 用户

虽然 Palpo 可以以任何用户身份运行，但最好为不同的服务使用专用用户。这还可以确保文件权限设置正确。

在 Debian 中，您可以使用此命令创建 Palpo 用户：

```bash
sudo adduser --system palpo --group --disabled-login --no-create-home
```

对于没有 `adduser`（或它是 `useradd` 的符号链接）的发行版：

```bash
sudo useradd -r --shell /usr/bin/nologin --no-create-home palpo
```

## 在防火墙或路由器中转发端口

Matrix 的默认联邦端口是 8448，客户端必须使用 443 端口。如果您只想使用 443 端口，或者使用不同的端口，则需要设置委托。Palpo 有用于委托的配置选项，或者您可以配置您的反向代理以手动提供必要的 JSON 文件以进行委托（请参阅 `[global.well_known]` 配置部分）。

如果 Palpo 运行在路由器后面或容器中，并且具有与主机系统不同的公共 IP 地址，则这些公共端口需要直接或间接转发到配置中提到的端口。

NAT 用户请注意；如果您无法从网络内部连接到您的服务器，您需要研究您的路由器，看看它是否支持“NAT hairpinning”或“NAT loopback”。

如果您的路由器不支持此功能，您需要研究进行本地 DNS 覆盖，并强制您的 Matrix DNS 记录在内部使用您的本地 IP。这可以在主机级别使用 `/etc/hosts` 完成。如果您需要在网络级别进行此操作，请考虑使用 NextDNS 或 Pi-Hole 等。

## 设置 systemd 服务

Palpo 的两个 systemd 单元示例可以在 [配置页面](../configuration/examples.md#debian-systemd-unit-file) 上找到。如果 Palpo 二进制文件不在 `/usr/bin/palpo`，您可能需要更改 `ExecStart=` 路径。

在 rsyslog 与 journald 一起使用的系统上（即基于 Red Hat 的发行版和 OpenSUSE），将 `$EscapeControlCharactersOnReceive off` 放入 `/etc/rsyslog.conf` 中，以允许日志中的颜色。

如果您使用与 systemd 单元配置的默认值 `/var/lib/palpo` 不同的 `database_path`，则需要将您的路径添加到 systemd 单元的 `ReadWritePaths=` 中。这可以通过直接编辑 `palpo.service` 并重新加载 systemd，或者运行 `systemctl edit palpo.service` 并输入以下内容来完成：

```
[Service]
ReadWritePaths=/path/to/custom/database/path
```

## 创建 Palpo 配置文件

现在我们需要在 `/etc/palpo/palpo.toml` 中创建 Palpo 的配置文件。示例配置可以在 [palpo-example.toml](../configuration/examples.md) 中找到。

**请花点时间阅读配置。您至少需要更改服务器名称。**

PostgresDB 是唯一支持的数据库后端。

## 设置正确的文件权限

如果您为 Palpo 使用专用用户，则需要允许它读取配置。为此，您可以运行以下命令：

```bash
sudo chown -R root:root /etc/palpo
sudo chmod -R 755 /etc/palpo
```

如果您使用默认数据库路径，您还需要运行以下命令：

```bash
sudo mkdir -p /var/lib/palpo/
sudo chown -R palpo:palpo /var/lib/palpo/
sudo chmod 700 /var/lib/palpo/
```

## 设置反向代理

我们推荐 Caddy 作为反向代理，因为它使用起来非常简单，可以透明地处理 TLS 证书、反向代理头等，并具有适当的默认值。
对于其他软件，请参阅其各自的文档或在线指南。

### Caddy

通过您喜欢的方法安装 Caddy 后，创建 `/etc/caddy/conf.d/palpo_caddyfile` 并输入以下内容（替换为您的服务器名称）。

```caddyfile
your.server.name, your.server.name:8448 {
    # TCP 反向代理
    reverse_proxy 127.0.0.1:6167
    # UNIX 套接字
    #reverse_proxy unix//run/palpo/palpo.sock
}
```

就是这样！只需启动并启用服务即可。

```bash
sudo systemctl enable --now caddy
```

### 其他反向代理

由于我们更希望用户使用 Caddy，因此我们不会为其他代理提供配置文件。

您需要反向代理以下所有路由：
- `/_matrix/` - 核心 Matrix C-S 和 S-S API
- `/_palpo/` - 特设 Palpo 路由，例如 `/local_user_count` 和 `/server_version`

您可以选择反向代理以下单个路由：
- `/.well-known/matrix/client` 和 `/.well-known/matrix/server` 如果使用 Palpo 执行委托（请参阅 `[global.well_known]` 配置部分）
- `/.well-known/matrix/support` 如果使用 Palpo 发送 homeserver 管理员联系和支持页面（以前称为 MSC1929）
- `/` 如果您想在根目录看到 `hewwo from palpo woof!`

有关这些文件的更多详细信息，请参阅以下规范页面：
- [`/.well-known/matrix/server`](https://spec.matrix.org/latest/client-server-api/#getwell-knownmatrixserver)
- [`/.well-known/matrix/client`](https://spec.matrix.org/latest/client-server-api/#getwell-knownmatrixclient)
- [`/.well-known/matrix/support`](https://spec.matrix.org/latest/client-server-api/#getwell-knownmatrixsupport)

委托示例：
- <https://puppygock.gay/.well-known/matrix/server>
- <https://puppygock.gay/.well-known/matrix/client>

对于 Apache 和 Nginx，网上有很多可用示例。

不支持 Lighttpd，因为它似乎会干扰 `X-Matrix` 授权头，导致联邦功能失效。如果找到解决方法，请随时分享，以便将其添加到此处文档中。

如果使用 Apache，您需要在 `ProxyPass` 指令中使用 `nocanon` 以防止 httpd 干扰 `X-Matrix` 头（请注意，Apache 作为通用反向代理并不是很好，如果可以的话，我们不鼓励使用它）。

如果使用 Nginx，您需要使用 `$request_uri` 将请求 URI 提供给 Palpo，或者像这样：
- `proxy_pass http://127.0.0.1:6167$request_uri;`
- `proxy_pass http://127.0.0.1:6167;`

Nginx 用户需要增加 `client_max_body_size`（默认为 1M）以匹配 palpo.toml 中定义的 `max_request_size`。

## 您已完成

现在您可以使用以下命令启动 Palpo：

```bash
sudo systemctl start palpo
```

将其设置为在系统启动时自动启动：

```bash
sudo systemctl enable palpo
```

## 我怎么知道它是否有效？

您可以打开 [Matrix 客户端](https://matrix.org/ecosystem/clients)，输入您的 homeserver 并尝试注册。

您还可以使用这些命令进行快速健康检查（替换 `your.server.name`）。

```bash
curl https://your.server.name/_palpo/server_version

# 如果使用 8448 端口
curl https://your.server.name:8448/_palpo/server_version

# 如果启用了联邦
curl https://your.server.name:8448/_matrix/federation/v1/version
```

- 要检查您的服务器是否可以与其他 homeserver 通信，您可以使用 [Matrix Federation Tester](https://federationtester.matrix.org/)。如果您可以注册但无法加入联邦房间，请再次检查您的配置，并检查 8448 端口是否打开并正确转发。

# 接下来是什么？

## 音频/视频通话

有关音频/视频通话功能，请参阅 [TURN 指南](../turn.md)。

## 应用服务

如果您想设置应用服务，请参阅 [应用服务指南](../appservices.md)。