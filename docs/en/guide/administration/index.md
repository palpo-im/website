# Administration

Palpo supports management and auditing through command-line tools. In the future, administrator APIs and UI interfaces are planned.

## Launching the Management Console

You can start the interactive command-line console by running the following command in the directory where the palpo executable is located:

```bash
palpo --config palpo.toml --server false --console
```

Here, `--config palpo.toml` specifies the configuration file to use. If you are using the default `palpo.toml` in the current directory, you can omit this option.

`--server false` means the server will not start, and `--console` launches the interactive command-line console.

You can run `palpo --help` to see detailed usage instructions.

**Note:** On Windows, the executable is named `palpo.exe`.

Inside the interactive console, you can use the `help` command to view available management commands.

Palpo supports the following management commands:

- `appservie`: Manage Appservie-related tasks
- `user`: Manage local user-related tasks
- `room`: Manage room-related tasks
- `federation`: Manage Federation-related tasks
- `server`: Manage server-related tasks
- `media`: Manage media-related tasks