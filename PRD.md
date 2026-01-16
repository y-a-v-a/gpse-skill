# Product Requirements Document: Google Programmable Search Engine Skill

## Overview

A Claude Code skill that enables web search using Google's Programmable Search Engine (formerly Custom Search Engine/CSE) as an alternative to Claude's standard Web Search functionality.

## Purpose

Provide users with direct access to Google's Custom Search API through Claude Code, offering:
- Alternative search provider option
- Customizable search engine configuration (via cx parameter)
- Field-level response control for efficiency
- Plain JavaScript implementation for simplicity

## Technical Requirements

### API Integration

**Endpoint:** `https://www.googleapis.com/customsearch/v1`

**Required Parameters:**
- `key` - Google API key (user-provided)
- `cx` - Programmable Search Engine ID (user-provided)
- `q` - Search query

**Optional Parameters:**
- `fields` - Comma-separated field selector for partial responses
  - Example: `kind,items(title,link,snippet)`
  - Improves efficiency by limiting response size

**Response Structure:**
```json
{
  "kind": "customsearch#search",
  "items": [
    {
      "title": "Result title",
      "link": "https://example.com",
      "snippet": "Description text..."
    }
  ]
}
```

### Skill Structure

```
gpse-skill/
├── SKILL.md              # Main skill definition
├── examples/
│   └── usage.md          # Usage examples and patterns
├── scripts/
│   └── search.js         # JavaScript search implementation
└── README.md             # Existing overview documentation
```

## Skill Metadata

```yaml
name: google-search
description: Search the web using Google Programmable Search Engine. Use when you need to search for information online with custom search engine configuration.
allowed-tools: Bash
user-invocable: true
```

## Functional Requirements

### FR-1: Configuration Management
- Skill MUST accept API key and Search Engine ID as parameters
- Skill SHOULD provide clear error messages for missing credentials
- Skill SHOULD reference environment variables (GOOGLE_API_KEY, GOOGLE_CX) as option

### FR-2: Search Execution
- Skill MUST construct valid Google Custom Search API requests
- Skill MUST handle HTTP requests using Node.js built-in fetch or external library
- Skill MUST parse JSON responses and extract relevant fields

### FR-3: Response Formatting
- Skill MUST present search results in readable markdown format
- Skill MUST include: title, link, and snippet for each result
- Skill SHOULD limit default results to 10 items for readability

### FR-4: Error Handling
- Skill MUST handle API errors gracefully (400, 401, 403, 429, 500)
- Skill MUST provide actionable error messages:
  - Invalid API key
  - Quota exceeded
  - Invalid search engine ID
  - Network errors

### FR-5: Field Selection Optimization
- Skill SHOULD use `fields` parameter by default to reduce response size
- Default fields: `kind,items(title,link,snippet)`

## User Experience

### Usage Pattern 1: Direct Invocation
```
User: /google-search "machine learning papers 2026"
Claude: [Executes skill, displays formatted results]
```

### Usage Pattern 2: Auto-Discovery
```
User: Search for recent developments in quantum computing
Claude: [Recognizes search intent, suggests google-search skill if configured]
```

## Implementation Plan

### Phase 1: Core Implementation
1. Create `SKILL.md` with metadata and basic instructions
2. Implement `scripts/search.js` with:
   - URL construction
   - HTTP request execution
   - JSON parsing
   - Error handling
3. Add response formatting logic

### Phase 2: Documentation
1. Create `examples/usage.md` with common patterns
2. Document setup requirements (API key, cx)
3. Add troubleshooting guide

### Phase 3: Enhancement
1. Add caching for repeated queries (optional)
2. Add pagination support for additional results
3. Add advanced search parameters (dateRestrict, siteSearch, etc.)

## Configuration Example

**Environment Variables (.env or shell):**
```bash
export GOOGLE_API_KEY="your-api-key-here"
export GOOGLE_CX="your-search-engine-id"
```

**Direct Parameter (in SKILL.md instructions):**
```javascript
// Alternatively, pass directly to search function
search({
  apiKey: "your-api-key",
  cx: "017576662512468239146:omuauf_lfve",
  query: "search terms"
})
```

## Success Criteria

1. Skill successfully executes Google Custom Search API requests
2. Results are formatted clearly and include title, link, snippet
3. Errors are handled gracefully with actionable messages
4. Skill is discoverable by Claude when users request web searches
5. Implementation uses plain JavaScript as specified
6. Zero external dependencies beyond Node.js standard library (or minimal deps)

## Non-Goals

- Building a custom search indexing system
- Replacing Claude's built-in Web Search entirely
- Supporting non-Google search providers
- Advanced search result filtering or ranking
- GUI or web interface

## Dependencies

- Node.js runtime (available in Claude Code environment)
- Google Programmable Search Engine account and API key
- Network access to googleapis.com

## Security Considerations

- API keys MUST NOT be hardcoded in skill files
- Recommend environment variables or secure parameter passing
- Warn users about API quota limits
- Sanitize user input in search queries to prevent injection

## Performance Considerations

- Use `fields` parameter to minimize response payload
- Consider rate limiting to respect API quotas
- Cache results for identical queries (future enhancement)
- Default to 10 results unless user specifies more

## Open Questions

1. Should we support multiple search engine IDs for different search contexts?
2. Should we implement local caching of recent searches?
3. Should we expose all Custom Search API parameters or keep it simple?
4. Should error messages include links to Google API documentation?

## References

- [Google Custom Search JSON API](https://developers.google.com/custom-search/v1/using_rest)
- [API Performance Optimization](https://developers.google.com/custom-search/v1/performance)
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)
