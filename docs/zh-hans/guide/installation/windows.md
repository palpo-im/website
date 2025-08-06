# Windows 下安装

PostgreSQL 是一个功能强大的开源对象关系数据库系统，它使用并扩展了 SQL 语言，结合了许多安全存储和扩展最复杂数据工作负载的功能。经过 35 年以上的积极开发，PostgreSQL 在可靠性、功能稳健性和性能方面赢得了良好的声誉。

## 为什么选择 PostgreSQL？

PostgreSQL 提供了几个优势，使其成为现代应用程序的绝佳选择：

- **ACID 合规性**：通过原子性、一致性、隔离性和持久性确保数据完整性
- **可扩展性**：支持自定义数据类型、操作符和函数
- **标准合规性**：遵循 SQL 标准，同时提供高级功能
- **性能**：出色的查询优化和索引功能
- **可扩展性**：高效处理大型数据集和并发用户
- **JSON 支持**：原生 JSON 和 JSONB 数据类型，支持灵活的数据存储
- **全文搜索**：内置文本搜索功能
- **复制**：支持主从和主主复制


## 未来数据库考虑

虽然 **Palpo 仅支持 PostgreSQL**，但我们可能会考虑在未来添加对其他数据库的支持，例如：

- **MySQL/MariaDB**：流行的关系数据库选项
- **SQLite**：用于轻量级部署
- **MongoDB**：用于基于文档的存储需求
- **其他数据库**：基于社区反馈和使用案例

扩展数据库支持的决定将取决于用户需求、开发资源和不同部署场景的具体要求。

## PostgreSQL 安装

本节介绍如何在不同操作系统上安装 PostgreSQL 以及使用 Docker Compose。

### Linux 安装

#### Ubuntu/Debian

```bash
# 更新包列表
sudo apt update

# 安装 PostgreSQL
sudo apt install postgresql postgresql-contrib

# 启动并启用 PostgreSQL 服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 切换到 postgres 用户并创建数据库
sudo -u postgres psql
```

#### CentOS/RHEL/Fedora

```bash
# 安装 PostgreSQL (CentOS/RHEL)
sudo yum install postgresql-server postgresql-contrib
# 或者对于 Fedora
sudo dnf install postgresql-server postgresql-contrib

# 初始化数据库
sudo postgresql-setup initdb

# 启动并启用 PostgreSQL 服务
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Arch Linux

```bash
# 安装 PostgreSQL
sudo pacman -S postgresql

# 初始化数据库集群
sudo -u postgres initdb -D /var/lib/postgres/data

# 启动并启用 PostgreSQL 服务
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### macOS 安装

#### 使用 Homebrew

```bash
# 安装 PostgreSQL
brew install postgresql

# 启动 PostgreSQL 服务
brew services start postgresql

# 创建数据库
createdb mydatabase
```

#### 使用 PostgreSQL.app

1. 从 [postgresapp.com](https://postgresapp.com/) 下载 PostgreSQL.app
2. 将应用程序拖到应用程序文件夹
3. 打开应用程序并点击"Initialize"创建新服务器
4. 将 `/Applications/Postgres.app/Contents/Versions/latest/bin` 添加到 PATH

### Windows 安装

#### 使用官方安装程序

1. 从 [postgresql.org](https://www.postgresql.org/download/windows/) 下载 PostgreSQL 安装程序
2. 以管理员身份运行安装程序
3. 按照安装向导操作：
   - 选择安装目录
   - 选择组件（PostgreSQL 服务器、pgAdmin、命令行工具）
   - 设置数据目录
   - 设置超级用户密码
   - 设置端口（默认：5432）
   - 设置区域设置
4. 完成安装

#### 使用 Chocolatey

```powershell
# 使用 Chocolatey 安装 PostgreSQL
choco install postgresql

# 启动 PostgreSQL 服务
net start postgresql-x64-13
```

### Docker Compose 安装

对于快速和便携的 PostgreSQL 设置，您可以使用 Docker Compose：

#### 基本 Docker Compose 设置

创建 `docker-compose.yml` 文件：

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: palpo-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: palpo
      POSTGRES_USER: palpo_user
      POSTGRES_PASSWORD: your_secure_password
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    networks:
      - palpo-network

volumes:
  postgres_data:

networks:
  palpo-network:
    driver: bridge
```

#### 包含 pgAdmin 的高级 Docker Compose

对于数据库管理，您还可以包含 pgAdmin：

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: palpo-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: palpo
      POSTGRES_USER: palpo_user
      POSTGRES_PASSWORD: your_secure_password
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - palpo-network

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: palpo-pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@palpo.im
      PGADMIN_DEFAULT_PASSWORD: admin_password
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    ports:
      - "8080:80"
    networks:
      - palpo-network
    depends_on:
      - postgres

volumes:
  postgres_data:
  pgadmin_data:

networks:
  palpo-network:
    driver: bridge
```

#### 运行 Docker Compose

```bash
# 启动服务
docker-compose up -d

# 检查服务状态
docker-compose ps

# 查看日志
docker-compose logs postgres

# 停止服务
docker-compose down

# 停止并删除卷（⚠️ 这将删除所有数据）
docker-compose down -v
```

### 安装后设置

安装 PostgreSQL 后，您需要：

1. **为 palpo 创建数据库**：

```sql
CREATE DATABASE palpo;
CREATE USER palpo_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE palpo TO palpo_user;
```

1. **在 palpo 应用程序配置文件中配置连接设置**，使用适当的数据库 URL：

```env
postgresql://palpo_user:your_secure_password@localhost:5432/palpo
```

1. **测试连接**以确保一切正常工作。

安装和配置 PostgreSQL 后，您就可以设置 palpo 了。在继续应用程序设置之前，请确保使用正确的连接详细信息更新应用程序的数据库配置。
