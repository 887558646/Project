# 安全指南

## 🚨 重要安全提醒

### API密钥安全

**⚠️ 警告：您的项目中发现了一个严重的安全漏洞！**

在 `start-dev.ps1` 文件中，OpenAI API密钥被硬编码在脚本中。这可能导致：

1. **API密钥泄露**：任何人都可以访问您的代码库并获取API密钥
2. **费用风险**：恶意用户可能使用您的API密钥进行大量请求
3. **账户安全**：可能导致账户被滥用或封禁

### 已采取的修复措施

✅ 已从 `start-dev.ps1` 中移除硬编码的API密钥  
✅ 已配置 `.gitignore` 忽略所有 `.env*` 文件  
✅ 已创建环境变量设置脚本 `setup-env.ps1`  
✅ 已更新启动脚本以安全地加载环境变量  

### 立即需要做的操作

1. **撤销暴露的API密钥**
   - 立即访问 [OpenAI API Keys](https://platform.openai.com/api-keys)
   - 删除或重新生成已暴露的API密钥
   - 设置新的API密钥

2. **设置环境变量**
   ```bash
   # 运行环境变量设置脚本
   powershell -ExecutionPolicy Bypass -File setup-env.ps1
   ```

3. **验证修复**
   - 确保 `.env` 文件已创建
   - 确保 `.env` 文件不在版本控制中
   - 测试应用是否正常工作

### 安全最佳实践

1. **永远不要在代码中硬编码敏感信息**
   - 使用环境变量
   - 使用配置文件（不提交到版本控制）
   - 使用密钥管理服务

2. **保护环境变量文件**
   - 确保 `.env` 文件在 `.gitignore` 中
   - 不要将环境变量文件分享给他人
   - 定期轮换API密钥

3. **代码审查**
   - 在提交代码前检查是否包含敏感信息
   - 使用自动化工具检测密钥泄露
   - 定期审查代码库

4. **监控和日志**
   - 监控API使用情况
   - 设置异常使用警报
   - 记录所有API调用

### 环境变量设置

项目现在使用以下环境变量：

```bash
# 数据库配置
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# OpenAI API 配置
OPENAI_API_KEY="your-openai-api-key-here"

# NextAuth 配置
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# 环境
NODE_ENV="development"
```

### 启动应用

```bash
# 使用环境变量启动（推荐）
pnpm run dev:env

# 或者手动设置环境变量后启动
pnpm dev
```

## 联系支持

如果您需要帮助或有安全问题，请：

1. 立即撤销暴露的API密钥
2. 检查是否有其他敏感信息泄露
3. 联系项目维护者

---

**记住：安全永远是第一位的！** 🔒
