import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { GroceryItemType } from '@/app/types';

// Path to our JSON "database"
const DB_PATH = path.join(process.cwd(), 'data', 'items.json');

// Helper to read data
async function readDb(): Promise<GroceryItemType[]> {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is invalid, return empty array
        return [];
    }
}

// Helper to write data
async function writeDb(items: GroceryItemType[]) {
    await fs.writeFile(DB_PATH, JSON.stringify(items, null, 2));
}

export async function GET() {
    const items = await readDb();
    return NextResponse.json(items);
}

export async function POST(request: Request) {
    const body = await request.json();
    const items = await readDb();

    // Handle different actions based on body content? 
    // For simplicity, let's assume body IS the new item to add, 
    // OR we can make a more RESTful structure.

    // Let's go with: POST = Add Item
    if (body.action === 'add') {
        const newItem: GroceryItemType = {
            id: Date.now().toString(),
            name: body.name,
            store: body.store,
            completed: false
        };
        items.unshift(newItem);
        await writeDb(items);
        return NextResponse.json(newItem);
    }

    // DELETE = Remove Item (usually implies DELETE method, but we can do it here for quick speed if we want, 
    // but let's stick to methods properly if we can, or just use POST for everything for dead simplicity if needed.
    // Let's do proper methods.)

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function PUT(request: Request) {
    const body = await request.json();
    const items = await readDb();

    const index = items.findIndex(i => i.id === body.id);
    if (index !== -1) {
        // Toggle completed or update fields
        items[index] = { ...items[index], ...body.updates };
        await writeDb(items);
        return NextResponse.json(items[index]);
    }

    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const items = await readDb();
    const newItems = items.filter(i => i.id !== id);
    await writeDb(newItems);

    return NextResponse.json({ success: true });
}
