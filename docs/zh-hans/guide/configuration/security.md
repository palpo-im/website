# 安全与注册

## 注册配置

控制用户注册：

```toml
# 启用用户注册
allow_registration = false

# 静态注册令牌
registration_token = "your-secret-token"

# 或从文件读取令牌
registration_token_file = "/etc/palpo/.reg_token"

# 允许开放注册（危险 - 仅用于私有网络）
# 这是真实的配置键名 — 故意使用冗长名称作为安全措施
yes_i_am_very_very_sure_i_want_an_open_registration_server_prone_to_abuse = false

# 允许访客注册
allow_guest_registration = false

# 新用户自动加入的房间
auto_join_rooms = ["#welcome:example.com"]
```

## 安全配置

```toml
# 允许房间加密
allow_encryption = true

# 允许普通用户创建房间
allow_room_creation = true

# 允许不稳定的房间版本
allow_unstable_room_versions = true

# 默认房间版本
default_room_version = 11

# 阻止非管理员用户发送邀请
block_non_admin_invites = false

# 要求配置文件请求进行认证
require_auth_for_profile_requests = false

# 紧急管理员密码
# emergency_password = "your-emergency-password"
```

## 速率限制

Palpo 使用基于 IP 的[令牌桶](https://zh.wikipedia.org/wiki/%E4%BB%A4%E7%89%8C%E6%A1%B6%E7%AE%97%E6%B3%95)算法对敏感端点进行速率限制，防止暴力破解和滥用。每个分类维护独立的计数器，登录请求不会消耗注册的配额。

- **`per_second`** — 每秒补充的令牌数（控制持续速率）。
- **`burst`** — 最大令牌累积量（控制突发容量）。

将 `per_second` 设为 `0` 可完全禁用对应的速率限制器。

```toml
# 登录端点（/login, /login/get_token）
# 默认：约每 5.5 分钟 1 次登录，突发上限 5 次
[rc_login]
per_second = 0.003
burst = 5

# 注册端点（/register）
# 默认：约每 6 秒 1 次，突发上限 3 次
[rc_registration]
per_second = 0.17
burst = 3

# 密码修改和账号注销
# 默认：约每 6 秒 1 次，突发上限 3 次
[rc_password]
per_second = 0.17
burst = 3

# 通用 API 端点（媒体、个人资料、房间等）
# 默认：每秒 10 次，突发上限 50 次
[rc_message]
per_second = 10.0
burst = 50
```

:::tip
在测试环境（如 Complement 测试）中，可以通过设置极高的值来有效禁用所有速率限制：

```toml
[rc_login]
per_second = 9999.0
burst = 9999

[rc_registration]
per_second = 9999.0
burst = 9999

[rc_password]
per_second = 9999.0
burst = 9999

[rc_message]
per_second = 9999.0
burst = 9999
```
:::
