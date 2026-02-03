# Project Roadmap

**Project:** Grocery Tracker
**Goal:** A shared grocery list app that family members can use together, with advanced features like barcode scanning and receipt import.

**Owner's Learning Goals:**
- Level up as a software developer (4 years experience, primarily Salesforce)
- Gain hands-on AWS experience for certification prep
- Understand full-stack web development outside of managed platforms

---

## Project Vision

A mobile-friendly grocery list that:
1. Multiple family members can access simultaneously
2. Filters by store (click "Costco" to see only Costco items)
3. Syncs in real-time across devices
4. Eventually supports barcode scanning and receipt import

---

## Phase 1: Foundation (Current)

**Goal:** Establish the core infrastructure for a multi-user app.

| ID | Feature | Status | Description |
|----|---------|--------|-------------|
| 001 | DynamoDB Migration | ✅ Done | Replace JSON file with AWS DynamoDB |
| 002 | User Authentication | ✅ Done | Login/signup with AWS Cognito |
| 003 | List Sharing | ⬜ Next | Invite family members to shared lists |

### Feature 001: DynamoDB Migration ✅
- **Completed:** 2026-02-02
- **What:** Migrated from local JSON file to AWS DynamoDB
- **Why:** JSON can't support multiple users or sync across devices
- **Docs:** [001-dynamodb-migration/CHANGES.md](./001-dynamodb-migration/CHANGES.md)

### Feature 002: User Authentication ✅
- **Completed:** 2026-02-02
- **What:** Login/signup with AWS Cognito + Google OAuth
- **Why:** Need to know who users are before sharing lists
- **Docs:** [002-user-authentication/CHANGES.md](./002-user-authentication/CHANGES.md)
- **Key achievements:**
  - AWS Cognito User Pool with Google federated identity
  - Email/password registration with verification
  - JWT-protected API routes
  - User ID from token replaces hardcoded `DEFAULT_USER_ID`

### Feature 003: List Sharing (Next)
- **Status:** Ready to start
- **What:** Allow users to share lists with family members
- **Why:** Core feature - family members shopping together
- **Depends on:** Feature 002 (Authentication) ✅
- **Key tasks:**
  - Design sharing data model (who has access to which lists)
  - Create invite/accept flow
  - Update DynamoDB queries for shared access

---

## Phase 2: Polish the Core Experience

**Goal:** Make the app pleasant and reliable for daily use.

| ID | Feature | Status | Description |
|----|---------|--------|-------------|
| 004 | Real-time Sync | ⬜ Planned | See updates instantly when others change the list |
| 005 | Multiple Lists | ⬜ Planned | Separate lists for different purposes |
| 006 | Mobile PWA | ⬜ Planned | Install as app on phone, offline support |

### Feature 004: Real-time Sync
- **What:** When one person checks off an item, others see it immediately
- **Why:** Avoids "I already got that!" moments at the store
- **Approach options:**
  - AWS AppSync (GraphQL with real-time subscriptions)
  - DynamoDB Streams + WebSockets
  - Polling (simple but less elegant)

### Feature 005: Multiple Lists
- **What:** Create separate lists (e.g., "Weekly Groceries", "Costco Run", "Party Supplies")
- **Why:** Different shopping trips have different needs
- **Key tasks:**
  - Add `listId` to data model
  - Create list management UI
  - Update sharing to be per-list

### Feature 006: Mobile PWA
- **What:** Progressive Web App that can be installed on phones
- **Why:** Quick access from home screen, works offline
- **Key tasks:**
  - Add service worker
  - Create app manifest
  - Implement offline queue for changes

---

## Phase 3: Advanced Features

**Goal:** Differentiate from basic list apps with smart features.

| ID | Feature | Status | Description |
|----|---------|--------|-------------|
| 007 | Barcode Scanning | ⬜ Future | Scan product to add to list |
| 008 | Receipt Import | ⬜ Future | OCR receipts to track purchases |
| 009 | Price Tracking | ⬜ Future | Historical prices, find best deals |
| 010 | Smart Suggestions | ⬜ Future | "You usually buy milk on Fridays" |

### Feature 007: Barcode Scanning
- **What:** Use phone camera to scan product barcodes
- **Why:** Faster than typing, especially for restocking
- **Approach:**
  - Browser-based scanner (quagga.js or similar)
  - Product database API (Open Food Facts, UPC Database)

### Feature 008: Receipt Import
- **What:** Take photo of receipt, auto-import items
- **Why:** Track what you actually bought, not just what you planned
- **Approach:**
  - AWS Textract for OCR
  - Parse receipt format to extract items/prices

### Feature 009: Price Tracking
- **What:** Store historical prices, show trends
- **Why:** Know if a "sale" is actually a good deal
- **Key tasks:**
  - Add price field to items
  - Store purchase history
  - Create price comparison views

### Feature 010: Smart Suggestions
- **What:** AI-powered suggestions based on patterns
- **Why:** "You're out of milk" before you realize it
- **Approach:** Analyze purchase frequency, suggest items

---

## Technical Decisions Log

Decisions made that affect future development:

| Decision | Choice | Why | Date |
|----------|--------|-----|------|
| Database | AWS DynamoDB | NoSQL for flexibility, AWS for cert prep, free tier | 2026-02-02 |
| Framework | Next.js | React-based, API routes built-in, good DX | Initial |
| Auth | AWS Cognito + Google OAuth | Native AWS integration, cert relevance, user convenience | 2026-02-02 |
| Hosting (planned) | Vercel or AWS Amplify | TBD based on deployment needs | TBD |

---

## Current Tech Stack

```
Frontend:        Next.js 16 + React 19
Language:        TypeScript 5
Database:        AWS DynamoDB
Auth:            AWS Cognito + Google OAuth (aws-amplify)
Hosting:         Local development only
Styling:         CSS with custom properties (dark theme)
```

---

## AWS Services Used/Planned

| Service | Status | Purpose |
|---------|--------|---------|
| DynamoDB | ✅ Active | Primary database |
| IAM | ✅ Active | API credentials |
| Cognito | ✅ Active | User authentication + Google OAuth |
| AppSync | ⬜ Considered | Real-time sync |
| Textract | ⬜ Future | Receipt OCR |
| S3 | ⬜ Future | Image storage |

---

## How to Use This Roadmap

1. **Before starting a feature:** Check this roadmap for context and dependencies
2. **After completing a feature:** Update status and add completion date
3. **When planning:** Reference this for priorities and approach decisions
4. **New sessions:** AI agents should read this first to understand project direction

---

## Revision History

| Date | Change |
|------|--------|
| 2026-02-02 | Initial roadmap created after Feature 001 completion |
| 2026-02-02 | Updated after Feature 002 (User Authentication) completion |
