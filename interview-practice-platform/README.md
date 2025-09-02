# 面试练习平台

一个基于Next.js和MySQL的面试练习平台，支持备审资料分析、书面问答、录影面试等功能。

## 功能特点

- **用户管理**：学生和教师角色分离
- **备审资料分析**：AI驱动的备审资料评分和建议
- **题库管理**：完整的CRUD操作，支持题目分类
- **书面问答**：实时文本分析和个性化题目生成
- **录影面试**：模拟面试录影功能
- **AI反馈**：详细的面试表现分析报告
- **OpenSMILE语速分析**：专业级语音分析，包含语速、流畅度、自信度评估
- **实时语音分析**：支持实时语音指标监控和即时反馈

## 技术栈

- **前端**：Next.js 15, React 19, TypeScript
- **UI组件**：Radix UI, Tailwind CSS
- **数据库**：MySQL + Prisma ORM
- **AI服务**：OpenAI GPT-4 API
- **语音分析**：OpenSMILE + FFmpeg
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

**重要**：请确保不要在代码中硬编码任何API密钥或敏感信息。

创建 `.env` 文件并配置以下环境变量：

```env
# 数据库连接
DATABASE_URL="mysql://username:password@localhost:3306/interview_platform"

# OpenAI API密钥（请从 https://platform.openai.com/api-keys 获取）
OPENAI_API_KEY="your-openai-api-key-here"

# OpenSMILE配置（用于语速分析）
OPENSMILE_BINARY="SMILExtract"
OPENSMILE_CONFIG="./config/opensmile/speech_analysis.conf"
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

### 5. 安装OpenSMILE（用于语速分析）

请参考 `docs/OPENSMILE_SETUP.md` 获取详细安装指南。

安装完成后，运行测试：
```bash
pnpm run test:opensmile
```

### 6. 启动开发服务器

```bash
# 方法1：使用环境变量启动脚本（推荐）
pnpm run dev:env

# 方法2：手动设置环境变量
$env:DATABASE_URL="mysql://root:@localhost:3306/interview_platform"; pnpm dev

# 方法3：直接启动（可能會有環境變量問題）
pnpm dev
```

访问 http://localhost:3000

**注意**：如果遇到 `DATABASE_URL` 环境变量未找到的错误，请使用方法1或方法2启动服务器。

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
- 备审资料上传和分析
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
- **ResumeAnalysis**: 备审资料分析记录
- **PersonalizedQuestion**: 个性化问题

## 安全性注意事项

### API密钥安全
1. **永远不要在代码中硬编码API密钥**
2. **使用环境变量**：所有敏感信息都应通过环境变量配置
3. **保护.env文件**：确保.env文件已添加到.gitignore中
4. **定期轮换密钥**：定期更新API密钥以提高安全性

### 部署注意事项

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

## 學校分類功能說明

### 功能概述
本系統新增了學校分類功能，允許教師為題目指定特定的學校，學生可以根據目標學校選擇相應的練習題目。

### 新增功能
- **題目學校分類**：每個題目可以指定為特定學校（如台大、清大、交大等）或通用題目
- **學校篩選**：學生在練習時可以選擇特定學校的題目進行練習
- **教師管理**：教師可以在題庫管理中為題目指定學校分類

### 支援的學校
- 台大（台灣大學）
- 清大（清華大學）
- 交大（交通大學）
- 政大（政治大學）
- 成大（成功大學）
- 中央（中央大學）
- 中山（中山大學）
- 中興（中興大學）
- 台科大（台灣科技大學）
- 北科大（台北科技大學）
- 暨南大學
- 東海大學
- 輔仁大學
- 淡江大學
- 銘傳大學
- 實踐大學
- 世新大學
- 文化大學
- 逢甲大學
- 靜宜大學
- 通用（適用於所有學校）

### 使用方式

#### 教師端
1. 進入題庫管理頁面 (`/teacher/question-bank`)
2. 新增題目時可以選擇學校分類
3. 使用學校篩選器查看特定學校的題目
4. 編輯現有題目時可以修改學校分類

#### 學生端
1. 在綜合練習頁面 (`/student/combined-practice`) 選擇目標學校
2. 在書面問答頁面 (`/student/written-qa`) 選擇目標學校
3. 系統會根據選擇的學校提供相應的練習題目

### 技術實現
- 數據庫模型：在 `Question` 表中新增 `school` 字段
- API 端點：支援按學校篩選題目
- 前端組件：新增學校選擇下拉選單
- 默認題庫：所有現有題目都設置為"通用"，教師可以自行添加各學校專屬題目

### 數據庫遷移
要啟用學校分類功能，需要執行以下步驟：

1. 確保環境變量 `DATABASE_URL` 已設置
2. 執行數據庫遷移：
   ```bash
   pnpm exec prisma migrate dev --name add_school_to_questions
   ```
3. 初始化題庫：在題庫管理頁面點擊"初始化題庫"

### 題目設置說明
- **現有題目**：所有現有題目都已設置為"通用"，適用於所有學校
- **新增專屬題目**：教師可以通過題庫管理頁面為各學校添加專屬題目
- **題目內容**：專屬題目可以針對特定學校的特色、課程設置、研究方向等進行設計
- **已添加的專屬題目**：系統已為以下學校添加了專屬題目：
  - 暨南大學：僑校特色、國際化教育、跨文化交流
  - 東海大學：博雅教育、環境永續、服務學習
  - 輔仁大學：全人教育、天主教精神、服務精神
  - 淡江大學：國際化教育、資訊科技、創新創業
  - 銘傳大學：創意產業、實務導向、國際交流
  - 實踐大學：創意設計、實作能力、產業連結
  - 世新大學：傳播媒體、新聞專業、社會關懷
  - 文化大學：人文藝術、文化傳承、創意發展
  - 逢甲大學：工程科技、產學合作、創新研發
  - 靜宜大學：人文社會科學、社會服務、品格教育

### 測試
可以使用測試頁面 (`/test-questions`) 來驗證學校篩選功能是否正常工作。 