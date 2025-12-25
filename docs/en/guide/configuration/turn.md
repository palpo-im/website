# Using TURN Servers

# Overview

This document describes how to enable VoIP relaying (TURN) on a homeserver.

The palpo Matrix homeserver supports integration with TURN servers via the [TURN server REST API](https://tools.ietf.org/html/draft-uberti-behave-turn-rest-00). This allows the homeserver to generate usable TURN server credentials using a secret key shared with the TURN server.

This document uses the coturn server as an example for configuration instructions.

## Prerequisites

For TURN relaying to function correctly, the TURN service must be deployed on a server/endpoint with a public IP address.

If TURN is deployed behind NAT, port forwarding is required, and the NAT gateway must have a public IP. Even if configured correctly, NAT can cause issues and is generally not recommended.

Additionally, the homeserver requires further configuration.

## Configuring Palpo

Your homeserver configuration file has a `[turn]` section for TURN server configuration.

For example, the following is a relevant configuration snippet from `matrix.org`. The `turn_uris` are for a TURN server listening on the default port without TLS.

```toml
[turn]
shared_secret = "n0t4ctuAllymatr1Xd0TorgSshar3d5ecret4obvIousreAsons"
user_lifetime = 86400000
allow_guests = true
uris = ["turn:turn.matrix.org?transport=udp", "turn:turn.matrix.org?transport=tcp"]
```

After updating the homeserver configuration, restart palpo:

- If using synctl:
  ```sh
  synctl restart
  ```
- If using systemd:
  ```sh
  systemctl restart matrix-palpo.service
  ```
- If using docker compose:
  ```sh
  docker compose restart
  ```

Then reload the client (or wait up to an hour for settings to refresh automatically).

## Installing and Configuring Coturn

Coturn is a free, open-source TURN/STUN server implementation. A TURN server acts as a NAT traversal server and gateway for VoIP media traffic.

### Initial Installation

The TURN daemon `coturn` can be installed in various ways, such as via package manager or from source.

#### Debian/Ubuntu

Install the Debian package directly:

```sh
sudo apt install coturn
```

This installs and starts a systemd service named `coturn`.

#### Installing from Source

1. Download the source code from the [latest release page on GitHub](https://github.com/coturn/coturn/releases/latest), extract it, and enter the directory.
2. Configure the build:

    ```sh
    ./configure
    ```

    If `libevent2` is required, install it as recommended for your system. Database support can be ignored.

3. Compile and install:

    ```sh
    make
    sudo make install
    ```

#### Docker Compose Installation

Create a `compose.yml` file and add the coturn configuration:

```yaml
coturn:
  image: coturn/coturn
  network_mode: "host"
```

Then run:

```bash
docker compose up -d
```

For more installation details, refer to the [official documentation](https://github.com/coturn/coturn/blob/master/docker/coturn/README.md).

### Configuration

1. Edit `/etc/turnserver.conf`. The main configurations are as follows:

    ```
    use-auth-secret
    static-auth-secret=[Your Secret Key]
    realm=turn.myserver.org
    ```

    The `static-auth-secret` can be generated using `pwgen`:

    ```sh
    pwgen -s 64 1
    ```

    The `realm` must be specified and is typically set to your server name.

2. It is recommended to configure coturn to output logs to syslog:

    ```sh
    syslog
    ```

    Alternatively, configure it to write to a log file. See the coturn example configuration for details.

3. For security recommendations, a minimal configuration includes:

    ```
    no-tcp-relay
    denied-peer-ip=10.0.0.0-10.255.255.255
    denied-peer-ip=192.168.0.0-192.168.255.255
    denied-peer-ip=172.16.0.0-172.31.255.255
    no-multicast-peers
    denied-peer-ip=0.0.0.0-0.255.255.255
    denied-peer-ip=100.64.0.0-100.127.255.255
    denied-peer-ip=127.0.0.0-127.255.255.255
    denied-peer-ip=169.254.0.0-169.254.255.255
    denied-peer-ip=192.0.0.0-192.0.0.255
    denied-peer-ip=192.0.2.0-192.0.2.255
    denied-peer-ip=192.88.99.0-192.88.99.255
    denied-peer-ip=198.18.0.0-198.19.255.255
    denied-peer-ip=198.51.100.0-198.51.100.255
    denied-peer-ip=203.0.113.0-203.0.113.255
    denied-peer-ip=240.0.0.0-255.255.255.255
    allowed-peer-ip=10.0.0.1
    user-quota=12
    total-quota=1200
    ```

4. To support TLS/DTLS, add the following configuration:

    ```
    cert=/path/to/fullchain.pem
    pkey=/path/to/privkey.pem
    #no-tls
    #no-dtls
    ```

    If using Let's Encrypt certificates, note that Element Android/iOS may not support them; ZeroSSL is recommended.

5. The firewall must allow TURN ports (default 3478, 5349, and UDP relay ports 49152-65535).

6. If TURN is behind NAT, configure `external-ip`:

    ```
    external-ip=Public IP Address
    ```

    Optional: Restrict listening to the local IP:

    ```
    listening-ip=Internal IP Address
    ```

    When IPv6 is supported, configure IPv4 and IPv6 separately.

7. Restart the TURN server:

    - For Debian package or systemd:

      ```sh
      sudo systemctl restart coturn
      ```

    - For source installation:

      ```sh
      /usr/local/bin/turnserver -o
      ```

## Troubleshooting

Common symptom: Calls between different networks get stuck on "Connecting." Troubleshooting suggestions:

- Check if the firewall allows TURN ports (3478, 5349, and UDP relay ports 49152-65535).
- Try enabling only non-encrypted TCP/UDP listening (WebRTC media streams are always encrypted).
- Some WebRTC implementations (e.g., Chrome) have poor IPv6 support; consider removing AAAA records and using IPv4 only.
- In NAT scenarios, ensure port forwarding and `external-ip` configuration are correct.
- Enable `verbose` logging in coturn or debug logging in eturnal.
- On the browser side, use `chrome://webrtc-internals/` or Firefox's about:webrtc to view connection logs.
- Test Matrix TURN configuration using <https://test.voip.librepush.net/> or test the TURN server with <https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/>.
- Generate test usernames/passwords using the following shell command:

    ```sh
    secret=staticAuthSecretHere
    u=$((`date +%s` + 3600)):test
    p=$(echo -n $u | openssl dgst -hmac $secret -sha1 -binary | base64)
    echo -e "username: $u\npassword: $p"
    ```

- Temporarily configure static username/password in coturn:

    ```
    lt-cred-mech
    user=username:password
    ```

    After modifying the configuration, restart coturn. Remember to revert to the original configuration after testing.

If TURN is configured correctly, the test results should include at least one `relay` entry.
{/* 本行由工具自动生成,原文哈希值:d7e5c1620cc9f3e43657950742e7996c */}