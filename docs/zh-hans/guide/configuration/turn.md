# 使用 TURN 服务器

# 概述

本文档介绍如何在 homeserver 上启用 VoIP 中继（TURN）。

palpo Matrix homeserver 支持通过 [TURN server REST API](<https://tools.ietf.org/html/draft-uberti-behave-turn-rest-00>) 集成 TURN 服务器。这允许 homeserver 通过与 TURN 服务器共享的密钥生成可用的 TURN 服务器凭据。

本文档以 coturn 服务器为例进行配置说明。

## 前置条件

要使 TURN 中继正常工作，TURN 服务必须部署在具有公网 IP 的服务器/端点上。

如果 TURN 部署在 NAT 后面，则需要端口转发，并且 NAT 网关必须有公网 IP。即使配置正确，NAT 也可能导致问题，通常并不推荐。

之后，homeserver 还需要进一步配置。

## 配置 Palpo

你的 homeserver 配置文件有 `[turn]` 部分用于 TURN 服务器配置。

例如，以下是 `matrix.org` 的相关配置片段。`turn_uris` 适用于监听默认端口、无 TLS 的 TURN 服务器。

```toml
[turn]
secret = "n0t4ctuAllymatr1Xd0TorgSshar3d5ecret4obvIousreAsons"
ttl = 86400
allow_guests = true
uris = ["turn:turn.matrix.org?transport=udp", "turn:turn.matrix.org?transport=tcp"]
```

更新 homeserver 配置后，需重启 palpo：

- 如果你用 synctl：
  ```sh
  synctl restart
  ```
- 如果你用 systemd：
  ```sh
  systemctl restart matrix-palpo.service
  ```
- 如果你用 docker compose：
  ```sh
  docker compose restart
  ```

然后重载客户端（或等待一小时自动刷新设置）。

## 安装与配置 Coturn

coturn 是免费开源的 TURN/STUN 服务器实现。TURN 服务器是 VoIP 媒体流量 NAT 穿透服务器和网关。

### 初始安装

TURN 守护进程 `coturn` 可通过多种方式安装，如包管理器或源码编译。

#### Debian/Ubuntu

直接安装 debian 包：

```sh
sudo apt install coturn
```

这会安装并启动名为 `coturn` 的 systemd 服务。

#### 源码安装

1. 从 [github 最新发布页](https://github.com/coturn/coturn/releases/latest) 下载源码，解压并进入目录。
2. 配置编译：

    ```sh
    ./configure
    ```

    如需 `libevent2`，请按系统推荐方式安装。数据库支持可忽略。

3. 编译并安装：

    ```sh
    make
    sudo make install
    ```

#### Docker compose 安装

创建 `compose.yml` 文件，添加 coturn 配置：

```yaml
coturn:
  image: coturn/coturn
  network_mode: "host"
```

然后运行：

```bash
docker compose up -d
```

更多安装细节见 [官方文档](https://github.com/coturn/coturn/blob/master/docker/coturn/README.md)。

### 配置

1. 编辑 `/etc/turnserver.conf`，主要配置如下：

    ```
    use-auth-secret
    static-auth-secret=[你的密钥]
    realm=turn.myserver.org
    ```

    `static-auth-secret` 可用 `pwgen` 生成：

    ```sh
    pwgen -s 64 1
    ```

    `realm` 必须指定，通常设为你的服务器名。

2. 建议配置 coturn 日志输出到 syslog：

    ```sh
    syslog
    ```

    或配置为写入日志文件，详见 coturn 示例配置。

3. 安全建议，最小配置如下：

    ```
    no-tcp-relay
    denied-peer-ip=10.0.0.0-10.255.255.255
    denied-peer-ip=192.168.0.0-192.168.255.255
    denied-peer-ip=172.16.0.0-172.31.255.255
    no-multicast-peers
    denied-peer-ip=0.0.0.0-0.255.255.255
    denied-peer-ip=100.64.0.0-100.127.255.255
    denied-peer-ip=127.0.0.0-127.255.255.255
    denied-peer-ip=169.254.0.0-169.254.255.255
    denied-peer-ip=192.0.0.0-192.0.0.255
    denied-peer-ip=192.0.2.0-192.0.2.255
    denied-peer-ip=192.88.99.0-192.88.99.255
    denied-peer-ip=198.18.0.0-198.19.255.255
    denied-peer-ip=198.51.100.0-198.51.100.255
    denied-peer-ip=203.0.113.0-203.0.113.255
    denied-peer-ip=240.0.0.0-255.255.255.255
    allowed-peer-ip=10.0.0.1
    user-quota=12
    total-quota=1200
    ```

4. 如需支持 TLS/DTLS，添加如下配置：

    ```
    cert=/path/to/fullchain.pem
    pkey=/path/to/privkey.pem
    #no-tls
    #no-dtls
    ```

    若使用 Let's Encrypt 证书，Element Android/iOS 可能不支持，建议用 ZeroSSL。

5. 防火墙需放行 TURN 端口（默认 3478、5349，UDP relay 49152-65535）。

6. 若 TURN 在 NAT 后，需配置 `external-ip`：

    ```
    external-ip=公网IP
    ```

    可选：限制监听本地 IP：

    ```
    listening-ip=内网IP
    ```

    支持 IPv6 时，分别配置 IPv4/IPv6。

7. 重启 turn 服务器：

    - Debian 包或 systemd：

      ```sh
      sudo systemctl restart coturn
      ```

    - 源码安装：

      ```sh
      /usr/local/bin/turnserver -o
      ```

## 故障排查

常见症状：不同网络间通话卡在“正在连接”。排查建议：

- 检查防火墙是否放行 TURN 端口（3478、5349，UDP relay 49152-65535）。
- 尝试仅启用非加密 TCP/UDP 监听（WebRTC 媒体流始终加密）。
- 某些 WebRTC 实现（如 Chrome）对 IPv6 支持不佳，可移除 AAAA 记录，仅用 IPv4。
- NAT 情况下，确保端口转发和 external-ip 配置正确。
- 启用 coturn 日志 `verbose`，或 eturnal 的 debug 日志。
- 浏览器端可用 `chrome://webrtc-internals/` 或 Firefox 的 about:webrtc 查看连接日志。
- 可用 <https://test.voip.librepush.net/> 测试 Matrix TURN 配置，或用 <https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/> 测试 TURN 服务器。
- 生成测试用用户名/密码可用如下 shell 命令：

    ```sh
    secret=staticAuthSecretHere
    u=$((`date +%s` + 3600)):test
    p=$(echo -n $u | openssl dgst -hmac $secret -sha1 -binary | base64)
    echo -e "username: $u\npassword: $p"
    ```

- 临时配置 coturn 静态用户名/密码：

    ```
    lt-cred-mech
    user=username:password
    ```

    修改配置后需重启 coturn，测试完请恢复原配置。

如 TURN 配置正确，测试结果应至少有一个 `relay` 条目。
