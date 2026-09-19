import { useEffect, useState, type ChangeEvent } from 'react';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  LogOut,
  Plus,
  Save,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { ADMIN_USERNAME } from '../../lib/adminCredentials';
import { defaultSiteContent, defaultSkillGroups } from '../../lib/defaultPortfolio';
import {
  deleteProject,
  defaultCategories,
  fetchProjectCategories,
  addProjectCategory,
  fetchAdminEmail,
  fetchAdminProjects,
  fetchSiteContent,
  fetchSkillGroups,
  saveProject,
  saveSiteContent,
  saveSkillGroups,
  uploadPortfolioImage,
} from '../../lib/portfolioApi';
import { supabase } from '../../lib/supabase';
import type {
  AboutHighlight,
  ContactItem,
  PortfolioProject,
  ProjectCategory,
  SiteContent,
  SkillGroup,
  SkillIconName,
  ThumbnailFit,
} from '../../types/portfolio';
import TagInput from './TagInput';

type AdminTab = 'projects' | 'content' | 'skills';

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-cyan-500/20';

const labelClass = 'mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200';

const skillIconOptions: SkillIconName[] = ['GitBranch', 'Database', 'Code2', 'Palette'];
const skillColorOptions = [
  'from-green-500 to-emerald-500',
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-amber-500 to-rose-500',
];

const linesToArray = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

const makeBlankProject = (): PortfolioProject => ({
  id: crypto.randomUUID(),
  title: '',
  shortDesc: '',
  description: '',
  image: '',
  thumbnailFit: 'cover',
  thumbnailPosition: 'center',
  category: 'personal',
  stack: [],
  overview: '',
  goal: '',
  difficulties: [],
  outputs: [],
  detailImages: [],
  fullPageImages: [],
  challengeImages: [],
  projectLinks: [],
  link: '',
  github: '',
  isPublished: true,
  sortOrder: 0,
});

interface AdminDashboardProps {
  onExit: () => void;
  startWithNewProject?: boolean;
}

