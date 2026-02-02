/**
 * One-time migration script to move JSON data to DynamoDB
 * Run with: npx tsx scripts/migrate-to-dynamodb.ts
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import * as fs from "fs";
import * as path from "path";

// Load environment variables from .env.local
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "GroceryItems";
const DEFAULT_USER_ID = "default_user";

async function migrate() {
    // Read the JSON file
    const jsonPath = path.join(process.cwd(), "data", "items.json");
    const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    console.log(`Found ${data.length} items to migrate...\n`);

    for (const item of data) {
        const newItem = {
            userId: DEFAULT_USER_ID,
            itemId: `item_${item.id}`, // Prefix with "item_" to match new format
            name: item.name,
            store: item.store,
            completed: item.completed,
        };

        console.log("Sending item:", JSON.stringify(newItem, null, 2));

        try {
            await docClient.send(
                new PutCommand({
                    TableName: TABLE_NAME,
                    Item: newItem,
                })
            );
            console.log(`✓ Migrated: ${item.name}`);
        } catch (error) {
            console.error(`✗ Failed to migrate ${item.name}:`, error);
        }
    }

    console.log("\nMigration complete!");
}

migrate();
