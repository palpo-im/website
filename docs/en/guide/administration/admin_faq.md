# Admin FAQ

#### Lost access to admin room

You can reinvite yourself to the admin room through the following methods:
- Use the `--execute "users make_user_admin <username>"` Palpo binary
argument once to invite yourslf to the admin room on startup;
- Use the Palpo console/CLI to run the `users make_user_admin` command;
- Or specify the `emergency_password` config option to allow you to temporarily
log into the server account (`@palpo`) from a web client.