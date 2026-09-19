import { useEffect, useState, type FormEvent } from 'react';
import type { SiteContent, SkillGroup } from '../../types/portfolio';
import { defaultSiteContent, defaultSkillGroups } from '../../lib/defaultPortfolio';
import { fetchSiteContent, fetchSkillGroups, saveSiteContent, saveSkillGroups, uploadPortfolioImage } from '../../lib/portfolioApi';
import { portfolioErrorMessage } from '../../lib/portfolioErrors';
import EditorModal from './EditorModal';
import TagInput from './TagInput';

export type EditableSection = 'hero' | 'about' | 'skills' | 'contact';
const names = { hero: 'Hero', about: 'About Me', skills: 'Skills & Tools', contact: 'Contact' };
const field = 'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-gray-900 dark:border-white/15 dark:bg-white/5 dark:text-white';
export default function SectionEditorModal({ section, onClose, onSaved }: { section: EditableSection; onClose: () => void; onSaved: () => void }) {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [groups, setGroups] = useState<SkillGroup[]>(defaultSkillGroups);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setLoadError('');
    Promise.all([fetchSiteContent(true), section === 'skills' ? fetchSkillGroups(true) : Promise.resolve([])]).then(([data, skills]) => {
      if (!active) return;
      if (data) setContent({ ...defaultSiteContent, ...data });
      if (skills.length) setGroups(skills);
    }).catch((reason) => { if (active) setLoadError(portfolioErrorMessage(reason, '내용을 불러오지 못했습니다.')); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [section, attempt]);
  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => { setDirty(true); setContent((current) => ({ ...current, [key]: value })); };
  const close = () => { if (!busy && (!dirty || window.confirm('수정한 내용을 저장하지 않고 닫을까요?'))) onClose(); };
  const text = (key: 'heroGreeting' | 'heroName' | 'heroDescription' | 'aboutCtaText' | 'contactTitle' | 'thankYouText' | 'skillsFooter', label: string, multiline = false) => <label className="block space-y-2"><span className="font-semibold">{label}</span>{multiline ? <textarea className={`${field} min-h-28`} value={content[key]} onChange={(event) => update(key, event.target.value)} /> : <input className={field} value={content[key]} onChange={(event) => update(key, event.target.value)} />}</label>;
  const save = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      if (section === 'skills') await saveSkillGroups(groups);
      // Merge just the edited section into a fresh read, preserving other sections.
      const current = await fetchSiteContent(true) ?? defaultSiteContent;
      const patch = section === 'hero' ? { heroGreeting: content.heroGreeting, heroName: content.heroName, heroDescription: content.heroDescription, heroAvatarUrl: content.heroAvatarUrl }
        : section === 'about' ? { aboutParagraphs: content.aboutParagraphs, aboutHighlights: content.aboutHighlights, aboutCtaText: content.aboutCtaText }
        : section === 'contact' ? { contactTitle: content.contactTitle, contactItems: content.contactItems, thankYouText: content.thankYouText }
        : { skillsFooter: content.skillsFooter };
      await saveSiteContent({ ...current, ...patch }); onSaved();
    } catch (reason) { setError(portfolioErrorMessage(reason, '저장하지 못했습니다.')); }
    finally { setBusy(false); }
  };
  return <EditorModal title={`${names[section]} 수정`} onClose={close}>
    {loading ? <p role="status">내용을 불러오는 중…</p> : loadError ? <div role="alert">{loadError}<button className="ml-3 underline" onClick={() => setAttempt((value) => value + 1)}>다시 시도</button></div> : <form onSubmit={save} className="space-y-6">
      <fieldset disabled={busy} className="space-y-5">
        {section === 'hero' && <>{text('heroGreeting', '인사')}{text('heroName', '이름')}{text('heroDescription', '소개', true)}<label className="block space-y-2"><span>프로필 이미지</span>{content.heroAvatarUrl && <img src={content.heroAvatarUrl} alt="프로필 미리보기" className="h-32 w-32 rounded-full object-cover" />}<input type="file" accept="image/*" className={field} onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; setBusy(true); try { update('heroAvatarUrl', await uploadPortfolioImage(file, 'hero')); } catch (reason) { setError(portfolioErrorMessage(reason, '업로드 실패')); } finally { setBusy(false); } }} /></label></>}
        {section === 'about' && <><label className="block space-y-2"><span>소개 문단 · 한 줄에 한 문단</span><textarea className={`${field} min-h-56`} value={content.aboutParagraphs.join('\n')} onChange={(event) => update('aboutParagraphs', event.target.value.split('\n'))} /></label>{content.aboutHighlights.map((item, index) => <div key={index} className="space-y-2 rounded-xl border p-4"><input aria-label={`강점 ${index + 1} 제목`} className={field} value={item.title} onChange={(event) => update('aboutHighlights', content.aboutHighlights.map((entry, position) => position === index ? { ...entry, title: event.target.value } : entry))} /><textarea aria-label={`강점 ${index + 1} 설명`} className={field} value={item.description} onChange={(event) => update('aboutHighlights', content.aboutHighlights.map((entry, position) => position === index ? { ...entry, description: event.target.value } : entry))} /></div>)}{text('aboutCtaText', '마무리 문구')}</>}
        {section === 'contact' && <>{text('contactTitle', '제목')}{content.contactItems.map((item, index) => <div key={index} className="space-y-2 rounded-xl border p-4">{(['label', 'value', 'url'] as const).map((key) => <input key={key} aria-label={`연락처 ${index + 1} ${key}`} placeholder={key === 'label' ? '항목 이름' : key === 'value' ? '표시할 내용' : '링크 · 선택'} className={field} value={item[key] ?? ''} onChange={(event) => update('contactItems', content.contactItems.map((entry, position) => position === index ? { ...entry, [key]: event.target.value } : entry))} />)}<button type="button" className="text-sm text-red-500" onClick={() => update('contactItems', content.contactItems.filter((_, position) => position !== index))}>항목 삭제</button></div>)}<button type="button" className="text-cyan-600" onClick={() => update('contactItems', [...content.contactItems, { label: '', value: '', url: '' }])}>＋ 연락처 추가</button>{text('thankYouText', '마지막 인사')}</>}
        {section === 'skills' && <>{groups.map((group, index) => <div key={group.id} className="space-y-3 rounded-xl border p-4"><input aria-label={`스킬 그룹 ${index + 1} 이름`} className={field} value={group.category} onChange={(event) => { setDirty(true); setGroups((items) => items.map((item) => item.id === group.id ? { ...item, category: event.target.value } : item)); }} /><TagInput label="스킬 항목" value={group.items} onChange={(items) => { setDirty(true); setGroups((current) => current.map((item) => item.id === group.id ? { ...item, items } : item)); }} placeholder="스킬 입력 후 Enter" /></div>)}{text('skillsFooter', '마무리 문구')}</>}
      </fieldset>
      {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
      <button disabled={busy} className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-white disabled:opacity-50">{busy ? '저장 중…' : '변경사항 저장'}</button>
    </form>}
  </EditorModal>;
}
