# 設置環境變量
$env:DATABASE_URL = "mysql://root:@localhost:3306/interview_platform"
# 請確保在系統環境變量中設置 OPENAI_API_KEY
# 或者創建 .env 文件並設置 OPENAI_API_KEY

# 啟動開發服務器
Write-Host "Starting development server with environment variables..." -ForegroundColor Green
Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Cyan
pnpm dev 