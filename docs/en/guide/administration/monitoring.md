# Monitoring

This guide covers monitoring strategies for your Palpo server to ensure reliability and performance.

## Key Metrics to Monitor

### Server Health

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| CPU Usage | Server CPU utilization | >80% sustained |
| Memory Usage | RAM utilization | >85% |
| Disk Space | Storage utilization | >80% |
| Disk I/O | Read/write operations | High latency |

### Application Metrics

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| HTTP Response Time | API latency | >500ms p95 |
| Error Rate | 5xx responses | >1% |
| Active Connections | Concurrent users | Near max limit |
| Federation Queue | Pending federation events | Growing continuously |

### Database Metrics

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| Query Time | Database query latency | >100ms average |
| Connection Pool | Active connections | >80% pool size |
| Replication Lag | If using replicas | >10 seconds |
| Table Bloat | Dead tuples | >20% table size |

## Logging Configuration

### Basic Logging

Configure logging in your `palpo.toml`:

```toml
[logger]
# Log level: trace, debug, info, warn, error
level = "info"
# Output format: json, pretty
format = "json"
# Enable ANSI colors (for terminal output)
color = false
```

### Structured Logging

For production, use JSON format for easier parsing:

```toml
[logger]
format = "json"
level = "info"
```

Log output:
```json
{"timestamp":"2024-01-15T10:30:00Z","level":"info","target":"palpo","message":"Request processed","method":"GET","path":"/_matrix/client/v3/sync","status":200,"duration_ms":45}
```

### Log Rotation

Use logrotate for managing log files:

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

## Health Checks

### HTTP Health Endpoint

Check server health:

```bash
curl -f http://localhost:8008/_matrix/client/versions
```

### Systemd Health Check

```ini
# /etc/systemd/system/palpo.service
[Service]
ExecStart=/usr/local/bin/palpo --config /etc/palpo/palpo.toml
ExecReload=/bin/kill -HUP $MAINPID
Type=simple
Restart=on-failure
RestartSec=5

# Health check
WatchdogSec=30s
```

### Docker Health Check

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

## Prometheus Metrics

### Exposing Metrics

Palpo can expose Prometheus-compatible metrics. Enable in configuration:

```toml
[metrics]
enable = true
port = 9090
```

### Common Metrics

```
# HTTP request duration
palpo_http_request_duration_seconds{method="GET",path="/sync"}

# Active connections
palpo_active_connections

# Federation queue size
palpo_federation_queue_size

# Database query duration
palpo_db_query_duration_seconds{query_type="select"}
```

### Prometheus Configuration

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'palpo'
    static_configs:
      - targets: ['localhost:9090']
    scrape_interval: 15s
```

## Grafana Dashboard

### Key Panels

1. **Request Rate** - Requests per second
2. **Response Time** - p50, p95, p99 latencies
3. **Error Rate** - 4xx and 5xx responses
4. **Active Users** - Concurrent connected users
5. **Federation Health** - Queue size and delivery rate
6. **Resource Usage** - CPU, memory, disk

### Sample Dashboard JSON

```json
{
  "title": "Palpo Overview",
  "panels": [
    {
      "title": "Request Rate",
      "type": "graph",
      "targets": [
        {
          "expr": "rate(palpo_http_requests_total[5m])",
          "legendFormat": "{{method}} {{path}}"
        }
      ]
    },
    {
      "title": "Response Time (p95)",
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

## Alerting

### Alert Examples

**High Error Rate:**
```yaml
- alert: HighErrorRate
  expr: rate(palpo_http_requests_total{status=~"5.."}[5m]) / rate(palpo_http_requests_total[5m]) > 0.01
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "High error rate on Palpo"
    description: "Error rate is {{ $value | humanizePercentage }}"
```

**Slow Response Time:**
```yaml
- alert: SlowResponseTime
  expr: histogram_quantile(0.95, rate(palpo_http_request_duration_seconds_bucket[5m])) > 0.5
  for: 10m
  labels:
    severity: warning
  annotations:
    summary: "Slow response time on Palpo"
    description: "p95 latency is {{ $value }}s"
```

**Federation Queue Growing:**
```yaml
- alert: FederationQueueGrowing
  expr: increase(palpo_federation_queue_size[1h]) > 1000
  for: 30m
  labels:
    severity: warning
  annotations:
    summary: "Federation queue is growing"
```

**Low Disk Space:**
```yaml
- alert: LowDiskSpace
  expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) < 0.2
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "Low disk space"
    description: "Only {{ $value | humanizePercentage }} disk space remaining"
```

## External Monitoring

### Uptime Monitoring Services

Monitor your server's availability from outside:
- UptimeRobot
- Pingdom
- StatusCake
- Better Uptime

**Endpoint to monitor:**
```
https://your-server.com/_matrix/client/versions
```

### Federation Tester

Test federation connectivity:
```
https://federationtester.matrix.org/api/report?server_name=your-server.com
```

## Troubleshooting with Monitoring

### High CPU Usage

1. Check slow queries in database
2. Review active requests
3. Look for federation issues
4. Check for runaway processes

### Memory Leaks

1. Monitor memory over time
2. Check for growing connection pools
3. Review long-running operations
4. Consider restart schedule if needed

### Slow Responses

1. Check database query times
2. Review disk I/O
3. Check network latency
4. Look for lock contention

### Federation Issues

1. Monitor federation queue size
2. Check destination server health
3. Review error logs for specific failures
4. Reset problematic connections via Admin API

## Best Practices

1. **Set up alerts before problems occur** - Don't wait for users to report issues
2. **Monitor trends, not just thresholds** - A gradual increase may indicate a developing problem
3. **Keep historical data** - Useful for capacity planning and debugging
4. **Document your monitoring setup** - So others can understand and maintain it
5. **Test your alerts** - Ensure they fire when expected
6. **Have runbooks** - Document response procedures for common alerts
