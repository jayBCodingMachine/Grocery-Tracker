import { NextResponse } from 'next/server';
import {
    QueryCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand
} from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '@/lib/dynamodb';
import { GroceryItemType } from '@/app/types';
import { verifyToken, extractToken } from '@/lib/auth-server';

// Helper to get authenticated userId or return 401
async function getAuthenticatedUserId(request: Request): Promise<string | NextResponse> {
    const token = extractToken(request);

    if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const verified = await verifyToken(token);

    if (!verified) {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    return verified.userId;
}

// GET - Fetch all items for the current user
export async function GET(request: Request) {
    const userIdOrError = await getAuthenticatedUserId(request);
    if (userIdOrError instanceof NextResponse) {
        return userIdOrError;
    }
    const userId = userIdOrError;

    try {
        const command = new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId,
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
    const userIdOrError = await getAuthenticatedUserId(request);
    if (userIdOrError instanceof NextResponse) {
        return userIdOrError;
    }
    const userId = userIdOrError;

    try {
        const body = await request.json();

        if (body.action === 'add') {
            const newItem: GroceryItemType = {
                userId: userId,
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
    const userIdOrError = await getAuthenticatedUserId(request);
    if (userIdOrError instanceof NextResponse) {
        return userIdOrError;
    }
    const userId = userIdOrError;

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
                userId: userId,
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
    const userIdOrError = await getAuthenticatedUserId(request);
    if (userIdOrError instanceof NextResponse) {
        return userIdOrError;
    }
    const userId = userIdOrError;

    try {
        const { searchParams } = new URL(request.url);
        const itemId = searchParams.get('id');

        if (!itemId) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        const command = new DeleteCommand({
            TableName: TABLE_NAME,
            Key: {
                userId: userId,
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