const AdminDashboard = ({ onExit, startWithNewProject = false }: AdminDashboardProps) => {
  const [categoryOptions, setCategoryOptions] = useState(defaultCategories);
  const [categoryName, setCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [categoryBusy, setCategoryBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [projectDraft, setProjectDraft] = useState<PortfolioProject>(makeBlankProject);
  const [contentDraft, setContentDraft] = useState<SiteContent>(defaultSiteContent);
  const [skillDrafts, setSkillDrafts] = useState<SkillGroup[]>(defaultSkillGroups);
  const [statusMessage, setStatusMessage] = useState('');
  const [loadError, setLoadError] = useState('');
  const [uploadingTarget, setUploadingTarget] = useState('');
  const [savingTarget, setSavingTarget] = useState('');

  useEffect(() => {
    const loadAdminData = async () => {
      setIsChecking(true);
      setIsLoading(true);
      setLoadError('');

      try {
        const email = await fetchAdminEmail();
        setAdminEmail(email);
        setIsChecking(false);

        if (!email) return;

        const [nextProjects, nextContent, nextSkills, nextCategories] = await Promise.all([
          fetchAdminProjects(),
          fetchSiteContent(),
          fetchSkillGroups(),
          fetchProjectCategories(),
        ]);

        setCategoryOptions(nextCategories);
        setProjects(nextProjects);
        if (startWithNewProject) {
          setProjectDraft(makeBlankProject());
        } else if (nextProjects[0]) {
          setProjectDraft(nextProjects[0]);
        }
        if (nextContent) setContentDraft({ ...defaultSiteContent, ...nextContent });
        if (nextSkills.length > 0) setSkillDrafts(nextSkills);
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : '관리자 데이터를 불러오지 못했어요.');
      } finally {
        setIsChecking(false);
        setIsLoading(false);
      }
    };

    void loadAdminData();
  }, [startWithNewProject]);

  const updateProjectDraft = <Key extends keyof PortfolioProject>(
    key: Key,
    value: PortfolioProject[Key],
  ) => {
    setProjectDraft((current) => ({ ...current, [key]: value }));
  };

  const updateContentDraft = <Key extends keyof SiteContent>(key: Key, value: SiteContent[Key]) => {
    setContentDraft((current) => ({ ...current, [key]: value }));
  };

  const refreshProjects = async () => {
    const nextProjects = await fetchAdminProjects();
    setProjects(nextProjects);
    return nextProjects;
  };

  const handleSaveProject = async () => {
    if (!projectDraft.title.trim() || !projectDraft.image.trim()) {
      setStatusMessage('프로젝트 제목과 대표 이미지를 입력해 주세요.');
      return;
    }
    setSavingTarget('project');
    setStatusMessage('');

    try {
      await saveProject({ ...projectDraft, difficulties: projectDraft.difficulties.map((item) => item.trim()).filter(Boolean) });
      const nextProjects = await refreshProjects();
      setProjectDraft(nextProjects.find((project) => project.id === projectDraft.id) ?? projectDraft);
      setStatusMessage('프로젝트가 저장됐어요.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : '프로젝트 저장에 실패했어요.');
    } finally {
      setSavingTarget('');
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('이 프로젝트를 삭제할까요?')) return;

    setSavingTarget('project');
    setStatusMessage('');

    try {
      await deleteProject(projectDraft.id);
      const nextProjects = await refreshProjects();
      setProjectDraft(nextProjects[0] ?? makeBlankProject());
      setStatusMessage('프로젝트가 삭제됐어요.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : '프로젝트 삭제에 실패했어요.');
    } finally {
      setSavingTarget('');
    }
  };

  const handleSaveContent = async () => {
    setSavingTarget('content');
    setStatusMessage('');

    try {
      await saveSiteContent(contentDraft);
      setStatusMessage('인트로, ABOUT, 연락처 문구가 저장됐어요.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : '콘텐츠 저장에 실패했어요.');
    } finally {
      setSavingTarget('');
    }
  };

  const handleSaveSkills = async () => {
    setSavingTarget('skills');
    setStatusMessage('');

    try {
      await saveSkillGroups(skillDrafts);
      setStatusMessage('스킬과 툴이 저장됐어요.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : '스킬 저장에 실패했어요.');
    } finally {
      setSavingTarget('');
    }
  };

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    folder: string,
    onUploaded: (urls: string[]) => void,
  ) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setUploadingTarget(folder);
    setStatusMessage('');

    try {
      const urls = await Promise.all(files.map((file) => uploadPortfolioImage(file, folder)));
      onUploaded(urls);
      setStatusMessage('이미지가 업로드됐어요.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : '이미지 업로드에 실패했어요.');
    } finally {
      setUploadingTarget('');
      event.target.value = '';
    }
  };

  const handleSignOut = async () => {
    await supabase?.auth.signOut();
    onExit();
  };

  const updateHighlight = (index: number, nextHighlight: AboutHighlight) => {
    updateContentDraft(
      'aboutHighlights',
      contentDraft.aboutHighlights.map((highlight, currentIndex) =>
        currentIndex === index ? nextHighlight : highlight,
      ),
    );
  };

  const updateContactItem = (index: number, nextItem: ContactItem) => {
    updateContentDraft(
      'contactItems',
      contentDraft.contactItems.map((item, currentIndex) =>
        currentIndex === index ? nextItem : item,
      ),
    );
  };

  const updateSkillGroup = (index: number, nextGroup: SkillGroup) => {
    setSkillDrafts((current) =>
      current.map((group, currentIndex) => (currentIndex === index ? nextGroup : group)),
    );
  };

  if (isChecking || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="mr-3 h-6 w-6 animate-spin text-cyan-300" />
        관리자 화면을 준비하고 있어요
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="max-w-lg rounded-2xl border border-red-400/20 bg-white/5 p-8 text-center">
          <h2 className="text-2xl font-bold">관리자 데이터를 불러오지 못했어요</h2>
          <p className="mt-3 break-words text-sm text-red-200">{loadError}</p>
          <button
            type="button"
            onClick={onExit}
            className="mt-6 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950"
          >
            포트폴리오로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!adminEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <h2 className="text-2xl font-bold">관리자 권한이 없어요</h2>
          <p className="mt-3 text-sm text-gray-300">
            Supabase Auth 내부 관리자 계정으로 로그인해야 편집할 수 있습니다.
          </p>
          <button
            type="button"
            onClick={onExit}
            className="mt-6 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950"
          >
            포트폴리오로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-gray-900 dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-500">
              Portfolio Admin
            </p>
            <h1 className="mt-1 text-2xl font-bold">Yunji 관리자 페이지</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              관리자 ID: {ADMIN_USERNAME}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onExit}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold dark:border-white/10 dark:bg-white/5"
            >
              <ArrowLeft className="h-4 w-4" />
              보기
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
            >
              <LogOut className="h-4 w-4" />
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[220px_1fr] lg:px-8">
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-white/5">
          {[
            { id: 'projects', label: '프로젝트' },
            { id: 'content', label: '인트로 & ABOUT' },
            { id: 'skills', label: 'Skills & Tools' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`w-full rounded-lg px-4 py-3 text-left text-sm font-semibold ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-white'
                  : 'text-gray-600 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        <section className="space-y-6">
          {statusMessage && (
            <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-800 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-200">
              {statusMessage}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
              <div className="h-fit rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                <button
                  type="button"
                  onClick={() => setProjectDraft(makeBlankProject())}
                  className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-3 text-sm font-semibold text-white"
                >
                  <Plus className="h-4 w-4" />
                  새 프로젝트 추가
                </button>

                <div className="space-y-2">
                  {projects.length === 0 && (
                    <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-gray-500 dark:bg-white/5 dark:text-gray-400">
                      아직 Supabase에 저장된 프로젝트가 없어요.
                    </p>
                  )}
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => setProjectDraft(project)}
                      className={`w-full rounded-lg px-4 py-3 text-left ${
                        projectDraft.id === project.id
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                          : 'bg-slate-50 text-gray-700 hover:bg-slate-100 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10'
                      }`}
                    >
                      <span className="block text-sm font-bold">{project.title || '제목 없음'}</span>
                      <span className="mt-1 flex items-center gap-1 text-xs opacity-70">
                        {project.isPublished ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {categoryOptions.find((item) => item.value === project.category)?.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 lg:p-6">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold">프로젝트 편집</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      제목, 이미지, 분류, 문구, 갤러리, 스택 태그를 관리합니다.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleDeleteProject}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      삭제
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProject}
                      disabled={savingTarget === 'project' || Boolean(uploadingTarget) || Boolean(loadError)}
                      className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      저장
                    </button>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className={labelClass}>프로젝트 제목</span>
                    <input
                      value={projectDraft.title}
                      onChange={(event) => updateProjectDraft('title', event.target.value)}
                      className={inputClass}
                      placeholder="예: DayTime"
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>대주제</span>
                    <div className="flex items-center gap-2">
                    <select
                      value={projectDraft.category}
                      onChange={(event) =>
                        updateProjectDraft('category', event.target.value as ProjectCategory)
                      }
                      className={inputClass}
                    >
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button type="button" aria-label="대주제 추가" className="shrink-0 rounded-lg border px-4 py-3" onClick={() => setAddingCategory(!addingCategory)}>+</button>
                    </div>
                  </label>
                  {addingCategory && <div className="md:col-span-2 flex gap-2">
                    <input aria-label="새 대주제 이름" className={inputClass} value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="새 대주제 이름" />
                    <button type="button" disabled={categoryBusy || !categoryName.trim()} className="shrink-0 rounded-lg bg-cyan-500 px-4 text-white disabled:opacity-50" onClick={async () => {
                      setCategoryBusy(true);
                      try {
                        const existing = categoryOptions.find((item) => item.label.toLowerCase() === categoryName.trim().toLowerCase());
                        const category = existing ?? await addProjectCategory(categoryName);
                        if (!existing) setCategoryOptions((items) => [...items, category]);
                        updateProjectDraft('category', category.value);
                        setCategoryName(''); setAddingCategory(false);
                      } catch { setStatusMessage('대주제를 저장하지 못했습니다. 같은 이름이 있는지, 연결 상태와 데이터베이스 설정을 확인해 주세요.'); }
                      finally { setCategoryBusy(false); }
                    }}>대주제 저장</button>
                  </div>}
                  <label className="block">
                    <span className={labelClass}>짧은 설명</span>
                    <input
                      value={projectDraft.shortDesc}
                      onChange={(event) => updateProjectDraft('shortDesc', event.target.value)}
                      className={inputClass}
                      placeholder="카드에 보일 한 줄 설명"
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>정렬 순서</span>
                    <input
                      type="number"
                      value={projectDraft.sortOrder ?? 0}
                      onChange={(event) => updateProjectDraft('sortOrder', Number(event.target.value))}
                      className={inputClass}
                    />
                  </label>
                  <label className="md:col-span-2">
                    <span className={labelClass}>상세 설명</span>
                    <input
                      value={projectDraft.description}
                      onChange={(event) => updateProjectDraft('description', event.target.value)}
                      className={inputClass}
                      placeholder="모달이나 검색용으로 남길 설명"
                    />
                  </label>
                  <label className="md:col-span-2">
                    <span className={labelClass}>대표 이미지 URL</span>
                    <input
                      value={projectDraft.image}
                      onChange={(event) => updateProjectDraft('image', event.target.value)}
                      className={inputClass}
                      placeholder="업로드하거나 이미지 URL을 붙여넣으세요"
                    />
                  </label>
                  <div className="md:col-span-2">
                    <span className={labelClass}>대표 이미지 업로드</span>
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-cyan-300 bg-cyan-50 px-4 py-4 text-sm font-semibold text-cyan-700 dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-200">
                      {uploadingTarget === 'project-cover' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ImagePlus className="h-4 w-4" />
                      )}
                      대표 이미지 선택
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) =>
                          void handleImageUpload(event, 'project-cover', ([url]) => {
                            if (url) updateProjectDraft('image', url);
                          })
                        }
                      />
                    </label>
                  </div>
                  <label>
                    <span className={labelClass}>이미지 맞춤</span>
                    <select
                      value={projectDraft.thumbnailFit ?? 'cover'}
                      onChange={(event) =>
                        updateProjectDraft('thumbnailFit', event.target.value as ThumbnailFit)
                      }
                      className={inputClass}
                    >
                      <option value="cover">cover</option>
                      <option value="contain">contain</option>
                    </select>
                  </label>
                  <label>
                    <span className={labelClass}>이미지 위치</span>
                    <input
                      value={projectDraft.thumbnailPosition ?? 'center'}
                      onChange={(event) =>
                        updateProjectDraft('thumbnailPosition', event.target.value)
                      }
                      className={inputClass}
                      placeholder="center 또는 center 8%"
                    />
                  </label>
                  <label>
                    <span className={labelClass}>배포 링크</span>
                    <input
                      value={projectDraft.link ?? ''}
                      onChange={(event) => updateProjectDraft('link', event.target.value)}
                      className={inputClass}
                      placeholder="https://..."
                    />
                  </label>
                  <label>
                    <span className={labelClass}>GitHub 링크</span>
                    <input
                      value={projectDraft.github ?? ''}
                      onChange={(event) => updateProjectDraft('github', event.target.value)}
                      className={inputClass}
                      placeholder="https://github.com/..."
                    />
                  </label>
                  <label className="md:col-span-2">
                    <span className={labelClass}>프로젝트 개요</span>
                    <textarea
                      value={projectDraft.overview}
                      onChange={(event) => updateProjectDraft('overview', event.target.value)}
                      className={`${inputClass} min-h-28 resize-y`}
                    />
                  </label>
                  <label className="md:col-span-2">
                    <span className={labelClass}>프로젝트 목표</span>
                    <textarea
                      value={projectDraft.goal}
                      onChange={(event) => updateProjectDraft('goal', event.target.value)}
                      className={`${inputClass} min-h-28 resize-y`}
                    />
                  </label>
                  <div className="md:col-span-2">
                    <TagInput
                      label="스킬"
                      hashtags
                      value={projectDraft.stack}
                      onChange={(nextValue) => updateProjectDraft('stack', nextValue)}
                      placeholder="#React #TypeScript 입력 후 Enter 또는 공백"
                    />
                  </div>
                  <label className="md:col-span-2">
                    <span className={labelClass}>어려웠던 점 & 해결 방법</span>
                    <textarea
                      value={(projectDraft.difficulties ?? []).join('\n')}
                      onChange={(event) =>
                        updateProjectDraft('difficulties', event.target.value.split('\n'))
                      }
                      className={`${inputClass} min-h-32 resize-y`}
                      placeholder="한 줄에 하나씩 입력하세요"
                    />
                  </label>
                  <div className="md:col-span-2 space-y-4">
                    <span className={labelClass}>중주제</span>
                    {(projectDraft.sections ?? []).map((section, index) => (
                      <div key={section.id} className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-white/10">
                        <input aria-label={`중주제 ${index + 1} 제목`} placeholder="중주제 제목" className={inputClass} value={section.title} onChange={(event) => updateProjectDraft('sections', projectDraft.sections?.map((item) => item.id === section.id ? { ...item, title: event.target.value } : item))} />
                        <textarea aria-label={`중주제 ${index + 1} 내용`} placeholder="내용" className={`${inputClass} min-h-28`} value={section.content} onChange={(event) => updateProjectDraft('sections', projectDraft.sections?.map((item) => item.id === section.id ? { ...item, content: event.target.value } : item))} />
                        <button type="button" className="text-sm text-red-500" onClick={() => updateProjectDraft('sections', projectDraft.sections?.filter((item) => item.id !== section.id))}>중주제 삭제</button>
                      </div>
                    ))}
                    <button type="button" className="rounded-lg border border-dashed border-cyan-400 px-4 py-3 text-sm text-cyan-600" onClick={() => updateProjectDraft('sections', [...(projectDraft.sections ?? []), { id: crypto.randomUUID(), title: '', content: '' }])}>+ 중주제 추가하기</button>
                  </div>
                  <div className="md:col-span-2">
                    <span className={labelClass}>상세 이미지 업로드</span>
                    <input aria-label="상세 이미지 업로드" type="file" accept="image/*" multiple disabled={Boolean(uploadingTarget)} className={inputClass} onChange={(event) => void handleImageUpload(event, 'project-details', (urls) => setProjectDraft((current) => ({ ...current, detailImages: [...(current.detailImages ?? []), ...urls] })))} />
                  </div>
                  <div className="md:col-span-2">
                    <span className={labelClass}>프로젝트 갤러리 이미지 업로드</span>
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm font-semibold text-gray-700 dark:border-white/20 dark:bg-white/5 dark:text-gray-200">
                      {uploadingTarget === 'project-gallery' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UploadCloud className="h-4 w-4" />
                      )}
                      갤러리 이미지 여러 장 선택
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(event) =>
                          void handleImageUpload(event, 'project-gallery', (urls) =>
                            updateProjectDraft('outputs', [...(projectDraft.outputs ?? []), ...urls]),
                          )
                        }
                      />
                    </label>
                  </div>
                  <div className="md:col-span-2">
                    <TagInput
                      label="프로젝트 갤러리 이미지 URL"
                      value={projectDraft.outputs ?? []}
                      onChange={(nextValue) => updateProjectDraft('outputs', nextValue)}
                      placeholder="이미지 URL 입력 후 Enter"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <TagInput
                      label="문제 해결 이미지 URL"
                      value={projectDraft.challengeImages ?? []}
                      onChange={(nextValue) => updateProjectDraft('challengeImages', nextValue)}
                      placeholder="이미지 URL 입력 후 Enter"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <TagInput
                      label="상세 이미지 URL"
                      value={projectDraft.detailImages ?? []}
                      onChange={(nextValue) => updateProjectDraft('detailImages', nextValue)}
                      placeholder="이미지 URL 입력 후 Enter"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <TagInput
                      label="세로 긴 이미지 URL"
                      value={projectDraft.fullPageImages ?? []}
                      onChange={(nextValue) => updateProjectDraft('fullPageImages', nextValue)}
                      placeholder="이미지 URL 입력 후 Enter"
                    />
                  </div>
                  <label className="inline-flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3 text-sm font-semibold dark:bg-white/5">
                    <input
                      type="checkbox"
                      checked={projectDraft.isPublished ?? true}
                      onChange={(event) => updateProjectDraft('isPublished', event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-cyan-500"
                    />
                    포트폴리오에 공개
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 lg:p-6">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold">인트로 & ABOUT & 연락처</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    첫 화면, 소개 문구, 하단 커넥트 영역을 수정합니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveContent}
                  disabled={savingTarget === 'content'}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  저장
                </button>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label>
                  <span className={labelClass}>인트로 인사</span>
                  <input
                    value={contentDraft.heroGreeting}
                    onChange={(event) => updateContentDraft('heroGreeting', event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label>
                  <span className={labelClass}>인트로 이름</span>
                  <input
                    value={contentDraft.heroName}
                    onChange={(event) => updateContentDraft('heroName', event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="md:col-span-2">
                  <span className={labelClass}>인트로 문구</span>
                  <textarea
                    value={contentDraft.heroDescription}
                    onChange={(event) => updateContentDraft('heroDescription', event.target.value)}
                    className={`${inputClass} min-h-24 resize-y`}
                  />
                </label>
                <label className="md:col-span-2">
                  <span className={labelClass}>인트로 이미지 URL</span>
                  <input
                    value={contentDraft.heroAvatarUrl ?? ''}
                    onChange={(event) => updateContentDraft('heroAvatarUrl', event.target.value)}
                    className={inputClass}
                  />
                </label>
                <div className="md:col-span-2">
                  <span className={labelClass}>인트로 이미지 업로드</span>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-cyan-300 bg-cyan-50 px-4 py-4 text-sm font-semibold text-cyan-700 dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-200">
                    {uploadingTarget === 'profile' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImagePlus className="h-4 w-4" />
                    )}
                    인트로 이미지 선택
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) =>
                        void handleImageUpload(event, 'profile', ([url]) => {
                          if (url) updateContentDraft('heroAvatarUrl', url);
                        })
                      }
                    />
                  </label>
                </div>
                <label className="md:col-span-2">
                  <span className={labelClass}>ABOUT 문구</span>
                  <textarea
                    value={contentDraft.aboutParagraphs.join('\n')}
                    onChange={(event) =>
                      updateContentDraft('aboutParagraphs', linesToArray(event.target.value))
                    }
                    className={`${inputClass} min-h-40 resize-y`}
                    placeholder="한 줄에 문단 하나씩 입력하세요"
                  />
                </label>
                <label className="md:col-span-2">
                  <span className={labelClass}>ABOUT 하단 문구</span>
                  <input
                    value={contentDraft.aboutCtaText}
                    onChange={(event) => updateContentDraft('aboutCtaText', event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="md:col-span-2">
                  <span className={labelClass}>Skills 하단 문구</span>
                  <input
                    value={contentDraft.skillsFooter}
                    onChange={(event) => updateContentDraft('skillsFooter', event.target.value)}
                    className={inputClass}
                  />
                </label>
                {contentDraft.aboutHighlights.map((highlight, index) => (
                  <div
                    key={`${highlight.title}-${index}`}
                    className="rounded-xl border border-slate-200 p-4 dark:border-white/10"
                  >
                    <p className="mb-3 text-sm font-bold">ABOUT 카드 {index + 1}</p>
                    <div className="space-y-3">
                      <select
                        value={highlight.iconName}
                        onChange={(event) =>
                          updateHighlight(index, {
                            ...highlight,
                            iconName: event.target.value as AboutHighlight['iconName'],
                          })
                        }
                        className={inputClass}
                      >
                        <option value="Users">Users</option>
                        <option value="Zap">Zap</option>
                        <option value="CheckCircle2">CheckCircle2</option>
                      </select>
                      <input
                        value={highlight.title}
                        onChange={(event) =>
                          updateHighlight(index, { ...highlight, title: event.target.value })
                        }
                        className={inputClass}
                        placeholder="카드 제목"
                      />
                      <input
                        value={highlight.description}
                        onChange={(event) =>
                          updateHighlight(index, { ...highlight, description: event.target.value })
                        }
                        className={inputClass}
                        placeholder="카드 설명"
                      />
                    </div>
                  </div>
                ))}
                <label className="md:col-span-2">
                  <span className={labelClass}>연락처 제목</span>
                  <input
                    value={contentDraft.contactTitle}
                    onChange={(event) => updateContentDraft('contactTitle', event.target.value)}
                    className={inputClass}
                  />
                </label>
                {contentDraft.contactItems.map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="rounded-xl border border-slate-200 p-4 dark:border-white/10"
                  >
                    <p className="mb-3 text-sm font-bold">연락처 {index + 1}</p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <input
                        value={item.label}
                        onChange={(event) =>
                          updateContactItem(index, { ...item, label: event.target.value })
                        }
                        className={inputClass}
                        placeholder="Email"
                      />
                      <input
                        value={item.value}
                        onChange={(event) =>
                          updateContactItem(index, { ...item, value: event.target.value })
                        }
                        className={inputClass}
                        placeholder="보이는 값"
                      />
                      <input
                        value={item.url ?? ''}
                        onChange={(event) =>
                          updateContactItem(index, { ...item, url: event.target.value })
                        }
                        className={inputClass}
                        placeholder="mailto: 또는 https://"
                      />
                    </div>
                  </div>
                ))}
                <label className="md:col-span-2">
                  <span className={labelClass}>Thank You 문구</span>
                  <input
                    value={contentDraft.thankYouText}
                    onChange={(event) => updateContentDraft('thankYouText', event.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 lg:p-6">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold">Skills & Tools 편집</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    각 그룹의 스택을 Enter 태그 입력으로 관리합니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSkills}
                  disabled={savingTarget === 'skills'}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  저장
                </button>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                {skillDrafts.map((group, index) => (
                  <div
                    key={group.id}
                    className="rounded-xl border border-slate-200 p-4 dark:border-white/10"
                  >
                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                      <label>
                        <span className={labelClass}>그룹 이름</span>
                        <input
                          value={group.category}
                          onChange={(event) =>
                            updateSkillGroup(index, { ...group, category: event.target.value })
                          }
                          className={inputClass}
                        />
                      </label>
                      <label>
                        <span className={labelClass}>아이콘</span>
                        <select
                          value={group.iconName}
                          onChange={(event) =>
                            updateSkillGroup(index, {
                              ...group,
                              iconName: event.target.value as SkillIconName,
                            })
                          }
                          className={inputClass}
                        >
                          {skillIconOptions.map((icon) => (
                            <option key={icon} value={icon}>
                              {icon}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="sm:col-span-2">
                        <span className={labelClass}>컬러</span>
                        <select
                          value={group.color}
                          onChange={(event) =>
                            updateSkillGroup(index, { ...group, color: event.target.value })
                          }
                          className={inputClass}
                        >
                          {skillColorOptions.map((color) => (
                            <option key={color} value={color}>
                              {color}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <TagInput
                      label="스킬"
                      hashtags
                      value={group.items}
                      onChange={(items) => updateSkillGroup(index, { ...group, items })}
                      placeholder="새 스택 입력 후 Enter"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
