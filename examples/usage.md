# Usage Examples: Google Programmable Search Engine Skill

This document provides usage examples and patterns for the Google Programmable Search Engine skill.

## Prerequisites

Before using this skill, ensure you have:

1. A Google API key with Custom Search API enabled
2. A Programmable Search Engine ID (cx)
3. Environment variables set:

```bash
export GOOGLE_API_KEY="your-api-key-here"
export GOOGLE_CX="your-search-engine-id"
```

---

## Basic Search Query

The simplest usage is a basic search query:

**User request:**
> Search for recent developments in quantum computing

**Execution:**
```bash
node scripts/search.js "recent developments quantum computing"
```

**Expected output:**
```
## Search Results for: "recent developments quantum computing"

1. **Quantum Computing Breakthrough in 2026**
   https://example.com/quantum-breakthrough
   Scientists have achieved a new milestone in quantum error correction...

2. **IBM's Latest Quantum Processor**
   https://example.com/ibm-quantum
   IBM announces their newest quantum processor with improved qubit stability...
```

---

## Direct Invocation with /google-search

Users can directly invoke the skill using the slash command:

**User request:**
> /google-search machine learning papers 2026

**Execution:**
```bash
node scripts/search.js "machine learning papers 2026"
```

---

## Limiting Results

To limit the number of results returned, use the `--num` parameter:

**User request:**
> Search for Python tutorials, show me only 5 results

**Execution:**
```bash
node scripts/search.js "Python tutorials" --num=5
```

---

## Handling No Results

When a search returns no results, the script provides a clear message:

**User request:**
> Search for xyznonexistentterm12345

**Execution:**
```bash
node scripts/search.js "xyznonexistentterm12345"
```

**Expected output:**
```
## Search Results for: "xyznonexistentterm12345"

No results found.
```

**Suggested response to user:**
> The search for "xyznonexistentterm12345" returned no results. You might try:
> - Using different keywords
> - Checking for typos
> - Broadening your search terms

---

## Error Scenarios and Recovery

### Missing API Key

**Error output:**
```
Error: GOOGLE_API_KEY environment variable is not set.

To set it:
  export GOOGLE_API_KEY="your-api-key-here"

To obtain an API key:
  1. Go to https://console.cloud.google.com/
  2. Create a project and enable "Custom Search API"
  3. Generate an API key
```

**Recovery:** Guide the user to set the environment variable or obtain an API key.

---

### Missing Search Engine ID (cx)

**Error output:**
```
Error: GOOGLE_CX environment variable is not set.

To set it:
  export GOOGLE_CX="your-search-engine-id"

To obtain a Search Engine ID:
  1. Go to https://programmablesearchengine.google.com/
  2. Create a search engine
  3. Copy the Search Engine ID from the control panel
```

**Recovery:** Guide the user to set up their Programmable Search Engine.

---

### Invalid API Key (401 Error)

**Error output:**
```
Error: Unauthorized: Invalid API key. Please check your GOOGLE_API_KEY environment variable.
```

**Recovery:**
1. Verify the API key is correct (no extra spaces or characters)
2. Ensure the Custom Search API is enabled in Google Cloud Console
3. Check that the API key has no restrictions blocking the Custom Search API

---

### Quota Exceeded (403/429 Error)

**Error output:**
```
Error: Forbidden: API quota exceeded. Free tier allows 100 queries/day.
```

**Recovery:**
1. Wait until the next day for quota reset
2. Consider upgrading to a paid plan for higher limits
3. Implement caching for repeated queries (future enhancement)

---

### Network Errors

**Error output:**
```
Error: Network error. Please check your internet connection.
```

**Recovery:**
1. Verify internet connectivity
2. Check if googleapis.com is accessible
3. Try again after a few moments

---

## Advanced Usage Patterns

### Combining with Other Tools

After searching, you can use the results with other tools:

**User request:**
> Search for React documentation and then open the first result

**Steps:**
1. Execute search: `node scripts/search.js "React documentation"`
2. Extract the first URL from results
3. Use WebFetch or browser to open the URL

---

### Targeted Searches

For more targeted results, be specific in your query:

**General search:**
```bash
node scripts/search.js "JavaScript"
```

**Targeted search:**
```bash
node scripts/search.js "JavaScript async await tutorial for beginners 2026"
```

---

### Technical Documentation Search

When searching for technical documentation, include specific terms:

**User request:**
> Find the official documentation for Node.js fetch API

**Execution:**
```bash
node scripts/search.js "Node.js fetch API official documentation"
```

---

## Tips for Best Results

1. **Be specific:** More specific queries yield more relevant results
2. **Use quotes for exact phrases:** Include important phrases that must appear together
3. **Include year for recent content:** Add the year to find recent information
4. **Limit results for quick scans:** Use `--num=3` or `--num=5` for quick overviews
5. **Check for typos:** Verify query spelling if results seem off

---

## Response Formatting

The skill formats results in a consistent markdown format:

```
## Search Results for: "query"

1. **Result Title**
   https://example.com/page
   Description snippet from the page...

2. **Another Result**
   https://example.com/other
   Another description snippet...
```

Each result includes:
- **Title** (bold): The page title from Google
- **Link**: The full URL to the page
- **Snippet**: A brief description or excerpt from the page
