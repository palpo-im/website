# 备份与恢复

本指南介绍 Palpo 服务器的备份策略，以确保数据安全和快速恢复。

## 需要备份的内容

### 关键数据

1. **PostgreSQL 数据库** - 包含所有用户数据、房间状态、消息和服务器配置
2. **媒体文件** - 存储在 `space_path` 目录中的用户上传文件
3. **配置文件** - 您的 `palpo.toml` 或等效文件
4. **签名密钥** - 服务器签名密钥（如果单独存储）

### 备份优先级

| 组件 | 优先级 | 恢复影响 |
|-----|-------|---------|
| 数据库 | 关键 | 丢失意味着完全数据丢失 |
| 媒体 | 高 | 丢失意味着上传的文件不可用 |
| 配置 | 中 | 可以重新创建但需要时间 |
| 日志 | 低 | 对调试有用，但不是必需的 |

## 数据库备份

### PostgreSQL 备份方法

#### pg_dump（推荐用于中小型服务器）

**完整备份：**
```bash
pg_dump -h localhost -U palpo -d palpo -F c -f palpo_backup_$(date +%Y%m%d).dump
```

**压缩备份：**
```bash
pg_dump -h localhost -U palpo -d palpo | gzip > palpo_backup_$(date +%Y%m%d).sql.gz
```

#### pg_basebackup（用于大型数据库）

```bash
pg_basebackup -h localhost -U palpo -D /backup/pg_base -Ft -z -P
```

### 自动备份脚本

创建 `/etc/cron.daily/palpo-backup`：

```bash
#!/bin/bash
BACKUP_DIR="/backup/palpo"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
pg_dump -h localhost -U palpo -d palpo -F c -f "$BACKUP_DIR/db_$DATE.dump"

# 备份媒体（使用 rsync 增量备份）
rsync -av --delete /var/lib/palpo/media/ "$BACKUP_DIR/media/"

# 备份配置
cp /etc/palpo/palpo.toml "$BACKUP_DIR/palpo.toml"

# 清理旧备份（保留 7 天）
find $BACKUP_DIR -name "db_*.dump" -mtime +7 -delete

# 记录完成
echo "$(date): 备份完成" >> /var/log/palpo-backup.log
```

设置可执行权限：
```bash
chmod +x /etc/cron.daily/palpo-backup
```

## 媒体备份

### rsync 方法

**初始完整备份：**
```bash
rsync -avz /var/lib/palpo/media/ /backup/palpo/media/
```

**增量备份：**
```bash
rsync -avz --delete /var/lib/palpo/media/ /backup/palpo/media/
```

### 远程备份

**到远程服务器：**
```bash
rsync -avz -e ssh /var/lib/palpo/media/ user@backup-server:/backup/palpo/media/
```

**到 S3 兼容存储：**
```bash
# 使用 rclone
rclone sync /var/lib/palpo/media/ s3:bucket-name/palpo-media/
```

## 配置备份

将配置保存在版本控制中：

```bash
# 初始设置
cd /etc/palpo
git init
git add palpo.toml
git commit -m "初始配置"

# 更改后
git add -A
git commit -m "更改描述"
```

## 恢复流程

### 完整服务器恢复

1. **在新服务器上安装 Palpo**

2. **恢复 PostgreSQL 数据库：**
   ```bash
   # 创建数据库
   createdb -U postgres palpo

   # 从转储恢复
   pg_restore -h localhost -U palpo -d palpo palpo_backup.dump
   ```

3. **恢复媒体文件：**
   ```bash
   rsync -avz backup-server:/backup/palpo/media/ /var/lib/palpo/media/
   ```

4. **恢复配置：**
   ```bash
   cp /backup/palpo/palpo.toml /etc/palpo/palpo.toml
   ```

5. **验证权限：**
   ```bash
   chown -R palpo:palpo /var/lib/palpo
   ```

6. **启动 Palpo：**
   ```bash
   systemctl start palpo
   ```

### 仅数据库恢复

```bash
# 停止 Palpo
systemctl stop palpo

# 删除并重新创建数据库
dropdb -U postgres palpo
createdb -U postgres palpo

# 恢复
pg_restore -h localhost -U palpo -d palpo palpo_backup.dump

# 启动 Palpo
systemctl start palpo
```

### 时间点恢复（PITR）

对于需要最小数据丢失的生产服务器：

1. **在 PostgreSQL 中启用 WAL 归档：**
   ```
   # postgresql.conf
   archive_mode = on
   archive_command = 'cp %p /backup/wal/%f'
   ```

2. **创建基础备份：**
   ```bash
   pg_basebackup -h localhost -U palpo -D /backup/base -Ft -z -P
   ```

3. **恢复到特定时间点：**
   ```bash
   # recovery.conf
   restore_command = 'cp /backup/wal/%f %p'
   recovery_target_time = '2024-01-15 14:30:00'
   ```

## 备份验证

### 定期测试备份

**数据库备份验证：**
```bash
# 恢复到测试数据库
createdb -U postgres palpo_test
pg_restore -h localhost -U postgres -d palpo_test palpo_backup.dump

# 验证数据
psql -U postgres -d palpo_test -c "SELECT COUNT(*) FROM users;"

# 清理
dropdb -U postgres palpo_test
```

**自动验证脚本：**
```bash
#!/bin/bash
BACKUP_FILE="/backup/palpo/db_latest.dump"

# 恢复到测试数据库
createdb -U postgres palpo_verify 2>/dev/null || dropdb -U postgres palpo_verify && createdb -U postgres palpo_verify
pg_restore -h localhost -U postgres -d palpo_verify $BACKUP_FILE

# 验证
USERS=$(psql -U postgres -d palpo_verify -t -c "SELECT COUNT(*) FROM users;")
ROOMS=$(psql -U postgres -d palpo_verify -t -c "SELECT COUNT(*) FROM rooms;")

echo "验证结果：$USERS 个用户，$ROOMS 个房间"

# 清理
dropdb -U postgres palpo_verify
```

## 备份存储建议

### 本地存储
- 快速恢复
- 如果服务器故障有丢失风险
- 适合作为初始备份目标

### 远程/异地存储
- 防止站点故障
- 恢复较慢
- 灾难恢复必不可少

### 云存储
- 高度持久
- 按使用量付费
- 适合长期归档

### 推荐策略：3-2-1 规则
- **3** 份数据副本
- **2** 种不同的存储介质
- **1** 份异地备份

## 备份计划建议

| 服务器规模 | 数据库 | 媒体 | 配置 |
|-----------|-------|------|-----|
| 小型（<100 用户） | 每日 | 每周 | 更改时 |
| 中型（100-1000） | 每 6 小时 | 每日 | 更改时 |
| 大型（>1000） | 每小时 + PITR | 每日增量 | 更改时 |
