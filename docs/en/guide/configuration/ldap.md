# LDAP Authentication

This guide explains how to configure Palpo to authenticate users against an LDAP directory service.

## Overview

LDAP (Lightweight Directory Access Protocol) authentication allows users to log in to Palpo using their existing enterprise directory credentials. This is useful for organizations that already have user accounts managed in services like Active Directory, OpenLDAP, or similar directory services.

## Prerequisites

- A working LDAP server (e.g., OpenLDAP, Active Directory, FreeIPA)
- Network connectivity between Palpo and the LDAP server
- Appropriate LDAP bind credentials (if anonymous access is not enabled)

## Configuration

Add the following section to your `palpo.toml` configuration file:

```toml
[ldap]
# Enable LDAP authentication
enable = true

# URI of the LDAP server
uri = "ldap://ldap.example.com:389"

# Base DN for user searches
base_dn = "ou=users,dc=example,dc=org"

# Bind DN for searching (if anonymous search is not enabled)
bind_dn = "cn=ldap-reader,dc=example,dc=org"

# Path to a file containing the bind password
bind_password_file = "/etc/palpo/ldap_password"

# Search filter to find users (default: "(objectClass=*)")
filter = "(&(objectClass=person)(memberOf=cn=matrix-users,ou=groups,dc=example,dc=org))"

# Attribute used to uniquely identify users (default: "uid")
uid_attribute = "uid"

# Attribute containing the user's email (default: "mail")
mail_attribute = "mail"

# Attribute containing the user's display name (default: "givenName")
name_attribute = "givenName"
```

## Configuration Options

### Basic Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enable` | boolean | `true` | Enable or disable LDAP authentication |
| `uri` | string | - | URI of the LDAP server (e.g., `ldap://server:389` or `ldaps://server:636`) |
| `base_dn` | string | - | Base DN for user searches |

### Bind Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `bind_dn` | string | - | DN to bind as for searches. Can include `{username}` placeholder for direct binding |
| `bind_password_file` | string | - | Path to file containing the bind password |

### Search Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `filter` | string | `(objectClass=*)` | LDAP search filter. Can include `{username}` placeholder |
| `uid_attribute` | string | `uid` | Attribute containing the unique user identifier |
| `mail_attribute` | string | `mail` | Attribute containing the user's email address |
| `name_attribute` | string | `givenName` | Attribute containing the user's display name |

### Admin Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `admin_base_dn` | string | (same as `base_dn`) | Base DN for admin user searches |
| `admin_filter` | string | - | Filter to identify admin users. Can include `{username}` placeholder |

## Bind Modes

Palpo supports two LDAP binding modes:

### 1. Service Account Binding (Recommended)

Use a dedicated service account to search for users:

```toml
[ldap]
bind_dn = "cn=ldap-reader,dc=example,dc=org"
bind_password_file = "/etc/palpo/ldap_password"
filter = "(uid={username})"
```

This mode:
- First binds with the service account to search for the user
- Then verifies the user's password by binding as the found user
- Supports automatic admin role detection via `admin_filter`

### 2. Direct Binding

Bind directly as the user without a search:

```toml
[ldap]
bind_dn = "cn={username},ou=users,dc=example,dc=org"
```

This mode:
- Uses the provided username directly in the bind DN
- Does not support automatic admin detection (admin_filter is ignored)
- Simpler but less flexible

## Examples

### OpenLDAP Configuration

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

### Active Directory Configuration

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

### Admin Role Detection

To automatically grant admin privileges to specific LDAP users:

```toml
[ldap]
# ... other config ...
admin_base_dn = "ou=admins,dc=example,dc=org"
admin_filter = "(memberOf=cn=palpo-admins,ou=groups,dc=example,dc=org)"
```

## Security Considerations

1. **Use LDAPS**: When possible, use `ldaps://` (LDAP over TLS) to encrypt connections
2. **Protect Credentials**: Store the bind password file with restrictive permissions (e.g., `chmod 600`)
3. **Limit Bind Account Permissions**: The bind account should only have read access to necessary attributes
4. **Network Security**: Consider using a VPN or private network between Palpo and the LDAP server

## Troubleshooting

### Connection Issues

- Verify the LDAP server is reachable: `ldapsearch -H ldap://server:389 -x -b "dc=example,dc=org"`
- Check firewall rules for ports 389 (LDAP) or 636 (LDAPS)
- Ensure the bind DN and password are correct

### Authentication Failures

- Test the search filter manually with `ldapsearch`
- Verify the `uid_attribute` matches your directory schema
- Check that the password file is readable by Palpo
- Enable debug logging to see detailed LDAP operations
