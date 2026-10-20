import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const result = await build({
  stdin: {
    resolveDir: process.cwd(),
    contents: `
      import React from 'react';
      import { renderToStaticMarkup } from 'react-dom/server';
      import ProjectLineChart from './src/components/ProjectLineChart';
      const points = [{ name: '시작', value: 10 }, { name: '중간', value: 45 }, { name: '완성', value: 100 }];
      export const html = renderToStaticMarkup(React.createElement(ProjectLineChart, { points }));
      export const animatedHtml = renderToStaticMarkup(React.createElement(ProjectLineChart, { points, animated: true }));
    `,
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  jsx: 'automatic',
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(process.cwd() + '/package.json');" },
});
const moduleUrl = `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`;
const { html, animatedHtml } = await import(moduleUrl);

test('renders named values as one connected SVG line', () => {
  assert.match(html, /<path[^>]+d="M [^"]+ L [^"]+ L [^"]+"/);
  assert.match(html, />시작</);
  assert.match(html, />중간</);
  assert.match(html, />완성</);
  assert.match(html, />100</);
});

test('animated graph exposes the same complete data', () => {
  assert.match(animatedHtml, /프로젝트 그래프: 시작 10, 중간 45, 완성 100/);
  assert.match(animatedHtml, /<circle|<g/);
});
