#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadSource(filePath) {
  const fullPath = path.resolve(process.cwd(), filePath);
  return fs.readFileSync(fullPath, 'utf8');
}

function stripJavascriptPrefix(source) {
  return source.startsWith('javascript:') ? source.slice('javascript:'.length) : source;
}

function tryDecodeURIComponent(value) {
  try {
    return { ok: true, value: decodeURIComponent(value) };
  } catch (error) {
    return { ok: false, error };
  }
}

function testSyntax(label, source) {
  try {
    new vm.Script(source, { filename: `${label}.js` });
    return { label, ok: true };
  } catch (error) {
    return { label, ok: false, error };
  }
}

function main() {
  const inputPath = process.argv[2] || 'min/twitter_copy.0.min.js';
  const raw = loadSource(inputPath).trim();

  const stripped = stripJavascriptPrefix(raw);
  const decodedResult = tryDecodeURIComponent(stripped);

  const scenarios = [
    { label: 'raw-file', source: raw },
    { label: 'stripped', source: stripped },
  ];

  if (decodedResult.ok) {
    scenarios.push({ label: 'decodeURIComponent', source: decodedResult.value });
  }

  const results = scenarios.map(({ label, source }) => testSyntax(label, source));

  results.forEach((result) => {
    if (result.ok) {
      console.log(`[${result.label}] syntax OK`);
    } else {
      console.log(`[${result.label}] syntax ERROR: ${result.error.name}: ${result.error.message}`);
    }
  });

  if (!decodedResult.ok) {
    console.log(`[decodeURIComponent] skip: ${decodedResult.error.message}`);
  }

  const failed = results.find((result) => !result.ok);
  process.exit(failed ? 1 : 0);
}

if (require.main === module) {
  main();
}
