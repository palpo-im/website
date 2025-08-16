# Install on Linux

## Install PostgreSQL


Follow the instructions in the [PostgreSQL installation guide](./postgres.md) to install and set up PostgreSQL for your system.

After installing PostgreSQL, create a database user and database for Palpo:

```bash
# Switch to the postgres user
sudo -u postgres psql

# In the psql shell, run:
CREATE USER palpo WITH PASSWORD 'your_secure_password';
CREATE DATABASE palpo OWNER palpo;
```

Replace `'your_secure_password'` with a strong password. This will create a PostgreSQL user named `palpo` and a database named `palpo`, with the user as the owner.

## Download Palpo Release

Go to the official GitHub releases page:

[https://github.com/palpo-im/palpo/releases](https://github.com/palpo-im/palpo/releases)

Download the latest release suitable for your Linux distribution and architecture. Extract the downloaded archive if necessary.

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

## Set Up as a Systemd Service (Autostart on Boot)

To run Palpo automatically on system startup, create a systemd service file:

1. Create `/etc/systemd/system/palpo.service` with the following content:

	```ini
	[Unit]
	Description=Palpo Matrix Homeserver
	After=network.target

	[Service]
	Type=simple
	User=palpo
	WorkingDirectory=/path/to/palpo
	ExecStart=/path/to/palpo
	Restart=on-failure

	[Install]
	WantedBy=multi-user.target
	```

	Replace `/path/to/palpo` with the actual directory where Palpo is located and set the correct user.

2. Reload systemd and enable the service:

	```bash
	sudo systemctl daemon-reload
	sudo systemctl enable palpo
	sudo systemctl start palpo
	```

Palpo will now start automatically on boot.