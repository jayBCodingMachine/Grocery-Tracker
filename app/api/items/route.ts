import { NextResponse } from 'next/server';
import {
    QueryCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand
} from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '@/lib/dynamodb';
import { GroceryItemType } from '@/app/types';

// Temporary: hardcoded user until we add authentication
const DEFAULT_USER_ID = 'default_user';

// GET - Fetch all items for the current user
export async function GET() {
    try {
        const command = new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': DEFAULT_USER_ID,
            },
        });

        const response = await docClient.send(command);
        const items = response.Items as GroceryItemType[] || [];

        return NextResponse.json(items);
    } catch (error) {
        console.error('DynamoDB GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
    }
}

// POST - Add a new item
export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (body.action === 'add') {
            const newItem: GroceryItemType = {
                userId: DEFAULT_USER_ID,
                itemId: `item_${Date.now()}`,
                name: body.name,
                store: body.store,
                completed: false,
            };

            const command = new PutCommand({
                TableName: TABLE_NAME,
                Item: newItem,
            });

            await docClient.send(command);
            return NextResponse.json(newItem);
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('DynamoDB POST error:', error);
        return NextResponse.json({ error: 'Failed to add item' }, { status: 500 });
    }
}

// PUT - Update an item (e.g., toggle completed)
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { itemId, updates } = body;

        // Build the update expression dynamically
        const updateExpressions: string[] = [];
        const expressionAttributeNames: Record<string, string> = {};
        const expressionAttributeValues: Record<string, unknown> = {};

        Object.entries(updates).forEach(([key, value]) => {
            updateExpressions.push(`#${key} = :${key}`);
            expressionAttributeNames[`#${key}`] = key;
            expressionAttributeValues[`:${key}`] = value;
        });

        const command = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: {
                userId: DEFAULT_USER_ID,
                itemId: itemId,
            },
            UpdateExpression: `SET ${updateExpressions.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
        });

        const response = await docClient.send(command);
        return NextResponse.json(response.Attributes);
    } catch (error) {
        console.error('DynamoDB PUT error:', error);
        return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
    }
}

// DELETE - Remove an item
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const itemId = searchParams.get('id');

        if (!itemId) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        const command = new DeleteCommand({
            TableName: TABLE_NAME,
            Key: {
                userId: DEFAULT_USER_ID,
                itemId: itemId,
            },
        });

        await docClient.send(command);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DynamoDB DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
    }
}
