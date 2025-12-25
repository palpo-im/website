# Management

Palpo supports management and auditing through command-line tools. Plans are in place to support administrator APIs and a UI interface in the future.

## Launching the Management Interface

To start the command-line interactive interface, run the following command in the directory where the Palpo executable is located:

```bash
palpo --config palpo.toml --server false --console
```

Here, `--config palpo.toml` specifies the configuration file to use. If it is the default configuration file `palpo.toml` in the current directory, this option can be omitted.

`--server false` indicates that the server should not be started, while `--console` launches the command-line interactive interface.

You can run `palpo --help` to view detailed usage instructions.

**Note**: On Windows, the executable file is named `palpo.exe`.

Once inside the command-line interactive interface, you can still run the `help` command to view available management commands.

Palpo supports the following management commands:

- `appservice`: Manage tasks related to Appservice.
- `user`: Manage tasks related to local users.
- `room`: Manage tasks related to rooms.
- `federation`: Manage tasks related to Federation.
- `server`: Manage tasks related to the server.
- `media`: Manage tasks related to media.
{/* 本行由工具自动生成,原文哈希值:3845537d7c1f70df5e870066c02cceeb */}