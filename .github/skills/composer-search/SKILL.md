---
name: composer-search
description: Search the Composer Studio knowledge base using Azure AI Search. Use this skill when working in the Composer Studio React TypeScript project and the user asks to search for information, look up documentation, find references, or retrieve knowledge about Composer Studio features, components, APIs, or concepts. Trigger on phrases like "search for", "look up", "find information about", "what does the knowledge base say about", or any request to retrieve information from Composer's documentation.
---

# Composer Search

Search the Composer Studio knowledge base using Azure AI Search integration.

## Overview

This skill enables Claude to query the shadow-knowledge-base index via Azure AI Search to retrieve relevant documentation, code examples, and reference material about Composer Studio.

## When to Use

Use this skill when the user requests information that might be in Composer Studio's knowledge base:

- Searching for component documentation
- Looking up API references
- Finding implementation examples
- Retrieving feature explanations
- Understanding Composer Studio concepts

## Prerequisites

The Composer Studio project must have:

1. Azure Search configured with environment variables:
   - `AZURE_SEARCH_API_KEY`
   - `AZURE_SEARCH_ENDPOINT`
2. Required packages installed: `@azure/search-documents`, `dotenv`

## Usage

### Running a Search

Execute the search script from the Composer Studio project root:

```bash
npx tsx scripts/composer_search.tsx "your search query" [max_chunks]
```

Parameters:
- `query` (required): The search query string
- `max_chunks` (optional): Maximum number of result chunks to return (default: 3)

### Workflow

1. **Understand the query**: Identify what information the user is seeking
2. **Formulate search**: Create a concise, focused search query
3. **Execute search**: Run the composer_search.tsx script with the query
4. **Parse results**: Extract relevant information from returned chunks
5. **Respond**: Present the information to the user with proper attribution

### Example

User asks: "How does the Challenger component work?"

```bash
npx tsx scripts/composer_search.tsx "Challenger component"
```

The script returns relevant chunks from the knowledge base. Present findings to the user, citing the source.

## Search Tips

- **Be specific**: "Challenger component API" vs "Challenger"
- **Use key terms**: Focus on technical terms, component names, feature names
- **Iterate if needed**: Try alternative phrasings if initial results are unclear
- **Adjust chunk count**: Use more chunks (5-10) for comprehensive topics

## Output Format

The script returns chunks in this structure:

```typescript
{
  content: string;  // The actual knowledge chunk text
  source: string;   // Knowledge source name(s)
}
```

Present results conversationally while attributing information to the knowledge base source.

## Limitations

- Search is limited to indexed content in shadow-knowledge-base
- Relies on Azure Search relevance ranking
- May require multiple queries for complex topics
- Does not modify or update the knowledge base