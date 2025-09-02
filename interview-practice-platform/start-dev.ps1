# 設置環境變量
$env:DATABASE_URL = "mysql://root:@localhost:3306/interview_platform"

# 檢查是否存在 .env 文件，如果存在則加載環境變量
if (Test-Path ".env") {
    Write-Host "Loading environment variables from .env file..." -ForegroundColor Green
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            $name = $matches[1]
            $value = $matches[2]
            Set-Variable -Name "env:$name" -Value $value
        }
    }
} else {
    Write-Host "Warning: .env file not found. Please create one with your API keys." -ForegroundColor Yellow
    Write-Host "You can copy .env.example and fill in your actual values." -ForegroundColor Yellow
}

# 啟動開發服務器
Write-Host "Starting development server with environment variables..." -ForegroundColor Green
Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Cyan
pnpm dev 