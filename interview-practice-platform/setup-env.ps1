# 环境变量设置脚本
# 此脚本将帮助您创建 .env 文件

Write-Host "=== 环境变量设置向导 ===" -ForegroundColor Cyan
Write-Host ""

# 检查是否已存在 .env 文件
if (Test-Path ".env") {
    Write-Host "检测到已存在的 .env 文件" -ForegroundColor Yellow
    $overwrite = Read-Host "是否要覆盖？(y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "操作已取消" -ForegroundColor Red
        exit
    }
}

Write-Host "请按照提示输入相应的值：" -ForegroundColor Green
Write-Host ""

# 数据库配置
$databaseUrl = Read-Host "数据库连接字符串 (例如: mysql://root:@localhost:3306/interview_platform)"
if ([string]::IsNullOrEmpty($databaseUrl)) {
    $databaseUrl = "mysql://root:@localhost:3306/interview_platform"
}

# OpenAI API密钥
$openaiKey = Read-Host "OpenAI API密钥 (从 https://platform.openai.com/api-keys 获取)"
if ([string]::IsNullOrEmpty($openaiKey)) {
    Write-Host "警告：未输入OpenAI API密钥，相关功能将不可用" -ForegroundColor Yellow
}

# NextAuth配置
$nextauthSecret = Read-Host "NextAuth密钥 (留空将自动生成)"
if ([string]::IsNullOrEmpty($nextauthSecret)) {
    $nextauthSecret = [System.Web.Security.Membership]::GeneratePassword(32, 10)
    Write-Host "已自动生成NextAuth密钥" -ForegroundColor Green
}

$nextauthUrl = Read-Host "NextAuth URL (留空使用默认值: http://localhost:3000)"
if ([string]::IsNullOrEmpty($nextauthUrl)) {
    $nextauthUrl = "http://localhost:3000"
}

# 创建 .env 文件内容
$envContent = @"
# 数据库配置
DATABASE_URL="$databaseUrl"

# OpenAI API 配置
OPENAI_API_KEY="$openaiKey"

# NextAuth 配置
NEXTAUTH_SECRET="$nextauthSecret"
NEXTAUTH_URL="$nextauthUrl"

# 环境
NODE_ENV="development"
"@

# 写入 .env 文件
try {
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host ""
    Write-Host "✅ .env 文件创建成功！" -ForegroundColor Green
    Write-Host ""
    Write-Host "重要提醒：" -ForegroundColor Yellow
    Write-Host "1. .env 文件已自动添加到 .gitignore 中" -ForegroundColor Yellow
    Write-Host "2. 请勿将此文件提交到版本控制系统" -ForegroundColor Yellow
    Write-Host "3. 请妥善保管您的API密钥" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "现在可以使用 'pnpm run dev:env' 启动开发服务器" -ForegroundColor Cyan
} catch {
    Write-Host "❌ 创建 .env 文件时出错: $($_.Exception.Message)" -ForegroundColor Red
}
