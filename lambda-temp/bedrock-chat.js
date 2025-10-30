import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS' || event.requestContext?.http?.method === 'OPTIONS') {
    return { 
      statusCode: 200, 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      }, 
      body: '' 
    };
  }

  try {
    const { message } = JSON.parse(event.body);
    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No message provided' })
      };
    }

    const input = {
      modelId: 'amazon.nova-lite-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: [{ text: message }]
        }],
        inferenceConfig: {
          max_new_tokens: 256,
          temperature: 0.7
        }
      })
    };

    const command = new InvokeModelCommand(input);
    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const aiText = responseBody.output?.message?.content?.[0]?.text || 'No response.';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ response: aiText })
    };
  } catch (err) {
    console.error('Bedrock Error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: `Bedrock API Error: ${err.message}` })
    };
  }
};