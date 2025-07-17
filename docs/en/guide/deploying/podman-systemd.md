# Palpo in Podman systemd

Copy [palpo.container](palpo.container) to ~/.config/containers/systemd/palpo.container.
Reload daemon:
```
systemctl --user daemon-reload
```
Start the service:
```
systemctl --user start palpo
```

To check the logs, run:
```
journalctl -eu palpo.container --user
```
