# Traffic Delegation

In the following documentation, we refer to `server_name` as the setting in the homeserver configuration file. It appears at the end of user IDs and informs other homeservers how to locate your server.

By default, other homeservers will attempt to access your server via your `server_name` on port 8448. For example, if you set `server_name` to `example.com` (so that your usernames appear as `@user:example.com`), other servers will try to connect to `https://example.com:8448/`.

Delegation is a Matrix feature that allows homeserver administrators to retain `example.com` as the `server_name`, so that user IDs, room aliases, etc., remain `*:example.com`, while federation traffic can be routed to a different server and/or port (e.g., `synapse.example.com:443`).

## .well-known Delegation

To use this method, you must be able to configure the `https://<server_name>` server to serve a file at `https://<server_name>/.well-known/matrix/server`. There are two ways to achieve this.

Note: The `.well-known` file must be hosted on the default HTTPS port (443).

### External Server

For maximum flexibility, you can configure an external server such as nginx, Apache, or HAProxy to serve the `https://<server_name>/.well-known/matrix/server` file. Setting up such a server is beyond the scope of this documentation, but it can typically be configured within your [reverse proxy](reverse-proxy.md).

`https://<server_name>/.well-known/matrix/server` should return a JSON structure containing the `m.server` key, as shown below:

```json
{
    "m.server": "<synapse.server.name>[:<yourport>]"
}
```

For example (if we want federation traffic to be routed to `https://synapse.example.com` on port 443), `https://example.com/.well-known/matrix/server` should return:

```json
{
    "m.server": "synapse.example.com:443"
}
```

Note that the port number is optional. If no port is specified, it defaults to 8448.

### Using Synapse to Serve the `.well-known/matrix/server` File

If you can route `https://<server_name>` to Synapse (i.e., you only need to change federation traffic from port 8448 to 443), you can configure Synapse to automatically serve the appropriate `.well-known/matrix/server` file. Simply add the following to the `homeserver.yaml` file:

```yaml
serve_server_wellknown: true
```

**Note**: This method only works if `https://<server_name>` is routed to Synapse, so it is not applicable if Synapse is deployed on a subdomain (e.g., `https://synapse.example.com`).

## SRV DNS Record Delegation

Delegation can also be achieved via SRV DNS records. However, this method is generally not recommended due to the complexity of TLS certificate configuration and the lack of significant advantages over `.well-known` delegation.

Please note that server delegation is a feature for server-to-server communication, so using SRV DNS records cannot cover client-server communication scenarios. This means that global client settings (such as Jitsi endpoints, default new room encryption, etc.) still need to be implemented via files under `https://<server_name>/.well-known/`! If you intend to use SRV DNS delegation to avoid serving this file, note that you will not be able to globally change these client defaults and will have to configure them individually per client.

If necessary, refer to the [Matrix specification](https://matrix.org/docs/spec/server_server/latest#resolving-server-names) for the SRV record format and how Synapse uses it.

## Delegation FAQ

### When is delegation necessary?

If your homeserver API is accessible via the domain pointed to by `server_name` on the default federation port (8448), no delegation is required.

For example, if you register `example.com`, point its DNS A record to a new server, install Synapse on that host, set `server_name` to `example.com`, and configure a reverse proxy to forward all requests on port 8448 and provide TLS certificates for `example.com`, no additional delegation configuration is needed.

**However**, if your homeserver API is not accessible via the domain pointed to by `server_name` on port 8448, you will need delegation to inform other servers how to locate your homeserver.

### Should federation traffic use a reverse proxy?

Generally, it is a good idea to use a reverse proxy for both federation and client traffic, as it allows Synapse to avoid handling TLS traffic directly. For instructions on setting up a reverse proxy, refer to the [reverse proxy documentation](reverse-proxy.md).
{/* 本行由工具自动生成,原文哈希值:370a574b877253d4bc8833bbd7b23c61 */}