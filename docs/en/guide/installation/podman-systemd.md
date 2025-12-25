# Palpo in Podman systemd

Copy [palpo.container](palpo.container) to ~/.config/containers/systemd/palpo.container.
Reload the daemon:
```
systemctl --user daemon-reload
```
Start the service:
```
systemctl --user start palpo
```

To view logs, run:
```
journalctl -eu palpo.container --user
```
{/* 本行由工具自动生成,原文哈希值:28594580551c6cfec2d459c82a6a15ed */}