# Traffic Delegation

By default, other homeservers will attempt to access your server via the domain configured in `server_name` on port 8448. The `server_name` appears at the end of user IDs and tells other homeservers how to locate your server. For example, if you set `server_name` to `example.com` (making user IDs appear as `@user:example.com`), other servers will try to connect to `https://example.com:8448/`.

Delegation is a Matrix feature that allows homeserver administrators to retain `example.com` as the `server_name`, keeping all user IDs and room aliases in the `*:example.com` format, while routing federation traffic to a different server or port (such as `synapse.example.com:443`).

## .well-known Delegation

To use this method, you must be able to configure the `https://<server_name>` server to serve a service discovery file at `https://<server_name>/.well-known/matrix/server`.

> **Note**: The `.well-known` file must be hosted on the default HTTPS port (443).

### External Server

For maximum flexibility, you can configure an external server such as nginx, Apache, or HAProxy to serve the `https://<server_name>/.well-known/matrix/server` file. Configuration methods can typically be found in the [reverse proxy](reverse-proxy.md) documentation.

`https://<server_name>/.well-known/matrix/server` should return a JSON structure containing the `m.server` key, as shown below:

```json
{
    "m.server": "<synapse.server.name>[:<yourport>]"
}
```

For example, if you need to route federation traffic to `https://synapse.example.com` on port 443, `https://example.com/.well-known/matrix/server` should return:

```json
{
    "m.server": "synapse.example.com:443"
}
```

The port number is optional; if not specified, it defaults to 8448.

### Using Palpo to Serve the `.well-known/matrix/server` File

If you can route `https://<server_name>` to Palpo (i.e., you only need to change federation traffic from port 8448 to 443), you can configure Palpo to automatically serve the appropriate `.well-known/matrix/server` file. Simply configure the `[well_known]` section in your `palpo.toml` file:

```toml
[well_known]
# Server discovery endpoint for federation
# Format: "hostname:port"
server = "matrix.example.com:443"
```

**Note**: This method only works if `https://<server_name>` is routed to Palpo, so it is not applicable if Palpo is deployed on a subdomain (e.g., `https://palpo.example.com`).

## SRV DNS Record Delegation

Delegation can also be achieved via SRV DNS records, but this method is generally not recommended. This is due to the complexity of TLS certificate configuration and the lack of significant advantages over `.well-known` delegation.

It's important to note that server delegation is only used for server-to-server communication, so SRV DNS records cannot cover client-server communication scenarios. This means that global client settings (such as Jitsi endpoints, default room encryption, etc.) still need to be implemented via files under the `https://<server_name>/.well-known/` path. If you use SRV DNS delegation to avoid serving this file, you will not be able to globally change client defaults and will have to configure them individually on each client.

If necessary, refer to the [Matrix specification](https://matrix.org/docs/spec/server_server/latest#resolving-server-names) for the SRV record format and how Matrix servers use it.

## Delegation FAQ

### When is delegation necessary?

If your homeserver API is accessible via the domain pointed to by `server_name` on the default federation port (8448), no delegation configuration is required.

For example: Register `example.com` and point its DNS A record to a server, install Synapse on that host, set `server_name` to `example.com`, and configure a reverse proxy to forward requests on port 8448 and provide TLS certificates for `example.com`. In this case, no additional delegation configuration is needed.

**However**, if your homeserver API is not accessible via the domain pointed to by `server_name` on port 8448, you will need delegation to inform other servers how to locate your homeserver.

### Should federation traffic use a reverse proxy?

Generally, using a reverse proxy for both federation and client traffic is a wise choice, as it allows Synapse to avoid handling TLS traffic directly. For information on setting up a reverse proxy, please refer to the [reverse proxy documentation](reverse-proxy.md).
{/* 本行由工具自动生成,原文哈希值:370a574b877253d4bc8833bbd7b23c61 */}