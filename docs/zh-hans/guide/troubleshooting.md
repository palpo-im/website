# Palpo 故障排除

> ## Docker 用户 ⚠️
>
> Docker 的用户体验极差。因此，大量问题或支持实际上是 Docker 支持，而不是 palpo 支持。我们也无法在此处记录不断增长的 Docker 问题列表。
>
> 如果您打算寻求支持并且正在使用 Docker，**请**再三验证您的问题**不是**因为您的 Docker 设置配置错误。
>
> 如果存在像 Compose 文件问题或 Dockerhub 镜像问题，只要是我们能解决的，仍然可以提及。

## Palpo 和 Matrix 问题

#### 失去管理房间的访问权限

您可以通过以下方法重新邀请自己加入管理房间：
- 在启动时使用 Palpo 二进制参数 `--execute "users make_user_admin <username>"` 一次性邀请自己加入管理房间
- 使用 Palpo 控制台/CLI 运行 `users make_user_admin` 命令
- 或者指定 `emergency_password` 配置选项，允许您暂时从 Web 客户端登录服务器帐户 (`@palpo`)

## 一般潜在问题

#### 使用 Docker 时潜在的 DNS 问题

Docker 的默认 DNS 设置存在问题，可能导致运行 Palpo 时 DNS 无法正常工作，从而导致联邦问题。症状表现为 DNS 超时过长导致房间加入时间过长（30 分钟以上）、“不匹配的响应名称服务器”日志条目，和/或部分或不完全的入站/出站联邦。

这**不是** Palpo 问题，纯粹是 Docker 问题。它不适合 Matrix 联邦所需的繁重 DNS 活动。解决方法是：
- 通过配置选项 `query_over_tcp_only = true` 使用 TCP 上的 DNS
- 不要使用 Docker 的默认 DNS 设置，而是允许容器使用并与主机的 DNS 服务器通信（主机的 `/etc/resolv.conf`）

#### DNS 无可用连接错误消息

如果您收到大量“DNS 无可用连接”错误日志，这是因为您的 DNS 服务器（`/etc/resolv.conf` 中的服务器）过载，无法处理典型的 Matrix 联邦流量。一些用户报告说，当他们收到此错误时（例如流行的上游，如 Google DNS），上游服务器也会对他们进行速率限制。

Matrix 联邦非常繁重，会发送大量的 DNS 请求。不幸的是，这是设计使然，并且随着更多的服务器/目标解析步骤而变得更糟。Synapse 也期望一个非常完美的 DNS 设置。

有一些方法可以减少 DNS 查询量，但最终的最佳解决方案是自托管高质量的缓存 DNS 服务器，如 [Unbound][unbound-arch]，不带任何上游解析器，并且不启用 DNSSEC 验证。

强烈建议**禁用** DNSSEC 验证，因为 DNSSEC 的计算成本非常高，并且极易受到拒绝服务攻击，尤其是在 Matrix 上。许多服务器也奇怪地存在损坏的 DNSSEC 设置，这将导致联邦功能失效。

Palpo 无法提供“适用于所有人”的 Unbound DNS 设置指南，但 [官方 Unbound 调优指南][unbound-tuning] 和 [Unbound Arch Linux wiki 页面][unbound-arch] 可能会有所帮助。在 Unbound 上禁用 DNSSEC 是注释掉 trust-anchors 配置选项并删除 `validator` 模块。

**避免**使用 `systemd-resolved`，因为它在高负载下表现不佳，并且我们发现其 DNS 缓存效果不佳。

dnsmasq 可能有效，但它**不**支持 TCP 回退，这在接收大型 DNS 响应（例如大型 SRV 记录）时可能会出现问题。如果您仍然想使用 dnsmasq，请确保在 Palpo 配置中**禁用** `dns_tcp_fallback`。

提高 Palpo 配置中 `dns_cache_entries` 的默认值也可以帮助 DNS 缓存，但功能齐全的外部缓存解析器更好、更可靠。

如果您没有 IPv6 连接，更改 `ip_lookup_strategy` 以匹配您的设置可以帮助减少不必要的 AAAA 查询（`1 - Ipv4Only (仅查询 A 记录，不查询 AAAA/IPv6)`）。

如果您的 DNS 服务器支持，一些用户报告说启用 `query_over_tcp_only` 以强制默认仅进行 TCP 查询，这提高了 DNS 可靠性，但由于 TCP 开销，性能略有下降。


## 调试

请注意，用户不应该真正调试东西。如果您发现自己在调试并发现问题，请告诉我们以及我们如何解决它。各种调试命令可以在 `!admin debug` 中找到。

#### 调试/跟踪日志级别

Palpo 默认在编译时构建时不带调试或跟踪日志级别，以显着提高 CPU 使用率并缩短编译时间。如果您需要访问调试/跟踪日志级别，您将需要构建时不带 `release_max_log_level` 功能或使用我们提供的静态调试二进制文件。

#### 动态更改日志级别

Palpo 支持使用管理命令 `!admin debug change-log-level <log env filter>` 动态更改跟踪日志环境过滤器。这接受一个**不带引号**的字符串，其格式与 `log` 配置选项相同。

示例：`!admin debug change-log-level debug`

这也可以接受复杂的过滤器，例如：
`!admin debug change-log-level info,palpo_service[{dest="example.com"}]=trace,ruma_state_res=trace`
`!admin debug change-log-level info,palpo_service[send{dest="example.org"}]=trace`

要将日志级别重置为启动时/上次配置加载时设置的级别，只需传递 `--reset` 标志。

`!admin debug change-log-level --reset`

#### Ping 服务器

Palpo 可以使用 `!admin debug ping <server>` ping 其他服务器。这需要一个服务器名称，并通过服务器发现过程查询 `/_matrix/federation/v1/version`。错误会输出。虽然它确实测量了请求的延迟，但它不能指示任何一方的服务器性能，因为该端点是完全未经身份验证的，并且只是在静态 JSON 端点上获取一个字符串。它的带宽和计算成本都非常低。

#### 分配器内存统计

当使用 jemallocator 的 `stats` 功能（`--enable-stats`）使用 jemalloc 时，您可以使用 `!admin server memory-usage` 在底部查看 Palpo 的高级分配器统计信息。

如果您是开发人员，您还可以使用 `!admin debug memory-stats` 查看原始 jemalloc 统计信息。请注意，此输出非常大，可能只能在 Palpo 控制台 CLI 中可见，因为 PDU 大小限制，并且非开发人员不容易理解。

[unbound-tuning]: https://unbound.docs.nlnetlabs.nl/en/latest/topics/core/performance.html
[unbound-arch]: https://wiki.archlinux.org/title/Unbound