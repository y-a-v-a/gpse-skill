Google Programmable Search Engine Skill

This directory contains a skill for AI tools that uses Google Programmable Search Engine, formerly known as CSE or Custom Search Engine, which can be used as an alternative to the standard Web Search features of your AI tool.

The skill is written in plain JavaScript.


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
