# 配置文件

本章介绍配置 Palpo 的配置文件详细设置。

Palpo 支持使用 `yaml`, `toml`, `json` 作为配置文件格式，你可以按照你的喜好选择。推荐使用 `toml` 格式。

系统默认加载 Palpo 可执行文件同级目录下的 `palpo.toml` 文件。你可以通过设置环境变量 `PALPO_CONFIG`, 改变加载的配置文件路径。

## 必要配置项

下面这些必须配额项目如果没有配置，系统无法正确运行。

```toml
# 外部访问服务器所使用的域名或者服务器名字
server_name = "matrix.palpo.im"
# 服务器侦听的本地地址
listen_addr = "0.0.0.0:8008"

[db]
# Postgres 数据库服务器信息
url = "postgres://palpo:changeme@postgres:5432/palpo"
```

如果你没有配置文件，你可以复制项目根目录下的 `palpo-example.toml` 文件按照你自己需求修改此配置文件。