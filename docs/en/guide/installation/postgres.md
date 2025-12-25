# PostgreSQL Installation

This section explains how to install PostgreSQL on different operating systems and using Docker Compose.

## Linux Installation

### Ubuntu/Debian

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start and enable PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Switch to postgres user and create database
sudo -u postgres psql
```

### CentOS/RHEL/Fedora

```bash
# Install PostgreSQL (CentOS/RHEL)
sudo yum install postgresql-server postgresql-contrib
# Or for Fedora
sudo dnf install postgresql-server postgresql-contrib

# Initialize database
sudo postgresql-setup initdb

# Start and enable PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Arch Linux

```bash
# Install PostgreSQL
sudo pacman -S postgresql

# Initialize database cluster
sudo -u postgres initdb -D /var/lib/postgres/data

# Start and enable PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## macOS Installation

### Using Homebrew

```bash
# Install PostgreSQL
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Create database
createdb mydatabase
```

### Using PostgreSQL.app

1. Download PostgreSQL.app from [postgresapp.com](https://postgresapp.com/)
2. Drag the application to your Applications folder
3. Open the app and click "Initialize" to create a new server
4. Add `/Applications/Postgres.app/Contents/Versions/latest/bin` to your PATH

### Windows Installation

#### Using Official Installer

1. Download PostgreSQL installer from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer as administrator
3. Follow the installation wizard:
   - Select installation directory
   - Choose components (PostgreSQL server, pgAdmin, command line tools)
   - Set data directory
   - Set superuser password
   - Set port (default: 5432)
   - Set locale
4. Complete installation

## Docker Compose Installation

For quick and portable PostgreSQL setup, you can use Docker Compose:

### Basic Docker Compose Setup

Create `docker-compose.yml` file:

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

### Advanced Docker Compose with pgAdmin

For database management, you can also include pgAdmin:

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

### Running Docker Compose

```bash
# Start services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs postgres

# Stop services
docker-compose down

# Stop and remove volumes (⚠️ This will delete all data)
docker-compose down -v
```

## Post-Installation Setup

After installing PostgreSQL, you need to:

1. **Create database for palpo**:

```sql
CREATE DATABASE palpo;
CREATE USER palpo_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE palpo TO palpo_user;
```

2. **Configure connection settings in palpo application configuration file** using appropriate database URL:

```
postgresql://palpo_user:your_secure_password@localhost:5432/palpo
```

3. **Test connection** to ensure everything works properly.

After installing and configuring PostgreSQL, you're ready to set up palpo. Make sure to update your application's database configuration with the correct connection details before proceeding with application setup.
{/* 本行由工具自动生成,原文哈希值:a517ef902d1e82c158060f7e5f040af7 */}