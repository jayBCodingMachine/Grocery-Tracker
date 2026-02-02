# Feature 001: DynamoDB Migration

| Field | Value |
|-------|-------|
| **Feature ID** | 001 |
| **Date** | 2026-02-02 |
| **Branch** | main |
| **Status** | Completed |

**Summary:** Replaced local JSON file storage with AWS DynamoDB for multi-user cloud database support.

---

## Why This Change?

The original app stored grocery items in a local `data/items.json` file. This worked for a single user on a single machine, but had limitations:

| Problem | Impact |
|---------|--------|
| Single user only | Can't share lists with family |
| Local file | Data stuck on one machine |
| No concurrent access | Multiple users would corrupt data |
| Not scalable | Would fail with large data |

**DynamoDB solves these problems** by providing a cloud-hosted, multi-user database with built-in scaling.

---

## What Changed

### Files Modified

| File | Change Type | Purpose |
|------|-------------|---------|
| `app/types.ts` | Modified | Updated data model with `userId` and `itemId` |
| `app/api/items/route.ts` | Rewritten | Replaced file I/O with DynamoDB operations |
| `components/GroceryList.tsx` | Modified | Updated to use `itemId` instead of `id` |
| `components/GroceryItem.tsx` | Modified | Updated to use `itemId` instead of `id` |
| `package.json` | Modified | Added AWS SDK dependencies |

### Files Added

| File | Purpose |
|------|---------|
| `lib/dynamodb.ts` | DynamoDB client configuration |
| `scripts/migrate-to-dynamodb.ts` | One-time data migration script |
| `scripts/test-dynamodb.ts` | Diagnostic/testing script |
| `.env.local` | AWS credentials (not committed) |

---

## Technical Details

### Data Model Change

**Before:**
```typescript
interface GroceryItemType {
    id: string;        // Simple unique ID
    name: string;
    store: string;
    completed: boolean;
}
```

**After:**
```typescript
interface GroceryItemType {
    userId: string;    // Partition key - enables multi-user
    itemId: string;    // Sort key - unique item identifier
    name: string;
    store: string;
    completed: boolean;
}
```

**Why two keys?**
- `userId` (Partition Key): Groups all items by user, enables "get all items for user X"
- `itemId` (Sort Key): Uniquely identifies each item within a user's partition

### DynamoDB Table Schema

```
Table: GroceryItems
Region: us-east-2

Primary Key:
  - Partition Key: userId (String)
  - Sort Key: itemId (String)

Capacity Mode: On-demand (pay per request)
```

### API Changes

| Endpoint | Before | After |
|----------|--------|-------|
| GET `/api/items` | Read JSON file | `QueryCommand` - fetch by userId |
| POST `/api/items` | Append to array, write file | `PutCommand` - insert new item |
| PUT `/api/items` | Find/update in array, write file | `UpdateCommand` - update specific fields |
| DELETE `/api/items?id=X` | Filter array, write file | `DeleteCommand` - remove by composite key |

### DynamoDB Operations Explained

**QueryCommand (GET):**
```typescript
new QueryCommand({
    TableName: "GroceryItems",
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': 'default_user' },
})
```
- Fetches all items where `userId` matches
- Efficient because it only scans one partition

**PutCommand (POST):**
```typescript
new PutCommand({
    TableName: "GroceryItems",
    Item: {
        userId: "default_user",
        itemId: "item_123456",
        name: "Milk",
        store: "Costco",
        completed: false
    },
})
```
- Inserts a complete item
- Overwrites if same keys exist

**UpdateCommand (PUT):**
```typescript
new UpdateCommand({
    TableName: "GroceryItems",
    Key: { userId: "default_user", itemId: "item_123456" },
    UpdateExpression: "SET #completed = :completed",
    ExpressionAttributeNames: { "#completed": "completed" },
    ExpressionAttributeValues: { ":completed": true },
    ReturnValues: "ALL_NEW",
})
```
- Updates specific fields without replacing entire item
- `ExpressionAttributeNames` handles reserved words
- `ReturnValues: "ALL_NEW"` returns the updated item

**DeleteCommand (DELETE):**
```typescript
new DeleteCommand({
    TableName: "GroceryItems",
    Key: { userId: "default_user", itemId: "item_123456" },
})
```
- Requires both partition key and sort key
- Deletes single item

---

## Dependencies Added

```json
{
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.x",
    "@aws-sdk/lib-dynamodb": "^3.x"
  },
  "devDependencies": {
    "dotenv": "^17.x",
    "tsx": "^4.x"
  }
}
```

| Package | Purpose |
|---------|---------|
| `@aws-sdk/client-dynamodb` | Low-level DynamoDB client |
| `@aws-sdk/lib-dynamodb` | Document client (auto-marshals JS objects) |
| `dotenv` | Load `.env.local` for migration scripts |
| `tsx` | Run TypeScript scripts directly |

**Why AWS SDK v3?**
- Modular (only install what you need)
- Better TypeScript support
- Tree-shakable for smaller bundles
- v2 is deprecated

---

## Environment Setup

### Required Environment Variables

Create `.env.local` in project root:
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-2
```

### AWS Resources Created

1. **IAM User:** `grocery-tracker-app`
   - Permissions: `AmazonDynamoDBFullAccess`

2. **IAM Group:** `DynamoDBApps`
   - Best practice: attach permissions to groups, not users

3. **DynamoDB Table:** `GroceryItems`
   - Partition key: `userId` (String)
   - Sort key: `itemId` (String)

---

## Lessons Learned

### 1. DynamoDB Key Schema is Immutable
Once you create a table, you cannot rename or modify the partition/sort keys. If you make a typo (like `"itemId "` with a trailing space), you must delete and recreate the table.

### 2. Use the DescribeTable Command for Debugging
When things don't work, use `DescribeTableCommand` to verify the actual schema:
```typescript
const result = await client.send(
    new DescribeTableCommand({ TableName: "GroceryItems" })
);
console.log(result.Table?.KeySchema);
```

### 3. Document Client vs Low-Level Client
- `DynamoDBClient` requires manual marshalling: `{ S: "value" }`
- `DynamoDBDocumentClient` accepts plain JS objects: `{ key: "value" }`
- Always use the Document Client for application code

### 4. Expression Attributes
DynamoDB uses placeholder syntax to avoid injection and reserved word conflicts:
- `#name` for attribute names
- `:value` for values

---

## Future Improvements

- [ ] Add user authentication (replace `DEFAULT_USER_ID`)
- [ ] Implement list sharing between users
- [ ] Add real-time sync with DynamoDB Streams
- [ ] Migrate to AWS Cognito for auth

---

## Related Files

- [lib/dynamodb.ts](../../lib/dynamodb.ts) - Client configuration
- [app/api/items/route.ts](../../app/api/items/route.ts) - API endpoints
- [scripts/migrate-to-dynamodb.ts](../../scripts/migrate-to-dynamodb.ts) - Migration script
