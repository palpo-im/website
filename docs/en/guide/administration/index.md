# Administration

## Moderation

Palpo has moderation through admin room commands. Admin API and UI is planned.

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
