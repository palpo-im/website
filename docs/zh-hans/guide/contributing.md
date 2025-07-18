# 贡献指南

我们非常欢迎您为本项目做出贡献！在您开始之前，请花一些时间阅读本指南，以确保您的贡献能够顺利进行并符合项目规范。

## 行为准则

我们致力于为所有贡献者提供一个开放和包容的环境。请遵守我们的 行为准则。

## 如何贡献

### 报告 Bug

如果您发现任何 Bug，请通过 [GitHub Issues](https://github.com/palpo-im/palpo/issues) 提交。

在提交 Bug 报告时，请提供尽可能详细的信息，包括：

*   重现步骤
*   预期行为
*   实际行为
*   错误消息（如果有）
*   您的环境信息（操作系统、版本等）

### 提交功能请求

如果您有新的功能想法，也请通过 [GitHub Issues](https://github.com/palpo-im/palpo/issues) 提交。

在提交功能请求时，请描述您的想法，并说明它将如何改进项目。

### 提交代码

1.  **Fork 项目**：首先，将本项目 Fork 到您的 GitHub 账户。
2.  **克隆仓库**：将 Fork 后的仓库克隆到您的本地机器。
    ```bash
    git clone https://github.com/您的用户名/palpo-im.git
    cd palpo-im
    ```
3.  **创建分支**：为您的新功能或 Bug 修复创建一个新的分支。
    ```bash
    git checkout -b feature/your-feature-name
    # 或者
    git checkout -b bugfix/your-bug-fix-name
    ```
4.  **进行更改**：在您的分支上进行代码更改。
5.  **编写测试**：如果您的更改涉及新功能或 Bug 修复，请编写相应的测试。
6.  **运行测试**：确保所有测试都通过。
7.  **提交更改**：提交您的更改，并编写清晰的提交消息。
    ```bash
    git add .
    git commit -m "feat: Add your feature" # 或者 "fix: Fix your bug"
    ```
8.  **推送到远程仓库**：将您的分支推送到您的 Fork 仓库。
    ```bash
    git push origin feature/your-feature-name
    ```
9.  **创建 Pull Request**：在 GitHub 上创建一个 Pull Request，将其合并到主仓库的 `main` 分支。

## 代码风格

请遵循项目现有的代码风格。我们使用 Prettier 进行代码格式化，您可以在提交代码之前运行它：

```bash
bun prettier --write .
```

## 许可证

通过贡献代码，您同意您的贡献将根据项目的 许可证 进行许可。

感谢您的贡献！