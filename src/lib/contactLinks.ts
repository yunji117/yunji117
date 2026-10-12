import type { ContactItem } from '../types/portfolio';

export type ResumeRole = 'frontend' | 'fullstack' | 'designer';

export const resumeDefinitions: Array<{ role: ResumeRole; label: string; itemLabel: string }> = [
  { role: 'frontend', label: '프론트엔드 이력서 PDF', itemLabel: 'Frontend Resume' },
  { role: 'fullstack', label: '풀스택 이력서 PDF', itemLabel: 'Fullstack Resume' },
  { role: 'designer', label: '웹디자인 이력서 PDF', itemLabel: 'Web Designer Resume' },
];

const normalize = (value: string) => value.toLocaleLowerCase().replace(/[^a-z0-9가-힣]/g, '');

export const isResumeContactItem = (item: ContactItem) => {
  const label = normalize(item.label);
  return label.includes('resume') || label.includes('이력서');
};

export const getResumeUrl = (items: ContactItem[], role: ResumeRole) => {
  const definition = resumeDefinitions.find((item) => item.role === role);
  if (!definition) return undefined;
  const target = normalize(definition.itemLabel);
  const item = items.find((entry) => normalize(entry.label) === target);
  return item?.url?.trim() || undefined;
};

export const setResumeUrl = (items: ContactItem[], role: ResumeRole, url: string): ContactItem[] => {
  const definition = resumeDefinitions.find((item) => item.role === role);
  if (!definition) return items;
  const target = normalize(definition.itemLabel);
  const index = items.findIndex((item) => normalize(item.label) === target);
  const nextItem: ContactItem = { label: definition.itemLabel, value: definition.label, url };

  if (index === -1) return [...items, nextItem];
  return items.map((item, position) => position === index ? nextItem : item);
};
