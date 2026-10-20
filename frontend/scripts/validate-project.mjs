import { readFile, readdir, stat, mkdtemp, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relative => readFile(path.join(root, relative), 'utf8');
const tmp = await mkdtemp(path.join(os.tmpdir(), 'one10-sfc-check-'));

async function walk(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(full));
    else output.push(full);
  }
  return output;
}

function skipWhitespace(source, offset) {
  while (offset < source.length && /\s/.test(source[offset])) offset += 1;
  return offset;
}

// Parses a single HTML/Vue opening or closing tag while respecting quoted attributes.
function readTag(source, offset) {
  if (source.startsWith('<!--', offset)) {
    const end = source.indexOf('-->', offset + 4);
    assert.notEqual(end, -1, 'Unclosed HTML comment inside a Vue template.');
    return { comment: true, end: end + 3 };
  }
  if (source[offset] !== '<' || !/[A-Za-z/]/.test(source[offset + 1] || '')) return null;
  let cursor = offset + 1;
  let closing = false;
  if (source[cursor] === '/') { closing = true; cursor += 1; }
  const nameMatch = source.slice(cursor).match(/^([A-Za-z][\w:.-]*)/);
  if (!nameMatch) return null;
  const name = nameMatch[1];
  cursor += name.length;
  let quote = '';
  while (cursor < source.length) {
    const character = source[cursor];
    if (quote) {
      if (character === quote && source[cursor - 1] !== '\\') quote = '';
    } else if (character === '"' || character === "'" || character === '`') {
      quote = character;
    } else if (character === '>') {
      const selfClosing = !closing && source.slice(offset, cursor).trimEnd().endsWith('/');
      return { name, closing, selfClosing, start: offset, end: cursor + 1 };
    }
    cursor += 1;
  }
  assert.fail(`Unclosed <${closing ? '/' : ''}${name}> tag.`);
}

const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

function findTemplateEnd(source, openEnd, relative) {
  const stack = ['template'];
  let cursor = openEnd;
  while (cursor < source.length) {
    if (source.startsWith('{{', cursor)) {
      const interpolationEnd = source.indexOf('}}', cursor + 2);
      if (interpolationEnd !== -1) { cursor = interpolationEnd + 2; continue; }
    }
    const opening = source.indexOf('<', cursor);
    if (opening === -1) break;
    const tag = readTag(source, opening);
    if (!tag) { cursor = opening + 1; continue; }
    cursor = tag.end;
    if (tag.comment) continue;
    const lower = tag.name.toLowerCase();
    assert.ok(lower !== 'script' && lower !== 'style', `${relative} contains a <${tag.name}> block inside its Vue template.`);
    if (tag.closing) {
      assert.ok(stack.length > 0, `${relative} has an unexpected closing </${tag.name}>.`);
      const expected = stack.pop();
      assert.equal(tag.name, expected, `${relative} closes </${tag.name}> while <${expected}> is still open.`);
      if (stack.length === 0) return tag.end;
    } else if (!tag.selfClosing && !VOID_TAGS.has(lower)) {
      stack.push(tag.name);
    }
  }
  assert.fail(`${relative} has an unclosed Vue template; still open: ${stack.join(', ')}.`);
}

function parseSfc(relative, source) {
  let cursor = skipWhitespace(source, 0);
  const scriptOpen = source.slice(cursor).match(/^<script\s+setup(?:\s+[^>]*)?>/);
  assert.ok(scriptOpen, `${relative} must begin with <script setup>.`);
  const scriptStart = cursor + scriptOpen[0].length;
  const scriptClose = source.indexOf('</script>', scriptStart);
  assert.notEqual(scriptClose, -1, `${relative} has an unclosed <script setup> block.`);
  const script = source.slice(scriptStart, scriptClose);
  cursor = skipWhitespace(source, scriptClose + '</script>'.length);

  const templateOpen = source.slice(cursor).match(/^<template(?:\s+[^>]*)?>/);
  assert.ok(templateOpen, `${relative} must have one top-level <template> after <script setup>.`);
  const templateStart = cursor + templateOpen[0].length;
  const templateEnd = findTemplateEnd(source, templateStart, relative);
  cursor = skipWhitespace(source, templateEnd);

  const styleOpen = source.slice(cursor).match(/^<style\s+scoped(?:\s+[^>]*)?>/);
  assert.ok(styleOpen, `${relative} must have one top-level <style scoped> after its template.`);
  const styleStart = cursor + styleOpen[0].length;
  const styleClose = source.indexOf('</style>', styleStart);
  assert.notEqual(styleClose, -1, `${relative} has an unclosed <style scoped> block.`);
  assert.equal(skipWhitespace(source, styleClose + '</style>'.length), source.length, `${relative} has extra or duplicate SFC blocks after its scoped style.`);

  // JavaScript's own parser catches syntax errors in every setup block without requiring installed Vue packages.
  return { script };
}

