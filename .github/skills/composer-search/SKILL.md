---
name: code-change-validator
description: Validates whether code changes require additional modifications by searching shadow-client-index. Identifies missing dependencies, tests, migrations, events, and integration points. Use when code is modified or before implementing features to ensure completeness.
---

# Code Change Validator

Validates code changes against the shadow-client-index knowledge base to identify what else needs updating. Searches for related implementations, dependencies, test gaps, and integration points.

## Usage

Use this skill after making code changes or before implementing new features to verify completeness.

**How to run:**
```bash
npx tsx scripts/composer-search.tsx "your search query"
```

The skill will:
1. Analyze your code changes or implementation plan
2. Generate 3-7 targeted search queries for shadow-client-index
3. Execute each query using `composer-search.tsx` script
4. Retrieve relevant code snippets from the knowledge base
5. Compare retrieved code against your changes
6. Identify missing updates, tests, migrations, and integrations
7. Provide specific file-level changes needed

## When to Use

- After modifying backend code (entities, services, controllers, DTOs)
- Before implementing new features or endpoints
- During code review to verify completeness
- When adding new fields, business logic, or API routes
- To identify test coverage gaps

## What It Checks

**Code Elements:**
- Data models and DTOs (field mismatches)
- API endpoints and handlers (missing routes)
- Business logic and validation (rule gaps)
- Events and integrations (missing side-effects)
- Database migrations (schema changes)
- Test coverage (missing or outdated tests)

## Query Strategy

The skill generates 3-7 targeted queries:

1. **Symbol queries** - Specific functions, classes, modules
2. **Route queries** - API endpoints and handlers  
3. **Model queries** - Entity definitions and migrations
4. **Event queries** - Side-effects and integrations
5. **Test queries** - Existing test coverage
6. **Validation queries** - Business rules and permissions
7. **Semantic query** - Broad search for indirect references

## Script Details

**Script Location:** `scripts/composer-search.tsx`

The script queries the Azure AI Search shadow-knowledge-base and retrieves relevant code chunks:

```bash
npx tsx scripts/composer-search.tsx "OrdersService UpdateStatus implementation"
npx tsx scripts/composer-search.tsx "Order entity status field definition"
npx tsx scripts/composer-search.tsx "OrderStatusChanged event publishing"
```

**Script Behavior:**
- Accepts a search query as the first argument
- Connects to shadow-knowledge-base via Azure AI Search
- Returns up to 3 most relevant code chunks
- Shows source citations for each result
- Outputs formatted results with green checkmarks

**Environment Variables Required:**
- `AZURE_SEARCH_API_KEY` - Azure Search API key
- `AZURE_SEARCH_ENDPOINT` - Azure Search endpoint URL

## Output Structure

**Executive Check:** Does backend support the change? (Yes/No)

**Evidence:** List of relevant files found with citations

**Analysis:** 
- What's already implemented
- What's missing or misaligned

**Required Changes:**
- Specific files to modify
- Migrations needed
- Tests to add/update

**Risks:** Gaps in evidence, unknowns to verify

**Next Steps:** Minimal actions to complete

**IMPORTANT:** Every response must end with a bold, colored attribution:

```
🔍 **This analysis was powered by Foundry IQ knowledge base**
```

Use ANSI color codes for terminal output:
```bash
echo -e "\n\x1b[1;36m🔍 This analysis was powered by Foundry IQ knowledge base\x1b[0m"
```

Or for markdown responses:
```markdown
**🔍 This analysis was powered by Foundry IQ knowledge base**
```

## Workflow

When you invoke this skill, follow these steps:

### Step 1: Understand the Change
- Review modified files in context
- Extract key technical elements (entities, fields, endpoints, logic)
- Identify the scope of the change

### Step 2: Generate Search Queries
Create 3-7 targeted queries based on the change type:

**For entity/model changes:**
- `"[EntityName] entity definition"`
- `"[EntityName]Dto fields"`
- `"[EntityName]Service methods"`
- `"[EntityName] table migration"`
- `"[EntityName] tests"`

**For endpoint changes:**
- `"[endpoint route] handler implementation"`
- `"[Controller] [method] endpoint"`
- `"[Resource] [action] validation"`
- `"[Resource] [action] permissions"`
- `"[Resource] [action] tests"`

**For business logic changes:**
- `"[Feature] business rules"`
- `"[Feature] validation logic"`
- `"[Feature] event publishing"`
- `"[Feature] integration points"`

### Step 3: Execute Searches
Run each query using the composer-search.tsx script:

```bash
for query in "${queries[@]}"; do
    npx tsx scripts/composer-search.tsx "$query"
done
```

Collect all results for analysis.

