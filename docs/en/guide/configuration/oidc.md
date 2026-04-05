# OIDC/OAuth Authentication

This guide explains how to configure Palpo to authenticate users using OAuth 2.0 / OpenID Connect (OIDC) providers such as GitHub, Google, GitLab, and other identity providers.

## Overview

OIDC authentication allows users to sign in to Palpo using their existing accounts from external identity providers. This provides a convenient single sign-on (SSO) experience and eliminates the need for users to manage separate Matrix passwords.

## Prerequisites

- An OAuth application registered with your chosen provider(s)
- The client ID and client secret from your OAuth application
- A publicly accessible callback URL for your Palpo server

## Basic Configuration

Add the following section to your `palpo.toml` configuration file:

```toml
[oidc]
# Enable OIDC authentication
enable = true

# Default provider (optional)
default_provider = "github"

# Auto-create new users on first login
allow_registration = true

# OAuth session timeout in seconds
session_timeout = 600

# Enable PKCE security extension (recommended)
enable_pkce = true
```

## Provider Configuration

Each provider needs its own configuration section under `[oidc.providers.<name>]`:

### GitHub

```toml
[oidc.providers.github]
issuer = "https://github.com"
client_id = "your_github_app_id"
client_secret = "your_github_app_secret"
redirect_uri = "https://matrix.example.com/_matrix/client/oidc/callback"
scopes = ["read:user", "user:email"]
display_name = "Sign in with GitHub"
```

To create a GitHub OAuth App:
1. Go to GitHub Settings → Developer Settings → OAuth Apps → New OAuth App
2. Set the Homepage URL to your Palpo server URL
3. Set the Authorization callback URL to `https://your-server/_matrix/client/oidc/callback`
4. Copy the Client ID and generate a Client Secret

### Google

```toml
[oidc.providers.google]
issuer = "https://accounts.google.com"
client_id = "your_google_client_id.apps.googleusercontent.com"
client_secret = "your_google_client_secret"
redirect_uri = "https://matrix.example.com/_matrix/client/oidc/callback"
scopes = ["openid", "email", "profile"]
display_name = "Sign in with Google"
```

To create a Google OAuth Client:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Go to APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client IDs
4. Set Application type to "Web application"
5. Add your callback URL to Authorized redirect URIs

### GitLab

```toml
[oidc.providers.gitlab]
issuer = "https://gitlab.com"
client_id = "your_gitlab_application_id"
client_secret = "your_gitlab_application_secret"
redirect_uri = "https://matrix.example.com/_matrix/client/oidc/callback"
scopes = ["openid", "email", "profile"]
display_name = "Sign in with GitLab"
```

### Self-Hosted Keycloak

```toml
[oidc.providers.keycloak]
issuer = "https://keycloak.example.com/realms/master"
client_id = "palpo"
client_secret = "your_keycloak_client_secret"
redirect_uri = "https://matrix.example.com/_matrix/client/oidc/callback"
scopes = ["openid", "email", "profile"]
display_name = "Sign in with Company SSO"
```

## Configuration Options

### Global Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enable` | boolean | `false` | Enable OIDC authentication |
| `default_provider` | string | (first alphabetically) | Default provider for login |
| `allow_registration` | boolean | `true` | Auto-create new users on first login |
| `user_prefix` | string | `""` | Prefix for OAuth user IDs (e.g., `gh_` → `@gh_user:server`) |
| `require_email_verified` | boolean | `true` | Require verified email for login |
| `session_timeout` | integer | `600` | OAuth session timeout in seconds |
| `enable_pkce` | boolean | `true` | Enable PKCE security extension |

### Provider Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `issuer` | string | Yes | Provider base URL |
| `client_id` | string | Yes | OAuth app client ID |
| `client_secret` | string | Yes | OAuth app client secret |
| `redirect_uri` | string | Yes | Callback URL (must match provider settings) |
| `scopes` | array | No | Permissions to request (default: `["openid", "email", "profile"]`) |
| `display_name` | string | No | UI display text for this provider |
| `additional_params` | object | No | Extra OAuth parameters |
| `skip_tls_verify` | boolean | No | Skip TLS verification (DEV ONLY) |
| `attribute_mapping` | object | No | Custom claim to attribute mapping |

## User ID Mapping

Palpo automatically determines the Matrix user ID from provider information:

1. **Username** (preferred): GitHub login, `preferred_username` claim
2. **Email prefix**: `john` from `john@example.com`
3. **Provider ID**: Falls back to provider's unique identifier

To add a prefix to distinguish OAuth users:

```toml
[oidc]
user_prefix = "oauth_"  # Results in @oauth_username:server
```

## Custom Attribute Mapping

Map OIDC claims to Matrix user attributes:

```toml
[oidc.providers.custom]
# ... other config ...
attribute_mapping = { "display_name" = "given_name", "avatar_url" = "picture" }
```

## Multiple Providers

You can configure multiple providers simultaneously:

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
display_name = "Company SSO"
```

## Security Considerations

1. **Keep secrets secure**: Never commit `client_secret` values to version control
2. **Use HTTPS**: Always use HTTPS for the callback URL
3. **Enable PKCE**: Keep `enable_pkce = true` for additional security
4. **Verify emails**: Keep `require_email_verified = true` when possible
5. **Restrict registration**: Set `allow_registration = false` if you only want existing users to use OAuth

## Login Flow

1. User clicks "Sign in with [Provider]" on the Matrix client
2. Client redirects to `/_matrix/client/oidc/auth?provider=<name>`
3. Palpo redirects to the OAuth provider's authorization page
4. User authenticates and grants permissions
5. Provider redirects back to Palpo's callback URL
6. Palpo exchanges the code for tokens and creates/authenticates the user
7. User is logged in to Matrix

## Troubleshooting

### "Invalid redirect_uri" Error

- Ensure the `redirect_uri` in your config exactly matches what's configured in the OAuth provider
- Check for trailing slashes or protocol mismatches (http vs https)

### "User not found" Error

- If `allow_registration = false`, the user must already exist in Matrix
- Check that the email/username mapping is working correctly

### Session Timeout Issues

- Increase `session_timeout` if users frequently fail to complete the OAuth flow
- Default is 600 seconds (10 minutes)

### Private Email Issues (GitHub)

- Some users have private GitHub emails
- Set `require_email_verified = false` to allow login without verified emails
- Or request the `user:email` scope to access primary email even if private
