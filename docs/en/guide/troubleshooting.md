# Troubleshooting Palpo

> ## Docker users ⚠️
>
> Docker is extremely UX unfriendly. Because of this, a ton of issues or support
> is actually Docker support, not palpo support. We also cannot document the
> ever-growing list of Docker issues here.
>
> If you intend on asking for support and you are using Docker, **PLEASE**
> triple validate your issues are **NOT** because you have a misconfiguration in
> your Docker setup.
>
> If there are things like Compose file issues or Dockerhub image issues, those
> can still be mentioned as long as they're something we can fix.

## Palpo and Matrix issues

#### Lost access to admin room

You can reinvite yourself to the admin room through the following methods:
- Use the `--execute "users make_user_admin <username>"` Palpo binary
argument once to invite yourslf to the admin room on startup
- Use the Palpo console/CLI to run the `users make_user_admin` command
- Or specify the `emergency_password` config option to allow you to temporarily
log into the server account (`@palpo`) from a web client

## General potential issues

#### Potential DNS issues when using Docker

Docker has issues with its default DNS setup that may cause DNS to not be
properly functional when running Palpo, resulting in federation issues. The
symptoms of this have shown in excessively long room joins (30+ minutes) from
very long DNS timeouts, log entries of "mismatching responding nameservers",
and/or partial or non-functional inbound/outbound federation.

This is **not** a Palpo issue, and is purely a Docker issue. It is not
sustainable for heavy DNS activity which is normal for Matrix federation. The
workarounds for this are:
- Use DNS over TCP via the config option `query_over_tcp_only = true`
- Don't use Docker's default DNS setup and instead allow the container to use
and communicate with your host's DNS servers (host's `/etc/resolv.conf`)

#### DNS No connections available error message

If you receive spurious amounts of error logs saying "DNS No connections
available", this is due to your DNS server (servers from `/etc/resolv.conf`)
being overloaded and unable to handle typical Matrix federation volume. Some
users have reported that the upstream servers are rate-limiting them as well
when they get this error (e.g. popular upstreams like Google DNS).

Matrix federation is extremely heavy and sends wild amounts of DNS requests.
Unfortunately this is by design and has only gotten worse with more
server/destination resolution steps. Synapse also expects a very perfect DNS
setup.

There are some ways you can reduce the amount of DNS queries, but ultimately
the best solution/fix is selfhosting a high quality caching DNS server like
[Unbound][unbound-arch] without any upstream resolvers, and without DNSSEC
validation enabled.

DNSSEC validation is highly recommended to be **disabled** due to DNSSEC being
very computationally expensive, and is extremely susceptible to denial of
service, especially on Matrix. Many servers also strangely have broken DNSSEC
setups and will result in non-functional federation.

Palpo cannot provide a "works-for-everyone" Unbound DNS setup guide, but
the [official Unbound tuning guide][unbound-tuning] and the [Unbound Arch Linux wiki page][unbound-arch]
may be of interest. Disabling DNSSEC on Unbound is commenting out trust-anchors
config options and removing the `validator` module.

**Avoid** using `systemd-resolved` as it does **not** perform very well under
high load, and we have identified its DNS caching to not be very effective.

dnsmasq can possibly work, but it does **not** support TCP fallback which can be
problematic when receiving large DNS responses such as from large SRV records.
If you still want to use dnsmasq, make sure you **disable** `dns_tcp_fallback`
in Palpo config.

Raising `dns_cache_entries` in Palpo config from the default can also assist
in DNS caching, but a full-fledged external caching resolver is better and more
reliable.

If you don't have IPv6 connectivity, changing `ip_lookup_strategy` to match
your setup can help reduce unnecessary AAAA queries
(`1 - Ipv4Only (Only query for A records, no AAAA/IPv6)`).

If your DNS server supports it, some users have reported enabling
`query_over_tcp_only` to force only TCP querying by default has improved DNS
reliability at a slight performance cost due to TCP overhead.

## Debugging

Note that users should not really be debugging things. If you find yourself
debugging and find the issue, please let us know and/or how we can fix it.
Various debug commands can be found in `!admin debug`.

#### Debug/Trace log level

Palpo builds without debug or trace log levels at compile time by default
for substantial performance gains in CPU usage and improved compile times. If
you need to access debug/trace log levels, you will need to build without the
`release_max_log_level` feature or use our provided static debug binaries.

#### Changing log level dynamically

Palpo supports changing the tracing log environment filter on-the-fly using
the admin command `!admin debug change-log-level <log env filter>`. This accepts
a string **without quotes** the same format as the `log` config option.

Example: `!admin debug change-log-level debug`

This can also accept complex filters such as:
`!admin debug change-log-level info,palpo_service[{dest="example.com"}]=trace,ruma_state_res=trace`
`!admin debug change-log-level info,palpo_service[{dest="example.com"}]=trace,palpo_service[send{dest="example.org"}]=trace`

And to reset the log level to the one that was set at startup / last config
load, simply pass the `--reset` flag.

`!admin debug change-log-level --reset`

#### Pinging servers

Palpo can ping other servers using `!admin debug ping <server>`. This takes
a server name and goes through the server discovery process and queries
`/_matrix/federation/v1/version`. Errors are outputted.

While it does measure the latency of the request, it is not indicative of
server performance on either side as that endpoint is completely unauthenticated
and simply fetches a string on a static JSON endpoint. It is very low cost both
bandwidth and computationally.

#### Allocator memory stats

When using jemalloc with jemallocator's `stats` feature (`--enable-stats`), you
can see Palpo's high-level allocator stats by using
`!admin server memory-usage` at the bottom.

If you are a developer, you can also view the raw jemalloc statistics with
`!admin debug memory-stats`. Please note that this output is extremely large
which may only be visible in the Palpo console CLI due to PDU size limits,
and is not easy for non-developers to understand.

[unbound-tuning]: https://unbound.docs.nlnetlabs.nl/en/latest/topics/core/performance.html
[unbound-arch]: https://wiki.archlinux.org/title/Unbound