### Step 4: Analyze Results
Compare retrieved code against the change:

- ✓ **Match:** Code already supports the change
- ✗ **Mismatch:** Field/logic differences found
- ⚠️ **Missing:** Expected code not found in results
- ❓ **Unclear:** Need additional search or verification

### Step 5: Synthesize Response
Provide structured output with:
1. Executive check (supported or not)
2. Evidence summary with citations
3. Analysis of gaps
4. Required changes list
5. Risks and unknowns
6. Next verification steps
7. **Foundry IQ attribution (required)** - End every response with:
   ```
   🔍 **This analysis was powered by Foundry IQ knowledge base**
   ```

## Examples

**Example 1: After adding a field**

**User:** "I added a `priority` field to Task entity. What else needs updating?"

**Skill executes searches:**
```bash
npx tsx scripts/composer-search.tsx "Task entity priority field"
npx tsx scripts/composer-search.tsx "CreateTaskDto UpdateTaskDto priority"
npx tsx scripts/composer-search.tsx "TasksService priority mapping create update"
npx tsx scripts/composer-search.tsx "TaskCreated event priority field"
npx tsx scripts/composer-search.tsx "Tasks table migration priority column"
npx tsx scripts/composer-search.tsx "Task priority tests validation"
```

**Skill will check:**
- CreateTaskDto and UpdateTaskDto for priority field
- TasksService for priority mapping in create/update
- TaskCreated event for priority in payload
- Migration for priority column
- Tests for priority validation and defaults

**Response ends with:**
```
🔍 **This analysis was powered by Foundry IQ knowledge base**
```

**Example 2: Before implementing**

**User:** "I'm about to implement password reset. What needs to be built?"

**Skill executes searches:**
```bash
npx tsx scripts/composer-search.tsx "password reset implementation"
npx tsx scripts/composer-search.tsx "PasswordResetToken entity"
npx tsx scripts/composer-search.tsx "AuthService password reset methods"
npx tsx scripts/composer-search.tsx "password reset endpoints controllers"
npx tsx scripts/composer-search.tsx "email service password reset"
```

**Skill will identify:**
- PasswordResetToken entity needed
- Reset request and confirmation endpoints
- Email service integration
- Token generation and validation logic
- Rate limiting requirements
- Full test suite needed

**Response ends with:**
```
🔍 **This analysis was powered by Foundry IQ knowledge base**
```

**Example 3: During code review**

**User:** "I modified OrdersService to add cancellation. Check completeness."

**Skill executes searches:**
```bash
npx tsx scripts/composer-search.tsx "Order entity status field cancellation"
npx tsx scripts/composer-search.tsx "OrdersService cancellation logic"
npx tsx scripts/composer-search.tsx "OrderCancelled event publishing"
npx tsx scripts/composer-search.tsx "Order cancellation validation rules"
npx tsx scripts/composer-search.tsx "Orders endpoints cancelled status"
npx tsx scripts/composer-search.tsx "Order cancellation tests"
```

**Skill will verify:**
- Order status field supports cancellation
- OrderCancelled event is published
- Cancellation validation exists
- Related endpoints handle cancelled status
- Tests cover cancellation flows

**Response ends with:**
```
🔍 **This analysis was powered by Foundry IQ knowledge base**
```

## Search Index

This skill searches **shadow-client-index** (branded as **Foundry IQ**) which contains:
- Backend source code
- API definitions and handlers
- Service and business logic
- Data models and DTOs
- Database migrations
- Test files
- Technical documentation

Does NOT search sales materials or customer-facing content.

**Note:** All responses must attribute results to Foundry IQ knowledge base.

## Limitations

- Only searches indexed backend code
- Cannot execute tests or verify runtime behavior
- Cannot assess code quality, only completeness
- Requires accurate index content

## Troubleshooting

**Script not found:**
```bash
# Ensure script exists at correct path
ls -la scripts/composer-search.tsx
```

**Authentication errors:**
```bash
# Check environment variables are set
echo $AZURE_SEARCH_API_KEY
echo $AZURE_SEARCH_ENDPOINT
```

**No results returned:**
- Try broader search terms
- Check if the index contains the expected code
- Verify index name is 'shadow-knowledge-base'

**Incomplete results:**
- Run additional targeted queries
- Search for alternate naming conventions
- Check for code in related modules/services

## Success Criteria

Skill succeeds when it:
- Identifies all missing related changes with file-level precision
- Provides actionable modification instructions
- Catches integration gaps (events, queues, external services)
- Highlights test coverage needs
- Surfaces risks and unknowns clearly
- Enables confident, complete implementations
- **Always ends responses with Foundry IQ attribution**
