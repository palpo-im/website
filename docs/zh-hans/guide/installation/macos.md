# 在 macOS 上安装

## 安装 PostgreSQL

请参考 [PostgreSQL 安装指南](./postgres.md) 安装并配置 PostgreSQL。

你可以通过 Homebrew 安装 PostgreSQL：

```bash
brew install postgresql
```

安装完成后，为 Palpo 创建数据库用户和数据库：

```bash
# 启动 postgresql 服务
brew services start postgresql
psql postgres

# 在 psql shell 中执行：
CREATE USER palpo WITH PASSWORD 'your_secure_password';
CREATE DATABASE palpo OWNER palpo;
```

将 `'your_secure_password'` 替换为强密码。这会创建名为 `palpo` 的 PostgreSQL 用户和数据库，并将该用户设为数据库所有者。

## 下载 Palpo 发行版

访问官方 GitHub 发布页面：

[https://github.com/palpo-im/palpo/releases](https://github.com/palpo-im/palpo/releases)

下载最新的 macOS 版本（如 `palpo-x.y.z-macos.zip`），并解压缩。

## 配置 Palpo

复制示例配置文件并重命名：

```bash
cp palpo-example.toml palpo.toml
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

```bash
./palpo
```

## 设置为 Launchd 服务（开机自启）

如需开机自动启动 Palpo，可创建 launchd 服务：

1. 在 `~/Library/LaunchAgents/im.palpo.palpo.plist` 创建如下内容的 plist 文件：

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

    将 `/path/to/palpo` 和 `/path/to` 替换为 Palpo 可执行文件及其目录的实际路径。

2. 加载服务：

    ```bash
    launchctl load ~/Library/LaunchAgents/im.palpo.palpo.plist
    ```

Palpo 现在会在登录时自动启动。