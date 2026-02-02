# Development Workflow

This document outlines the development workflow for the Grocery Tracker project. The goal is to maintain a learning-focused approach where every change is understood, documented, and traceable.

---

## Core Principles

1. **Understand before implementing** — Always explain the "why" before writing code
2. **Document as you go** — Create documentation alongside code, not after
3. **Keep changes traceable** — Every feature has a number, documentation, and detailed commit

---

## Workflow Steps

### 1. Discuss the Change

Before writing any code, discuss:
- **What** is the goal?
- **Why** is this needed?
- **How** will it be implemented?
- **What alternatives** were considered?

This ensures understanding and prevents wasted effort on wrong approaches.

### 2. Assign a Feature Number

Every significant change gets a feature number:

```
Format: XXX (three digits)
Example: 001, 002, 003...
```

**When to assign a number:**
- New features
- Major refactors
- Infrastructure changes (database, auth, deployment)
- Breaking changes

**When NOT to assign a number:**
- Bug fixes (unless major)
- Typo corrections
- Dependency updates (unless major)
- Code formatting

### 3. Create Documentation First

Before or during implementation, create:

```
documentation/
└── XXX-feature-name/
    └── CHANGES.md
```

**CHANGES.md template:**
```markdown
# Feature XXX: Feature Name

| Field | Value |
|-------|-------|
| **Feature ID** | XXX |
| **Date** | YYYY-MM-DD |
| **Branch** | main |
| **Status** | In Progress / Completed |

**Summary:** One-line description of what this feature does.

---

## Why This Change?

Explain the problem being solved and why this approach was chosen.

## What Changed

### Files Modified
| File | Change Type | Purpose |
|------|-------------|---------|

### Files Added
| File | Purpose |
|------|---------|

## Technical Details

Detailed explanation of the implementation with code examples.

## Lessons Learned

What was learned during implementation (errors encountered, concepts clarified, etc.)

## Future Improvements

What could be added or improved later.
```

### 4. Implement the Change

While implementing:
- Explain each significant decision
- Note any issues encountered (for "Lessons Learned")
- Keep the documentation updated

### 5. Test the Change

Before committing:
- Verify the feature works end-to-end
- Check for regressions
- Run any existing tests

### 6. Stage for Review

Review all changes before committing:
```bash
git status          # See what changed
git diff --stat     # Summary of changes
git diff <file>     # Detailed changes per file
```

### 7. Commit with Detailed Message

**Commit message format:**
```
feat(XXX): Short description (max 50 chars)

Longer description explaining what and why (not how - the code shows how).

Docs: documentation/XXX-feature-name/CHANGES.md

## Changes

### Section Name
- Bullet points of specific changes
- Be specific, not vague

## Setup Required (if applicable)

Any manual setup steps needed.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

**Commit type prefixes:**
| Prefix | Use for |
|--------|---------|
| `feat(XXX)` | New features with ticket number |
| `fix` | Bug fixes |
| `docs` | Documentation only changes |
| `refactor` | Code changes that don't add features or fix bugs |
| `chore` | Maintenance tasks (dependencies, config) |

### 8. Update the Index

After committing, ensure `documentation/INDEX.md` is updated with the new feature.

---

## Example Workflow

Here's how Feature 001 (DynamoDB Migration) followed this workflow:

### Step 1: Discussion
```
User: "I want a shared grocery list"
Claude: "That requires a real database. Here are the options..."
User: "I want to learn AWS for certifications"
Claude: "Let's use DynamoDB. Here's how it works..."
```

### Step 2: Assign Number
- Feature ID: 001
- Name: DynamoDB Migration

### Step 3: Create Documentation
- Created `documentation/001-dynamodb-migration/CHANGES.md`
- Documented the why, what, and how

### Step 4: Implement
- Created lib/dynamodb.ts
- Updated API routes
- Updated frontend components
- Created migration scripts

### Step 5: Test
- Ran diagnostic script to verify connection
- Tested CRUD operations in the app
- Verified data in DynamoDB console

### Step 6: Review
- Listed all changed files
- Reviewed each change
- Explained the purpose of each

### Step 7: Commit
```
feat(001): Replace JSON file storage with AWS DynamoDB
...
```

### Step 8: Update Index
- Added Feature 001 to documentation/INDEX.md

---

## File Organization

```
project/
├── app/                    # Next.js application code
├── components/             # React components
├── lib/                    # Shared utilities (database clients, etc.)
├── scripts/                # One-time or utility scripts
├── data/                   # Local data files (deprecated after DB migration)
├── documentation/          # Feature documentation
│   ├── INDEX.md           # Master list of all features
│   ├── WORKFLOW.md        # This file
│   └── XXX-feature-name/  # Per-feature documentation
│       └── CHANGES.md
└── .env.local             # Environment variables (not committed)
```

---

## Why This Workflow?

### For Learning
- Explaining "why" reinforces understanding
- Documentation becomes study material
- Mistakes are captured as lessons learned

### For Maintainability
- Future you can understand past decisions
- Others can onboard quickly
- Changes are traceable to requirements

### For Portfolio
- Demonstrates professional practices
- Shows thought process, not just code
- Proves ability to document and communicate

---

## Quick Reference

**Starting a new feature:**
1. Discuss what and why
2. Get next feature number from INDEX.md
3. Create `documentation/XXX-feature-name/CHANGES.md`
4. Implement with explanations
5. Test
6. Commit with `feat(XXX): description`
7. Update INDEX.md

**Commit message must include:**
- Feature number in prefix: `feat(XXX)`
- Reference to docs: `Docs: documentation/XXX-.../CHANGES.md`
- Co-author line for AI assistance
