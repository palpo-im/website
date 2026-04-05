# 在 Windows 上安装

## 安装 PostgreSQL

请参考 [PostgreSQL 安装指南](./postgres.md) 安装并配置 PostgreSQL。

安装完成后，为 Palpo 创建数据库用户和数据库：

1. 从开始菜单打开 "SQL Shell (psql)"，或在终端运行 `psql -U postgres`。按照提示输入安装过程中配置的密码。如果遇到"命令无法找到"类似的报错提示，请查询Windows的环境变量PATH中是否包括了PostgreSQL的安装路径。
2. 在 psql shell 中执行：

    ```sql
    CREATE USER palpo WITH PASSWORD 'your_secure_password';
    CREATE DATABASE palpo OWNER palpo;
    \q
    ```

将 `'your_secure_password'` 替换为强密码。这会创建名为 `palpo` 的 PostgreSQL 用户和数据库，并将该用户设为数据库所有者。

## 安装 Palpo

### 下载官方发行版

访问官方 GitHub 发布页面：

[https://github.com/palpo-im/palpo/releases](https://github.com/palpo-im/palpo/releases)

下载最新的 Windows 版本（如 `palpo-x.y.z-windows.zip`），并解压缩。

### 源码安装

#### Windows 环境

1.  配置 Rust 开发环境

从 Rust 官方网站获取 Windows 安装程序：https://rust-lang.org/tools/install/
双击安装程序，选择**Quick Install**选项。安装过程中，系统会提示安装 Windows SDK 等依赖项。待这些工具安装完成后，使用默认设置继续安装 Rust 工具链，等待 `rustc`、`cargo` 等组件安装完毕。

在 PowerShell 或命令提示符（CMD）中执行以下命令，验证安装是否成功：
```bash
rustc --version
cargo --version
```

若出现“命令未找到”错误，请在 Windows 系统设置中配置 PATH 环境变量。

2.  获取 Palpo 源代码

访问 Palpo 官方 GitHub 代码仓库：https://github.com/palpo-im/palpo

-  若已安装 Git：使用 `git clone` 命令拉取源代码。
-  若不想使用 Git：直接在 GitHub 仓库页面选择**Download ZIP**，获取源代码压缩包。

3.  编译源代码

编译前，需先安装 CMake，有以下两种安装方式：

- 从 CMake 官方网站下载安装程序：https://cmake.org/download/
- 通过 Winget（Windows 包管理器）执行以下命令安装：

```bash
winget install --id=Kitware.CMake -e
```

**编译 Palpo 步骤**：

a.  进入 Palpo 源代码目录。
b.  在该目录下打开终端，执行以下命令，等待编译完成：

```bash
cargo build --release
```
编译完成后，Windows 可执行文件 `palpo.exe` 会生成在源代码文件夹的 `./target/release/` 子目录下。该文件为独立可执行程序，不依赖外部 DLL 文件，可复制到任意目录运行。

---

#### WSL 环境下交叉编译与安装

若你的 Windows 设备已配置适用于 Linux 的 Windows 子系统（WSL），可直接在 WSL 中交叉编译 Palpo 生成 Windows 二进制文件。这种方式无需在原生 Windows 系统配置 Rust 工具链，能简化多平台编译流程，但需进行额外的前置配置。

1.  配置交叉编译工具链

在 WSL 的 Rust 工具链中添加 Windows 目标平台，并安装 MinGW64 交叉编译器（命令因 Linux 发行版而异）：

```bash
# 为 Rust 添加 Windows 目标平台
rustup target add x86_64-pc-windows-gnu

# Arch Linux 系统
sudo pacman -S mingw-w64-gcc
# Ubuntu/Debian 系统
sudo apt-get update && sudo apt-get install gcc-mingw-w64-x86-64
# Fedora/RHEL 系统
sudo dnf install mingw64-gcc
```

2.  编译依赖的 PostgreSQL 库

官方 PostgreSQL 二进制文件基于 Visual Studio（VS）工具链构建，而 WSL 中的交叉编译使用 MinGW64 工具链。因此，你需要手动编译所需的 PostgreSQL 库（无需编译完整的 PostgreSQL 软件），才能完成交叉编译：

a.  下载 PostgreSQL 源代码：https://www.postgresql.org/ftp/source/
b.  解压源代码压缩包，进入 PostgreSQL 根目录。
c.  配置编译参数（排除不必要的库）：

```bash
./configure --host=x86_64-w64-mingw32 \
            --without-readline \
            --without-zlib \
            --without-icu \
            --without-openssl
```
d.  仅编译所需的库文件：

```bash
make -C src/port
make -C src/common
make -C src/interfaces/libpq
```
e.  编译完成后，在以下路径找到 MinGW 编译生成的静态库文件（`.a` 文件）：
  - `src/interfaces/libpq/libpq.a`
  - `src/common/libpgcommon.a`
  - `src/port/libpgport.a`
f.  将这些 `.a` 文件复制到一个专用目录（例如`postgresql/lib-mingw32` 目录）。

3.  配置 Palpo 交叉编译环境

在 Palpo 源代码目录中，创建 `.cargo/config.toml` 文件，并写入以下内容，指定交叉编译配置：

```toml
[target.x86_64-pc-windows-gnu]
linker = "x86_64-w64-mingw32-gcc"
ar = "x86_64-w64-mingw32-gcc-ar"

rustflags = [
    "-L", "postgresql/lib-mingw32",  
    "-C", "link-args=-lpthread",
    "-C", "link-args=-lwinpthread",
]
```

4.  执行交叉编译

运行以下命令，等待编译完成：

```bash
cargo build --release --target x86_64-pc-windows-gnu
```
Windows 二进制文件会生成在 `target/x86_64-pc-windows-gnu/release/` 目录下，将其复制到 Windows 系统的任意目录。

---

**交叉编译二进制文件运行注意事项**

交叉编译生成的二进制文件默认采用动态链接方式。在 Windows 系统中双击生成的 `palpo.exe` 文件时，可能会触发以下错误：

> 无法在动态链接库 D:\palpo\palpo-mingw.exe 中定位程序入口点 nanosleep64

出现此问题的原因是，Palpo 运行需要依赖 MinGW 动态库文件 `libwinpthread-1.dll`。

1.  在 WSL 中找到 `libwinpthread-1.dll` 文件（路径因 Linux 发行版而异）：
```
/usr/x86_64-w64-mingw32/bin/libwinpthread-1.dll
```
2.  将该 DLL 文件复制到 Windows 系统中 `palpo.exe` 所在的同一目录，随后即可进行 Palpo 的配置与运行。

## 配置 Palpo

复制示例配置文件并重命名：

```powershell
copy palpo-example.toml palpo.toml
```

根据你的环境和数据库设置编辑 `palpo.toml`。至少需要：

- 设置 `server_name` 为你需要的域名，例如：

    ```toml
    server_name = "your.domain.com"
    ```

- 在 `[db]` 部分设置数据库 URL，匹配你上面创建的数据库、用户和密码，例如：

    ```toml
    [db]
    url = "postgresql://palpo:your_secure_password@localhost:5432/palpo"
    ```

将 `your.domain.com` 和 `your_secure_password` 替换为实际的域名和密码。

若在本地测试，将 `server_name` 设置为 `localhost:端口号`，例如 `localhost:8008`。同时配置 `well_known` 部分以指定客户端连接地址：

```toml
[well_known]
client = "http://127.0.0.1:8008"
```
若使用代理服务，务必配置正确的 `client`，确保外部可以访问。

更多高级配置请参见 [设置页面](../configuration/index.md)。

## 运行 Palpo

在命令行启动 Palpo：

```powershell
palpo.exe
```

## 设置为 Windows 服务（开机自启）

你可以使用内置的 `sc` 命令或 NSSM（推荐，Non-Sucking Service Manager）来实现 Palpo 开机自启。

### 使用 NSSM（推荐）

1. 下载并安装 [NSSM](https://nssm.cc/download)。
2. 以管理员身份打开命令提示符，运行：

    ```powershell
    nssm install Palpo
    ```
3. 在 NSSM 界面中：
    - 设置 `palpo.exe` 的路径
    - 设置启动目录为包含 `palpo.exe` 的文件夹
    - 点击 "Install service"
4. 启动服务：

    ```powershell
    nssm start Palpo
    ```

### 使用 Windows 内置服务管理器（进阶）

你也可以用 `sc` 命令创建服务：

```powershell
sc create Palpo binPath= "C:\\path\\to\\palpo.exe" start= auto
```

将 `C:\\path\\to\\palpo.exe` 替换为 Palpo 可执行文件的实际路径。

Palpo 现在会在开机时自动启动。
