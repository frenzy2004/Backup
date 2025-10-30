# Add environment variables to Amplify app
$appId = Read-Host "Enter your Amplify App ID"

aws amplify update-app --app-id $appId --environment-variables VITE_GOOGLE_MAPS_API_KEY=AIzaSyCcdHqF_kBE-E9Fq3JuiCife-XImYsjGlQ

Write-Host "✅ Environment variable added to Amplify app" -ForegroundColor Green