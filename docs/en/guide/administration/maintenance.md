# Maintaining Palpo

## Moderation

Palpo has moderation through admin room commands. "binary commands" (medium
priority) and an admin API (low priority) is planned. Some moderation-related
config options are available in the example config such as "global ACLs" and
blocking media requests to certain servers. See the example config for the
moderation config options under the "Moderation / Privacy / Security" section.

Palpo has moderation admin commands for:

- managing room aliases (`!admin rooms alias`)
- managing room directory (`!admin rooms directory`)
- managing room banning/blocking and user removal (`!admin rooms moderation`)
- managing user accounts (`!admin users`)
- fetching `/.well-known/matrix/support` from servers (`!admin federation`)
- blocking incoming federation for certain rooms (not the same as room banning)
(`!admin federation`)
- deleting media (see [the media section](#media))

Any commands with `-list` in them will require a codeblock in the message with
each object being newline delimited. An example of doing this is:

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

Media still needs various work, however Palpo implements media deletion via:

- MXC URI or Event ID (unencrypted and attempts to find the MXC URI in the
event)
- Delete list of MXC URIs
- Delete remote media in the past `N` seconds/minutes via filesystem metadata on
the file created time (`btime`) or file modified time (`mtime`)

See the `!admin media` command for further information. All media in Palpo
is stored at `$DATABASE_DIR/media`. This will be configurable soon.

If you are finding yourself needing extensive granular control over media, we
recommend looking into [Matrix Media
Repo](https://github.com/t2bot/matrix-media-repo). Palpo intends to
implement various utilities for media, but MMR is dedicated to extensive media
management.

Built-in S3 support is also planned, but for now using a "S3 filesystem" on
`media/` works. Palpo also sends a `Cache-Control` header of 1 year and
immutable for all media requests (download and thumbnail) to reduce unnecessary
media requests from browsers, reduce bandwidth usage, and reduce load.
