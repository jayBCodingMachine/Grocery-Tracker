/**
 * Quick diagnostic script to test DynamoDB connection
 * Run with: npx tsx scripts/test-dynamodb.ts
 */

import { DynamoDBClient, DescribeTableCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

console.log("=== DynamoDB Diagnostic ===\n");
console.log("Region:", process.env.AWS_REGION);
console.log("Access Key ID:", process.env.AWS_ACCESS_KEY_ID?.slice(0, 8) + "...");

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const docClient = DynamoDBDocumentClient.from(client);

async function test() {
    const TABLE_NAME = "GroceryItems";

    // 1. Describe the table
    console.log("\n--- Step 1: Describe Table ---");
    try {
        const describeResult = await client.send(
            new DescribeTableCommand({ TableName: TABLE_NAME })
        );
        console.log("Table Status:", describeResult.Table?.TableStatus);
        console.log("Key Schema:", JSON.stringify(describeResult.Table?.KeySchema, null, 2));
    } catch (error) {
        console.error("Failed to describe table:", error);
        return;
    }

    // 2. Try to put a simple test item
    console.log("\n--- Step 2: Put Test Item ---");
    const testItem = {
        userId: "test_user",
        itemId: "test_item_001",
        name: "Test Item",
        store: "Test Store",
        completed: false,
    };
    console.log("Attempting to put:", JSON.stringify(testItem, null, 2));

    try {
        await docClient.send(
            new PutCommand({
                TableName: TABLE_NAME,
                Item: testItem,
            })
        );
        console.log("✓ Put succeeded!");
    } catch (error: any) {
        console.error("✗ Put failed:", error.message);
        console.error("Full error:", error);
    }

    // 3. Scan to see what's in the table
    console.log("\n--- Step 3: Scan Table ---");
    try {
        const scanResult = await docClient.send(
            new ScanCommand({ TableName: TABLE_NAME })
        );
        console.log("Items in table:", scanResult.Items?.length || 0);
        if (scanResult.Items?.length) {
            console.log("Items:", JSON.stringify(scanResult.Items, null, 2));
        }
    } catch (error: any) {
        console.error("Scan failed:", error.message);
    }
}

test();
