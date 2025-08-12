# Palpo 构建指南

本文档提供了在不同平台上构建 Palpo Matrix 服务器的详细说明。

## 目录

- [系统要求](#系统要求 "系统要求")
- [macOS/Linux 构建](#macoslinux-构建 "macOS/Linux 构建")
- [Windows 构建](#windows-构建 "Windows 构建")
- [Docker 构建](#docker-构建 "Docker 构建")
- [数据库设置和迁移](#数据库设置和迁移 "数据库设置和迁移")
- [开发环境设置](#开发环境设置 "开发环境设置")

## 系统要求

### 基础要求
- [Rust](https://www.rust-lang.org/) 1.70+ (推荐使用最新稳定版)
- [PostgreSQL](https://www.postgresql.org/) 12+
- [Git](https://git-scm.com/)
- [Diesel CLI](https://diesel.rs/guides/getting-started) (用于数据库迁移)

### 平台特定要求
- **Linux**: `libclang-dev`, `libpq-dev`, `cmake`
- **macOS**: [Xcode Command Line Tools](https://developer.apple.com/xcode/resources/)
- **Windows**: [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022) 2019+

## macOS/Linux 构建

### 1. 安装依赖

#### macOS
```bash
# 安装 Homebrew (如果未安装)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装依赖
brew install postgresql cmake
```

更多信息请参考：
- [Homebrew 官方文档](https://brew.sh/)
- [PostgreSQL macOS 安装指南](https://www.postgresql.org/download/macosx/)

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install -y \
    curl \
    build-essential \
    libclang-dev \
    libpq-dev \
    cmake \
    postgresql \
    postgresql-contrib
```

更多信息请参考：
- [PostgreSQL Ubuntu 安装指南](https://www.postgresql.org/download/linux/ubuntu/)
- [Ubuntu 开发工具安装](https://ubuntu.com/server/docs/programming-c)

#### CentOS/RHEL/Fedora
```bash
# CentOS/RHEL
sudo yum install -y gcc gcc-c++ cmake postgresql-devel clang-devel

# Fedora
sudo dnf install -y gcc gcc-c++ cmake postgresql-devel clang-devel
```

更多信息请参考：
- [PostgreSQL Red Hat 安装指南](https://www.postgresql.org/download/linux/redhat/)
- [Fedora 开发工具](https://docs.fedoraproject.org/en-US/quick-docs/installing-plugins-for-playing-movies-and-music/)

### 2. 安装 Rust 和 Diesel CLI
```bash
# 安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# 安装 Diesel CLI (PostgreSQL 支持)
cargo install diesel_cli --no-default-features --features postgres
```

更多信息请参考：
- [Rust 官方安装指南](https://www.rust-lang.org/tools/install)
- [Diesel CLI 文档](https://diesel.rs/guides/getting-started)

### 3. 克隆并构建项目
```bash
# 克隆项目
git clone https://github.com/palpo/palpo.git
cd palpo

# 构建项目
cargo build --release

# 构建完成后，可执行文件位于
./target/release/palpo
```

## Windows 构建

### 1. 安装依赖

#### 使用 Chocolatey (推荐)
```powershell
# 以管理员身份运行 PowerShell
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

# 安装依赖
choco install rust postgresql cmake git
```

更多信息请参考：
- [Chocolatey 官方文档](https://chocolatey.org/install)
- [PostgreSQL Windows 安装指南](https://www.postgresql.org/download/windows/)
- [Rust Windows 安装指南](https://forge.rust-lang.org/infra/channel-layout.html#windows)

### 2. 安装 Diesel CLI
```powershell
# 安装 Diesel CLI
cargo install diesel_cli --no-default-features --features postgres
```

### 3. 设置环境变量
```powershell
# 添加到系统 PATH (根据实际安装路径调整)
$env:PATH += ";C:\Program Files\PostgreSQL\15\bin"
$env:PATH += ";C:\Program Files\CMake\bin"
```

### 4. 构建项目
```powershell
# 克隆项目
git clone https://github.com/palpo/palpo.git
cd palpo

# 构建项目
cargo build --release

# 可执行文件位于
.\target\release\palpo.exe
```

## 数据库设置和迁移

### 1. 创建数据库和用户

#### macOS/Linux
```bash
# 启动 PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS

# 创建数据库和用户
sudo -u postgres psql
```

#### Windows
```powershell
# 启动 PostgreSQL 服务
net start postgresql-x64-15  # 根据版本调整

# 连接数据库
psql -U postgres
```

#### 在 psql 中执行
```sql
-- 创建用户
CREATE USER palpo WITH PASSWORD 'your_password';

-- 创建数据库
CREATE DATABASE palpo OWNER palpo;

-- 授予权限
GRANT ALL PRIVILEGES ON DATABASE palpo TO palpo;

-- 退出
\q
```

更多信息请参考：
- [PostgreSQL 用户管理文档](https://www.postgresql.org/docs/current/user-manag.html)
- [PostgreSQL 数据库创建文档](https://www.postgresql.org/docs/current/manage-ag-createdb.html)

### 2. 配置数据库连接

设置环境变量或创建 `.env` 文件：

```bash
# 方法1: 设置环境变量
export DATABASE_URL="postgres://palpo:your_password@localhost:5432/palpo"

# 方法2: 创建 .env 文件
echo "DATABASE_URL=postgres://palpo:your_password@localhost:5432/palpo" > .env
```

### 3. 运行数据库迁移

```bash
# 进入 data crate 目录
cd crates/data

# 运行迁移 (创建所有表和索引)
diesel migration run

# 验证迁移状态
diesel migration list
```

### 4. 迁移管理命令

```bash
# 查看迁移状态
diesel migration list

# 回滚最后一次迁移
diesel migration revert

# 重新运行所有迁移
diesel migration redo

# 生成新的迁移文件 (开发时使用)
diesel migration generate migration_name
```

更多信息请参考：
- [Diesel 迁移指南](https://diesel.rs/guides/migration)
- [PostgreSQL 连接字符串格式](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)

### 5. 验证数据库结构

连接数据库验证表是否创建成功：

```bash
psql -U palpo -d palpo -h localhost
```

```sql
-- 查看所有表
\dt

-- 查看表结构示例
\d users
\d rooms
\d events

-- 退出
\q
```

## Docker 构建

### 1. 使用预构建镜像 (推荐)
```bash
# 克隆项目获取配置文件
git clone https://github.com/palpo/palpo.git
cd palpo/deploy/docker

# 编辑配置文件
cp palpo.toml.example palpo.toml
# 编辑 palpo.toml 设置你的服务器名称和数据库连接

# 启动服务 (包含自动数据库迁移)
docker compose up -d
```

更多信息请参考：
- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)

### 2. Docker 环境数据库迁移

Docker 环境中的数据库迁移会自动执行，但你也可以手动运行：

```bash
# 查看迁移状态
docker compose exec palpo diesel migration list

# 手动运行迁移
docker compose exec palpo diesel migration run

# 如果需要进入容器调试
docker compose exec palpo bash
```

### 3. Docker Compose 配置示例

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: palpo
      POSTGRES_PASSWORD: changeme
      POSTGRES_DB: palpo
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U palpo"]
      interval: 10s
      timeout: 5s
      retries: 5

  palpo:
    image: palpo:latest
    ports:
      - "8008:8008"
      - "8448:8448"
    environment:
      DATABASE_URL: "postgres://palpo:changeme@postgres:5432/palpo"
      PALPO_CONFIG: '/var/palpo/palpo.toml'
    volumes:
      - ./palpo.toml:/var/palpo/palpo.toml
      - palpo_media:/var/palpo/media
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
  palpo_media:
```

## 开发环境设置

### 1. 安装开发工具
```bash
# 安装 Rust 开发工具
rustup component add rustfmt clippy

# 安装 cargo 扩展
cargo install cargo-watch cargo-edit
```

更多信息请参考：
- [Rustup 文档](https://rust-lang.github.io/rustup/)
- [Cargo 工具文档](https://doc.rust-lang.org/cargo/)

### 2. 设置开发数据库
```bash
# 创建开发数据库
createdb palpo_dev

# 设置开发环境变量
export DATABASE_URL="postgres://palpo:your_password@localhost:5432/palpo_dev"

# 运行迁移
cd crates/data
diesel migration run
```

### 3. 运行开发服务器
```bash
# 复制示例配置
cp crates/server/palpo.toml palpo-dev.toml

# 编辑配置文件设置开发环境
# 修改 server_name, listen_addr, 数据库连接等

# 运行开发服务器
PALPO_CONFIG=palpo-dev.toml cargo run

# 或使用 cargo-watch 自动重载
cargo watch -x 'run'
```

### 4. 验证服务器运行
启动成功后，使用以下命令测试服务器是否正常运行：

```bash
# 检查服务器版本信息
curl http://yourservername:6006/_matrix/client/versions

# 预期返回 JSON 格式的版本信息，类似：
{
  "versions": ["r0.5.0", "r0.6.0", "v1.1", "v1.2", "v1.3", "v1.4", "v1.5", "v1.6"],
  "unstable_features": {}
}
```

如果返回上述 JSON 数据，说明 Palpo 服务器已成功启动并正常运行。

更多关于 Matrix API 的信息请参考：
- [Matrix 客户端-服务器 API 规范](https://spec.matrix.org/latest/client-server-api/)
- [Matrix 服务器发现规范](https://spec.matrix.org/latest/server-server-api/#server-discovery)

## 数据库架构说明

Palpo 使用以下主要数据表：

- **用户相关**: `users`, `user_passwords`, `user_sessions`, `user_profiles`, `user_access_tokens`
- **房间相关**: `rooms`, `room_aliases`, `room_tags`
- **事件相关**: `events`, `event_datas`, `event_points`, `threads`
- **媒体相关**: `media_metadatas`, `media_thumbnails`, `media_url_previews`
- **端到端加密**: `e2e_device_keys`, `e2e_room_keys`, `e2e_room_keys_versions`
- **统计相关**: `stats_user_daily_visits`, `stats_monthly_active_users`, `stats_room_currents`
- **其他**: `threepid_*`, `user_pushers`, `server_signing_keys`

所有表的详细结构可以在 `crates/data/migrations/` 目录中查看。

## 故障排除

### 数据库相关问题

1. **迁移失败**:
```bash
# 检查数据库连接
psql $DATABASE_URL -c "SELECT version();"

# 检查迁移状态
diesel migration list

# 重置数据库 (谨慎使用)
dropdb palpo && createdb palpo
diesel migration run
```

2. **权限问题**:
```sql
-- 确保用户有足够权限
GRANT ALL PRIVILEGES ON DATABASE palpo TO palpo;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO palpo;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO palpo;
```

3. **连接问题**:
```bash
# 测试数据库连接
pg_isready -h localhost -p 5432 -U palpo

# 检查 PostgreSQL 状态
sudo systemctl status postgresql  # Linux
brew services list | grep postgres  # macOS
```

更多故障排除信息请参考：
- [PostgreSQL 故障排除文档](https://www.postgresql.org/docs/current/troubleshooting.html)
- [Diesel 故障排除指南](https://diesel.rs/guides/troubleshooting)

### 常见问题

1. **编译错误**: 确保安装了所有必需的系统依赖
2. **Diesel CLI 安装失败**: 确保安装了 `libpq-dev` (Linux) 或 PostgreSQL 开发库
3. **端口冲突**: 修改 `listen_addr` 使用不同端口
4. **权限问题**: 确保 Palpo 有权限访问配置文件和媒体目录

### 日志调试
```bash
# 启用详细日志
RUST_LOG=debug ./target/release/palpo

# 数据库查询日志
RUST_LOG=diesel=debug ./target/release/palpo
```

更多调试信息请参考：
- [Rust 日志配置文档](https://docs.rs/env_logger/latest/env_logger/)
- [Tracing 文档](https://docs.rs/tracing/latest/tracing/)