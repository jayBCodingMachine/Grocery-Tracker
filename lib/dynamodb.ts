import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Create the base DynamoDB client with credentials from environment variables
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Document client simplifies working with DynamoDB items
// It automatically converts JavaScript objects to DynamoDB's format
export const docClient = DynamoDBDocumentClient.from(client);

// Table name - we'll use this throughout the app
export const TABLE_NAME = "GroceryItems";
