# Setup Guide: Google Programmable Search Engine Skill

This guide walks you through setting up the Google Programmable Search Engine skill for Claude Code.

## Overview

To use this skill, you need:
1. A Google API key with the Custom Search API enabled
2. A Programmable Search Engine ID (cx)
3. Environment variables configured

---

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click the project dropdown at the top of the page
4. Click **New Project**
5. Enter a project name (e.g., "Claude Search Skill")
6. Click **Create**
7. Wait for the project to be created, then select it from the project dropdown

---

## Step 2: Enable the Custom Search API

1. In the Google Cloud Console, go to **APIs & Services** > **Library**
   - Or navigate directly to: https://console.cloud.google.com/apis/library
2. Search for "Custom Search API"
3. Click on **Custom Search API** in the results
4. Click the **Enable** button
5. Wait for the API to be enabled

---

## Step 3: Create an API Key

1. Go to **APIs & Services** > **Credentials**
   - Or navigate directly to: https://console.cloud.google.com/apis/credentials
2. Click **+ CREATE CREDENTIALS** at the top
3. Select **API key**
4. Your new API key will be displayed - **copy it immediately**
5. (Recommended) Click **Edit API key** to add restrictions:
   - Under "API restrictions", select **Restrict key**
   - Check only **Custom Search API**
   - Click **Save**

**Important:** Keep your API key secure. Do not commit it to version control or share it publicly.

---

## Step 4: Create a Programmable Search Engine

1. Go to [Programmable Search Engine](https://programmablesearchengine.google.com/)
2. Click **Get started** or **Add** (if you already have engines)
3. Configure your search engine:

### Option A: Search the Entire Web
- Under "What to search", select **Search the entire web**
- Enter a name for your search engine (e.g., "Web Search")
- Click **Create**

### Option B: Search Specific Sites
- Under "What to search", select **Search specific sites or pages**
- Enter the sites you want to search (e.g., `stackoverflow.com`, `github.com`)
- Enter a name for your search engine
- Click **Create**

---

## Step 5: Get Your Search Engine ID (cx)

1. After creating your search engine, you'll see a confirmation page
2. Click **Customize** or go to the control panel
3. In the **Overview** section, find **Search engine ID**
4. Copy the ID (it looks like: `017576662512468239146:omuauf_lfve`)

Alternatively:
1. Go to https://programmablesearchengine.google.com/controlpanel/all
2. Click on your search engine
3. Copy the **Search engine ID** from the Basic section

---

## Step 6: Configure Environment Variables

Set the environment variables in your shell:

### Temporary (current session only)

```bash
export GOOGLE_API_KEY="your-api-key-here"
export GOOGLE_CX="your-search-engine-id-here"
```

### Permanent (recommended)

Add to your shell configuration file:

**For Bash (~/.bashrc or ~/.bash_profile):**
```bash
echo 'export GOOGLE_API_KEY="your-api-key-here"' >> ~/.bashrc
echo 'export GOOGLE_CX="your-search-engine-id-here"' >> ~/.bashrc
source ~/.bashrc
```

**For Zsh (~/.zshrc):**
```bash
echo 'export GOOGLE_API_KEY="your-api-key-here"' >> ~/.zshrc
echo 'export GOOGLE_CX="your-search-engine-id-here"' >> ~/.zshrc
source ~/.zshrc
```

**For Fish (~/.config/fish/config.fish):**
```fish
set -Ux GOOGLE_API_KEY "your-api-key-here"
set -Ux GOOGLE_CX "your-search-engine-id-here"
```

---

## Alternative Configuration Methods

### Method 1: Using a .env File

Create a `.env` file in your project directory:

```bash
GOOGLE_API_KEY=your-api-key-here
GOOGLE_CX=your-search-engine-id-here
```

**Note:** Add `.env` to your `.gitignore` to prevent committing credentials.

### Method 2: Using direnv

If you use [direnv](https://direnv.net/), create a `.envrc` file:

```bash
export GOOGLE_API_KEY="your-api-key-here"
export GOOGLE_CX="your-search-engine-id-here"
```

Then run:
```bash
direnv allow
```

### Method 3: Per-Command Environment

Pass variables directly when running the script:

```bash
GOOGLE_API_KEY="your-key" GOOGLE_CX="your-cx" node scripts/search.js "query"
```

---

## Verify Your Setup

Test that everything is configured correctly:

```bash
# Check environment variables are set
echo $GOOGLE_API_KEY
echo $GOOGLE_CX

# Run a test search
node scripts/search.js "test query"
```

If successful, you should see formatted search results.

---

## Quotas and Limits

### Free Tier
- **100 queries per day** (resets at midnight Pacific Time)
- No payment method required

### Paid Tier
- $5 per 1,000 queries (beyond free tier)
- Up to 10,000 queries per day
- Requires billing enabled on your Google Cloud project

To check your usage:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Dashboard**
3. Click on **Custom Search API**
4. View the **Metrics** tab

---

## Troubleshooting Setup Issues

### "API key not valid" Error
- Verify the API key is copied correctly (no extra spaces)
- Ensure the Custom Search API is enabled for your project
- Check that the API key is not restricted to other APIs

### "Invalid cx" Error
- Verify the Search Engine ID is copied correctly
- Ensure the search engine is active (not deleted)
- Check that the search engine is configured to search the web or specific sites

### "Quota exceeded" Error
- You've used 100 queries today
- Wait until midnight PT for quota reset
- Or enable billing for additional queries

### Environment Variables Not Found
- Ensure you've sourced your shell config: `source ~/.bashrc` (or equivalent)
- Start a new terminal session
- Verify with: `echo $GOOGLE_API_KEY`

---

## Security Best Practices

1. **Never commit API keys** - Add `.env` to `.gitignore`
2. **Restrict your API key** - Limit it to only the Custom Search API
3. **Monitor usage** - Check the Google Cloud Console for unexpected activity
4. **Rotate keys periodically** - Delete old keys and create new ones if compromised
5. **Use environment variables** - Never hardcode keys in scripts

---

## Next Steps

Once setup is complete:
1. Try a test search: `node scripts/search.js "hello world"`
2. Review [usage examples](examples/usage.md) for common patterns
3. Use the `/google-search` command in Claude Code

For more information:
- [Google Custom Search API Documentation](https://developers.google.com/custom-search/v1/overview)
- [Programmable Search Engine Help](https://support.google.com/programmable-search/)
