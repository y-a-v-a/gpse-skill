#!/usr/bin/env node

/**
 * Unit tests for Google Programmable Search Engine Script
 *
 * Run with: node --test tests/search.test.js
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');

const {
  sanitizeInput,
  parseArgs,
  buildApiUrl,
  getErrorMessage,
  formatResults,
  API_ENDPOINT,
  DEFAULT_FIELDS,
  DEFAULT_NUM_RESULTS
} = require('../scripts/search.js');

describe('sanitizeInput', () => {
  it('should return empty string for non-string input', () => {
    assert.strictEqual(sanitizeInput(null), '');
    assert.strictEqual(sanitizeInput(undefined), '');
    assert.strictEqual(sanitizeInput(123), '');
    assert.strictEqual(sanitizeInput({}), '');
  });

  it('should trim whitespace from strings', () => {
    assert.strictEqual(sanitizeInput('  hello  '), 'hello');
    assert.strictEqual(sanitizeInput('\thello\n'), 'hello');
  });

  it('should remove control characters', () => {
    assert.strictEqual(sanitizeInput('hello\x00world'), 'helloworld');
    assert.strictEqual(sanitizeInput('\x01\x02\x03test'), 'test');
  });

  it('should preserve normal characters', () => {
    assert.strictEqual(sanitizeInput('Hello World!'), 'Hello World!');
    assert.strictEqual(sanitizeInput('search query 2024'), 'search query 2024');
  });

  it('should preserve unicode characters', () => {
    assert.strictEqual(sanitizeInput('日本語 test'), '日本語 test');
    assert.strictEqual(sanitizeInput('café résumé'), 'café résumé');
  });
});

describe('parseArgs', () => {
  it('should parse query from positional argument', () => {
    const result = parseArgs(['machine learning']);
    assert.strictEqual(result.query, 'machine learning');
    assert.strictEqual(result.num, DEFAULT_NUM_RESULTS);
  });

  it('should parse --num flag', () => {
    const result = parseArgs(['test query', '--num=5']);
    assert.strictEqual(result.query, 'test query');
    assert.strictEqual(result.num, 5);
  });

  it('should handle --num flag before query', () => {
    const result = parseArgs(['--num=3', 'my query']);
    assert.strictEqual(result.query, 'my query');
    assert.strictEqual(result.num, 3);
  });

  it('should limit num to valid range (1-10)', () => {
    assert.strictEqual(parseArgs(['test', '--num=0']).num, DEFAULT_NUM_RESULTS);
    assert.strictEqual(parseArgs(['test', '--num=11']).num, DEFAULT_NUM_RESULTS);
    assert.strictEqual(parseArgs(['test', '--num=-1']).num, DEFAULT_NUM_RESULTS);
    assert.strictEqual(parseArgs(['test', '--num=abc']).num, DEFAULT_NUM_RESULTS);
  });

  it('should return empty query when no positional args', () => {
    const result = parseArgs(['--num=5']);
    assert.strictEqual(result.query, '');
  });

  it('should sanitize query input', () => {
    const result = parseArgs(['  test\x00query  ']);
    assert.strictEqual(result.query, 'testquery');
  });
});

describe('buildApiUrl', () => {
  it('should build correct API URL with all parameters', () => {
    const url = buildApiUrl('test query', 'API_KEY', 'CX_ID', 10);

    assert.ok(url.startsWith(API_ENDPOINT));
    assert.ok(url.includes('key=API_KEY'));
    assert.ok(url.includes('cx=CX_ID'));
    assert.ok(url.includes('q=test+query') || url.includes('q=test%20query'));
    assert.ok(url.includes('num=10'));
    // URLSearchParams encodes parentheses and commas in the fields value
    assert.ok(url.includes('fields='));
    const params = new URLSearchParams(url.split('?')[1]);
    assert.strictEqual(params.get('fields'), DEFAULT_FIELDS);
  });

  it('should properly encode special characters in query', () => {
    const url = buildApiUrl('hello & world', 'key', 'cx', 5);
    assert.ok(url.includes('q=hello+%26+world') || url.includes('q=hello%20%26%20world'));
  });

  it('should use default fields parameter', () => {
    const url = buildApiUrl('test', 'key', 'cx', 10);
    assert.ok(url.includes('fields='));
  });
});

describe('getErrorMessage', () => {
  it('should return correct message for 400 status', () => {
    const msg = getErrorMessage(400, { error: { message: 'Bad param' } });
    assert.ok(msg.includes('Bad Request'));
    assert.ok(msg.includes('Bad param'));
  });

  it('should return correct message for 401 status', () => {
    const msg = getErrorMessage(401, {});
    assert.ok(msg.includes('Unauthorized'));
    assert.ok(msg.includes('Invalid API key'));
    assert.ok(msg.includes('GOOGLE_API_KEY'));
  });

  it('should return quota exceeded message for 403 with quota error', () => {
    const msg = getErrorMessage(403, { error: { message: 'quota exceeded' } });
    assert.ok(msg.includes('Forbidden'));
    assert.ok(msg.includes('quota'));
    assert.ok(msg.includes('100 queries/day'));
  });

  it('should return generic 403 message for non-quota errors', () => {
    const msg = getErrorMessage(403, { error: { message: 'Access denied' } });
    assert.ok(msg.includes('Forbidden'));
    assert.ok(msg.includes('Access denied'));
  });

  it('should return correct message for 429 status', () => {
    const msg = getErrorMessage(429, {});
    assert.ok(msg.includes('Too Many Requests'));
    assert.ok(msg.includes('Rate limit'));
  });

  it('should return correct message for 500 status', () => {
    const msg = getErrorMessage(500, {});
    assert.ok(msg.includes('Server Error'));
    assert.ok(msg.includes('Google API'));
  });

  it('should return correct message for 503 status', () => {
    const msg = getErrorMessage(503, {});
    assert.ok(msg.includes('Service Unavailable'));
  });

  it('should return generic error for unknown status codes', () => {
    const msg = getErrorMessage(418, { error: { message: "I'm a teapot" } });
    assert.ok(msg.includes('API Error (418)'));
    assert.ok(msg.includes("I'm a teapot"));
  });

  it('should handle missing error body gracefully', () => {
    const msg = getErrorMessage(500, null);
    assert.ok(msg.includes('Server Error'));
  });
});

describe('formatResults', () => {
  it('should format empty results', () => {
    const output = formatResults('test', []);
    assert.ok(output.includes('Search Results for: "test"'));
    assert.ok(output.includes('No results found'));
  });

  it('should format null items as no results', () => {
    const output = formatResults('test', null);
    assert.ok(output.includes('No results found'));
  });

  it('should format single result correctly', () => {
    const items = [{
      title: 'Test Title',
      link: 'https://example.com',
      snippet: 'This is a test snippet.'
    }];
    const output = formatResults('query', items);

    assert.ok(output.includes('Search Results for: "query"'));
    assert.ok(output.includes('1. **Test Title**'));
    assert.ok(output.includes('https://example.com'));
    assert.ok(output.includes('This is a test snippet.'));
  });

  it('should format multiple results with numbering', () => {
    const items = [
      { title: 'First', link: 'https://first.com', snippet: 'First desc' },
      { title: 'Second', link: 'https://second.com', snippet: 'Second desc' },
      { title: 'Third', link: 'https://third.com', snippet: 'Third desc' }
    ];
    const output = formatResults('test', items);

    assert.ok(output.includes('1. **First**'));
    assert.ok(output.includes('2. **Second**'));
    assert.ok(output.includes('3. **Third**'));
  });

  it('should handle missing fields with defaults', () => {
    const items = [{}];
    const output = formatResults('test', items);

    assert.ok(output.includes('**Untitled**'));
    assert.ok(output.includes('No description available'));
  });

  it('should handle partially filled items', () => {
    const items = [{ title: 'Only Title' }];
    const output = formatResults('test', items);

    assert.ok(output.includes('**Only Title**'));
    assert.ok(output.includes('No description available'));
  });
});

describe('constants', () => {
  it('should have correct API endpoint', () => {
    assert.strictEqual(API_ENDPOINT, 'https://www.googleapis.com/customsearch/v1');
  });

  it('should have correct default fields', () => {
    assert.strictEqual(DEFAULT_FIELDS, 'kind,items(title,link,snippet)');
  });

  it('should have correct default number of results', () => {
    assert.strictEqual(DEFAULT_NUM_RESULTS, 10);
  });
});
