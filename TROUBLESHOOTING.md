# Troubleshooting Guide: Google Programmable Search Engine Skill

This guide helps you diagnose and resolve common issues with the Google Programmable Search Engine skill.

---

## Table of Contents

1. [Skill Not Triggering](#skill-not-triggering)
2. [API Authentication Errors](#api-authentication-errors)
3. [Quota Exceeded Errors](#quota-exceeded-errors)
4. [No Results Returned](#no-results-returned)
5. [Invalid cx Parameter](#invalid-cx-parameter)
6. [Network and Connection Issues](#network-and-connection-issues)
7. [Quick Diagnostic Checklist](#quick-diagnostic-checklist)
8. [Getting Help](#getting-help)

---

## Skill Not Triggering

### Symptoms
- The `/google-search` command is not recognized
- Claude doesn't suggest using the skill when you ask for web searches
- The skill appears inactive or unavailable

### Causes and Solutions

#### 1. Skill Not Installed in Project
**Check:** Verify the skill files are in the correct location.

```bash
# The following files should exist in your project:
ls -la SKILL.md scripts/search.js
```

**Fix:** Ensure SKILL.md is at the root of your project and scripts/search.js exists.

#### 2. SKILL.md Syntax Error
**Check:** Validate the YAML frontmatter in SKILL.md.

```bash
# Check the first few lines of SKILL.md
head -10 SKILL.md
```

The file should start with valid YAML frontmatter:
```yaml
---
name: google-search
description: Search the web using Google Programmable Search Engine...
allowed-tools:
  - Bash
user-invocable: true
---
```

**Fix:** Ensure there are no syntax errors in the YAML frontmatter. Common issues:
- Missing `---` delimiters
- Incorrect indentation
- Invalid characters

#### 3. Claude Code Skill Discovery
**Check:** Skills are discovered when Claude Code starts a session.

**Fix:**
- Restart Claude Code to trigger skill discovery
- Ensure you're in the correct project directory
- Verify the project is recognized by Claude Code

#### 4. Search Query Format
**Check:** Ensure you're invoking the skill correctly.

**Correct usage:**
```
/google-search machine learning papers
```

**Incorrect usage:**
```
/googlesearch machine learning papers  # Wrong name
google-search machine learning papers  # Missing slash
/google-search                         # No query provided
```

---

## API Authentication Errors

### HTTP 401 Unauthorized

**Error Message:**
```
Error: Unauthorized: Invalid API key. Please check your GOOGLE_API_KEY environment variable.
```

#### Causes and Solutions

1. **API Key Not Set**

   Check if the environment variable is set:
   ```bash
   echo $GOOGLE_API_KEY
   ```

   If empty, set it:
   ```bash
   export GOOGLE_API_KEY="your-api-key-here"
   ```

2. **API Key Incorrect**

   - Copy the key again from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Ensure no extra spaces or characters
   - Verify you're using the correct project's key

3. **Custom Search API Not Enabled**

   - Go to [Google Cloud Console > APIs & Services > Library](https://console.cloud.google.com/apis/library)
   - Search for "Custom Search API"
   - Click **Enable** if not already enabled

4. **API Key Restrictions**

   If you restricted your API key:
   - Go to [Credentials](https://console.cloud.google.com/apis/credentials)
   - Click on your API key
   - Under "API restrictions", ensure "Custom Search API" is allowed

### HTTP 403 Forbidden

**Error Message:**
```
Error: Forbidden: Access denied. The API key may lack permission or the cx is invalid.
```

#### Causes and Solutions

1. **Wrong Google Cloud Project**

   - Ensure you're using an API key from a project where Custom Search API is enabled
   - Verify the project ID matches where you enabled the API

2. **API Key Restricted to Wrong APIs**

   - Check API key restrictions in Google Cloud Console
   - Add "Custom Search API" to allowed APIs

3. **Account or Project Issues**

   - Verify your Google Cloud account is in good standing
   - Check for any billing or account restrictions

---

## Quota Exceeded Errors

### HTTP 403 with Quota Message or HTTP 429

**Error Messages:**
```
Error: Forbidden: API quota exceeded. Free tier allows 100 queries/day.
Error: Too Many Requests: Rate limit exceeded. Please wait and try again.
```

#### Understanding Quotas

| Tier | Daily Limit | Cost |
|------|-------------|------|
| Free | 100 queries | $0 |
| Paid | 10,000 queries | $5 per 1,000 queries |

Quota resets at midnight Pacific Time (PT).

#### Solutions

1. **Wait for Quota Reset**

   If you've hit the daily limit, wait until midnight PT for the quota to reset.

2. **Check Current Usage**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to **APIs & Services** > **Dashboard**
   - Click on **Custom Search API**
   - View the **Metrics** tab

3. **Upgrade to Paid Tier**

   For higher limits:
   - Enable billing on your Google Cloud project
   - The API will automatically allow more requests (billed at $5/1,000 queries)

4. **Reduce Query Frequency**

   - Avoid running identical searches repeatedly
   - Use more specific queries to find what you need faster
   - Consider caching results locally for repeated lookups

5. **Use Multiple Search Engines**

   Create multiple Programmable Search Engines with different cx IDs to distribute load (each shares the same quota per API key, but this helps organize searches).

---

## No Results Returned

### Symptoms

**Output:**
```
## Search Results for: "your query"

No results found.
```

#### Causes and Solutions

1. **Query Too Specific or Unusual**

   - Try broader search terms
   - Remove special characters or very specific phrases
   - Use common synonyms

   **Example:**
   ```bash
   # Too specific - might return no results
   node scripts/search.js "xyznonexistent12345"

   # Better - use common terms
   node scripts/search.js "programming tutorials"
   ```

2. **Typos in Search Query**

   - Double-check spelling
   - Google Custom Search doesn't auto-correct like google.com

3. **Search Engine Configuration**

   If your Programmable Search Engine is configured to search specific sites:
   - The query must match content on those sites
   - Consider switching to "Search the entire web" mode

   To check:
   - Go to [Programmable Search Engine control panel](https://programmablesearchengine.google.com/controlpanel/all)
   - Select your search engine
   - Check the "Sites to search" setting

4. **Regional or Language Restrictions**

   - Your search engine may have geographic or language filters
   - Check settings in the Programmable Search Engine control panel

5. **Content Not Indexed**

   - Very new content may not yet be indexed by Google
   - Some content is intentionally not indexed (robots.txt exclusions)

---

## Invalid cx Parameter

### Symptoms

**Error Messages:**
```
Error: GOOGLE_CX environment variable is not set.
Error: Forbidden: Access denied. The API key may lack permission or the cx is invalid.
```

Or unexpected results/empty responses.

#### Causes and Solutions

1. **cx Not Set**

   Check if the environment variable is set:
   ```bash
   echo $GOOGLE_CX
   ```

   If empty, set it:
   ```bash
   export GOOGLE_CX="your-search-engine-id"
   ```

2. **Wrong Format**

   A valid cx looks like: `017576662512468239146:omuauf_lfve`

   Common mistakes:
   - Using the search engine name instead of the ID
   - Including extra characters or spaces
   - Copying an incomplete ID

3. **Search Engine Deleted**

   - Go to [Programmable Search Engine control panel](https://programmablesearchengine.google.com/controlpanel/all)
   - Verify your search engine exists
   - If deleted, create a new one and update GOOGLE_CX

4. **Search Engine Disabled**

   - Check if the search engine is active in the control panel
   - Re-enable if necessary

5. **Finding Your cx**

   To get the correct cx:
   1. Go to https://programmablesearchengine.google.com/controlpanel/all
   2. Click on your search engine
   3. Look for "Search engine ID" in the Basic section
   4. Copy the full ID string

---

## Network and Connection Issues

### Symptoms

**Error Messages:**
```
Error: Network error. Please check your internet connection.
Error: Request timed out. Please try again.
Error: getaddrinfo ENOTFOUND www.googleapis.com
```

#### Causes and Solutions

1. **No Internet Connection**

   ```bash
   # Test connectivity
   ping -c 3 google.com
   ```

   Fix: Restore internet connection.

2. **googleapis.com Blocked**

   Some networks (corporate, educational) block Google APIs.

   ```bash
   # Test API endpoint
   curl -I https://www.googleapis.com
   ```

   Fix: Use a different network, VPN, or contact your network administrator.

3. **DNS Issues**

   ```bash
   # Test DNS resolution
   nslookup www.googleapis.com
   ```

   Fix: Try different DNS servers (8.8.8.8 or 1.1.1.1).

4. **Firewall Blocking Outbound HTTPS**

   - Ensure port 443 (HTTPS) is not blocked
   - Check firewall rules

5. **Proxy Configuration**

   If you're behind a proxy:
   ```bash
   export HTTPS_PROXY="http://proxy.example.com:8080"
   ```

6. **Timeout Issues**

   For slow connections:
   - Try again during off-peak hours
   - Check for network congestion

---

## Quick Diagnostic Checklist

Run through this checklist to quickly identify issues:

```bash
# 1. Check environment variables are set
echo "API Key: ${GOOGLE_API_KEY:0:10}..." # Shows first 10 chars
echo "CX: $GOOGLE_CX"

# 2. Verify script exists
ls -la scripts/search.js

# 3. Test Node.js is available
node --version

# 4. Run a test search
node scripts/search.js "test"

# 5. Test network connectivity
curl -s -o /dev/null -w "%{http_code}" "https://www.googleapis.com" && echo " - googleapis.com reachable"
```

### Expected Results

| Check | Expected |
|-------|----------|
| API Key | Shows partial key (not empty) |
| CX | Shows search engine ID (not empty) |
| Script | File exists |
| Node.js | Version number (18.x or higher recommended) |
| Test search | Search results or meaningful error |
| Network | "200 - googleapis.com reachable" |

---

## Getting Help

### Google API Documentation

- [Custom Search API Overview](https://developers.google.com/custom-search/v1/overview)
- [Custom Search API Reference](https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list)
- [API Performance Tips](https://developers.google.com/custom-search/v1/performance)
- [Error Responses](https://developers.google.com/custom-search/v1/reference/rest/v1/errors)

### Programmable Search Engine Help

- [Programmable Search Engine Help Center](https://support.google.com/programmable-search/)
- [Creating a Search Engine](https://support.google.com/programmable-search/answer/2649143)
- [Search Engine Settings](https://support.google.com/programmable-search/answer/4513886)

### Google Cloud Console

- [API Credentials](https://console.cloud.google.com/apis/credentials)
- [API Dashboard & Metrics](https://console.cloud.google.com/apis/dashboard)
- [Billing & Quotas](https://console.cloud.google.com/billing)

### Common Quick Fixes

1. **Restart your terminal** - Ensures environment variables are loaded
2. **Re-source your shell config** - `source ~/.bashrc` or `source ~/.zshrc`
3. **Verify copy/paste** - Re-copy credentials without extra whitespace
4. **Check project selection** - Ensure correct Google Cloud project is selected
5. **Wait and retry** - Some issues are transient

---

## Error Message Quick Reference

| Error | Likely Cause | First Step |
|-------|--------------|------------|
| `GOOGLE_API_KEY not set` | Missing env var | `export GOOGLE_API_KEY="..."` |
| `GOOGLE_CX not set` | Missing env var | `export GOOGLE_CX="..."` |
| `401 Unauthorized` | Invalid API key | Verify key in Cloud Console |
| `403 Forbidden` | Permission denied | Check API enabled, key restrictions |
| `403 quota exceeded` | Daily limit reached | Wait for reset or enable billing |
| `429 Too Many Requests` | Rate limited | Wait and retry |
| `No results found` | Query issue | Try different search terms |
| `Network error` | Connectivity | Check internet connection |
| `Request timed out` | Slow network | Retry later |
