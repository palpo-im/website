# Using Postgres

PostgreSQL is a powerful, open-source object-relational database system that uses and extends the SQL language combined with many features that safely store and scale the most complicated data workloads. With over 35 years of active development, PostgreSQL has earned a strong reputation for reliability, feature robustness, and performance.

## Why PostgreSQL?

PostgreSQL offers several advantages that make it an excellent choice for modern applications:

- **ACID Compliance**: Ensures data integrity through Atomicity, Consistency, Isolation, and Durability
- **Extensibility**: Supports custom data types, operators, and functions
- **Standards Compliance**: Follows SQL standards while providing advanced features
- **Performance**: Excellent query optimization and indexing capabilities
- **Scalability**: Handles large datasets and concurrent users efficiently
- **JSON Support**: Native JSON and JSONB data types for flexible data storage
- **Full-Text Search**: Built-in text search capabilities
- **Replication**: Master-slave and master-master replication support


## Future Database Considerations

While **Currently, palpo only supports PostgreSQL** as the primary database, we may consider adding support for additional databases in the future, such as:

- **MySQL/MariaDB**: Popular relational database options
- **SQLite**: For lightweight deployments
- **MongoDB**: For document-based storage needs
- **Other databases**: Based on community feedback and use cases

The decision to expand database support will depend on user demand, development resources, and the specific requirements of different deployment scenarios.

## PostgreSQL Installation

This section covers how to install PostgreSQL on different operating systems and using Docker Compose.

### Linux Installation

#### Ubuntu/Debian

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

#### CentOS/RHEL/Fedora

```bash
# Install PostgreSQL (CentOS/RHEL)
sudo yum install postgresql-server postgresql-contrib
# or for Fedora
sudo dnf install postgresql-server postgresql-contrib

# Initialize database
sudo postgresql-setup initdb

# Start and enable PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Arch Linux

```bash
# Install PostgreSQL
sudo pacman -S postgresql

# Initialize database cluster
sudo -u postgres initdb -D /var/lib/postgres/data

# Start and enable PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### macOS Installation

#### Using Homebrew

```bash
# Install PostgreSQL
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Create a database
createdb mydatabase
```

#### Using PostgreSQL.app

1. Download PostgreSQL.app from [postgresapp.com](https://postgresapp.com/)
2. Drag the app to your Applications folder
3. Open the app and click "Initialize" to create a new server
4. Add `/Applications/Postgres.app/Contents/Versions/latest/bin` to your PATH

### Windows Installation

#### Using Official Installer

1. Download the PostgreSQL installer from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer as administrator
3. Follow the installation wizard:
   - Choose installation directory
   - Select components (PostgreSQL Server, pgAdmin, Command Line Tools)
   - Set data directory
   - Set superuser password
   - Set port (default: 5432)
   - Set locale
4. Complete the installation

#### Using Chocolatey

```powershell
# Install PostgreSQL using Chocolatey
choco install postgresql

# Start PostgreSQL service
net start postgresql-x64-13
```

### Docker Compose Installation

For a quick and portable PostgreSQL setup, you can use Docker Compose:

#### Basic Docker Compose Setup

Create a `docker-compose.yml` file:

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

#### Advanced Docker Compose with pgAdmin

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

#### Running Docker Compose

```bash
# Start the services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs postgres

# Stop the services
docker-compose down

# Stop and remove volumes (⚠️ This will delete all data)
docker-compose down -v
```

### Post-Installation Setup

After installing PostgreSQL, you'll need to:

1. **Create a database for palpo**:

```sql
CREATE DATABASE palpo;
CREATE USER palpo_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE palpo TO palpo_user;
```

1. **Configure connection settings** in your palpo application configuration file with the appropriate database URL:

```env
postgresql://palpo_user:your_secure_password@localhost:5432/palpo
```

1. **Test the connection** to ensure everything is working correctly.

With PostgreSQL installed and configured, you're ready to set up palpo. Make sure to update your application's database configuration with the correct connection details before proceeding with the application setup.
