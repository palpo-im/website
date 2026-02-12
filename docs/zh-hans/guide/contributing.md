# Palpo 贡献指南

感谢您对 Palpo 项目的关注！我们欢迎各种形式的贡献，包括修复 Bug、添加功能、改进文档和编写测试等。

## 目录

- [开始之前](#开始之前)
- [开发环境设置](#开发环境设置)
- [贡献方式](#贡献方式)
- [代码规范](#代码规范)
- [测试](#测试)
- [Pull Request 流程](#pull-request-流程)
- [问题反馈](#问题反馈)

## 开始之前

在开始贡献前，请：

1. 完整阅读本指南
2. 查看[现有 Issues](https://github.com/palpo-im/palpo/issues) 避免重复工作
3. 对于重大变更，请先创建 Issue 讨论您的方案

## 开发环境设置

### 环境要求

- **Rust 1.92+** - 通过 [rustup](https://rustup.rs/) 安装
- **PostgreSQL 18+** - 数据库后端
- **系统依赖** (Linux)：
  ```bash
  sudo apt install -y libclang-dev libpq-dev cmake
  ```

### 从源码构建

```bash
# 克隆仓库
git clone https://github.com/palpo-im/palpo.git
cd palpo

# 构建项目
cargo build

# 运行所有检查（提交前推荐执行）
cargo check --all --bins --examples --tests
```

### 管理控制台

Palpo 提供交互式管理控制台用于服务器管理：

```bash
# 仅控制台模式（不启动 HTTP 服务器）
./palpo -c palpo.toml -s false --console

# 控制台 + 服务器模式
./palpo -c palpo.toml --console
```

**控制台命令：**

| 命令 | 说明 |
|------|------|
| `help` | 显示可用的管理命令 |
| `exit` / `quit` | 退出控制台（如果服务器正在运行也会退出） |
| `clear` | 清空终端屏幕 |
| `user <子命令>` | 管理本地用户 |
| `room <子命令>` | 管理房间 |
| `federation <子命令>` | 管理联邦 |
| `server <子命令>` | 管理服务器设置 |
| `media <子命令>` | 管理媒体 |
| `appservice <子命令>` | 管理应用服务 |

**快捷键：**

| 快捷键 | 说明 |
|--------|------|
| `Ctrl+D` | 退出控制台（同 `exit`） |
| `Ctrl+C` | 中断当前命令 |
| `Up/Down` | 浏览命令历史 |

**优雅关闭：**

在控制台+服务器模式下，退出控制台（通过 `exit`、`quit` 或 `Ctrl+D`）会触发服务器优雅关闭。服务器将停止接受新连接并干净退出。

以守护进程方式运行时（不带 `--console`），发送 `SIGTERM` 或 `SIGQUIT` 信号实现优雅关闭：

```bash
kill -TERM <palpo-pid>
```

### 项目结构

Palpo 采用 Cargo 工作空间组织，包含以下 crate：

| Crate | 说明 |
|-------|------|
| `palpo` | 主服务器应用 |
| `palpo-core` | 核心库，包含 Matrix 协议类型 |
| `palpo-core-macros` | 核心库的过程宏 |
| `palpo-data` | 数据层，集成 Diesel ORM |
| `palpo-identifiers-validation` | 用户/房间标识符验证 |
| `palpo-server-macros` | 服务器专用过程宏 |

## 贡献方式

### 贡献类型

我们欢迎各种形式的贡献：

- **Bug 修复** - 修复问题跟踪器中报告的问题
- **新功能** - 实现新功能（请先在 Issue 中讨论）
- **文档改进** - 完善文档、添加示例、修正错别字
- **测试** - 增加测试覆盖率、改进现有测试
- **性能优化** - 优化代码、减少内存占用

### 开始之前

1. **从 `main` 分支创建新分支**
2. **保持变更聚焦** - 每个 PR 只做一个逻辑变更
3. **为新功能编写测试**
4. **必要时更新文档**

## 代码规范

### Rust 代码格式化

我们使用 `rustfmt` 配合 Rust 2024 版本风格。提交前请格式化代码：

```bash
cargo +nightly fmt --all
```

### 代码检查

我们使用 `clippy` 进行代码检查。您的代码应该通过检查且无警告：

```bash
cargo clippy --all --all-features -- -D warnings
```

### 拼写检查

我们使用 [typos](https://github.com/crate-ci/typos) 检查拼写错误：

```bash
# 安装 typos
cargo install typos-cli

# 运行拼写检查
typos
```

### 代码风格指南

- 使用有意义的变量和函数名
- 保持函数专注且大小合理
- 为复杂逻辑添加注释（而非显而易见的代码）
- 遵循代码库中的现有模式
- 在生产代码中优先使用显式错误处理而非 `.unwrap()`

## 测试

### 运行测试

```bash
# 运行所有测试
cargo test --all --all-features

# 运行特定 crate 的测试
cargo test -p palpo-core

# 运行特定测试
cargo test test_name
```

### Complement 测试

我们使用 [Complement](https://github.com/matrix-org/complement) 进行 Matrix 规范合规性测试。详见 [tests/README.md](https://github.com/palpo-im/palpo/blob/main/tests/README.md)。

### 编写测试

- 为新函数和模块添加单元测试
- 为 API 端点添加集成测试
- 测试成功和错误情况
- 使用描述性测试名称说明测试内容

## Pull Request 流程

### 提交前检查

确保您的变更在本地通过所有 CI 检查：

```bash
# 格式检查
cargo fmt --all -- --check

# 代码检查
cargo clippy --all --all-features -- -D warnings

# 构建检查
cargo check --all --bins --examples --tests

# 测试
cargo test --all --all-features --no-fail-fast

# 拼写检查
typos
```

### 提交 PR

1. **创建描述性标题** - 清晰概括变更内容
2. **编写有用的描述** - 说明做了什么以及为什么
3. **关联相关 Issue** - 使用 `Fixes #123` 或 `Relates to #123`
4. **保持可审查性** - 较小的 PR 更容易审查和合并

### PR 标题格式

使用清晰、描述性的标题：

- `fix: 修复无效令牌导致的登录失败`
- `feat: 添加房间别名支持`
- `docs: 更新安装指南`
- `refactor: 简化事件处理逻辑`
- `test: 添加联邦端点测试`

### 审查流程

- 维护者将审查您的 PR
- 根据反馈更新您的 PR
- 获得批准后，维护者将合并您的 PR

## 问题反馈

### Bug 报告

使用 [Bug 报告模板](https://github.com/palpo-im/palpo/blob/main/.github/workflows/ISSUE_TEMPLATE/BUG_REPORT.md) 并包含：

- Palpo 版本或 git SHA
- 是否在 Docker 中运行
- 使用的客户端（如适用）
- 问题的清晰描述
- 重现步骤

### 功能请求

使用 [功能请求模板](https://github.com/palpo-im/palpo/blob/main/.github/workflows/ISSUE_TEMPLATE/FEATURE_REQUEST.md) 并：

- 清晰描述功能
- 说明使用场景
- 注意：请勿将缺失的 Matrix 规范功能作为 Issue 提交

## 有疑问？

- 查看现有的 [Issues](https://github.com/palpo-im/palpo/issues) 和讨论
- 为贡献相关问题创建新 Issue

---

感谢您为 Palpo 做出贡献！