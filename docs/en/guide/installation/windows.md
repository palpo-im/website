# Installing on Windows

## Installing PostgreSQL

Please refer to the [PostgreSQL Installation Guide](./postgres.md) to install and configure PostgreSQL.

After installation, create a database user and database for Palpo:

1. Open "SQL Shell (psql)" from the Start Menu, or run `psql -U postgres` in the terminal.Enter the password configured during installation as prompted. If you encounter an error message like "command not found," please check if the installation path of PostgreSQL is included in the Windows environment variable PATH.
2. Execute the following in the psql shell:

    ```sql
    CREATE USER palpo WITH PASSWORD 'your_secure_password';
    CREATE DATABASE palpo OWNER palpo;
    \q
    ```

Replace `'your_secure_password'` with a strong password. This creates a PostgreSQL user and database named `palpo`, and sets the user as the database owner.

## Downloading Palpo Release


### Download officeal release
Visit the official GitHub releases page:

[https://github.com/palpo-im/palpo/releases](https://github.com/palpo-im/palpo/releases)

Download the latest Windows version (e.g., `palpo-x.y.z-windows.zip`) and extract it.

### Install from Source Code

#### Windows Environment

1. Configure the Rust Development Environment  

Obtain the Windows installer from the official Rust website: [https://rust-lang.org/tools/install/](https://rust-lang.org/tools/install/)  
Double-click the installer and select the **Quick install** option. During installation, you will be prompted to install dependencies such as the Windows SDK. After these tools finish installing, proceed with the Rust toolchain installation using default settings, and wait for components (e.g., `rustc`, `cargo`) to complete installation.Verify the installation success in PowerShell or Command Prompt (CMD) by running the following commands:

```bash
rustc --version
cargo --version
```

If you receive a "command not found" error, configure the `PATH` environment variable in Windows System Settings.

2. Obtain the Palpo Source Code  

Visit the official Palpo GitHub repository: [https://github.com/palpo-im/palpo](https://github.com/palpo-im/palpo)
- If Git is installed: Use the `git clone` command to fetch the source code.
- If you prefer not to use Git: Directly download the source code package by selecting **Download ZIP** on the GitHub repository page.


3. Compile the Source Code  
Before compilation, install CMake first. You have two installation options:
- Download the installer from the official CMake website: [https://cmake.org/download/](https://cmake.org/download/)
- Install via Winget (Windows Package Manager) with this command:

```bash
winget install --id=Kitware.CMake -e
```

**compile Palpo**

1. Navigate to the Palpo source code directory.
2. Open a terminal in this directory and execute the following command. Wait for compilation to finish:

```bash
cargo build --release
```

The Windows executable (`palpo.exe`) will be generated in the `./target/release/` subdirectory of the source code folder. This is a **standalone executable** with no external DLL dependencies—you can copy it to any directory for use.

---

#### Cross-Compilation and Installation on WSL Environment

If you have the Windows Subsystem for Linux (WSL) configured on your Windows machine, you can cross-compile Palpo to generate a Windows binary directly in WSL. This avoids configuring the Rust toolchain on Windows natively and simplifies multi-platform build workflows, though additional pre-configuration is required.

1. Configure the Cross-Compilation Toolchain  
Add the Windows target to the Rust toolchain in WSL and install the MinGW64 cross-compiler (commands vary by Linux distribution):

```bash
# Add Windows target for Rust
rustup target add x86_64-pc-windows-gnu

# For Arch Linux
sudo pacman -S mingw-w64-gcc
# For Ubuntu/Debian
sudo apt-get update && sudo apt-get install gcc-mingw-w64-x86-64
# For Fedora/RHEL
sudo dnf install mingw64-gcc
```

2. Compile Dependent PostgreSQL Libraries  

The official PostgreSQL binaries are built with the Visual Studio (VS) toolchain, but cross-compilation in WSL uses MinGW64. You must manually compile the required PostgreSQL libraries (not the full PostgreSQL software) to complete cross-compilation:
a. Download the PostgreSQL source code: [https://www.postgresql.org/ftp/source/](https://www.postgresql.org/ftp/source/)
b. Extract the source code package and navigate to the PostgreSQL root directory.
c. Configure compilation parameters (exclude unnecessary libraries):

```bash
./configure --host=x86_64-w64-mingw32 \
            --without-readline \
            --without-zlib \
            --without-icu \
            --without-openssl
```

d. Compile only the required libraries:

```bash
make -C src/port
make -C src/common
make -C src/interfaces/libpq
```

e. After compilation, locate the MinGW-compiled static libraries (`.a` files) at these paths:
    * `src/interfaces/libpq/libpq.a`
    * `src/common/libpgcommon.a`
    * `src/port/libpgport.a`
f. Copy these `.a` files to a dedicated directory (we use `postgresql/lib-mingw32` in this guide for consistency).

3. Configure Cross-Compilation for Palpo  

In the Palpo source code directory, create a `.cargo/config.toml` file with the following content to specify cross-compilation settings:

```toml
[target.x86_64-pc-windows-gnu]
linker = "x86_64-w64-mingw32-gcc"
ar = "x86_64-w64-mingw32-gcc-ar"

rustflags = [
    "-L", "postgresql/lib-mingw32",  # Path to compiled PostgreSQL libraries
    "-C", "link-args=-lpthread",
    "-C", "link-args=-lwinpthread",
]
```

4. Run Cross-Compilation  

Execute the following command and wait for compilation to complete:

```bash
cargo build --release --target x86_64-pc-windows-gnu
```

The Windows binary will be generated in the `target/x86_64-pc-windows-gnu/release/` directory. Copy it to a Windows directory to run.

---

**Notes on Running Cross-Compiled Binaries**

Cross-compiled binaries use **dynamic linking** by default. Double-clicking the generated `.exe` file on Windows will trigger this error (or no valid output in the terminal):

```bash
The procedure entry point nanosleep64 could not be located in the dynamic link library D:\palpo\palpo-mingw.exe
```

This occurs because Palpo requires the MinGW dynamic library `libwinpthread-1.dll` to run.

1. Locate `libwinpthread-1.dll` in WSL (path may vary by distribution):

```bash
/usr/x86_64-w64-mingw32/bin/libwinpthread-1.dll
```

2. Copy this DLL file to the **same directory** as `palpo-mingw.exe` on Windows, then proceed with Palpo configuration.


## Configuring Palpo

Copy the example configuration file and rename it:

```powershell
copy palpo-example.toml palpo.toml
```

Edit `palpo.toml` according to your environment and database settings. At minimum, you need to:

- Set `server_name` to your desired domain, for example:

    ```toml
    server_name = "your.domain.com"
    ```

- Set the database URL in the `[db]` section to match the database, user, and password you created above, for example:

    ```toml
    [db]
    url = "postgresql://palpo:your_secure_password@your.domain.com:5432/palpo"
    ```

Replace `your.domain.com` and `your_secure_password` with your actual domain and password.
Use `localhost` as the domain name for local testing.

For more advanced configuration, please refer to the [Configuration Page](../configuration/index.md).

## Running Palpo

Start Palpo from the command line:

```powershell
palpo.exe
```

## Setting Up as a Windows Service (Auto-start on Boot)

You can use the built-in `sc` command or NSSM (recommended, Non-Sucking Service Manager) to enable Palpo to start automatically on boot.

### Using NSSM (Recommended)

1. Download and install [NSSM](https://nssm.cc/download).
2. Open Command Prompt as Administrator and run:

    ```powershell
    nssm install Palpo
    ```
3. In the NSSM interface:
    - Set the path to `palpo.exe`
    - Set the startup directory to the folder containing `palpo.exe`
    - Click "Install service"
4. Start the service:

    ```powershell
    nssm start Palpo
    ```

### Using Windows Built-in Service Manager (Advanced)

You can also create a service using the `sc` command:

```powershell
sc create Palpo binPath= "C:\\path\\to\\palpo.exe" start= auto
```

Replace `C:\\path\\to\\palpo.exe` with the actual path to the Palpo executable.

Palpo will now start automatically on boot.
{/* 本行由工具自动生成,原文哈希值:8d6bf9b2dacdf6172cb54f60a30db81d */}
