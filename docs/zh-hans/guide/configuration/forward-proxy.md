# 使用正向/出站代理

你可以让 Palpo 配合正向代理或出站代理一起使用。在企业内网（如 DMZ，非军事区）等场景下通常需要这样做。
Palpo 支持通过代理路由出站 HTTP(S) 请求。仅支持 HTTP(S) 代理，不支持 SOCKS 代理或其他类型。

## 配置方法

可以通过环境变量 `http_proxy`、`https_proxy`、`no_proxy` 来指定代理设置。环境变量名不区分大小写。
- `http_proxy`：用于 HTTP 请求的代理服务器。
- `https_proxy`：用于 HTTPS 请求的代理服务器。
- `no_proxy`：不走代理的主机、IP 或 CIDR 格式的 IP 段（逗号分隔）。Palpo 会直接连接这些主机。

`http_proxy` 和 `https_proxy` 的格式为：`[scheme://][<用户名>:<密码>@]<主机>[:<端口>]`
- 支持的 scheme 有 `http://` 和 `https://`。默认 scheme 是 `http://`（为兼容性考虑），建议明确指定 scheme。如果 scheme 为 `https://`，Palpo 与代理之间的连接将使用 TLS。

  **注意**：Palpo 会校验证书。如果证书无效，连接会被拒绝。
- 默认端口为 `1080`（如果未指定）。
- 用户名和密码可选，用于代理认证。

**示例**
- HTTP_PROXY=http://USERNAME:PASSWORD@10.0.1.1:8080/
- HTTPS_PROXY=http://USERNAME:PASSWORD@proxy.example.com:8080/
- NO_PROXY=master.hostname.example.com,10.1.0.0/16,172.30.0.0/16

**注意**：
Palpo 不会对通过代理的连接应用 IP 黑名单（因为 DNS 解析由代理完成）。通常应由代理或防火墙负责 IP 黑名单。

## 连接类型

以下场景会**使用**代理：

- 推送（push）
- URL 预览
- 远程统计（phone-home stats）
- recaptcha 验证
- CAS 认证验证
- OpenID Connect
- 出站联邦
- 联邦（检查公钥吊销）
- 获取其他服务器的公钥
- 下载远程媒体

以下场景**不会使用**代理：

- 应用服务（Application Services）
- 身份服务器（Identity servers）
- worker 配置中的：
  - worker 之间的连接
  - worker 到 Redis 的连接

## 故障排查

如果代理服务器使用 TLS（HTTPS）且无法建立连接，通常是代理证书问题。可临时关闭 Palpo 的证书校验进行测试。

**注意**：此操作有安全风险，仅供测试！