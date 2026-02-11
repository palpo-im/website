# 监控

本指南介绍 Palpo 服务器的监控策略，以确保可靠性和性能。

## 关键监控指标

### 服务器健康

| 指标 | 描述 | 告警阈值 |
|-----|------|---------|
| CPU 使用率 | 服务器 CPU 利用率 | 持续 >80% |
| 内存使用率 | RAM 利用率 | >85% |
| 磁盘空间 | 存储利用率 | >80% |
| 磁盘 I/O | 读写操作 | 高延迟 |

### 应用指标

| 指标 | 描述 | 告警阈值 |
|-----|------|---------|
| HTTP 响应时间 | API 延迟 | p95 >500ms |
| 错误率 | 5xx 响应 | >1% |
| 活跃连接 | 并发用户 | 接近最大限制 |
| 联邦队列 | 待处理的联邦事件 | 持续增长 |

### 数据库指标

| 指标 | 描述 | 告警阈值 |
|-----|------|---------|
| 查询时间 | 数据库查询延迟 | 平均 >100ms |
| 连接池 | 活跃连接数 | >80% 池大小 |
| 复制延迟 | 如果使用副本 | >10 秒 |
| 表膨胀 | 死元组 | >20% 表大小 |

## 日志配置

### 基本日志

在 `palpo.toml` 中配置日志：

```toml
[logger]
# 日志级别：trace, debug, info, warn, error
level = "info"
# 输出格式：json, pretty
format = "json"
# 启用 ANSI 颜色（用于终端输出）
color = false
```

### 结构化日志

对于生产环境，使用 JSON 格式便于解析：

```toml
[logger]
format = "json"
level = "info"
```

日志输出：
```json
{"timestamp":"2024-01-15T10:30:00Z","level":"info","target":"palpo","message":"Request processed","method":"GET","path":"/_matrix/client/v3/sync","status":200,"duration_ms":45}
```

### 日志轮转

使用 logrotate 管理日志文件：

```
# /etc/logrotate.d/palpo
/var/log/palpo/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 palpo palpo
    postrotate
        systemctl reload palpo > /dev/null 2>&1 || true
    endscript
}
```

## 健康检查

### HTTP 健康端点

检查服务器健康：

```bash
curl -f http://localhost:8008/_matrix/client/versions
```

### Systemd 健康检查

```ini
# /etc/systemd/system/palpo.service
[Service]
ExecStart=/usr/local/bin/palpo --config /etc/palpo/palpo.toml
ExecReload=/bin/kill -HUP $MAINPID
Type=simple
Restart=on-failure
RestartSec=5

# 健康检查
WatchdogSec=30s
```

### Docker 健康检查

```yaml
# docker-compose.yml
services:
  palpo:
    image: palpo/palpo:latest
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8008/_matrix/client/versions"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## Prometheus 指标

### 暴露指标

Palpo 可以暴露 Prometheus 兼容的指标。在配置中启用：

```toml
[metrics]
enable = true
port = 9090
```

### 常见指标

```
# HTTP 请求持续时间
palpo_http_request_duration_seconds{method="GET",path="/sync"}

# 活跃连接
palpo_active_connections

# 联邦队列大小
palpo_federation_queue_size

# 数据库查询持续时间
palpo_db_query_duration_seconds{query_type="select"}
```

### Prometheus 配置

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'palpo'
    static_configs:
      - targets: ['localhost:9090']
    scrape_interval: 15s
```

## Grafana 仪表板

### 关键面板

1. **请求速率** - 每秒请求数
2. **响应时间** - p50、p95、p99 延迟
3. **错误率** - 4xx 和 5xx 响应
4. **活跃用户** - 并发连接用户
5. **联邦健康** - 队列大小和投递率
6. **资源使用** - CPU、内存、磁盘

### 示例仪表板 JSON

```json
{
  "title": "Palpo 概览",
  "panels": [
    {
      "title": "请求速率",
      "type": "graph",
      "targets": [
        {
          "expr": "rate(palpo_http_requests_total[5m])",
          "legendFormat": "{{method}} {{path}}"
        }
      ]
    },
    {
      "title": "响应时间 (p95)",
      "type": "graph",
      "targets": [
        {
          "expr": "histogram_quantile(0.95, rate(palpo_http_request_duration_seconds_bucket[5m]))",
          "legendFormat": "p95"
        }
      ]
    }
  ]
}
```

## 告警

### 告警示例

**高错误率：**
```yaml
- alert: HighErrorRate
  expr: rate(palpo_http_requests_total{status=~"5.."}[5m]) / rate(palpo_http_requests_total[5m]) > 0.01
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "Palpo 错误率过高"
    description: "错误率为 {{ $value | humanizePercentage }}"
```

**响应时间过慢：**
```yaml
- alert: SlowResponseTime
  expr: histogram_quantile(0.95, rate(palpo_http_request_duration_seconds_bucket[5m])) > 0.5
  for: 10m
  labels:
    severity: warning
  annotations:
    summary: "Palpo 响应时间过慢"
    description: "p95 延迟为 {{ $value }}s"
```

**联邦队列增长：**
```yaml
- alert: FederationQueueGrowing
  expr: increase(palpo_federation_queue_size[1h]) > 1000
  for: 30m
  labels:
    severity: warning
  annotations:
    summary: "联邦队列正在增长"
```

**磁盘空间不足：**
```yaml
- alert: LowDiskSpace
  expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) < 0.2
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "磁盘空间不足"
    description: "仅剩余 {{ $value | humanizePercentage }} 磁盘空间"
```

## 外部监控

### 可用性监控服务

从外部监控服务器可用性：
- UptimeRobot
- Pingdom
- StatusCake
- Better Uptime

**监控端点：**
```
https://your-server.com/_matrix/client/versions
```

### 联邦测试器

测试联邦连通性：
```
https://federationtester.matrix.org/api/report?server_name=your-server.com
```

## 通过监控排查问题

### CPU 使用率过高

1. 检查数据库中的慢查询
2. 审查活跃请求
3. 检查联邦问题
4. 检查失控进程

### 内存泄漏

1. 长期监控内存
2. 检查连接池是否增长
3. 审查长时间运行的操作
4. 如需要，考虑计划重启

### 响应缓慢

1. 检查数据库查询时间
2. 审查磁盘 I/O
3. 检查网络延迟
4. 检查锁争用

### 联邦问题

1. 监控联邦队列大小
2. 检查目标服务器健康状况
3. 查看错误日志了解具体故障
4. 通过 Admin API 重置有问题的连接

## 最佳实践

1. **在问题发生前设置告警** - 不要等用户报告问题
2. **监控趋势，而不仅仅是阈值** - 逐渐增加可能表明正在发展的问题
3. **保留历史数据** - 对容量规划和调试很有用
4. **记录监控设置** - 以便他人理解和维护
5. **测试告警** - 确保它们在预期时触发
6. **准备运维手册** - 记录常见告警的响应程序
