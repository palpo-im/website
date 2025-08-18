
# 管理


Palpo 支持通过命令行工具进行管理与审核。未来计划支持管理员 API 和 UI 界面。

## 启动管理交互界面

我们可以在 palpo 可执行文件所在的目录下运行以下命令启动命令行交互界面：

```bash
palpo --config palpo.toml --server false --console
```
这里的  `--config palpo.toml` 指定了使用的配置文件，如果是当前文件夹下的默认配置文件 `palpo.toml`，则可以省略。

`--server false` 代表不启动服务器， `--console` 代表启动命令行交互界面。

可以运行 `palpo --help` 查看具体使用说明。

**注意**：在 Windows 下可执行文件名字为 `palpo.exe`.

进入命令行交互界面，依然可以运行 `help` 命令查看可用的管理命令。

Palpo 支持以下管理命令：

- `appservie` 管理 Appservie 的相关任务；
- `user` 管理本地用户的相关任务；
- `room` 管理房间相关的任务；
- `federation` 管理 Federation 相关的任务；
- `server` 管理服务器相关的任务；
- `media` 媒体相关的管理任务。