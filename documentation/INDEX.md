# Documentation Index

This folder contains documentation for the Grocery Tracker app.

## Start Here (New Sessions)

| Document | Purpose |
|----------|---------|
| **[ROADMAP.md](./ROADMAP.md)** | Project vision, phases, and what's next |
| **[WORKFLOW.md](./WORKFLOW.md)** | Development process and conventions |

---

## Feature Documentation

### Naming Convention

```
XXX-feature-name/
└── CHANGES.md
```

- **XXX** = Three-digit feature number (001, 002, 003...)
- **feature-name** = Kebab-case description of the feature
- **CHANGES.md** = Detailed documentation of what changed and why

## Features Log

| ID | Feature | Date | Status |
|----|---------|------|--------|
| [001](./001-dynamodb-migration/CHANGES.md) | DynamoDB Migration | 2026-02-02 | Completed |

## Upcoming Features

| ID | Feature | Status |
|----|---------|--------|
| 002 | User Authentication | Planned |
| 003 | List Sharing | Planned |
| 004 | Real-time Sync | Planned |

---

## How to Add New Documentation

1. Create a new folder: `XXX-feature-name/`
2. Copy the template from an existing feature
3. Update the INDEX.md with the new entry
4. Commit documentation with the feature code
