# 在 Windows 上安装

## 安装 PostgreSQL

请参考 [PostgreSQL 安装指南](./postgres.md) 安装并配置 PostgreSQL。

安装完成后，为 Palpo 创建数据库用户和数据库：

1. 从开始菜单打开 "SQL Shell (psql)"，或在终端运行 `psql`。
2. 在 psql shell 中执行：

    ```sql
    CREATE USER palpo WITH PASSWORD 'your_secure_password';
    CREATE DATABASE palpo OWNER palpo;
    \q
    ```

将 `'your_secure_password'` 替换为强密码。这会创建名为 `palpo` 的 PostgreSQL 用户和数据库，并将该用户设为数据库所有者。

## 下载 Palpo 发行版

访问官方 GitHub 发布页面：

[https://github.com/palpo-im/palpo/releases](https://github.com/palpo-im/palpo/releases)

下载最新的 Windows 版本（如 `palpo-x.y.z-windows.zip`），并解压缩。

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