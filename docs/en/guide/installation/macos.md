# Install on macOS

## Install PostgreSQL

Follow the instructions in the [PostgreSQL installation guide](./postgres.md) to install and set up PostgreSQL for your system.


You can install PostgreSQL on macOS using Homebrew:

```bash
brew install postgresql
```

After installing PostgreSQL, create a database user and database for Palpo:

```bash
# Switch to the postgres user
brew services start postgresql
psql postgres

# In the psql shell, run:
CREATE USER palpo WITH PASSWORD 'your_secure_password';
CREATE DATABASE palpo OWNER palpo;
```

Replace `'your_secure_password'` with a strong password. This will create a PostgreSQL user named `palpo` and a database named `palpo`, with the user as the owner.


## Download Palpo Release

Go to the official GitHub releases page:

[https://github.com/palpo-im/palpo/releases](https://github.com/palpo-im/palpo/releases)

Download the latest macOS release (e.g., `palpo-x.y.z-macos.zip`). Extract the downloaded archive.

## Configure Palpo

Copy the example configuration file and rename it:

```bash
cp palpo-example.toml palpo.toml
```

Edit `palpo.toml` to match your environment and database settings. At minimum, you must:

- Set `server_name` to your desired domain name, for example:

	```toml
	server_name = "your.domain.com"
	```

- Set the database URL in the `[db]` section to match the database, user, and password you created above. For example:

	```toml
	[db]
	url = "postgresql://palpo:your_secure_password@localhost:5432/palpo"
	```

Replace `your.domain.com` and `your_secure_password` with your actual domain and password.

For more advanced configuration options, see the [settings page](../configuration/index.md).



## Run Palpo

Start Palpo from the command line:

```bash
./palpo
```

## 5. Set Up as a Launchd Service (Autostart on Boot)

To run Palpo automatically on system startup, you can create a launchd service:

1. Create a plist file at `~/Library/LaunchAgents/im.palpo.palpo.plist` with the following content:

	```xml
	<?xml version="1.0" encoding="UTF-8"?>
	<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
	<plist version="1.0">
	<dict>
		<key>Label</key>
		<string>im.palpo.palpo</string>
		<key>ProgramArguments</key>
		<array>
			<string>/path/to/palpo</string>
		</array>
		<key>WorkingDirectory</key>
		<string>/path/to</string>
		<key>RunAtLoad</key>
		<true/>
		<key>KeepAlive</key>
		<true/>
	</dict>
	</plist>
	```

	Replace `/path/to/palpo` and `/path/to` with the actual path to your Palpo binary and its directory.

2. Load the service:

	```bash
	launchctl load ~/Library/LaunchAgents/im.palpo.palpo.plist
	```

Palpo will now start automatically on login.