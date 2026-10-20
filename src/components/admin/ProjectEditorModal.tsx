import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Eye, EyeOff, ExternalLink, ImagePlus, Loader2, Move, Plus, RotateCcw, Trash2 } from 'lucide-react';
import type { PortfolioProject, ProjectCaseStudy, ThumbnailFit } from '../../types/portfolio';
import { addProjectCategory, defaultCategories, fetchProjectCategories, saveProject, uploadPortfolioImage } from '../../lib/portfolioApi';
import { portfolioErrorMessage } from '../../lib/portfolioErrors';
import { moveGalleryImage } from '../../lib/projectGallery';
import EditorModal from './EditorModal';
import TagInput from './TagInput';

const field = 'w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-gray-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:ring-cyan-500/20';
const heading = 'mb-3 block text-2xl font-bold';
const blank = (category: string, sortOrder: number): PortfolioProject => ({ id: crypto.randomUUID(), title: '', description: '', shortDesc: '', image: '', category, stack: [], overview: '', goal: '', difficulties: [], outputs: [], sections: [], caseStudy: {}, link: '', isPublished: true, sortOrder });

type CoverPosition = { x: number; y: number; fit: ThumbnailFit };

const positionValue = (value: string | undefined, axis: 'x' | 'y') => {
  const tokens = (value?.trim() || 'center').split(/\s+/);
  const first = tokens[0] ?? 'center';
  const token = tokens.length === 1
    ? (axis === 'x' && !['top', 'bottom'].includes(first) ? first : axis === 'y' && ['top', 'bottom'].includes(first) ? first : 'center')
    : (tokens[axis === 'x' ? 0 : 1] ?? 'center');
  const keyword = axis === 'x' ? { left: 0, center: 50, right: 100 } : { top: 0, center: 50, bottom: 100 };
  if (token in keyword) return keyword[token as keyof typeof keyword] ?? 50;
  const numeric = Number.parseFloat(token);
  return Number.isFinite(numeric) ? Math.min(100, Math.max(0, numeric)) : 50;
};

const coverPositionFrom = (project: PortfolioProject): CoverPosition => ({
  x: positionValue(project.thumbnailPosition, 'x'),
  y: positionValue(project.thumbnailPosition, 'y'),
  fit: project.thumbnailFit ?? 'cover',
});

