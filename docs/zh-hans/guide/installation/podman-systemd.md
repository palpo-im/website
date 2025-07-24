# Podman systemd 中的 palpo

将 [palpo.container](palpo.container) 复制到 ~/.config/containers/systemd/palpo.container。
重新加载守护进程：
```
systemctl --user daemon-reload
```
启动服务：
```
systemctl --user start palpo
```

要查看日志，请运行：
```
journalctl -eu palpo.container --user
```