// src/lib/awsDynamo.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const REGION = process.env.AWS_REGION || 'eu-west-2'; // or your region

const ddbClient = new DynamoDBClient({
  region: REGION,
  // If you use Amplify hosting or other AWS credentials, 
  // make sure credentials are configured properly (env vars or role).
});

export const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
