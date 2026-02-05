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

## Command Categories

Palpo supports the following management commands:

- `appservice`: Manage Application Services (bridges)
- `user`: Manage local users
- `room`: Manage rooms
- `federation`: Manage federation with other servers
- `server`: Manage server settings and operations
- `media`: Manage media files

## User Commands

### Create User

Create a new local user account.

```
user create-user <username> [password]
```

- `<username>`: Username for the new user
- `[password]`: Optional password; if not provided, a 25-character password is auto-generated

**Note**: The first user created is automatically granted admin privileges.

### Reset Password

Reset a user's password.

```
user reset-password <username> [password]
```

- `<username>`: Username of the user
- `[password]`: New password; if not provided, one is auto-generated

### List Users

List all local user accounts.

```
user list-users
```

### Deactivate User

Deactivate a single user account.

```
user deactivate [--no-leave-rooms] <user_id>
```

- `<user_id>`: Full Matrix ID (e.g., `@username:example.com`)
- `--no-leave-rooms`: Do not remove user from joined rooms

### Deactivate All Users

Bulk deactivate users from a list.

```
user deactivate-all [--no-leave-rooms] [--force]
```

- `--no-leave-rooms`: Do not remove users from joined rooms
- `--force`: Also deactivate admin accounts (normally skipped)

The command body must contain a code block with one username per line:

````
```
user1
user2
user3
```
````

### List Joined Rooms

List all rooms where a user is joined.

```
user list-joined-rooms <user_id>
```

### Force Join Room

Force a local user to join a room.

```
user force-join-room <user_id> <room_id>
```

- `<user_id>`: Username or full Matrix ID
- `<room_id>`: Room ID or alias (e.g., `!roomid:example.com` or `#alias:example.com`)

### Force Leave Room

Force a local user to leave a room.

```
user force-leave-room <user_id> <room_id>
```

### Make User Admin

Grant server admin privileges to a local user.

```
user make-user-admin <user_id>
```

### Put Room Tag

Set a room tag for a user.

```
user put-room-tag <user_id> <room_id> <tag>
```

- `<tag>`: Tag name (e.g., `m.server_notice` for "System Alerts" in Element)

### Delete Room Tag

Remove a room tag.

```
user delete-room-tag <user_id> <room_id> <tag>
```

### Get Room Tags

List all tags for a user in a room.

```
user get-room-tags <user_id> <room_id>
```

### Redact Event

Forcefully redact an event sent by a local user.

```
user redact-event <event_id>
```

### Force Join List of Local Users

Force a list of local users to join a room.

```
user force-join-list-of-local-users <room_id> --yes-i-want-to-do-this
```

The command body must contain a code block with usernames.

### Force Join All Local Users

Force all local users to join a room.

```
user force-join-all-local-users <room_id> --yes-i-want-to-do-this
```

## Room Commands

### List Rooms

List all rooms the server knows about.

```
room list-rooms [page] [--exclude-disabled] [--exclude-banned] [--no-details]
```

- `[page]`: Page number (default: 1, 100 rooms per page)
- `--exclude-disabled`: Skip rooms with federation disabled
- `--exclude-banned`: Skip banned rooms
- `--no-details`: Output only room IDs

### Room Exists

Check if the server knows about a room.

```
room exists <room_id>
```

### List Joined Members

List members joined in a room.

```
room info list-joined-members <room_id> [--local-only]
```

### View Room Topic

Display the room topic.

```
room info view-room-topic <room_id>
```

### Ban Room

Ban a room from local users.

```
room moderation ban-room <room>
```

- `<room>`: Room ID or alias

This will:
- Prevent local users from joining
- Evict all local users
- Block invites
- Disable federation with the room
- Unpublish from room directory

### Ban List of Rooms

Bulk ban multiple rooms.

```
room moderation ban-list-of-rooms
```

The command body must contain a code block with room IDs/aliases.

### Unban Room

Unban a room.

```
room moderation unban-room <room>
```

### List Banned Rooms

List all banned rooms.

```
room moderation list-banned-rooms [--no-details]
```

