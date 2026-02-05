# LDAP 认证

本指南介绍如何配置 Palpo 使用 LDAP 目录服务进行用户认证。

## 概述

LDAP（轻量级目录访问协议）认证允许用户使用现有的企业目录凭据登录 Palpo。这对于已经在 Active Directory、OpenLDAP 或类似目录服务中管理用户账户的组织非常有用。

## 前提条件

- 运行中的 LDAP 服务器（如 OpenLDAP、Active Directory、FreeIPA）
- Palpo 和 LDAP 服务器之间的网络连接
- 适当的 LDAP 绑定凭据（如果未启用匿名访问）

## 配置

在您的 `palpo.toml` 配置文件中添加以下部分：

```toml
[ldap]
# 启用 LDAP 认证
enable = true

# LDAP 服务器的 URI
uri = "ldap://ldap.example.com:389"

# 用户搜索的基础 DN
base_dn = "ou=users,dc=example,dc=org"

# 搜索时使用的绑定 DN（如果未启用匿名搜索）
bind_dn = "cn=ldap-reader,dc=example,dc=org"

# 包含绑定密码的文件路径
bind_password_file = "/etc/palpo/ldap_password"

# 查找用户的搜索过滤器（默认："(objectClass=*)"）
filter = "(&(objectClass=person)(memberOf=cn=matrix-users,ou=groups,dc=example,dc=org))"

# 用于唯一标识用户的属性（默认："uid"）
uid_attribute = "uid"

# 包含用户邮箱的属性（默认："mail"）
mail_attribute = "mail"

# 包含用户显示名称的属性（默认："givenName"）
name_attribute = "givenName"
```

## 配置选项

### 基本选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `enable` | boolean | `true` | 启用或禁用 LDAP 认证 |
| `uri` | string | - | LDAP 服务器的 URI（如 `ldap://server:389` 或 `ldaps://server:636`） |
| `base_dn` | string | - | 用户搜索的基础 DN |

### 绑定选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `bind_dn` | string | - | 搜索时绑定的 DN，可包含 `{username}` 占位符用于直接绑定 |
| `bind_password_file` | string | - | 包含绑定密码的文件路径 |

### 搜索选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `filter` | string | `(objectClass=*)` | LDAP 搜索过滤器，可包含 `{username}` 占位符 |
| `uid_attribute` | string | `uid` | 包含唯一用户标识符的属性 |
| `mail_attribute` | string | `mail` | 包含用户邮箱地址的属性 |
| `name_attribute` | string | `givenName` | 包含用户显示名称的属性 |

### 管理员选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `admin_base_dn` | string | （同 `base_dn`） | 管理员用户搜索的基础 DN |
| `admin_filter` | string | - | 识别管理员用户的过滤器，可包含 `{username}` 占位符 |

## 绑定模式

Palpo 支持两种 LDAP 绑定模式：

### 1. 服务账户绑定（推荐）

使用专用服务账户搜索用户：

```toml
[ldap]
bind_dn = "cn=ldap-reader,dc=example,dc=org"
bind_password_file = "/etc/palpo/ldap_password"
filter = "(uid={username})"
```

此模式：
- 首先使用服务账户绑定以搜索用户
- 然后通过绑定找到的用户来验证密码
- 支持通过 `admin_filter` 自动检测管理员角色

### 2. 直接绑定

无需搜索直接作为用户绑定：

```toml
[ldap]
bind_dn = "cn={username},ou=users,dc=example,dc=org"
```

此模式：
- 直接在绑定 DN 中使用提供的用户名
- 不支持自动管理员检测（admin_filter 被忽略）
- 更简单但灵活性较低

## 示例

### OpenLDAP 配置

```toml
[ldap]
enable = true
uri = "ldap://ldap.example.com:389"
base_dn = "ou=users,dc=example,dc=com"
bind_dn = "cn=palpo-reader,ou=service-accounts,dc=example,dc=com"
bind_password_file = "/etc/palpo/ldap_password"
filter = "(&(objectClass=inetOrgPerson)(uid={username}))"
uid_attribute = "uid"
mail_attribute = "mail"
name_attribute = "cn"
```

### Active Directory 配置

```toml
[ldap]
enable = true
uri = "ldap://dc.example.com:389"
base_dn = "OU=Users,DC=example,DC=com"
bind_dn = "CN=Palpo Service,OU=Service Accounts,DC=example,DC=com"
bind_password_file = "/etc/palpo/ad_password"
filter = "(&(objectClass=user)(sAMAccountName={username}))"
uid_attribute = "sAMAccountName"
mail_attribute = "mail"
name_attribute = "displayName"
```

### 管理员角色检测

自动为特定 LDAP 用户授予管理员权限：

```toml
[ldap]
# ... 其他配置 ...
admin_base_dn = "ou=admins,dc=example,dc=org"
admin_filter = "(memberOf=cn=palpo-admins,ou=groups,dc=example,dc=org)"
```

## 安全考虑

1. **使用 LDAPS**：尽可能使用 `ldaps://`（LDAP over TLS）加密连接
2. **保护凭据**：使用限制性权限存储绑定密码文件（如 `chmod 600`）
3. **限制绑定账户权限**：绑定账户应仅对必要属性具有读取权限
4. **网络安全**：考虑在 Palpo 和 LDAP 服务器之间使用 VPN 或私有网络

## 故障排除

### 连接问题

- 验证 LDAP 服务器是否可达：`ldapsearch -H ldap://server:389 -x -b "dc=example,dc=org"`
- 检查端口 389（LDAP）或 636（LDAPS）的防火墙规则
- 确保绑定 DN 和密码正确

### 认证失败

- 使用 `ldapsearch` 手动测试搜索过滤器
- 验证 `uid_attribute` 是否与目录架构匹配
- 检查密码文件是否可被 Palpo 读取
- 启用调试日志查看详细的 LDAP 操作
