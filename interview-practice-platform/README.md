# 面试练习平台

一个基于Next.js和MySQL的面试练习平台，支持履历分析、书面问答、录影面试等功能。

## 功能特点

- **用户管理**：学生和教师角色分离
- **履历分析**：AI驱动的履历评分和建议
- **题库管理**：完整的CRUD操作，支持题目分类
- **书面问答**：实时文本分析和个性化题目生成
- **录影面试**：模拟面试录影功能
- **AI反馈**：详细的面试表现分析报告

## 技术栈

- **前端**：Next.js 15, React 19, TypeScript
- **UI组件**：Radix UI, Tailwind CSS
- **数据库**：MySQL + Prisma ORM
- **AI服务**：OpenAI GPT-4 API
- **包管理**：pnpm

## 环境设置

### 1. 克隆项目

```bash
git clone <repository-url>
cd interview-practice-platform
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 环境变量配置

创建 `.env` 文件并配置以下环境变量：

```env
# 数据库连接
DATABASE_URL="mysql://username:password@localhost:3306/interview_platform"

# OpenAI API密钥
OPENAI_API_KEY="your-openai-api-key-here"
```

### 4. 数据库设置

```bash
# 生成Prisma客户端
pnpm exec prisma generate

# 运行数据库迁移
pnpm exec prisma migrate deploy

# 可选：查看数据库状态
pnpm exec prisma migrate status
```

### 5. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

## 项目结构

```
interview-practice-platform/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   ├── student/           # 学生页面
│   └── teacher/           # 教师页面
├── components/            # UI组件
├── lib/                  # 工具库
├── prisma/               # 数据库schema和迁移
└── public/               # 静态资源
```

## 主要功能

### 题库管理
- 支持新增、编辑、删除题目
- 题目分类：学术类、技术类、个人类、职涯类
- 题目状态管理（启用/停用）
- 初始化资管系题库（20题）

### 学生功能
- 履历上传和分析
- 书面问答练习（随机+个性化题目）
- 录影面试练习
- AI反馈报告

### 教师功能
- 学生管理
- 题库管理
- 查看学生进度和答案

## 数据库模型

- **User**: 用户信息
- **Question**: 题库题目
- **WrittenAnswer**: 书面问答记录
- **ResumeAnalysis**: 履历分析记录
- **PersonalizedQuestion**: 个性化问题

## 部署注意事项

1. **环境变量**：确保所有敏感信息都通过环境变量配置
2. **数据库**：生产环境使用稳定的MySQL实例
3. **API密钥**：妥善保管OpenAI API密钥
4. **HTTPS**：生产环境必须使用HTTPS

## 开发指南

### 添加新功能
1. 在 `app/api/` 下创建API路由
2. 在 `app/` 下创建对应的页面
3. 更新Prisma schema（如需要）
4. 运行数据库迁移

### 代码规范
- 使用TypeScript
- 遵循Next.js 13+ App Router规范
- 使用Tailwind CSS进行样式设计
- 组件使用Radix UI

## 许可证

MIT License 