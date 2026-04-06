# 媒体配置

## 媒体设置

配置媒体处理行为：

```toml
[media]
# 启用旧版未认证媒体端点
allow_legacy = true

# 冻结旧版媒体（阻止通过旧版端点上传新内容）
freeze_legacy = true

# 启动时检查媒体一致性
startup_check = true

# 创建 Conduit 兼容的符号链接
compat_file_link = false

# 删除缺失媒体文件的数据库条目
prune_missing = false

# 阻止从特定服务器下载媒体（正则表达式模式）
prevent_downloads_from = ["badserver\\.tld$", "spammer\\.example"]
```

## Blurhash 配置

配置图片模糊哈希生成：

```toml
[blurhash]
# blurhash X 分量（推荐：4）
components_x = 4

# blurhash Y 分量（推荐：3）
components_y = 3

# blurhash 生成的最大原始图片大小（字节）
# 默认：33554432（33.55 MB）。设为 0 禁用。
max_raw_size = 33554432
```

## URL 预览配置

配置 URL 预览/展开行为：

```toml
[url_preview]
# 绑定预览请求的网络接口
# bound_interface = "eth0"

# 允许包含这些字符串的域名进行 URL 预览
domain_contains_allowlist = ["wikipedia.org", "github.com"]

# 允许精确匹配这些域名进行 URL 预览
domain_explicit_allowlist = ["example.com"]

# 阻止这些域名的 URL 预览
domain_explicit_denylist = ["malicious.com"]

# 允许包含这些字符串的 URL 进行预览
url_contains_allowlist = []

# URL 预览抓取的最大正文大小（字节）
max_spider_size = 256000

# 检查根域名以进行白名单匹配
check_root_domain = false
```
