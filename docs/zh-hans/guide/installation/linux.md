# 在 Linux 上安装

## 安装 PostgreSQL

请参考 [PostgreSQL 安装指南](./postgres.md) 安装并配置 PostgreSQL。

安装完成后，为 Palpo 创建数据库用户和数据库：

```bash
# 切换到 postgres 用户
sudo -u postgres psql

# 在 psql shell 中执行：
CREATE USER palpo WITH PASSWORD 'your_secure_password';
CREATE DATABASE palpo OWNER palpo;
```

将 `'your_secure_password'` 替换为强密码。这会创建名为 `palpo` 的 PostgreSQL 用户和数据库，并将该用户设为数据库所有者。

## 下载 Palpo 发行版

访问官方 GitHub 发布页面：

[https://github.com/palpo-im/palpo/releases](https://github.com/palpo-im/palpo/releases)

下载适合你 Linux 发行版和架构的最新版本，并解压缩。

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

## 初始化数据库结构

Palpo 不会自动创建数据库表,在首次启动前需要运行数据库迁移。你需要先安装 `diesel_cli` 工具:

```bash
# 安装 diesel_cli (仅需 PostgreSQL 支持)
cargo install diesel_cli --no-default-features --features postgres
```

然后在 Palpo 可执行文件所在目录运行迁移:

```bash
# 设置数据库连接 URL
export DATABASE_URL="postgresql://palpo:your_secure_password@localhost:5432/palpo"

# 运行迁移
diesel migration run --migration-dir crates/data/migrations
```

如果你没有源代码中的 `crates/data/migrations` 目录,可以从 GitHub 下载:

```bash
# 克隆 migrations 目录
git clone --depth=1 --filter=blob:none --sparse https://github.com/palpo-im/palpo.git
cd palpo
git sparse-checkout set crates/data/migrations
```

或者从 [GitHub 仓库](https://github.com/palpo-im/palpo/tree/main/crates/data/migrations) 直接下载 migrations 文件夹。

## 运行 Palpo

在命令行启动 Palpo：

```bash
./palpo
```

## 设置为 Systemd 服务（开机自启）

如需开机自动启动 Palpo，可创建 systemd 服务文件：

1. 创建 `/etc/systemd/system/palpo.service`，内容如下：

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

    将 `/path/to/palpo` 替换为 Palpo 实际路径，并设置正确的用户。

2. 重新加载 systemd 并启用服务：

    ```bash
    sudo systemctl daemon-reload
    sudo systemctl enable palpo
    sudo systemctl start palpo
    ```

Palpo 现在会在开机时自动启动。