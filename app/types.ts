export interface GroceryItemType {
    userId: string;    // Partition key - who owns this item
    itemId: string;    // Sort key - unique identifier for the item
    name: string;
    store: string;
    completed: boolean;
}
