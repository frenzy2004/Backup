# Complete Lambda + API Gateway deployment script

param(
    [string]$Region = "us-east-1",
    [string]$AccountId = "235881043191"
)

$functionName = "location-analysis-bedrock-chat"
$apiName = "location-analysis-api"

Write-Host "🚀 Deploying Lambda + API Gateway..." -ForegroundColor Green

# Create deployment package
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow
if (Test-Path "lambda-deployment.zip") { Remove-Item "lambda-deployment.zip" }

$packageJson = @'
{
  "name": "bedrock-chat-lambda",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@aws-sdk/client-bedrock-runtime": "^3.893.0"
  }
}
'@
$packageJson | Out-File -FilePath "lambda-package.json" -Encoding UTF8

New-Item -ItemType Directory -Force -Path "lambda-temp"
Copy-Item "api/bedrock-chat.js" "lambda-temp/"
Copy-Item "lambda-package.json" "lambda-temp/package.json"

Push-Location "lambda-temp"
npm install --production
Pop-Location

Compress-Archive -Path "lambda-temp/*" -DestinationPath "lambda-deployment.zip" -Force

# Deploy Lambda function
Write-Host "☁️ Deploying Lambda function..." -ForegroundColor Yellow
$roleArn = "arn:aws:iam::${AccountId}:role/lambda-execution-role"

aws lambda create-function `
  --function-name $functionName `
  --runtime nodejs18.x `
  --role $roleArn `
  --handler bedrock-chat.handler `
  --zip-file fileb://lambda-deployment.zip `
  --timeout 30 `
  --memory-size 256 `
  --region $Region 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Function exists. Updating..." -ForegroundColor Yellow
    aws lambda update-function-code --function-name $functionName --zip-file fileb://lambda-deployment.zip --region $Region
}

# Create API Gateway
Write-Host "🌐 Creating API Gateway..." -ForegroundColor Yellow
$apiId = (aws apigateway create-rest-api --name $apiName --region $Region --query 'id' --output text 2>$null)

if (-not $apiId) {
    $apiId = (aws apigateway get-rest-apis --region $Region --query "items[?name=='$apiName'].id" --output text)
    Write-Host "⚠️ API Gateway exists. Using existing: $apiId" -ForegroundColor Yellow
}

# Get root resource ID
$rootResourceId = (aws apigateway get-resources --rest-api-id $apiId --region $Region --query 'items[?path==`/`].id' --output text)

# Create /api resource
$apiResourceId = (aws apigateway create-resource --rest-api-id $apiId --parent-id $rootResourceId --path-part "api" --region $Region --query 'id' --output text 2>$null)
if (-not $apiResourceId) {
    $apiResourceId = (aws apigateway get-resources --rest-api-id $apiId --region $Region --query 'items[?pathPart==`api`].id' --output text)
}

# Create /bedrock-chat resource
$chatResourceId = (aws apigateway create-resource --rest-api-id $apiId --parent-id $apiResourceId --path-part "bedrock-chat" --region $Region --query 'id' --output text 2>$null)
if (-not $chatResourceId) {
    $chatResourceId = (aws apigateway get-resources --rest-api-id $apiId --region $Region --query 'items[?pathPart==`bedrock-chat`].id' --output text)
}

# Create POST method
aws apigateway put-method --rest-api-id $apiId --resource-id $chatResourceId --http-method POST --authorization-type NONE --region $Region 2>$null

# Create OPTIONS method for CORS
aws apigateway put-method --rest-api-id $apiId --resource-id $chatResourceId --http-method OPTIONS --authorization-type NONE --region $Region 2>$null

# Set up Lambda integration for POST
$lambdaUri = "arn:aws:apigateway:${Region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${Region}:${AccountId}:function:${functionName}/invocations"

aws apigateway put-integration --rest-api-id $apiId --resource-id $chatResourceId --http-method POST --type AWS_PROXY --integration-http-method POST --uri $lambdaUri --region $Region 2>$null

# Set up OPTIONS integration for CORS
aws apigateway put-integration --rest-api-id $apiId --resource-id $chatResourceId --http-method OPTIONS --type MOCK --region $Region 2>$null

aws apigateway put-integration-response --rest-api-id $apiId --resource-id $chatResourceId --http-method OPTIONS --status-code 200 --response-parameters '{"method.response.header.Access-Control-Allow-Headers":"'"'"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"'"'","method.response.header.Access-Control-Allow-Methods":"'"'"'GET,OPTIONS,POST,PUT'"'"'","method.response.header.Access-Control-Allow-Origin":"'"'"'*'"'"'"}' --region $Region 2>$null

aws apigateway put-method-response --rest-api-id $apiId --resource-id $chatResourceId --http-method OPTIONS --status-code 200 --response-parameters '{"method.response.header.Access-Control-Allow-Headers":false,"method.response.header.Access-Control-Allow-Methods":false,"method.response.header.Access-Control-Allow-Origin":false}' --region $Region 2>$null

# Grant API Gateway permission to invoke Lambda
aws lambda add-permission --function-name $functionName --statement-id apigateway-invoke --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "arn:aws:execute-api:${Region}:${AccountId}:${apiId}/*/*" --region $Region 2>$null

# Deploy API
aws apigateway create-deployment --rest-api-id $apiId --stage-name prod --region $Region 2>$null

# Output the API URL
$apiUrl = "https://${apiId}.execute-api.${Region}.amazonaws.com/prod/api/bedrock-chat"
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 API URL: $apiUrl" -ForegroundColor Cyan

# Update environment variable
Write-Host "📝 Updating .env.production..." -ForegroundColor Yellow
$envContent = Get-Content ".env.production" -Raw
$envContent = $envContent -replace "VITE_API_URL=.*", "VITE_API_URL=$apiUrl"
$envContent | Out-File -FilePath ".env.production" -Encoding UTF8 -NoNewline

# Cleanup
Remove-Item -Recurse -Force "lambda-temp"
Remove-Item "lambda-package.json"
Remove-Item "lambda-deployment.zip"

Write-Host "🎉 Ready to test at: $apiUrl" -ForegroundColor Green