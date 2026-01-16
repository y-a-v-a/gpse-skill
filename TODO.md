# TODO: Google Programmable Search Engine Skill

## Phase 1: Core Implementation

### SKILL.md
- [x] Create SKILL.md file with YAML frontmatter
- [x] Add skill metadata (name, description, allowed-tools, user-invocable)
- [x] Write basic instructions for Claude
- [x] Add setup instructions (API key and cx configuration)
- [x] Document required environment variables (GOOGLE_API_KEY, GOOGLE_CX)
- [x] Add reference to scripts/search.js execution
- [x] Include basic usage examples

### scripts/search.js
- [ ] Create scripts/ directory
- [ ] Initialize search.js with proper Node.js structure
- [ ] Implement URL construction for Google Custom Search API
- [ ] Add API key and cx parameter handling
- [ ] Implement query parameter encoding
- [ ] Add fields parameter for response optimization
- [ ] Implement HTTP request execution (fetch or https module)
- [ ] Add JSON response parsing
- [ ] Implement error handling for API errors (400, 401, 403, 429, 500)
- [ ] Add error messages for missing credentials
- [ ] Add error messages for quota exceeded
- [ ] Add error messages for network errors
- [ ] Implement response formatting to markdown
- [ ] Format results with title, link, and snippet
- [ ] Limit default results to 10 items
- [ ] Add input sanitization for search queries

### Testing
- [ ] Test with valid API key and cx
- [ ] Test with missing credentials
- [ ] Test with invalid API key
- [ ] Test with quota exceeded scenario
- [ ] Test response formatting
- [ ] Test error handling paths

## Phase 2: Documentation

### examples/usage.md
- [ ] Create examples/ directory
- [ ] Create usage.md file
- [ ] Add example: Basic search query
- [ ] Add example: Direct invocation with /google-search
- [ ] Add example: Search with specific fields
- [ ] Add example: Handling no results
- [ ] Add example: Error scenarios and recovery

### Setup Documentation
- [ ] Document how to obtain Google API key
- [ ] Document how to create Programmable Search Engine
- [ ] Document how to get cx (Search Engine ID)
- [ ] Add environment variable setup instructions
- [ ] Add alternative configuration methods

### Troubleshooting Guide
- [ ] Add section for "Skill not triggering"
- [ ] Add section for "API authentication errors"
- [ ] Add section for "Quota exceeded errors"
- [ ] Add section for "No results returned"
- [ ] Add section for "Invalid cx parameter"
- [ ] Add links to Google API documentation

## Phase 3: Enhancement (Optional)

### Caching
- [ ] Design caching strategy for repeated queries
- [ ] Implement cache storage (in-memory or file-based)
- [ ] Add cache expiration logic
- [ ] Add cache key generation based on query
- [ ] Test cache hit/miss scenarios

### Pagination
- [ ] Add support for startIndex parameter
- [ ] Implement "next page" functionality
- [ ] Add user instructions for requesting more results
- [ ] Test pagination with multiple pages

### Advanced Parameters
- [ ] Add dateRestrict parameter support
- [ ] Add siteSearch parameter support
- [ ] Add exactTerms parameter support
- [ ] Add excludeTerms parameter support
- [ ] Document advanced parameters in SKILL.md
- [ ] Add examples for advanced usage

## General Tasks

- [ ] Update README.md with skill installation instructions
- [ ] Add LICENSE file if needed
- [ ] Test skill integration with Claude Code
- [ ] Verify skill discovery and auto-activation
- [ ] Test user-invocable slash command
- [ ] Get user feedback and iterate
