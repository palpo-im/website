# Palpo Troubleshooting

> ## Docker Users ⚠️
>
> Docker provides a very poor user experience. Therefore, a large number of issues or support requests are actually Docker support, not palpo support. We also cannot document the ever-growing list of Docker issues here.
>
> If you intend to seek support and are using Docker, **please** double and triple-check that your issue is **not** due to a misconfiguration of your Docker setup.
>
> If there is something like a Compose file issue or a Dockerhub image issue, it's still okay to mention it, as long as it's something we can fix.

## Palpo and Matrix Issues

#### Lost Access to the Admin Room

You can re-invite yourself to the admin room by:
- Using the Palpo binary argument `--execute "users make_user_admin <username>"` at startup to invite yourself to the admin room once
- Using the Palpo console/CLI to run the `users make_user_admin` command
- Or specifying the `emergency_password` configuration option, which allows you to temporarily log into the server account (`@palpo`) from the web client

## General Potential Issues

#### Potential DNS Issues When Using Docker

Docker's default DNS settings have issues that can cause DNS to not work properly when running Palpo, leading to federation problems. Symptoms include excessively long room join times (30+ minutes) due to DNS timeouts, "mismatched response nameserver" log entries, and/or partial or incomplete inbound/outbound federation.

This is **not** a Palpo issue; it is purely a Docker issue. It is not suitable for the heavy DNS activity required by Matrix federation. Solutions are:
- Use DNS over TCP via the configuration option `query_over_tcp_only = true`
- Instead of using Docker's default DNS settings, allow the container to use and communicate with the host's DNS servers (the host's `/etc/resolv.conf`)

#### DNS No Available Connections Error Messages

If you receive many "DNS no available connections" error logs, this is because your DNS servers (the servers in `/etc/resolv.conf`) are overloaded and cannot handle typical Matrix federation traffic. Some users report that upstream servers also rate-limit them when they receive this error (e.g., popular upstreams like Google DNS).

Matrix federation is very heavy and sends a large number of DNS requests. Unfortunately, this is by design and gets worse with more servers/target resolution steps. Synapse also expects a very perfect DNS setup.

There are ways to reduce the number of DNS queries, but ultimately the best solution is to self-host a high-quality caching DNS server like [Unbound][unbound-arch] without any upstream resolvers and without DNSSEC validation enabled.

It is highly recommended to **disable** DNSSEC validation because DNSSEC is very computationally expensive and extremely susceptible to denial-of-service attacks, especially on Matrix. Many servers also oddly have broken DNSSEC setups, which will cause federation to break.

Palpo cannot provide a "works for everyone" guide for Unbound DNS settings, but the [official Unbound tuning guide][unbound-tuning] and the [Unbound Arch Linux wiki page][unbound-arch] may help. Disabling DNSSEC on Unbound is commenting out the trust-anchors configuration option and removing the `validator` module.

**Avoid** using `systemd-resolved` as it performs poorly under high load, and we have found its DNS caching to be ineffective.

dnsmasq may work, but it does **not** support TCP fallback, which can be problematic when receiving large DNS responses (e.g., large SRV records). If you still want to use dnsmasq, make sure to **disable** `dns_tcp_fallback` in the Palpo configuration.

Increasing the default value of `dns_cache_entries` in the Palpo configuration can also help with DNS caching, but a fully-featured external caching resolver is better and more reliable.

If you do not have IPv6 connectivity, changing `ip_lookup_strategy` to match your setup can help reduce unnecessary AAAA queries (`1 - Ipv4Only (query only A records, not AAAA/IPv6)`).

If your DNS server supports it, some users report that enabling `query_over_tcp_only` to force TCP-only queries by default improves DNS reliability, albeit with a slight performance penalty due to TCP overhead.

## Debugging

Please note that users shouldn't really be debugging things. If you find yourself debugging and find an issue, please tell us and how we can fix it. Various debug commands can be found in `!admin debug`.

#### Debug/Trace Log Levels

Palpo is built by default at compile time without debug or trace log levels to significantly improve CPU usage and reduce compile times. If you need access to debug/trace log levels, you will need to build without the `release_max_log_level` feature or use our provided static debug binaries.

#### Dynamically Changing Log Levels

Palpo supports dynamically changing the trace log environment filter using the admin command `!admin debug change-log-level <log env filter>`. This accepts a **quotation-less** string in the same format as the `log` configuration option.

Example: `!admin debug change-log-level debug`

This can also accept complex filters, such as:
`!admin debug change-log-level info,palpo_service[{dest="example.com"}]=trace,ruma_state_res=trace`
`!admin debug change-log-level info,palpo_service[send{dest="example.org"}]=trace`

To reset the log level to what was set at startup/last configuration load, simply pass the `--reset` flag.

`!admin debug change-log-level --reset`

#### Ping Server

Palpo can ping other servers using `!admin debug ping <server>`. This takes a server name and queries `/_matrix/federation/v1/version` via the server discovery process. Errors are output. While it does measure the latency of the request, it cannot indicate server performance on either side because that endpoint is completely unauthenticated and simply fetches a string on a static JSON endpoint. It is very low bandwidth and computationally cheap.

#### Allocator Memory Statistics

When using jemalloc with jemallocator's `stats` feature (`--enable-stats`), you can view Palpo's high-level allocator statistics at the bottom using `!admin server memory-usage`.

If you are a developer, you can also view raw jemalloc statistics using `!admin debug memory-stats`. Note that this output is very large and may only be visible in the Palpo console CLI due to PDU size limits, and is not easily understandable by non-developers.

[unbound-tuning]: https://unbound.docs.nlnetlabs.nl/en/latest/topics/core/performance.html
[unbound-arch]: https://wiki.archlinux.org/title/Unbound
{/* 本行由工具自动生成,原文哈希值:f0be5996cc979e76fd663432148eacf1 */}