# AWS Production Deployment Guide

## Prerequisites

1. **AWS CLI** - Install from https://aws.amazon.com/cli/
2. **AWS Account** with appropriate permissions
3. **Google Maps API Key** for production use

## Quick Deploy

```bash
# Configure AWS credentials
aws configure

# Deploy the application
npm run deploy
```

## Manual Deployment Steps

### 1. Frontend Deployment (AWS Amplify)

```bash
# Build the app
npm run build

# Create Amplify app
aws amplify create-app --name location-analysis-app --platform WEB

# Deploy to Amplify
aws amplify start-deployment --app-id YOUR_APP_ID --branch-name main
```

### 2. Backend API Deployment (AWS Lambda)

```bash
# Install Serverless Framework
npm install -g serverless

# Deploy Lambda function
serverless deploy
```

### 3. Environment Variables

Set these in AWS Amplify Console:
- `VITE_GOOGLE_MAPS_API_KEY` - Your Google Maps API key
- `VITE_API_URL` - Your Lambda API Gateway URL

## AWS Services Used

- **AWS Amplify** - Frontend hosting and CI/CD
- **AWS Lambda** - Serverless API backend
- **API Gateway** - REST API endpoints
- **AWS Bedrock** - AI chat functionality

## Production Checklist

- [ ] Google Maps API key configured for production domain
- [ ] AWS credentials configured
- [ ] Environment variables set in Amplify
- [ ] Lambda function deployed
- [ ] Custom domain configured (optional)
- [ ] SSL certificate enabled
- [ ] CloudFront CDN configured

## Monitoring

- AWS CloudWatch for logs and metrics
- AWS X-Ray for distributed tracing
- Amplify Console for deployment status

## Cost Optimization

- Enable CloudFront caching
- Use Lambda provisioned concurrency for consistent performance
- Monitor AWS costs in Cost Explorer