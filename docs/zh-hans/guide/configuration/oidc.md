# OIDC/OAuth 认证

本指南介绍如何配置 Palpo 使用 OAuth 2.0 / OpenID Connect (OIDC) 提供商（如 GitHub、Google、GitLab 和其他身份提供商）进行用户认证。

## 概述

OIDC 认证允许用户使用外部身份提供商的现有账户登录 Palpo。这提供了便捷的单点登录（SSO）体验，并消除了用户管理单独 Matrix 密码的需要。

## 前提条件

- 在所选提供商注册的 OAuth 应用程序
- OAuth 应用程序的客户端 ID 和客户端密钥
- Palpo 服务器的可公开访问的回调 URL

## 基本配置

在您的 `palpo.toml` 配置文件中添加以下部分：

```toml
[oidc]
# 启用 OIDC 认证
enable = true

# 默认提供商（可选）
default_provider = "github"

# 首次登录时自动创建新用户
allow_registration = true

# OAuth 会话超时（秒）
session_timeout = 600

# 启用 PKCE 安全扩展（推荐）
enable_pkce = true
```

## 提供商配置

每个提供商需要在 `[oidc.providers.<name>]` 下有自己的配置部分：

### GitHub

```toml
[oidc.providers.github]
issuer = "https://github.com"
client_id = "your_github_app_id"
client_secret = "your_github_app_secret"
redirect_uri = "https://matrix.example.com/_matrix/client/oidc/callback"
scopes = ["read:user", "user:email"]
display_name = "使用 GitHub 登录"
```

创建 GitHub OAuth 应用：
1. 前往 GitHub 设置 → 开发者设置 → OAuth Apps → 新建 OAuth App
2. 将主页 URL 设置为您的 Palpo 服务器 URL
3. 将授权回调 URL 设置为 `https://your-server/_matrix/client/oidc/callback`
4. 复制客户端 ID 并生成客户端密钥

### Google

```toml
[oidc.providers.google]
issuer = "https://accounts.google.com"
client_id = "your_google_client_id.apps.googleusercontent.com"
client_secret = "your_google_client_secret"
redirect_uri = "https://matrix.example.com/_matrix/client/oidc/callback"
scopes = ["openid", "email", "profile"]
display_name = "使用 Google 登录"
```

创建 Google OAuth 客户端：
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建或选择项目
3. 前往 APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client IDs
4. 将应用程序类型设置为 "Web application"
5. 在授权重定向 URI 中添加您的回调 URL

### GitLab

```toml
[oidc.providers.gitlab]
issuer = "https://gitlab.com"
client_id = "your_gitlab_application_id"
client_secret = "your_gitlab_application_secret"
redirect_uri = "https://matrix.example.com/_matrix/client/oidc/callback"
scopes = ["openid", "email", "profile"]
display_name = "使用 GitLab 登录"
```

### 自托管 Keycloak

```toml
[oidc.providers.keycloak]
issuer = "https://keycloak.example.com/realms/master"
client_id = "palpo"
client_secret = "your_keycloak_client_secret"
redirect_uri = "https://matrix.example.com/_matrix/client/oidc/callback"
scopes = ["openid", "email", "profile"]
display_name = "使用公司 SSO 登录"
```

## 配置选项

### 全局选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `enable` | boolean | `false` | 启用 OIDC 认证 |
| `default_provider` | string | （首个按字母顺序） | 登录的默认提供商 |
| `allow_registration` | boolean | `true` | 首次登录时自动创建新用户 |
| `user_prefix` | string | `""` | OAuth 用户 ID 前缀（如 `gh_` → `@gh_user:server`） |
| `require_email_verified` | boolean | `true` | 登录需要已验证的邮箱 |
| `session_timeout` | integer | `600` | OAuth 会话超时（秒） |
| `enable_pkce` | boolean | `true` | 启用 PKCE 安全扩展 |

### 提供商选项

