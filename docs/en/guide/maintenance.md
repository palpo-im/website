# Maintaining Your Palpo Setup

## Moderation

Palpo handles moderation through room management commands. "Binary commands" (medium priority) and admin APIs (low priority) are planned. Some moderation-related configuration options are provided in the example configuration, such as "global ACL" and blocking media requests to certain servers. Refer to the moderation configuration options under the "Moderation/Privacy/Security" section in the example configuration.

Palpo has the following moderation management commands:

- Manage room aliases (`!admin rooms alias`)
- Manage room directory (`!admin rooms directory`)
- Manage room bans/blocks and user removal (`!admin rooms moderation`)
- Manage user accounts (`!admin users`)
- Fetch `/.well-known/matrix/support` from servers (`!admin federation`)
- Block incoming federation for certain rooms (different from room bans) (`!admin federation`)
- Delete media (see [Media section](#media))

Any command with `-list` requires a code block in the message, with each object separated by a newline. Example:

````
!admin rooms moderation ban-list-of-rooms
```
!roomid1:server.name
#badroomalias1:server.name
!roomid2:server.name
!roomid3:server.name
#badroomalias2:server.name
```
````

## Media

Media still requires various improvements, but Palpo implements media deletion through:

- MXC URI or event ID (unencrypted and attempts to find MXC URI in the event)
- Deleting a list of MXC URIs
- File system metadata via file creation time (`btime`) or file modification time (`mtime`) to delete remote media from the past `N` seconds/minutes

For more information, refer to the `!admin media` command. All media in Palpo is stored in `$DATABASE_DIR/media`. This will be configurable soon.

If you find yourself needing extensive fine-grained control over media, we recommend checking out [Matrix Media Repo](https://github.com/t2bot/matrix-media-repo). Palpo plans to implement various utilities for media, but MMR is dedicated to extensive media management.

Built-in S3 support is also planned, but currently using an "S3 filesystem" on `media/` works. Palpo also sends a 1-year `Cache-Control` header with immutable for all media requests (downloads and thumbnails) to reduce unnecessary media requests from browsers, decrease bandwidth usage, and lower load.
{/* 本行由工具自动生成,原文哈希值:64494666d29f2fe37d924a6f3c93bfe3 */}