export default function ProjectEditorModal({ project, category = 'personal', sortOrder, onClose, onSaved }: { project?: PortfolioProject; category?: string; sortOrder: number; onClose: () => void; onSaved: (project: PortfolioProject) => void }) {
  const [draft, setDraft] = useState(() => project ? { ...structuredClone(project), outputs: [...new Set([...(project.outputs ?? []), ...(project.detailImages ?? [])])], detailImages: [] } : blank(category, sortOrder));
  const [coverPreview, setCoverPreview] = useState('');
  const [coverLoadError, setCoverLoadError] = useState(false);
  const [coverPosition, setCoverPosition] = useState<CoverPosition | null>(null);
  const [initial] = useState(() => JSON.stringify(draft));
  const [categories, setCategories] = useState(defaultCategories);
  const [newCategory, setNewCategory] = useState<string | null>(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);
  const [draggedGalleryIndex, setDraggedGalleryIndex] = useState<number | null>(null);
  const [galleryDropIndex, setGalleryDropIndex] = useState<number | null>(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [categoryAttempt, setCategoryAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    fetchProjectCategories().then((items) => { if (active) { setCategories(items); setCategoryError(''); } }).catch((reason) => { if (active) setCategoryError(portfolioErrorMessage(reason, '대주제를 불러오지 못했습니다.')); });
    return () => { active = false; };
  }, [categoryAttempt]);
  useEffect(() => {
    setCoverLoadError(false);
  }, [coverPreview, draft.image]);
  useEffect(() => () => {
    if (coverPreview.startsWith('blob:')) URL.revokeObjectURL(coverPreview);
  }, [coverPreview]);
  const update = <K extends keyof PortfolioProject>(key: K, value: PortfolioProject[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const updateCaseStudy = <K extends keyof ProjectCaseStudy>(key: K, value: ProjectCaseStudy[K]) =>
    setDraft((current) => ({ ...current, caseStudy: { ...current.caseStudy, [key]: value } }));
  const close = () => { if (!busy && (initial === JSON.stringify(draft) || window.confirm('작성 중인 내용을 저장하지 않고 닫을까요?'))) onClose(); };
  const upload = async (event: ChangeEvent<HTMLInputElement>, cover: boolean) => {
    const files = Array.from(event.target.files ?? []); event.target.value = '';
    if (!files.length) return;
    if (cover && files.length !== 1) { setError('대표 이미지는 한 장만 선택해 주세요.'); return; }
    if (files.some((file) => !file.type.startsWith('image/') || file.size > 10 * 1024 * 1024)) { setError('이미지는 한 장당 10MB 이하로 선택해 주세요.'); return; }
    if (cover) {
      setCoverPosition(null);
      setCoverPreview(URL.createObjectURL(files[0]));
    }
    setBusy(cover ? 'cover' : 'gallery'); setError('');
    try {
      // Apply each successful upload immediately so a later failure cannot lose it.
      for (const file of files) {
        const url = await uploadPortfolioImage(file, cover ? 'project-cover' : 'project-gallery');
        setDraft((current) => cover ? { ...current, image: url, thumbnailUrl: undefined, thumbnailFit: 'cover', thumbnailPosition: '50% 50%' } : { ...current, outputs: [...(current.outputs ?? []), url] });
      }
    } catch (reason) { setError(portfolioErrorMessage(reason, '이미지를 업로드하지 못했습니다.')); }
    finally { if (cover) setCoverPreview(''); setBusy(''); }
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
  const coverSource = coverPreview || draft.image;
  const publicationToggle = <button type="button" onClick={() => update('isPublished', !isPublished)} disabled={Boolean(busy)} aria-label={isPublished ? '프로젝트 비공개로 전환' : '프로젝트 공개로 전환'} aria-pressed={isPublished} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${isPublished ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300'}`}>
    {isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
    {isPublished ? '공개' : '비공개'}
  </button>;
  return <EditorModal title={project ? '프로젝트 수정' : '프로젝트 추가'} headerActions={publicationToggle} onClose={close}>
    <form onSubmit={submit} className="space-y-8">
      <fieldset disabled={Boolean(busy)} className="space-y-8 disabled:opacity-70">
        <div className="space-y-3">
          <div className="relative flex min-h-56 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-cyan-300 bg-cyan-50/30">
            {coverSource && !coverLoadError ? <img src={coverSource} onError={() => setCoverLoadError(true)} alt="대표 이미지 미리보기" className="h-64 w-full" style={{ objectFit: draft.thumbnailFit ?? 'cover', objectPosition: draft.thumbnailPosition ?? 'center' }} /> : <><ImagePlus className="mb-3 h-9 w-9 text-cyan-600" /><span>{coverLoadError ? '이미지를 불러오지 못했습니다 · 다시 선택해 주세요' : '대표 이미지 추가 · 한 장'}</span></>}
            <div className="absolute bottom-3 flex flex-wrap justify-center gap-2 px-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-black/85 focus-within:ring-2 focus-within:ring-cyan-300">
                <ImagePlus className="h-4 w-4" />
                {coverSource && !coverLoadError ? (coverPreview ? '이미지 업로드 중…' : '대표 이미지 교체') : '대표 이미지 추가'}
                <input type="file" accept="image/*" aria-label="대표 이미지 한 장 선택" className="sr-only" onChange={(event) => void upload(event, true)} />
              </label>
              {coverSource && !coverLoadError && <button type="button" onClick={() => setCoverPosition(coverPositionFrom(draft))} className="inline-flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-black/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"><Move className="h-4 w-4" />대표 이미지 위치 조정</button>}
            </div>
          </div>
          {coverPosition && coverSource && <section aria-label="대표 이미지 위치 조정 패널" className="space-y-5 rounded-2xl border border-cyan-200 bg-cyan-50/60 p-4 dark:border-cyan-400/20 dark:bg-cyan-500/5 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div><h3 className="font-bold">대표 이미지 위치 조정</h3><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">실제 프로젝트 카드와 같은 비율로 미리 볼 수 있습니다.</p></div>
              <button type="button" onClick={() => setCoverPosition({ x: 50, y: 50, fit: 'cover' })} className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-white dark:hover:bg-white/10"><RotateCcw className="h-4 w-4" />초기화</button>
            </div>
            <div className="aspect-[8/5] w-full overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 shadow-inner">
              <img src={coverSource} alt="조정 중인 대표 이미지" className="h-full w-full" style={{ objectFit: coverPosition.fit, objectPosition: `${coverPosition.x}% ${coverPosition.y}%` }} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><span className="mb-2 block text-sm font-semibold">이미지 맞춤</span><div className="grid grid-cols-2 gap-2" role="group" aria-label="이미지 맞춤 방식">
                {([['cover', '영역 채우기'], ['contain', '전체 보기']] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={coverPosition.fit === value} onClick={() => setCoverPosition((current) => current && { ...current, fit: value })} className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${coverPosition.fit === value ? 'border-cyan-500 bg-cyan-500 text-white' : 'border-slate-200 bg-white text-gray-600 dark:border-white/15 dark:bg-white/5 dark:text-gray-300'}`}>{label}</button>)}
              </div></div>
              <div><span className="mb-2 block text-sm font-semibold">빠른 위치 선택</span><div className="grid w-fit grid-cols-3 gap-1" role="group" aria-label="대표 이미지 빠른 위치 선택">{[0, 50, 100].flatMap((y) => [0, 50, 100].map((x) => <button key={`${x}-${y}`} type="button" aria-label={`${x === 0 ? '왼쪽' : x === 100 ? '오른쪽' : '가운데'} ${y === 0 ? '위' : y === 100 ? '아래' : '중앙'}`} onClick={() => setCoverPosition((current) => current && { ...current, x, y })} className={`h-6 w-8 rounded border transition ${coverPosition.x === x && coverPosition.y === y ? 'border-cyan-500 bg-cyan-500' : 'border-slate-300 bg-white hover:border-cyan-400 dark:border-white/20 dark:bg-white/10'}`} />))}</div></div>
            </div>
            <label className="block"><span className="mb-2 flex justify-between text-sm font-semibold"><span>가로 위치</span><span className="font-normal text-gray-500">{Math.round(coverPosition.x)}%</span></span><input type="range" min="0" max="100" value={coverPosition.x} onChange={(event) => setCoverPosition((current) => current && { ...current, x: Number(event.target.value) })} aria-label="대표 이미지 가로 위치" className="w-full accent-cyan-500" /><span className="flex justify-between text-xs text-gray-400"><span>왼쪽</span><span>오른쪽</span></span></label>
            <label className="block"><span className="mb-2 flex justify-between text-sm font-semibold"><span>세로 위치</span><span className="font-normal text-gray-500">{Math.round(coverPosition.y)}%</span></span><input type="range" min="0" max="100" value={coverPosition.y} onChange={(event) => setCoverPosition((current) => current && { ...current, y: Number(event.target.value) })} aria-label="대표 이미지 세로 위치" className="w-full accent-cyan-500" /><span className="flex justify-between text-xs text-gray-400"><span>위</span><span>아래</span></span></label>
            <div className="flex justify-end gap-2"><button type="button" onClick={() => setCoverPosition(null)} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm dark:border-white/15 dark:bg-white/5">취소</button><button type="button" onClick={() => { update('thumbnailFit', coverPosition.fit); update('thumbnailPosition', `${coverPosition.x}% ${coverPosition.y}%`); setCoverPosition(null); }} className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white">위치 적용</button></div>
          </section>}
          {draft.image && <button type="button" onClick={() => { update('image', ''); update('thumbnailUrl', undefined); setCoverPosition(null); }} className="text-sm text-gray-500">대표 이미지 삭제</button>}
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
        <section className="space-y-4 rounded-2xl border border-violet-200 bg-violet-50/40 p-5 dark:border-violet-400/20 dark:bg-violet-500/5">
          <div><h3 className={heading}>Case Study Summary</h3><p className="text-sm text-gray-500">확인된 실제 정보만 입력하세요. 빈 항목은 상세 화면에 표시되지 않습니다.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {([
              ['period', '프로젝트 기간', '예: 2026.01 – 2026.03'],
              ['projectType', '프로젝트 형태', '예: 개인 프로젝트'],
              ['role', '담당', '예: 기획 · UI/UX · 프론트엔드'],
              ['contribution', '기여도', '예: 100%'],
              ['deploymentStatus', '배포 상태', '예: 실제 운영 중'],
              ['keyOutcome', '핵심 성과', '완성된 기능이나 해결한 문제'],
            ] as const).map(([key, label, placeholder]) => (
              <label key={key} className={key === 'role' || key === 'keyOutcome' ? 'sm:col-span-2' : ''}>
                <span className="mb-2 block text-sm font-semibold">{label}</span>
                <input className={field} value={draft.caseStudy?.[key] ?? ''} onChange={(event) => updateCaseStudy(key, event.target.value)} placeholder={placeholder} />
              </label>
            ))}
          </div>
          {([
            ['responsibilities', '나의 역할', '한 줄에 하나씩 입력하세요'],
            ['features', '핵심 기능', '한 줄에 하나씩 입력하세요'],
            ['decisions', '기술적·디자인적 의사결정', '한 줄에 하나씩 입력하세요'],
            ['results', '결과와 성과', '한 줄에 하나씩 입력하세요'],
          ] as const).map(([key, label, placeholder]) => (
            <label key={key} className="block"><span className="mb-2 block text-sm font-semibold">{label}</span><textarea className={`${field} min-h-24`} value={(draft.caseStudy?.[key] ?? []).join('\n')} onChange={(event) => updateCaseStudy(key, event.target.value.split('\n').map((item) => item.trim()).filter(Boolean))} placeholder={placeholder} /></label>
          ))}
          <label className="block"><span className="mb-2 block text-sm font-semibold">회고와 다음 개선 사항</span><textarea className={`${field} min-h-28`} value={draft.caseStudy?.retrospective ?? ''} onChange={(event) => updateCaseStudy('retrospective', event.target.value)} /></label>
        </section>
        <label className="block"><span className={heading}>프로젝트 배경과 문제</span><textarea className={`${field} min-h-32`} value={draft.overview} onChange={(event) => update('overview', event.target.value)} /></label>
        <label className="block"><span className={heading}>Goal</span><textarea className={`${field} min-h-28`} value={draft.goal} onChange={(event) => update('goal', event.target.value)} /></label>
        <section>
          <h3 className={heading}>Project Gallery</h3>
          <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">이미지를 클릭해 선택한 뒤, 원하는 위치로 드래그해 놓으세요.</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {(draft.outputs ?? []).map((url, index) => {
              const selected = selectedGalleryIndex === index;
              const isDragged = draggedGalleryIndex === index;
              const isDropTarget = galleryDropIndex === index && draggedGalleryIndex !== index;
              return (
                <div
                  key={`${url}-${index}`}
                  draggable
                  onDragStart={(event) => {
                    setSelectedGalleryIndex(index);
                    setDraggedGalleryIndex(index);
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text/plain', String(index));
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = 'move';
                    setGalleryDropIndex(index);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    const from = Number(event.dataTransfer.getData('text/plain'));
                    if (Number.isInteger(from) && from !== index) {
                      update('outputs', moveGalleryImage(draft.outputs ?? [], from, index));
                      setSelectedGalleryIndex(index);
                    }
                    setDraggedGalleryIndex(null);
                    setGalleryDropIndex(null);
                  }}
                  onDragEnd={() => {
                    setDraggedGalleryIndex(null);
                    setGalleryDropIndex(null);
                  }}
                  className={`relative overflow-hidden rounded-lg bg-gray-100 transition dark:bg-slate-800 ${selected ? 'ring-4 ring-cyan-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900' : ''} ${isDropTarget ? 'outline outline-4 outline-dashed outline-amber-400' : ''} ${isDragged ? 'cursor-grabbing opacity-40' : 'cursor-grab'}`}
                >
                  <button
                    type="button"
                    aria-label={`프로젝트 이미지 ${index + 1}${selected ? ' 선택됨' : ' 선택'}`}
                    aria-pressed={selected}
                    className="block w-full"
                    onClick={() => setSelectedGalleryIndex(index)}
                  >
                    <img draggable={false} src={url} alt={`프로젝트 이미지 ${index + 1}`} className="h-40 w-full object-contain" />
                  </button>
                  {selected && <span className="absolute bottom-2 left-2 rounded-full bg-cyan-600 px-2 py-1 text-xs font-semibold text-white">선택됨 · {index + 1}번째</span>}
                  <div className="absolute right-2 top-2">
                    <button
                      type="button"
                      aria-label={`프로젝트 이미지 ${index + 1} 삭제`}
                      className="rounded-full bg-white p-2 text-red-600 shadow"
                      onClick={() => {
                        update('outputs', draft.outputs?.filter((_, position) => position !== index));
                        setSelectedGalleryIndex(null);
                      }}
                    ><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              );
            })}
            <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-cyan-300 text-sm text-cyan-600"><ImagePlus />이미지 여러 장 추가<input type="file" multiple accept="image/*" aria-label="프로젝트 이미지 여러 장 선택" className="sr-only" onChange={(event) => void upload(event, false)} /></label>
          </div>
        </section>
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
