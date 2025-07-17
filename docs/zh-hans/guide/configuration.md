# 配置

本章介绍配置 Palpo 的各种方法。

## 基础

Palpo 大部分设置使用配置文件，但也支持通过命令行设置单个配置选项。

请参阅 [示例配置文件](./configuration/examples.md#example-configuration) 以获取所有这些设置。

可以在运行 Palpo 时通过命令行指定要使用的配置文件，方法是指定 `-c`、`--config` 标志。或者，您可以使用环境变量 `PALPO_CONFIG` 来指定要使用的配置文件。Conduit 的环境变量支持向后兼容。

## 选项命令行标志

Palpo 支持从 `-O` / `--option` 标志以 TOML 格式设置单个配置选项。例如，您可以通过 `-O server_name="example.com"` 设置您的服务器名称。

请注意，配置以 TOML 格式解析，并且像 bash 这样的 shell 会删除引号。因此，如果配置选项接受字符串，则不幸的是需要转义引号。这不适用于接受布尔值或数字的选项：
- `--option allow_registration=true` 有效 ✅
- `-O max_request_size=99999999` 有效 ✅
- `-O server_name=example.com` 无效 ❌
- `--option log="debug"` 有效 ✅
- `--option server_name='"example.com"'` 有效 ✅

## 执行命令行标志

Palpo 支持在启动时使用命令行参数 `--execute` 运行管理命令。最值得注意的是，这用于在首次启动时创建管理员用户。

其语法是标准管理命令，不带前缀，例如 `./palpo --execute "users create_user june"`

成功输出的示例是：
```
INFO palpo_service::admin::startup: Startup command #0 completed:
Created user with user_id: @june:girlboss.ceo and password: `<redacted>`
```

此命令行参数可以与 `--option` 标志配对使用。

## 环境变量

配置文件中找到的所有设置都可以通过使用环境变量来指定。环境变量名称应全部大写并以 `PALPO_` 为前缀。

例如，如果您要更改的设置是 `max_request_size`，则要设置的环境变量是 `PALPO_MAX_REQUEST_SIZE`。

要修改不在 `[global]` 上下文中的配置选项，例如 `[global.well_known]`，请使用 `__` 后缀分隔：`PALPO_WELL_KNOWN__SERVER`

Conduit 和 conduwuit 的环境变量支持向后兼容（例如 `CONDUIT_SERVER_NAME` 或 `CONDUWUIT_SERVER_NAME`）。