# Google Programmable Search Engine Skill

A Claude Code skill that enables web search using Google's Programmable Search Engine (formerly Custom Search Engine/CSE).

## Features

- Search the web using Google Custom Search API
- Customizable search engine configuration
- Formatted markdown output with title, link, and snippet
- Built-in error handling and helpful error messages
- Plain JavaScript implementation with zero external dependencies

## Prerequisites

- [Claude Code](https://claude.ai/code) CLI installed
- Node.js (v18 or later, for native fetch support)
- Google Cloud account with Custom Search API enabled
- A Programmable Search Engine ID (cx)

## Installation

### 1. Clone or Download This Repository

```bash
git clone https://github.com/your-username/gpse-skill.git
```

### 2. Add the Skill to Claude Code

Copy this skill directory to your Claude Code skills folder:

**Option A: Global skills (available in all projects)**
```bash
# Create the global skills directory if it doesn't exist
mkdir -p ~/.claude/skills

# Copy the skill
cp -r gpse-skill ~/.claude/skills/
```

**Option B: Project-local skills (available only in current project)**
```bash
# Create the project skills directory if it doesn't exist
mkdir -p .claude/skills

# Copy the skill
cp -r gpse-skill .claude/skills/
```

### 3. Configure API Credentials

Set the required environment variables:

```bash
export GOOGLE_API_KEY="your-api-key-here"
export GOOGLE_CX="your-search-engine-id"
```

To make these persistent, add them to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
echo 'export GOOGLE_API_KEY="your-api-key-here"' >> ~/.bashrc
echo 'export GOOGLE_CX="your-search-engine-id"' >> ~/.bashrc
source ~/.bashrc
```

For detailed instructions on obtaining credentials, see [SETUP.md](SETUP.md).

## Usage

### Direct Invocation

Use the `/google-search` slash command:

```
/google-search machine learning papers 2026
```

### Natural Language

Simply ask Claude to search:

```
Search for recent developments in quantum computing
```

### Example Output

```markdown
## Search Results for: "quantum computing"

1. **Introduction to Quantum Computing**
   https://example.com/quantum-intro
   A comprehensive guide to quantum computing fundamentals...

2. **Latest Quantum Computing Research**
   https://example.com/quantum-research
   Recent breakthroughs in quantum computing technology...
```

## Configuration

| Environment Variable | Required | Description |
|---------------------|----------|-------------|
| `GOOGLE_API_KEY` | Yes | Google API key with Custom Search API enabled |
| `GOOGLE_CX` | Yes | Programmable Search Engine ID |

## Documentation

- [SETUP.md](SETUP.md) - Detailed setup instructions for obtaining credentials
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues and solutions
- [examples/usage.md](examples/usage.md) - Usage examples and patterns

## Quotas and Limits

The Google Custom Search API free tier allows:
- 100 queries per day
- 10 results per query (maximum)

For higher limits, see [Google Custom Search pricing](https://developers.google.com/custom-search/v1/overview#pricing).

---

## API Reference

### Basic REST API Request Example

Source: https://developers.google.com/custom-search/v1/using_rest

An example of a GET request to the Custom Search JSON API. This demonstrates the required parameters: API key, Programmable Search Engine ID (cx), and the search query (q).

```http
GET https://www.googleapis.com/customsearch/v1?key=INSERT_YOUR_API_KEY&cx=017576662512468239146:omuauf_lfve&q=lectures
```

### GET /customsearch/v1

Source: https://developers.google.com/custom-search/v1/performance

This example demonstrates how to use the `fields` parameter to retrieve specific fields from the Custom Search API response.

```APIDOC
## GET /customsearch/v1

### Description
This endpoint allows you to search for content using the Google Custom Search engine. The `fields` query parameter can be used to limit the response to a subset of fields, improving efficiency.

### Method
GET

### Endpoint
/customsearch/v1

### Parameters
#### Query Parameters
- **fields** (string) - Required - Specifies a subset of fields to return in the response. Fields are comma-separated and can include nested fields using '/' and wildcards using '*'. Sub-selections can be made using `( )`.
- **q** (string) - Required - The query string to search for.

### Request Example
```json
{
  "example": "https://www.googleapis.com/customsearch/v1?q=google&fields=kind,items(title,link)"
}
```

### Response
#### Success Response (200)
- **kind** (string) - The type of the resource. This is always customsearch#search.
- **items** (array) - The search results.
  - **title** (string) - The title of the search result.
  - **link** (string) - The URL of the search result.

#### Response Example
```json
{
  "kind": "customsearch#search",
  "items": [
    {
      "title": "Google",
      "link": "https://www.google.com/"
    },
    {
      "title": "Google",
      "link": "https://www.google.com/search?q=google"
    }
  ]
}
```

#### Error Response (400)
- **error** (object) - Contains error details.
  - **code** (integer) - The error code.
  - **message** (string) - A description of the error. Example: "Invalid field selection specified."

```
