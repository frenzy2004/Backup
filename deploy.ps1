# AWS Deployment Script for Location Analysis App

Write-Host "🚀 Deploying Location Analysis App to AWS..." -ForegroundColor Green

# Check if AWS CLI is installed
if (!(Get-Command aws -ErrorAction SilentlyContinue)) {
    Write-Host "❌ AWS CLI not found. Please install AWS CLI first." -ForegroundColor Red
    exit 1
}

# Check AWS credentials
$awsIdentity = aws sts get-caller-identity 2>$null
if (!$awsIdentity) {
    Write-Host "❌ AWS credentials not configured. Run 'aws configure' first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ AWS credentials verified" -ForegroundColor Green

# Build the React app
Write-Host "📦 Building React application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Deploy to AWS Amplify
Write-Host "🌐 Creating Amplify app..." -ForegroundColor Yellow
$appName = "location-analysis-app"

# Create Amplify app with environment variables
$amplifyApp = aws amplify create-app --name $appName --platform WEB --build-spec (Get-Content amplify.yml -Raw) --custom-rules '[{"source":"/<*>","target":"/index.html","status":"404-200"}]' --environment-variables VITE_GOOGLE_MAPS_API_KEY=AIzaSyCcdHqF_kBE-E9Fq3JuiCife-XImYsjGlQ 2>$null

if ($amplifyApp) {
    $appId = ($amplifyApp | ConvertFrom-Json).app.appId
    Write-Host "✅ Amplify app created: $appId" -ForegroundColor Green
    
    # Create branch
    aws amplify create-branch --app-id $appId --branch-name main
    
    # Start deployment
    aws amplify start-deployment --app-id $appId --branch-name main --source-url "."
    
    Write-Host "🎉 Frontend deployed! Check AWS Amplify Console for URL" -ForegroundColor Green
} else {
    Write-Host "⚠️  Amplify app might already exist. Check AWS Console." -ForegroundColor Yellow
}

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Go to AWS Amplify Console" -ForegroundColor White
Write-Host "   2. Connect your GitHub repository" -ForegroundColor White
Write-Host "   3. Add environment variables (VITE_GOOGLE_MAPS_API_KEY)" -ForegroundColor White
Write-Host "   4. Deploy Lambda function with: npm install -g serverless && serverless deploy" -ForegroundColor White