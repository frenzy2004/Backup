@echo off
echo Deploying Lambda + API Gateway...

REM Create package.json for Lambda
echo {> lambda-package.json
echo   "name": "bedrock-chat-lambda",>> lambda-package.json
echo   "version": "1.0.0",>> lambda-package.json
echo   "type": "module",>> lambda-package.json
echo   "dependencies": {>> lambda-package.json
echo     "@aws-sdk/client-bedrock-runtime": "^3.893.0">> lambda-package.json
echo   }>> lambda-package.json
echo }>> lambda-package.json

REM Create deployment package
mkdir lambda-temp 2>nul
copy api\bedrock-chat.js lambda-temp\
copy lambda-package.json lambda-temp\

cd lambda-temp
call npm install --production
cd ..

powershell -Command "Compress-Archive -Path 'lambda-temp\*' -DestinationPath 'lambda-deployment.zip' -Force"

REM Deploy Lambda function
echo Deploying Lambda function...
aws lambda create-function --function-name location-analysis-bedrock-chat --runtime nodejs18.x --role arn:aws:iam::235881043191:role/lambda-execution-role --handler bedrock-chat.handler --zip-file fileb://lambda-deployment.zip --timeout 30 --memory-size 256 --region us-east-1

if %errorlevel% neq 0 (
    echo Function exists. Updating...
    aws lambda update-function-code --function-name location-analysis-bedrock-chat --zip-file fileb://lambda-deployment.zip --region us-east-1
)

REM Get API Gateway ID (create if doesn't exist)
for /f %%i in ('aws apigateway get-rest-apis --region us-east-1 --query "items[?name==''location-analysis-api''].id" --output text') do set API_ID=%%i

if "%API_ID%"=="" (
    echo Creating API Gateway...
    for /f %%i in ('aws apigateway create-rest-api --name location-analysis-api --region us-east-1 --query "id" --output text') do set API_ID=%%i
)

echo API Gateway ID: %API_ID%

REM Get root resource ID
for /f %%i in ('aws apigateway get-resources --rest-api-id %API_ID% --region us-east-1 --query "items[?path==''/''].id" --output text') do set ROOT_ID=%%i

REM Create resources and methods (simplified)
aws apigateway create-resource --rest-api-id %API_ID% --parent-id %ROOT_ID% --path-part api --region us-east-1 2>nul
for /f %%i in ('aws apigateway get-resources --rest-api-id %API_ID% --region us-east-1 --query "items[?pathPart==''api''].id" --output text') do set API_RESOURCE_ID=%%i

aws apigateway create-resource --rest-api-id %API_ID% --parent-id %API_RESOURCE_ID% --path-part bedrock-chat --region us-east-1 2>nul
for /f %%i in ('aws apigateway get-resources --rest-api-id %API_ID% --region us-east-1 --query "items[?pathPart==''bedrock-chat''].id" --output text') do set CHAT_RESOURCE_ID=%%i

REM Create POST method
aws apigateway put-method --rest-api-id %API_ID% --resource-id %CHAT_RESOURCE_ID% --http-method POST --authorization-type NONE --region us-east-1 2>nul

REM Set up Lambda integration
aws apigateway put-integration --rest-api-id %API_ID% --resource-id %CHAT_RESOURCE_ID% --http-method POST --type AWS_PROXY --integration-http-method POST --uri arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:235881043191:function:location-analysis-bedrock-chat/invocations --region us-east-1 2>nul

REM Grant permission
aws lambda add-permission --function-name location-analysis-bedrock-chat --statement-id apigateway-invoke --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "arn:aws:execute-api:us-east-1:235881043191:%API_ID%/*/*" --region us-east-1 2>nul

REM Deploy API
aws apigateway create-deployment --rest-api-id %API_ID% --stage-name prod --region us-east-1 2>nul

REM Output URL
set API_URL=https://%API_ID%.execute-api.us-east-1.amazonaws.com/prod/api/bedrock-chat
echo.
echo Deployment complete!
echo API URL: %API_URL%

REM Update .env.production
powershell -Command "(Get-Content '.env.production') -replace 'VITE_API_URL=.*', 'VITE_API_URL=%API_URL%' | Set-Content '.env.production'"

REM Cleanup
rmdir /s /q lambda-temp 2>nul
del lambda-package.json 2>nul
del lambda-deployment.zip 2>nul

echo Ready to test!