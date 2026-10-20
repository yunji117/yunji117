import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
const result = await build({
  stdin: { resolveDir: process.cwd(), contents: `
    import React from 'react';
    import { renderToStaticMarkup } from 'react-dom/server';
    import ProjectEditor from './src/components/admin/ProjectEditorModal';
    import CoverImageCropper from './src/components/admin/CoverImageCropper';
    import TagInput from './src/components/admin/TagInput';
    const noop = () => {};
    const project = { id: 'test', title: '', description: '', shortDesc: '', image: '', category: 'personal', stack: [], overview: '', goal: '', difficulties: [], outputs: ['first.png', 'second.png'], sections: [], caseStudy: {}, isPublished: true };
    export const html = renderToStaticMarkup(React.createElement(ProjectEditor, { project, sortOrder: 1, onClose: noop, onSaved: noop }));
    export const editHtml = renderToStaticMarkup(React.createElement(ProjectEditor, { project: { id: 'saved', title: 'Saved project', description: '', shortDesc: '', image: 'https://example.com/cover.webp', category: 'personal', stack: [], overview: '', goal: '', difficulties: [], outputs: [] }, sortOrder: 1, onClose: noop, onSaved: noop }));
    export const chartHtml = renderToStaticMarkup(React.createElement(ProjectEditor, { project: { id: 'chart', title: 'Chart project', description: '', shortDesc: '', image: '', visualType: 'chart', chartPoints: [{ name: '기획', value: 20 }, { name: '완성', value: 90 }], category: 'personal', stack: [], overview: '', goal: '', difficulties: [], outputs: [] }, sortOrder: 1, onClose: noop, onSaved: noop }));
    export const tags = renderToStaticMarkup(React.createElement(TagInput, { label: '스택', hashtags: true, value: ['React', '#TypeScript'], onChange: noop }));
    export const cropper = renderToStaticMarkup(React.createElement(CoverImageCropper, { src: 'cover.webp', initial: { x: 50, y: 50, scale: 1 }, onCancel: noop, onSave: noop }));
  ` },
  bundle: true, write: false, format: 'esm', platform: 'node', jsx: 'automatic',
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(process.cwd() + '/package.json');" },
  plugins: [{ name: 'mock-api', setup(builder) {
    builder.onResolve({ filter: /lib\/portfolioApi$/ }, () => ({ path: 'api', namespace: 'mock' }));
    builder.onLoad({ filter: /.*/, namespace: 'mock' }, () => ({ contents: `export const defaultCategories = [{value:'personal',label:'개인 프로젝트'}]; export const fetchProjectCategories = async () => defaultCategories; export const addProjectCategory = async () => {}; export const saveProject = async () => {}; export const uploadPortfolioImage = async () => {};` }));
  } }],
});
const { html, editHtml, chartHtml, tags, cropper } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`).catch((error) => { throw new Error(error.message); });
test('editor follows the requested detail-view content order', () => {
  const labels = ['대표 이미지 한 장 선택', '프로젝트 이름', '프로젝트 간단 소개', 'Case Study Summary', '프로젝트 배경과 문제', 'Goal', 'Project Gallery', 'Tech Stack', '중주제 추가하기', '프로젝트 URL'];
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
test('an existing project renders its saved cover in the editor preview', () => {
  assert.match(editHtml, /src="https:\/\/example\.com\/cover\.webp"/);
  assert.match(editHtml, /alt="대표 이미지 미리보기"/);
  assert.match(editHtml, /대표 이미지 교체/);
  assert.match(editHtml, />대표 이미지 위치 조정<\/button>/);
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
test('project gallery images can be selected and dragged to reorder', () => {
  assert.match(html, /aria-label="프로젝트 이미지 1 선택"/);
  assert.match(html, /draggable="true"/);
  assert.match(html, /이미지를 클릭해 선택한 뒤, 원하는 위치로 드래그해 놓으세요/);
});
test('cover cropper explains direct gestures and exposes an explicit save action', () => {
  assert.match(cropper, /대표 이미지 드래그 및 확대·축소 영역/);
  assert.match(cropper, /Ctrl \+ 마우스 휠/);
  assert.match(cropper, /두 손가락 벌리기·모으기/);
  assert.match(cropper, /대표 이미지 수정 저장/);
  assert.match(cropper, /type="range"/);
});
test('editor offers image and chart representative-content options', () => {
  assert.match(html, /대표 이미지 등록/);
  assert.match(html, /그래프 등록/);
  assert.match(chartHtml, /그래프 미리보기/);
  assert.match(chartHtml, /이름 추가/);
  assert.match(chartHtml, /그래프 항목 1 이름/);
  assert.match(chartHtml, />기획</);
  assert.match(chartHtml, />완성</);
});
