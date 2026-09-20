import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Eye, EyeOff, ExternalLink, ImagePlus, Loader2, Plus, Trash2 } from 'lucide-react';
import type { PortfolioProject } from '../../types/portfolio';
import { addProjectCategory, defaultCategories, fetchProjectCategories, saveProject, uploadPortfolioImage } from '../../lib/portfolioApi';
import { portfolioErrorMessage } from '../../lib/portfolioErrors';
import EditorModal from './EditorModal';
import TagInput from './TagInput';

const field = 'w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-gray-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:ring-cyan-500/20';
const heading = 'mb-3 block text-2xl font-bold';
const blank = (category: string, sortOrder: number): PortfolioProject => ({ id: crypto.randomUUID(), title: '', description: '', shortDesc: '', image: '', category, stack: [], overview: '', goal: '', difficulties: [], outputs: [], sections: [], link: '', isPublished: true, sortOrder });

export default function ProjectEditorModal({ project, category = 'personal', sortOrder, onClose, onSaved }: { project?: PortfolioProject; category?: string; sortOrder: number; onClose: () => void; onSaved: (project: PortfolioProject) => void }) {
  const [draft, setDraft] = useState(() => project ? { ...structuredClone(project), outputs: [...new Set([...(project.outputs ?? []), ...(project.detailImages ?? [])])], detailImages: [] } : blank(category, sortOrder));
  const [initial] = useState(() => JSON.stringify(draft));
  const [categories, setCategories] = useState(defaultCategories);
  const [newCategory, setNewCategory] = useState<string | null>(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [categoryAttempt, setCategoryAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    fetchProjectCategories().then((items) => { if (active) { setCategories(items); setCategoryError(''); } }).catch((reason) => { if (active) setCategoryError(portfolioErrorMessage(reason, '대주제를 불러오지 못했습니다.')); });
    return () => { active = false; };
  }, [categoryAttempt]);
  const update = <K extends keyof PortfolioProject>(key: K, value: PortfolioProject[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const close = () => { if (!busy && (initial === JSON.stringify(draft) || window.confirm('작성 중인 내용을 저장하지 않고 닫을까요?'))) onClose(); };
  const upload = async (event: ChangeEvent<HTMLInputElement>, cover: boolean) => {
    const files = Array.from(event.target.files ?? []); event.target.value = '';
    if (!files.length) return;
    if (cover && files.length !== 1) { setError('대표 이미지는 한 장만 선택해 주세요.'); return; }
    if (files.some((file) => !file.type.startsWith('image/') || file.size > 10 * 1024 * 1024)) { setError('이미지는 한 장당 10MB 이하로 선택해 주세요.'); return; }
    setBusy(cover ? 'cover' : 'gallery'); setError('');
    try {
      // Apply each successful upload immediately so a later failure cannot lose it.
      for (const file of files) {
        const url = await uploadPortfolioImage(file, cover ? 'project-cover' : 'project-gallery');
        setDraft((current) => cover ? { ...current, image: url } : { ...current, outputs: [...(current.outputs ?? []), url] });
      }
    } catch (reason) { setError(portfolioErrorMessage(reason, '이미지를 업로드하지 못했습니다.')); }
    finally { setBusy(''); }
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (busy) return;
    if (!draft.image || !draft.title.trim()) { setError('대표 이미지 한 장과 프로젝트 이름을 입력해 주세요.'); return; }
    const link = draft.link?.trim() ?? '';
    if (link && !/^https?:\/\//i.test(link)) { setError('URL은 https:// 또는 http://로 시작해야 합니다.'); return; }
    if ((draft.sections ?? []).some((item) => !item.title.trim() || !item.content.trim())) { setError('중주제의 제목과 내용을 모두 입력하거나 빈 중주제를 삭제해 주세요.'); return; }
    const next = { ...draft, title: draft.title.trim(), description: draft.description.trim(), shortDesc: draft.description.trim(), link };
    setBusy('save'); setError('');
    try { await saveProject(next); onSaved(next); }
    catch (reason) { setError(portfolioErrorMessage(reason, '프로젝트를 저장하지 못했습니다.')); }
    finally { setBusy(''); }
  };
  const isPublished = draft.isPublished ?? true;
  const publicationToggle = <button type="button" onClick={() => update('isPublished', !isPublished)} disabled={Boolean(busy)} aria-label={isPublished ? '프로젝트 비공개로 전환' : '프로젝트 공개로 전환'} aria-pressed={isPublished} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${isPublished ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300'}`}>
    {isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
    {isPublished ? '공개' : '비공개'}
  </button>;
  return <EditorModal title={project ? '프로젝트 수정' : '프로젝트 추가'} headerActions={publicationToggle} onClose={close}>
    <form onSubmit={submit} className="space-y-8">
      <fieldset disabled={Boolean(busy)} className="space-y-8 disabled:opacity-70">
        <div>
          <label className="relative flex min-h-56 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-cyan-300 bg-cyan-50/30">
            {draft.image ? <img src={draft.image} alt="대표 이미지 미리보기" className="h-64 w-full" style={{ objectFit: draft.thumbnailFit ?? 'cover', objectPosition: draft.thumbnailPosition ?? 'center' }} /> : <><ImagePlus className="mb-3 h-9 w-9 text-cyan-600" /><span>대표 이미지 추가 · 한 장</span></>}
            {draft.image && <span className="absolute bottom-3 rounded-full bg-black/65 px-4 py-2 text-sm text-white">대표 이미지 교체</span>}
            <input type="file" accept="image/*" aria-label="대표 이미지 한 장 선택" className="sr-only" onChange={(event) => void upload(event, true)} />
          </label>
          {draft.image && <button type="button" onClick={() => update('image', '')} className="mt-2 text-sm text-gray-500">대표 이미지 삭제</button>}
        </div>
        <label className="block"><span className="sr-only">프로젝트 이름</span><input required aria-label="프로젝트 이름" value={draft.title} onChange={(event) => update('title', event.target.value)} placeholder="프로젝트 이름" className={`${field} text-3xl font-bold sm:text-4xl`} /></label>
        <div>
          <div className="flex gap-2"><select aria-label="대주제" value={draft.category} onChange={(event) => update('category', event.target.value)} className={`${field} max-w-xs`}>{categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select><button type="button" aria-label="대주제 추가" onClick={() => setNewCategory(newCategory === null ? '' : null)} className="rounded-xl border border-cyan-300 px-3"><Plus /></button></div>
          {categoryError && <p role="alert" className="mt-2 text-sm text-red-500">{categoryError} <button type="button" className="underline" onClick={() => setCategoryAttempt((value) => value + 1)}>다시 확인</button></p>}
          {newCategory !== null && <div className="mt-3 flex gap-2"><input aria-label="새 대주제 이름" value={newCategory} onChange={(event) => setNewCategory(event.target.value)} className={field} placeholder="새 대주제 이름" /><button type="button" className="shrink-0 rounded-xl bg-cyan-500 px-4 text-white" onClick={async () => {
            if (!newCategory.trim()) return; setBusy('category'); setError('');
            try { const existing = categories.find((item) => item.label.toLowerCase() === newCategory.trim().toLowerCase()); const added = existing ?? await addProjectCategory(newCategory); if (!existing) setCategories((items) => [...items, added]); update('category', added.value); setNewCategory(null); }
            catch (reason) { setError(portfolioErrorMessage(reason, '대주제를 저장하지 못했습니다.')); } finally { setBusy(''); }
          }}>추가</button></div>}
        </div>
        <label className="block"><span className="mb-2 block text-sm text-gray-500">프로젝트 간단 소개</span><textarea aria-label="프로젝트 간단 소개" className={`${field} min-h-24`} value={draft.description} onChange={(event) => update('description', event.target.value)} placeholder="이 프로젝트는 …을 위한 웹 서비스입니다." /></label>
        <label className="block"><span className={heading}>Project Overview</span><textarea className={`${field} min-h-32`} value={draft.overview} onChange={(event) => update('overview', event.target.value)} /></label>
        <label className="block"><span className={heading}>Goal</span><textarea className={`${field} min-h-28`} value={draft.goal} onChange={(event) => update('goal', event.target.value)} /></label>
        <section><h3 className={heading}>Project Gallery</h3><div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{(draft.outputs ?? []).map((url, index) => <div key={`${url}-${index}`} className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-slate-800"><img src={url} alt={`프로젝트 이미지 ${index + 1}`} className="h-40 w-full object-contain" /><button type="button" aria-label={`프로젝트 이미지 ${index + 1} 삭제`} className="absolute right-2 top-2 rounded-full bg-white p-2 text-red-600" onClick={() => update('outputs', draft.outputs?.filter((_, position) => position !== index))}><Trash2 className="h-4 w-4" /></button></div>)}<label className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-cyan-300 text-sm text-cyan-600"><ImagePlus />이미지 여러 장 추가<input type="file" multiple accept="image/*" aria-label="프로젝트 이미지 여러 장 선택" className="sr-only" onChange={(event) => void upload(event, false)} /></label></div></section>
        <section><h3 className={heading}>Tech Stack</h3><TagInput label="스택" hashtags value={draft.stack} onChange={(items) => update('stack', items)} placeholder="#React #TypeScript 입력 후 Enter" /></section>
        <section className="space-y-5">{(draft.sections ?? []).map((section, index) => <div key={section.id} className="space-y-3"><input aria-label={`중주제 ${index + 1} 제목`} className={`${field} text-2xl font-bold`} placeholder="중주제 제목" value={section.title} onChange={(event) => update('sections', draft.sections?.map((item) => item.id === section.id ? { ...item, title: event.target.value } : item))} /><textarea aria-label={`중주제 ${index + 1} 내용`} className={`${field} min-h-28`} placeholder="내용" value={section.content} onChange={(event) => update('sections', draft.sections?.map((item) => item.id === section.id ? { ...item, content: event.target.value } : item))} /><button type="button" className="text-sm text-red-500" onClick={() => update('sections', draft.sections?.filter((item) => item.id !== section.id))}>중주제 삭제</button></div>)}<button type="button" className="w-full rounded-xl border border-dashed border-cyan-400 py-4 text-cyan-600" onClick={() => update('sections', [...(draft.sections ?? []), { id: crypto.randomUUID(), title: '', content: '' }])}>＋ 중주제 추가하기</button></section>
        {Boolean(draft.difficulties.length) && <label className="block"><span className={heading}>Challenges & Solutions</span><textarea className={`${field} min-h-28`} value={draft.difficulties.join('\n')} onChange={(event) => update('difficulties', event.target.value.split('\n'))} /></label>}
        <label className="block"><span className="mb-2 block font-semibold">프로젝트 URL · 선택</span><input type="url" className={field} value={draft.link ?? ''} onChange={(event) => update('link', event.target.value)} placeholder="https://…" />{draft.link?.trim() && <span className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 py-3 font-semibold text-white"><ExternalLink className="h-5 w-5" />Visit Project</span>}</label>
      </fieldset>
      <footer className="sticky bottom-0 space-y-3 border-t border-slate-200 bg-[#fffdf8]/95 py-4 dark:border-white/10 dark:bg-slate-900/95">
        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        {busy && <p role="status" className="flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin" />{busy === 'save' ? '프로젝트 저장 중…' : '업로드 및 저장 중…'}</p>}
        <div className="flex justify-end gap-3"><button type="button" onClick={close} disabled={Boolean(busy)} className="rounded-lg border px-5 py-3 disabled:opacity-50">취소</button><button type="submit" disabled={Boolean(busy) || Boolean(categoryError)} className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-white disabled:opacity-50">{project ? '수정 저장' : '프로젝트 등록'}</button></div>
      </footer>
    </form>
  </EditorModal>;
}
