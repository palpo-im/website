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
{/* 本行由工具自动生成,原文哈希值:84ad6f007762377dda04c3c44d8b5a51 */}