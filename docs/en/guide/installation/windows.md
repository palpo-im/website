# Install on Windows

## Install PostgreSQL


Follow the instructions in the [PostgreSQL installation guide](./postgres.md) to install and set up PostgreSQL for your system.

After installing PostgreSQL, create a database user and database for Palpo:

1. Open the "SQL Shell (psql)" from the Start Menu or run `psql` in a terminal.
2. In the psql shell, run:

	```sql
	CREATE USER palpo WITH PASSWORD 'your_secure_password';
	CREATE DATABASE palpo OWNER palpo;
	```

Replace `'your_secure_password'` with a strong password. This will create a PostgreSQL user named `palpo` and a database named `palpo`, with the user as the owner.

## Download Palpo Release

Go to the official GitHub releases page:

[https://github.com/palpo-im/palpo/releases](https://github.com/palpo-im/palpo/releases)

Download the latest Windows release (e.g., `palpo-x.y.z-windows.zip`). Extract the downloaded archive.

## Configure Palpo

Copy the example configuration file and rename it:

```powershell
copy palpo-example.toml palpo.toml
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

For more advanced configuration options, see the [configuration page](../configuration/index.md).

## Run Palpo

Start Palpo from the command line:

```powershell
palpo.exe
```

## Setup as a Windows Service (Autostart on Boot)

To run Palpo automatically on system startup, you can use the built-in `sc` command or a service manager like NSSM (the Non-Sucking Service Manager).

### Using NSSM (Recommended)

1. Download and install [NSSM](https://nssm.cc/download).
2. Open a Command Prompt as Administrator and run:

	```powershell
	nssm install Palpo
	```
3. In the NSSM GUI:
	- Set the path to your `palpo.exe` binary
	- Set the startup directory to the folder containing `palpo.exe`
	- Click "Install service"
4. Start the service:

	```powershell
	nssm start Palpo
	```

### Using Windows Built-in Service Manager (Advanced)

You can also use the `sc` command to create a service:

```powershell
sc create Palpo binPath= "C:\\path\\to\\palpo.exe" start= auto
```

Replace `C:\\path\\to\\palpo.exe` with the actual path to your Palpo binary.

Palpo will now start automatically on boot.