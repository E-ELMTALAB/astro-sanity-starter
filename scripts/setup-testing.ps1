# PowerShell script for Windows
Write-Host "🚀 Setting up testing pipeline..." -ForegroundColor Green

# Check if pnpm is installed
try {
    pnpm --version | Out-Null
    Write-Host "✅ pnpm is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ pnpm is not installed. Please install pnpm first." -ForegroundColor Red
    Write-Host "   npm install -g pnpm" -ForegroundColor Yellow
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
pnpm install

# Initialize Husky
Write-Host "🐕 Setting up Husky..." -ForegroundColor Blue
npx husky init

# Copy environment example
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file from example..." -ForegroundColor Blue
    Copy-Item "env.example" ".env"
    Write-Host "⚠️  Please update .env with your actual values" -ForegroundColor Yellow
}

# Test the setup
Write-Host "🧪 Testing the setup..." -ForegroundColor Blue
pnpm test:static

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Testing pipeline setup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Update .env with your actual values" -ForegroundColor White
    Write-Host "2. Run 'pnpm ci:astro' to test the full pipeline" -ForegroundColor White
    Write-Host "3. Configure GitHub secrets for CI/CD" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 Available commands:" -ForegroundColor Cyan
    Write-Host "  pnpm test:static    - Run static checks" -ForegroundColor White
    Write-Host "  pnpm test:render    - Run render checks (requires build)" -ForegroundColor White
    Write-Host "  pnpm ci:astro       - Full Astro pipeline" -ForegroundColor White
    Write-Host "  pnpm ci:full        - Complete pipeline" -ForegroundColor White
} else {
    Write-Host "❌ Setup test failed. Please check your configuration." -ForegroundColor Red
    exit 1
}
