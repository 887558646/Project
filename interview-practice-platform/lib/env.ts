import { config } from 'dotenv'
import { resolve } from 'path'

// 加載 .env 文件，指定絕對路徑
config({ path: resolve(process.cwd(), '.env') })

// 確保環境變量被正確設置
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'mysql://root:@localhost:3306/interview_platform'
}

if (!process.env.OPENAI_API_KEY) {
  console.warn('[env] OPENAI_API_KEY 未設置，與 OpenAI 相關功能將不可用。')
}

if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = 'dev-secret-change-me'
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  AUTH_SECRET: process.env.AUTH_SECRET!
} 