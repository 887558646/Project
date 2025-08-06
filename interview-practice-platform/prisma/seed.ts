import { PrismaClient } from '../lib/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 創建測試用戶
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  // 創建學生用戶
  await prisma.user.upsert({
    where: { username: 'student' },
    update: {},
    create: {
      username: 'student',
      password: hashedPassword,
      role: 'student'
    }
  })

  // 創建教師用戶
  await prisma.user.upsert({
    where: { username: 'teacher' },
    update: {},
    create: {
      username: 'teacher',
      password: hashedPassword,
      role: 'teacher'
    }
  })

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 