| 选项 | 类型 | 必需 | 描述 |
|------|------|------|------|
| `issuer` | string | 是 | 提供商基础 URL |
| `client_id` | string | 是 | OAuth 应用客户端 ID |
| `client_secret` | string | 是 | OAuth 应用客户端密钥 |
| `redirect_uri` | string | 是 | 回调 URL（必须与提供商设置匹配） |
| `scopes` | array | 否 | 请求的权限（默认：`["openid", "email", "profile"]`） |
| `display_name` | string | 否 | 此提供商的 UI 显示文本 |
| `additional_params` | object | 否 | 额外的 OAuth 参数 |
| `skip_tls_verify` | boolean | 否 | 跳过 TLS 验证（仅用于开发） |
| `attribute_mapping` | object | 否 | 自定义声明到属性的映射 |

## 用户 ID 映射

Palpo 自动从提供商信息确定 Matrix 用户 ID：

1. **用户名**（首选）：GitHub 登录名、`preferred_username` 声明
2. **邮箱前缀**：从 `john@example.com` 获取 `john`
3. **提供商 ID**：回退到提供商的唯一标识符

添加前缀以区分 OAuth 用户：

```toml
[oidc]
user_prefix = "oauth_"  # 结果为 @oauth_username:server
```

## 自定义属性映射

将 OIDC 声明映射到 Matrix 用户属性：

```toml
[oidc.providers.custom]
# ... 其他配置 ...
attribute_mapping = { "display_name" = "given_name", "avatar_url" = "picture" }
```

## 多个提供商

您可以同时配置多个提供商：

```toml
[oidc]
enable = true
default_provider = "company"

[oidc.providers.github]
issuer = "https://github.com"
client_id = "..."
client_secret = "..."
redirect_uri = "https://matrix.example.com/_matrix/client/oidc/callback"
scopes = ["read:user", "user:email"]
display_name = "GitHub"

[oidc.providers.google]
issuer = "https://accounts.google.com"
client_id = "..."
client_secret = "..."
redirect_uri = "https://matrix.example.com/_matrix/client/oidc/callback"
scopes = ["openid", "email", "profile"]
display_name = "Google"

[oidc.providers.company]
issuer = "https://sso.company.com"
client_id = "..."
client_secret = "..."
redirect_uri = "https://matrix.example.com/_matrix/client/oidc/callback"
scopes = ["openid", "email", "profile"]
display_name = "公司 SSO"
```

## 安全考虑

1. **保护密钥安全**：永远不要将 `client_secret` 值提交到版本控制
2. **使用 HTTPS**：回调 URL 始终使用 HTTPS
3. **启用 PKCE**：保持 `enable_pkce = true` 以增加安全性
4. **验证邮箱**：尽可能保持 `require_email_verified = true`
5. **限制注册**：如果只希望现有用户使用 OAuth，设置 `allow_registration = false`

## 登录流程

1. 用户在 Matrix 客户端点击"使用 [提供商] 登录"
2. 客户端重定向到 `/_matrix/client/oidc/auth?provider=<name>`
3. Palpo 重定向到 OAuth 提供商的授权页面
4. 用户认证并授予权限
5. 提供商重定向回 Palpo 的回调 URL
6. Palpo 用授权码交换令牌并创建/认证用户
7. 用户登录到 Matrix

## 故障排除

### "Invalid redirect_uri" 错误

- 确保配置中的 `redirect_uri` 与 OAuth 提供商中配置的完全匹配
- 检查尾部斜杠或协议不匹配（http 与 https）

### "User not found" 错误

- 如果 `allow_registration = false`，用户必须已存在于 Matrix 中
- 检查邮箱/用户名映射是否正常工作

### 会话超时问题

- 如果用户经常无法完成 OAuth 流程，增加 `session_timeout`
- 默认为 600 秒（10 分钟）

### 私人邮箱问题（GitHub）

- 一些用户有私人 GitHub 邮箱
- 设置 `require_email_verified = false` 允许不需要验证邮箱即可登录
- 或请求 `user:email` 范围以访问主邮箱，即使是私人的