### Set Room Alias

Create a room alias.

```
room alias set [--force] <room_id> <room_alias_localpart>
```

- `<room_alias_localpart>`: Alias name (e.g., `lobby` not `#lobby:example.com`)
- `--force`: Overwrite if alias already in use

### Remove Room Alias

Delete a room alias.

```
room alias remove <room_alias_localpart>
```

### Which Room (Alias Lookup)

Find which room an alias points to.

```
room alias which <room_alias_localpart>
```

### List Aliases

List current local aliases.

```
room alias list [room_id]
```

### Publish Room

Publish a room to the directory.

```
room directory publish <room_id>
```

### Unpublish Room

Remove a room from the directory.

```
room directory unpublish <room_id>
```

### List Published Rooms

List rooms in the directory.

```
room directory list [page]
```

## Federation Commands

### Disable Room Federation

Disable federation for a room.

```
federation disable-room <room_id>
```

### Enable Room Federation

Re-enable federation for a room.

```
federation enable-room <room_id>
```

### Fetch Support Well-Known

Fetch `/.well-known/matrix/support` from a server.

```
federation fetch-support-well-known <server_name>
```

### Remote User in Rooms

List rooms shared with a remote user.

```
federation remote-user-in-rooms <user_id>
```

## Media Commands

### Delete Single Media

Delete a media file.

```
media delete-media (--mxc <mxc_url> | --event-id <event_id>)
```

- `--mxc`: MXC URL (e.g., `mxc://example.com/abcd1234`)
- `--event-id`: Event ID containing media

### Delete Media List

Bulk delete MXC URLs.

```
media delete-media-list
```

The command body must contain a code block with MXC URLs.

### Delete Past Remote Media

Delete remote media by age.

```
media delete-past-remote-media <duration> (--before | --after) [--yes-i-want-to-delete-local-media]
```

- `<duration>`: Time duration (e.g., `30s`, `5m`, `7d`, `2w`)
- `--before`: Delete media created before duration ago
- `--after`: Delete media created after duration ago
- `--yes-i-want-to-delete-local-media`: Also delete local media

### Get File Info

Look up metadata for a media file.

```
media get-file-info <mxc>
```

## Server Commands

### Show Configuration

Display current server configuration.

```
server show-config
```

### Reload Configuration

Reload configuration from file.

```
server reload-config [path]
```

### List Features

Show server features and their status.

```
server list-features [--available] [--enabled] [--comma]
```

- `--available`: Show all available features
- `--enabled`: Show only enabled features
- `--comma`: Use comma delimiter

### Admin Notice

Send a message to the admin room.

```
server admin-notice <message...>
```

### Reload Mods

Hot-reload the server.

```
server reload-mods
```

### Restart Server

Restart the server.

```
server restart [--force]
```

- `--force`: Force restart even if executable has changed

### Shutdown Server

Shutdown the server.

```
server shutdown
```

## Appservice Commands

### Register Appservice

Register a bridge/appservice.

```
appservice register
```

The command body must contain YAML registration:

````
```yaml
id: my_bridge
as_token: secret_token_here
hs_token: secret_token_here
namespaces:
  users:
    - regex: '@irc_.*'
  aliases:
    - regex: '#irc_.*'
  rooms: []
```
````

### Unregister Appservice

Unregister an appservice.

```
appservice unregister <appservice_identifier>
```

### Show Appservice Config

Display appservice registration.

```
appservice show-appservice-config <appservice_identifier>
```

### List Appservices

List all registered appservices.

```
appservice list-registered
```

## Command Input Formats

### Code Block Format

Many commands accept bulk input via code blocks:

````
```
item1
item2
item3
```
````

### Duration Format

Time durations use these units:
- `s` - seconds
- `m` - minutes
- `h` - hours
- `d` - days
- `w` - weeks

Example: `7d` for 7 days, `2w` for 2 weeks.

## Safety Features

- Confirmation flags for dangerous operations (`--yes-i-want-to-do-this`)
- Cannot deactivate the server service account
- Cannot ban the admin room
- Prevents overwriting aliases without `--force`
