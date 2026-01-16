---
name: google-search
description: Search the web using Google Programmable Search Engine. Use when you need to search for information online with custom search engine configuration.
allowed-tools:
  - Bash
user-invocable: true
---

# Google Programmable Search Engine Skill

This skill enables web search using Google's Programmable Search Engine (formerly Custom Search Engine/CSE).

## Setup Requirements

Before using this skill, ensure the following environment variables are set:

- `GOOGLE_API_KEY` - Your Google API key with Custom Search API enabled
- `GOOGLE_CX` - Your Programmable Search Engine ID

### How to Obtain Credentials

See [SETUP.md](SETUP.md) for detailed step-by-step instructions on:
- Creating a Google Cloud project and enabling the Custom Search API
- Generating an API key
- Creating a Programmable Search Engine and obtaining the cx ID
- Configuring environment variables

**Quick summary:**
1. **API Key**: Go to [Google Cloud Console](https://console.cloud.google.com/), create a project, enable the "Custom Search API", and generate an API key.
2. **Search Engine ID (cx)**: Go to [Programmable Search Engine](https://programmablesearchengine.google.com/), create a search engine, and copy the Search Engine ID from the control panel.

### Setting Environment Variables

```bash
export GOOGLE_API_KEY="your-api-key-here"
export GOOGLE_CX="your-search-engine-id"
```

## Usage

When the user asks you to search the web or look up information online, execute the search script:

```bash
node scripts/search.js "search query here"
```

The script will:
1. Read credentials from environment variables
2. Send a request to Google Custom Search API
3. Return formatted results with title, link, and snippet

## Response Format

The search returns results formatted as markdown:

```
## Search Results for: "query"

1. **Result Title**
   https://example.com/page
   Description snippet from the page...

2. **Another Result**
   https://example.com/other
   Another description...
```

## Error Handling

If you encounter errors:

- **Missing credentials**: Remind the user to set GOOGLE_API_KEY and GOOGLE_CX environment variables
- **401 Unauthorized**: The API key is invalid or not authorized for Custom Search API
- **403 Forbidden**: The API key lacks permission or the cx is invalid
- **429 Too Many Requests**: Daily quota exceeded (free tier: 100 queries/day)
- **Network errors**: Check internet connectivity

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed diagnostic steps and solutions.

## Parameters

The script accepts additional optional parameters:

### Basic Parameters
- `--num=N` - Number of results (default: 10, max: 10 per request)
- `--start=N` - Starting index for results, enables pagination (default: 1, max: 91)

### Advanced Search Filters
- `--date=PERIOD` - Restrict results by date. Format: `d[N]` (days), `w[N]` (weeks), `m[N]` (months), `y[N]` (years)
  - Examples: `d1` (last day), `w1` (last week), `m3` (last 3 months), `y1` (last year)
- `--site=DOMAIN` - Restrict results to a specific domain
  - Example: `github.com`, `stackoverflow.com`
- `--exact=PHRASE` - Require this exact phrase to appear in results
- `--exclude=TERMS` - Exclude results containing these terms

Example with basic parameters:
```bash
node scripts/search.js "machine learning papers" --num=5
```

Example with advanced filters:
```bash
# Search within the last week
node scripts/search.js "JavaScript tutorials" --date=w1

# Search only GitHub
node scripts/search.js "react hooks" --site=github.com

# Require exact phrase
node scripts/search.js "programming" --exact=best practices

# Exclude certain terms
node scripts/search.js "Python tutorial" --exclude=beginner

# Combine multiple filters
node scripts/search.js "machine learning" --date=m3 --site=arxiv.org --num=5
```

### Pagination

To retrieve additional results beyond the first page, use the `--start` parameter:

```bash
# First page (results 1-10)
node scripts/search.js "quantum computing"

# Second page (results 11-20)
node scripts/search.js "quantum computing" --start=11

# Third page (results 21-30)
node scripts/search.js "quantum computing" --start=21
```

**Note:** Google Custom Search API allows a maximum of 100 results per query (start index up to 91 with 10 results).

## Examples

### Basic Search
User: "Search for recent developments in quantum computing"
```bash
node scripts/search.js "recent developments quantum computing 2026"
```

### Direct Invocation
User: "/google-search machine learning papers"
```bash
node scripts/search.js "machine learning papers"
```

### Search Recent Content
User: "Find news about AI from the last week"
```bash
node scripts/search.js "AI news" --date=w1
```

### Site-Specific Search
User: "Search for Python tutorials on Stack Overflow"
```bash
node scripts/search.js "Python tutorial" --site=stackoverflow.com
```

### Exclude Unwanted Results
User: "Find JavaScript frameworks but not React"
```bash
node scripts/search.js "JavaScript framework" --exclude=React
```

### Combined Filters
User: "Find recent machine learning papers on arxiv"
```bash
node scripts/search.js "machine learning" --date=m1 --site=arxiv.org --num=5
```
