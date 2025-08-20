import { config } from 'dotenv'

// 加載 .env 文件
config()

// 確保環境變量被正確設置
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'mysql://root:@localhost:3306/interview_platform'
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY 環境變量未設置。請在 .env 文件中設置 OPENAI_API_KEY 或設置系統環境變量。')
}

if (!process.env.AUTH_SECRET) {
  // 開發環境默認密鑰（請在生產環境設置 AUTH_SECRET）
  process.env.AUTH_SECRET = 'dev-secret-change-me'
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
  AUTH_SECRET: process.env.AUTH_SECRET!
} 