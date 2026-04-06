# Setting up Appservices

## Getting Help

If you have any problems setting up an appservice: Ask in [#palpo:palpo.chat](https://matrix.to/#/#palpo:palpo.chat) or [open an issue on GitHub](https://github.com/palpo-im/palpo/issues/new).

## Setting up Appservices - General Instructions

Follow any instructions provided by the appservice. This usually involves downloading it, changing its configuration (setting domain, homeserver url, port, etc.), and then starting it.

At some point, the appservice guide should ask you to add a registration yaml file to the homeserver. In Synapse, you would do this by adding the path to homeserver.yaml, but in palpo, you can do it from within Matrix:

First, go to your homeserver's `#admins` room. The first person registered on the homeserver is automatically joined. Then send a message to the room like:

    !admin appservices register
    ```
    Paste
    yaml
    registration
    contents
    here
    ```

You can confirm it worked by sending:
`!admin appservices list`

The server bot should answer `Appservices (1): your-bridge`

Then you're done. Palpo will send messages to the appservice, and the appservice can send requests to the homeserver. You don't need to restart palpo, but if it doesn't work, restarting while the appservice is running might help.

## Appservice-Specific Instructions

### Removing an Appservice

To remove an appservice, go to your admin room and do

`!admin appservices unregister <name>`

where `<name>` is one of the outputs from `appservices list`.

## Common Bridge Examples

### mautrix-discord

[mautrix-discord](https://github.com/mautrix/discord) bridges Discord servers and DMs to Matrix.

1. Follow the [mautrix-discord setup guide](https://docs.mau.fi/bridges/go/discord/index.html) to download and configure the bridge.
2. Generate the registration file:
   ```bash
   mautrix-discord -g -c config.yaml -r registration.yaml
   ```
3. Register it in Palpo via the admin room:
   ```
   !admin appservices register
   ```yaml
   (paste contents of registration.yaml)
   ```
   ```
4. Start the bridge: `./mautrix-discord -c config.yaml`

### mautrix-telegram

[mautrix-telegram](https://github.com/mautrix/telegram) bridges Telegram chats and groups to Matrix.

1. Follow the [mautrix-telegram setup guide](https://docs.mau.fi/bridges/python/telegram/index.html).
2. Generate the registration file and register it in Palpo the same way as shown above.
3. After starting the bridge, message `@telegrambot:your.server` to link your Telegram account.

## Differences from Synapse

In Synapse, appservice registration files are added by editing `homeserver.yaml` and listing file paths under `app_service_config_files`. In Palpo, registration is done **at runtime** through the admin room — no server restart is required.

- **Register**: `!admin appservices register` followed by a code block with the YAML content
- **Unregister**: `!admin appservices unregister <name>`
- **List**: `!admin appservices list`

This means you do not need filesystem access to the server to manage appservices.

## Troubleshooting

- **Bridge not receiving events**: Verify the appservice is registered (`!admin appservices list`) and that the bridge process is running and reachable at the URL specified in the registration YAML.
- **"Unknown appservice" error**: The `id` in the registration YAML must be unique. Check for typos or duplicates.
- **Users not being created**: Ensure the `namespaces.users` regex in the registration YAML matches the user IDs the bridge tries to create.
- **Connection refused**: If Palpo and the bridge run on different hosts or in containers, ensure network connectivity between them. The `url` field in the registration YAML must be reachable from Palpo.