# JWT 认证

本指南介绍如何配置 Palpo 使用 JSON Web Tokens (JWT) 进行用户认证。

## 概述

JWT 认证允许外部系统在不要求用户输入 Matrix 凭据的情况下认证用户。这在以下场景很有用：

- 将 Matrix 集成到具有自己认证系统的现有应用
- 单点登录（SSO）场景
- 需要以用户身份操作的自动化系统
- 从使用 JWT 认证的 Synapse 或其他 homeserver 迁移

## 前提条件

- 能够生成有效 JWT 的系统
- 共享密钥（用于 HMAC）或公钥（用于 ECDSA）
- 理解 JWT 声明和结构

## 基本配置

在您的 `palpo.toml` 配置文件中添加以下部分：

```toml
[jwt]
# 启用 JWT 认证
enable = true

# 用于 HMAC 签名验证的共享密钥
secret = "your-secret-key-keep-this-private"

# 密钥格式（HMAC、B64HMAC 或 ECDSA）
format = "HMAC"

# 算法（默认：HS256）
algorithm = "HS256"

# 从有效令牌自动创建新用户
register_user = true
```

## 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `enable` | boolean | `true` | 启用 JWT 认证 |
| `secret` | string | - | 验证密钥（内容取决于 `format`） |
| `format` | string | `"HMAC"` | 密钥格式：`HMAC`、`B64HMAC` 或 `ECDSA` |
| `algorithm` | string | `"HS256"` | JWT 算法（如 `HS256`、`HS384`、`ES256`） |
| `register_user` | boolean | `true` | 从有效令牌自动创建用户 |
| `audience` | array | `[]` | 必需的 audience 声明 |
| `issuer` | array | `[]` | 必需的 issuer 声明 |
| `require_exp` | boolean | `false` | 要求过期时间声明 |
| `require_nbf` | boolean | `false` | 要求生效时间声明 |
| `validate_exp` | boolean | `true` | 存在时验证过期时间 |
| `validate_nbf` | boolean | `true` | 存在时验证生效时间 |
| `validate_signature` | boolean | `true` | 验证令牌签名 |

## 密钥格式

### HMAC（默认）

使用纯文本共享密钥：

```toml
[jwt]
format = "HMAC"
secret = "your-shared-secret-at-least-32-characters-long"
algorithm = "HS256"  # 或 HS384、HS512
```

生成安全密钥：
```bash
openssl rand -hex 32
```

### B64HMAC

使用 base64 编码的密钥（适用于二进制密钥）：

```toml
[jwt]
format = "B64HMAC"
secret = "eW91ci1iYXNlNjQtZW5jb2RlZC1zZWNyZXQ="
algorithm = "HS256"
```

生成 base64 密钥：
```bash
openssl rand -base64 32
```

### ECDSA

使用 PEM 编码的公钥进行非对称验证：

```toml
[jwt]
format = "ECDSA"
secret = """
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE...
-----END PUBLIC KEY-----
"""
algorithm = "ES256"  # 或 ES384、ES512
```

## JWT 令牌结构

JWT 令牌必须包含以下声明：

```json
{
  "sub": "username"
}
```

`sub`（主题）声明用作 Matrix 用户 ID（本地部分）。

### 可选声明

```json
{
  "sub": "alice",
  "aud": ["palpo", "matrix"],
  "iss": "https://auth.example.com",
  "exp": 1735689600,
  "nbf": 1735603200
}
```

## 令牌验证

配置验证要求：

```toml
[jwt]
# 要求特定 audience
audience = ["palpo", "matrix"]

# 要求特定 issuer
issuer = ["https://auth.example.com"]

# 要求过期时间声明
require_exp = true

# 要求生效时间声明
require_nbf = false

# 存在时验证 exp/nbf
validate_exp = true
validate_nbf = true
```

## 登录流程

使用 JWT 认证：

1. 您的应用程序生成包含用户身份的 JWT
2. 客户端向 Palpo 发出登录请求：

```http
POST /_matrix/client/v3/login
Content-Type: application/json

{
  "type": "org.matrix.login.jwt",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

3. Palpo 验证令牌并创建/认证用户
4. 客户端收到用于 Matrix API 调用的访问令牌

## 示例：在不同语言中生成 JWT

### Python

```python
import jwt
import time

secret = "your-shared-secret"
token = jwt.encode(
    {
        "sub": "alice",
        "exp": int(time.time()) + 3600,  # 1 小时
        "iss": "my-app"
    },
    secret,
    algorithm="HS256"
)
print(token)
```

### Node.js

```javascript
const jwt = require('jsonwebtoken');

const secret = 'your-shared-secret';
const token = jwt.sign(
  {
    sub: 'alice',
    exp: Math.floor(Date.now() / 1000) + 3600,
    iss: 'my-app'
  },
  secret,
  { algorithm: 'HS256' }
);
console.log(token);
```

### Rust

```rust
use jsonwebtoken::{encode, EncodingKey, Header, Algorithm};
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
    iss: String,
}

let claims = Claims {
    sub: "alice".to_owned(),
    exp: (chrono::Utc::now() + chrono::Duration::hours(1)).timestamp() as usize,
    iss: "my-app".to_owned(),
};

let token = encode(
    &Header::new(Algorithm::HS256),
    &claims,
    &EncodingKey::from_secret(b"your-shared-secret"),
).unwrap();
```

## 安全考虑

1. **保护密钥安全**：永远不要在客户端代码或日志中暴露 HMAC 密钥
2. **使用强密钥**：HMAC 算法至少 256 位（32 字节）
3. **设置过期时间**：始终包含 `exp` 声明并设置 `require_exp = true`
4. **验证发行者**：设置 `issuer` 以防止来自不受信任来源的令牌
5. **使用 HTTPS**：始终通过加密连接传输令牌
6. **考虑 ECDSA**：对于面向公众的系统，非对称密钥（ECDSA）更安全，因为验证密钥可以共享而不会危及令牌生成

## Synapse 迁移

如果从使用 JWT 认证的 Synapse 迁移：

```toml
[jwt]
enable = true
secret = "same-secret-as-synapse"
format = "HMAC"
algorithm = "HS256"

# Synapse 兼容性设置
require_exp = false
require_nbf = false
register_user = true
```

## 故障排除

### "Invalid token" 错误

- 验证令牌生成器和 Palpo 之间的密钥是否匹配
- 检查算法是否匹配（`HS256`、`ES256` 等）
- 确保令牌未过期

### "User not found" 错误

- 如果 `register_user = false`，用户必须已存在
- 检查 `sub` 声明是否包含有效的用户名

### "Invalid audience/issuer" 错误

- 确保令牌声明与配置的 `audience` 和 `issuer` 数组匹配
- 检查大小写敏感性和精确字符串匹配

### 签名验证失败

- 对于 HMAC：确保密钥完全相同（注意额外空格）
- 对于 ECDSA：确保公钥格式正确（PEM 格式）
- 验证令牌头中的算法与配置匹配
