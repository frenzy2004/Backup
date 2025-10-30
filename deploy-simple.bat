@echo off
echo Creating Lambda deployment package...

REM Create package.json
echo {"name":"bedrock-chat-lambda","version":"1.0.0","type":"module","dependencies":{"@aws-sdk/client-bedrock-runtime":"^3.893.0"}} > lambda-package.json

REM Create temp directory and copy files
mkdir lambda-temp 2>nul
copy api\bedrock-chat.js lambda-temp\
copy lambda-package.json lambda-temp\

REM Install dependencies
cd lambda-temp
call npm install --production --silent
cd ..

REM Create ZIP
powershell -Command "Compress-Archive -Path 'lambda-temp\*' -DestinationPath 'lambda-deployment.zip' -Force"

echo.
echo Lambda package created: lambda-deployment.zip
echo.
echo Next steps:
echo 1. Go to AWS Lambda Console
echo 2. Create function: location-analysis-bedrock-chat
echo 3. Upload lambda-deployment.zip
echo 4. Set handler: bedrock-chat.handler
echo 5. Create API Gateway and connect to Lambda
echo.
echo Or run these AWS CLI commands:
echo.
echo aws lambda create-function --function-name location-analysis-bedrock-chat --runtime nodejs18.x --role YOUR_LAMBDA_ROLE_ARN --handler bedrock-chat.handler --zip-file fileb://lambda-deployment.zip --timeout 30 --memory-size 256
echo.
echo Then create API Gateway manually or use AWS Console.

REM Cleanup temp files
rmdir /s /q lambda-temp 2>nul
del lambda-package.json 2>nul

pause