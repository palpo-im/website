# JWT Authentication

This guide explains how to configure Palpo to authenticate users using JSON Web Tokens (JWT).

## Overview

JWT authentication allows external systems to authenticate users to Palpo without requiring them to enter Matrix credentials. This is useful for:

- Integrating Matrix into existing applications with their own authentication
- Single sign-on (SSO) scenarios
- Automated systems that need to act as users
- Migration from Synapse or other homeservers using JWT authentication

## Prerequisites

- A system capable of generating valid JWTs
- A shared secret (for HMAC) or public key (for ECDSA)
- Understanding of JWT claims and structure

## Basic Configuration

Add the following section to your `palpo.toml` configuration file:

```toml
[jwt]
# Enable JWT authentication
enable = true

# Shared secret for HMAC signature validation
secret = "your-secret-key-keep-this-private"

# Key format (HMAC, B64HMAC, or ECDSA)
format = "HMAC"

# Algorithm (default: HS256)
algorithm = "HS256"

# Auto-create new users from valid tokens
register_user = true
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enable` | boolean | `true` | Enable JWT authentication |
| `secret` | string | - | Validation key (content depends on `format`) |
| `format` | string | `"HMAC"` | Key format: `HMAC`, `B64HMAC`, or `ECDSA` |
| `algorithm` | string | `"HS256"` | JWT algorithm (e.g., `HS256`, `HS384`, `ES256`) |
| `register_user` | boolean | `true` | Auto-create users from valid tokens |
| `audience` | array | `[]` | Required audience claims |
| `issuer` | array | `[]` | Required issuer claims |
| `require_exp` | boolean | `false` | Require expiration claim |
| `require_nbf` | boolean | `false` | Require not-before claim |
| `validate_exp` | boolean | `true` | Validate expiration when present |
| `validate_nbf` | boolean | `true` | Validate not-before when present |
| `validate_signature` | boolean | `true` | Validate token signature |

## Key Formats

### HMAC (Default)

Use a plaintext shared secret:

```toml
[jwt]
format = "HMAC"
secret = "your-shared-secret-at-least-32-characters-long"
algorithm = "HS256"  # or HS384, HS512
```

Generate a secure secret:
```bash
openssl rand -hex 32
```

### B64HMAC

Use a base64-encoded secret (useful for binary keys):

```toml
[jwt]
format = "B64HMAC"
secret = "eW91ci1iYXNlNjQtZW5jb2RlZC1zZWNyZXQ="
algorithm = "HS256"
```

Generate a base64 secret:
```bash
openssl rand -base64 32
```

### ECDSA

Use a PEM-encoded public key for asymmetric verification:

```toml
[jwt]
format = "ECDSA"
secret = """
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE...
-----END PUBLIC KEY-----
"""
algorithm = "ES256"  # or ES384, ES512
```

## JWT Token Structure

The JWT token must contain the following claim:

```json
{
  "sub": "username"
}
```

The `sub` (subject) claim is used as the Matrix user ID (localpart).

### Optional Claims

```json
{
  "sub": "alice",
  "aud": ["palpo", "matrix"],
  "iss": "https://auth.example.com",
  "exp": 1735689600,
  "nbf": 1735603200
}
```

## Token Validation

Configure validation requirements:

```toml
[jwt]
# Require specific audiences
audience = ["palpo", "matrix"]

# Require specific issuers
issuer = ["https://auth.example.com"]

# Require expiration claim
require_exp = true

# Require not-before claim
require_nbf = false

# Validate exp/nbf when present
validate_exp = true
validate_nbf = true
```

## Login Flow

To authenticate with JWT:

1. Your application generates a JWT with the user's identity
2. The client makes a login request to Palpo:

```http
POST /_matrix/client/v3/login
Content-Type: application/json

{
  "type": "org.matrix.login.jwt",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

3. Palpo validates the token and creates/authenticates the user
4. Client receives access token for Matrix API calls

## Example: Generating JWT in Different Languages

### Python

```python
import jwt
import time

secret = "your-shared-secret"
token = jwt.encode(
    {
        "sub": "alice",
        "exp": int(time.time()) + 3600,  # 1 hour
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

## Security Considerations

1. **Keep secrets secure**: Never expose HMAC secrets in client-side code or logs
2. **Use strong secrets**: At least 256 bits (32 bytes) for HMAC algorithms
3. **Set expiration**: Always include `exp` claim and set `require_exp = true`
4. **Validate issuer**: Set `issuer` to prevent tokens from untrusted sources
5. **Use HTTPS**: Always transmit tokens over encrypted connections
6. **Consider ECDSA**: For public-facing systems, asymmetric keys (ECDSA) are more secure as the verification key can be shared without compromising token generation

## Synapse Migration

If migrating from Synapse with JWT authentication:

```toml
[jwt]
enable = true
secret = "same-secret-as-synapse"
format = "HMAC"
algorithm = "HS256"

# Synapse compatibility settings
require_exp = false
require_nbf = false
register_user = true
```

## Troubleshooting

### "Invalid token" Error

- Verify the secret matches between token generator and Palpo
- Check the algorithm matches (`HS256`, `ES256`, etc.)
- Ensure the token hasn't expired

### "User not found" Error

- If `register_user = false`, the user must already exist
- Check the `sub` claim contains a valid username

### "Invalid audience/issuer" Error

- Ensure token claims match the configured `audience` and `issuer` arrays
- Check for case sensitivity and exact string matching

### Signature Verification Failed

- For HMAC: ensure secrets are identical (watch for extra whitespace)
- For ECDSA: ensure the public key is correctly formatted (PEM format)
- Verify the algorithm in token header matches configuration