try {
  const pageData = JSON.parse(await read('src/data/pages.json'));
  const policyData = JSON.parse(await read('src/data/policies.json'));
  const catalogModule = await read('src/data/catalog.js');
  const catalogStart = catalogModule.indexOf('export const CATALOG = ') + 'export const CATALOG = '.length;
  const catalogEnd = catalogModule.lastIndexOf(';');
  assert.ok(catalogStart >= 'export const CATALOG = '.length, 'Could not find exported catalog literal.');
  assert.ok(catalogEnd > catalogStart, 'Could not find catalog terminator.');
  const products = JSON.parse(catalogModule.slice(catalogStart, catalogEnd));
  const productIds = new Set(products.map(product => product.id));

  assert.equal(Object.keys(pageData).length, 151, 'Expected all original routes in the route manifest.');
  assert.equal(products.length, 128, 'Expected every supplied product in the catalog.');
  assert.equal(productIds.size, products.length, 'Product IDs must be unique.');
  assert.ok(pageData['/'] && pageData['/shop/'] && pageData['/cart/'] && pageData['/checkout/'], 'Required routes are missing.');
  const productRoutes = Object.values(pageData).filter(page => page.page === 'product');
  assert.equal(productRoutes.length, products.length, 'Every catalog product must have a product route.');
  for (const [route, page] of Object.entries(pageData)) {
    assert.equal(page.path, route, `Route manifest path does not match key: ${route}`);
    assert.ok(page.title, `Missing title for ${route}`);
    assert.ok(page.description, `Missing description for ${route}`);
    assert.ok(page.canonical, `Missing canonical URL for ${route}`);
    if (page.page === 'product') assert.ok(productIds.has(page.product), `Unknown product ${page.product} at ${route}`);
  }
  for (const product of products) {
    assert.ok(product.id && product.name && product.price >= 0, `Invalid product record: ${product.id || '(no ID)'}`);
    assert.ok(Array.isArray(product.amz) && product.amz.length > 0, `Product has no image references: ${product.id}`);
    assert.ok(Array.isArray(product.bullets), `Product feature list is missing: ${product.id}`);
  }

  const allowedPolicyKeys = ['shipping', 'returns', 'warranty', 'terms', 'privacy', 'accessibility'];
  const allowedBlockTypes = new Set(['p', 'h2', 'h3', 'ul', 'ol', 'callout', 'table']);
  for (const key of allowedPolicyKeys) {
    const policy = policyData[key];
    assert.ok(policy?.title && policy?.description && policy.blocks.length, `Policy content incomplete: ${key}`);
    for (const block of policy.blocks) {
      assert.ok(allowedBlockTypes.has(block.type), `Unsupported policy block type '${block.type}' in ${key}.`);
      if (block.type === 'ul' || block.type === 'ol') assert.ok(Array.isArray(block.items), `List block has no items in ${key}.`);
      if (block.type === 'table') assert.ok(Array.isArray(block.rows) && block.rows.length, `Table block has no rows in ${key}.`);
    }
  }

  const files = await walk(path.join(root, 'src'));
  const vueFiles = files.filter(file => file.endsWith('.vue'));
  const sourceFiles = files.filter(file => /\.(?:js|mjs|vue)$/.test(file));
  assert.ok(vueFiles.length >= 30, `Expected a maintainable component/page set, got ${vueFiles.length} SFCs.`);

  for (const file of vueFiles) {
    const source = await readFile(file, 'utf8');
    const relative = path.relative(root, file).replaceAll(path.sep, '/');
    const { script } = parseSfc(relative, source);
    assert.doesNotMatch(source, /\bv-html\s*=/, `${relative} contains v-html.`);
    assert.doesNotMatch(source, /\.innerHTML\s*=|insertAdjacentHTML\s*\(/, `${relative} contains imperative HTML injection.`);
    const scriptPath = path.join(tmp, `${path.basename(file)}.mjs`);
    await writeFile(scriptPath, script);
    const check = spawnSync(process.execPath, ['--check', scriptPath], { encoding: 'utf8' });
    assert.equal(check.status, 0, `${relative} has a JavaScript syntax error:\n${check.stderr || check.stdout}`);
  }

  for (const file of sourceFiles) {
    const source = await readFile(file, 'utf8');
    const relative = path.relative(root, file).replaceAll(path.sep, '/');
    assert.doesNotMatch(relative, /src\/legacy\//, 'Legacy renderer is not allowed.');
    if (!file.endsWith('.vue')) {
      const check = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
      assert.equal(check.status, 0, `${relative} has a JavaScript syntax error:\n${check.stderr || check.stdout}`);
    }
    const importPattern = /\bfrom\s*['"]([^'"]+)['"]|^\s*import\s*['"]([^'"]+)['"]/gm;
    for (const match of source.matchAll(importPattern)) {
      const specifier = match[1] || match[2];
      if (!specifier.startsWith('.')) continue;
      const resolved = path.resolve(path.dirname(file), specifier);
      const candidates = [resolved, `${resolved}.js`, `${resolved}.mjs`, `${resolved}.vue`, `${resolved}.json`, path.join(resolved, 'index.js')];
      let exists = false;
      for (const candidate of candidates) {
        try { if ((await stat(candidate)).isFile()) { exists = true; break; } } catch { /* test next conventional extension */ }
      }
      assert.ok(exists, `Broken local import in ${relative}: ${specifier}`);
    }
  }

  const router = await read('src/router/index.js');
  const pageTypes = new Set(Object.values(pageData).map(page => page.page));
  for (const type of pageTypes) assert.ok(router.includes(`${type}:`) || router.includes(`'${type}':`), `No Vue page component mapped for route type ${type}.`);

  const routePaths = new Set(Object.keys(pageData));
  function validatePolicyRuns(runs, policyName) {
    for (const run of runs || []) {
      if (Array.isArray(run)) { validatePolicyRuns(run, policyName); continue; }
      if (!run || typeof run !== 'object') continue;
      if (run.to) assert.ok(routePaths.has(run.to), `Broken internal policy link in ${policyName}: ${run.to}`);
      if (run.href) assert.match(run.href, /^(?:https?:|mailto:|tel:|#)/i, `Unsafe or malformed policy URL in ${policyName}: ${run.href}`);
    }
  }
  for (const [policyName, policy] of Object.entries(policyData)) {
    for (const block of policy.blocks) {
      validatePolicyRuns(block.runs, policyName);
      validatePolicyRuns(block.items, policyName);
      validatePolicyRuns(block.rows, policyName);
    }
  }
  for (const file of vueFiles) {
    const source = await readFile(file, 'utf8');
    const relative = path.relative(root, file).replaceAll(path.sep, '/');
    const linkPattern = /<(?:RouterLink|router-link)\b[^>]*\bto=["']([^"']+)["']|<a\b[^>]*\bhref=["']([^"']+)["']/g;
    for (const match of source.matchAll(linkPattern)) {
      const target = match[1] || match[2];
      if (!target.startsWith('/') || target.startsWith('//')) continue;
      const pathname = target.split(/[?#]/, 1)[0];
      assert.ok(routePaths.has(pathname) || routePaths.has(pathname.endsWith('/') ? pathname : `${pathname}/`), `Broken internal link in ${relative}: ${target}`);
    }
  }

  const packageJson = JSON.parse(await read('package.json'));
  assert.ok(packageJson.dependencies.vue && packageJson.dependencies['vue-router'], 'Vue runtime dependencies are missing.');
  assert.ok(packageJson.devDependencies.vite && packageJson.devDependencies['@vitejs/plugin-vue'], 'Vite dependencies are missing.');
  const index = await read('index.html');
  assert.match(index, /<div id="app"><\/div>/, 'index.html mount point must match main.js.');
  const main = await read('src/main.js');
  assert.match(main, /mount\('#app'\)/, 'Vue app is not mounted at #app.');

  console.log(`Validated ${Object.keys(pageData).length} routes, ${products.length} products, ${allowedPolicyKeys.length} legal pages, ${vueFiles.length} structurally parsed Vue SFCs, JavaScript syntax, internal links, and all local imports.`);
} finally {
  await rm(tmp, { recursive: true, force: true });
}
