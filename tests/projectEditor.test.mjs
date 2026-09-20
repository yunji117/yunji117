import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
const result = await build({
  stdin: { resolveDir: process.cwd(), contents: `
    import React from 'react';
    import { renderToStaticMarkup } from 'react-dom/server';
    import ProjectEditor from './src/components/admin/ProjectEditorModal';
    import TagInput from './src/components/admin/TagInput';
    const noop = () => {};
    export const html = renderToStaticMarkup(React.createElement(ProjectEditor, { sortOrder: 1, onClose: noop, onSaved: noop }));
    export const tags = renderToStaticMarkup(React.createElement(TagInput, { label: '스택', hashtags: true, value: ['React', '#TypeScript'], onChange: noop }));
  ` },
  bundle: true, write: false, format: 'esm', platform: 'node', jsx: 'automatic',
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(process.cwd() + '/package.json');" },
  plugins: [{ name: 'mock-api', setup(builder) {
    builder.onResolve({ filter: /lib\/portfolioApi$/ }, () => ({ path: 'api', namespace: 'mock' }));
    builder.onLoad({ filter: /.*/, namespace: 'mock' }, () => ({ contents: `export const defaultCategories = [{value:'personal',label:'개인 프로젝트'}]; export const fetchProjectCategories = async () => defaultCategories; export const addProjectCategory = async () => {}; export const saveProject = async () => {}; export const uploadPortfolioImage = async () => {};` }));
  } }],
});
const { html, tags } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`).catch((error) => { throw new Error(error.message); });
test('editor follows the requested detail-view content order', () => {
  const labels = ['대표 이미지 한 장 선택', '프로젝트 이름', '프로젝트 간단 소개', 'Project Overview', 'Goal', 'Project Gallery', 'Tech Stack', '중주제 추가하기', '프로젝트 URL'];
  const positions = labels.map((label) => html.indexOf(label));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
});
test('cover input accepts one file and gallery accepts multiple files', () => {
  const inputs = html.match(/<input[^>]+type="file"[^>]*>/g);
  assert.equal(inputs.length, 2);
  assert.doesNotMatch(inputs[0], /multiple/);
  assert.match(inputs[1], /multiple/);
});
test('empty project URL has no Visit Project preview and hashtag is hidden on tags', () => {
  assert.doesNotMatch(html, /Visit Project/);
  assert.match(tags, />React</);
  assert.match(tags, />TypeScript</);
  assert.doesNotMatch(tags, />#(?:React|TypeScript)</);
});
test('project editor exposes the publication toggle beside the close action', () => {
  assert.match(html, /aria-label="프로젝트 비공개로 전환"/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, />공개<\/button>/);
});
