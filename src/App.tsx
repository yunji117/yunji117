import { useEffect, useRef, useState } from 'react';
import { useThemeStore } from './store/themeStore';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skill from './components/Skill';
import ProjectSection from './components/ProjectSection';
import Contact from './components/Contact';
import SectionEditorModal, { type EditableSection } from './components/admin/SectionEditorModal';
import AdminLogin from './components/admin/AdminLogin';
import AdminAccess from './components/admin/AdminAccess';
import { initialAuthState, observePortfolioAuth } from './lib/portfolioAuth';
import { supabase } from './lib/supabase';

function App() {
  const { theme } = useThemeStore();
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(() => sessionStorage.getItem('portfolio-admin-view') !== 'false');
  const [editingSection, setEditingSection] = useState<EditableSection | null>(null);
  const [contentRevision, setContentRevision] = useState(0);
  const [auth, setAuth] = useState(initialAuthState);
  const authController = useRef<ReturnType<typeof observePortfolioAuth> | null>(null);
  const [signOutError, setSignOutError] = useState('');
  const [signingOut, setSigningOut] = useState(false);
  const isAdmin = auth.phase === 'admin';
  const canEdit = isAdmin && isAdminView;

  const handleSignOut = async () => {
    if (!supabase) return;
    setSigningOut(true);
    setSignOutError('');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsAdminView(false);
      setIsAdminLoginOpen(true);
    } catch {
      setSignOutError('로그아웃하지 못했습니다. 연결 상태를 확인하고 다시 시도해 주세요.');
    } finally {
      setSigningOut(false);
    }
  };

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (!supabase) {
      setAuth({ session: null, phase: 'signed-out', message: '' });
      return;
    }
    const controller = observePortfolioAuth(supabase, setAuth);
    authController.current = controller;
    return () => controller.dispose();
  }, []);

  useEffect(() => {
    if (auth.phase === 'signed-out') setIsAdminView(false);
    if (auth.phase === 'admin' && sessionStorage.getItem('portfolio-open-admin') === 'true') {
      sessionStorage.removeItem('portfolio-open-admin');
      // Show editing controls on the portfolio after Google sign-in.
      setIsAdminView(true);
      setIsAdminLoginOpen(false);
    }
  }, [auth.phase]);

  useEffect(() => {
    sessionStorage.setItem('portfolio-admin-view', String(isAdminView));
  }, [isAdminView]);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header
        isAdmin={isAdmin}
        onOpenAdmin={() => {
          setIsAdminView(true);
        }}
      />
      <main className="pt-20">
        {canEdit && <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 rounded-xl bg-cyan-50 px-6 py-3 text-sm text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200"><span>관리자 모드 · 연필로 수정하고 프로젝트를 길게 눌러 순서를 바꾸세요.</span><button onClick={() => setIsAdminView(false)} className="underline">방문자 화면 보기</button></div>}
        <Hero revision={contentRevision} onEdit={canEdit ? () => setEditingSection('hero') : undefined} />
        <About revision={contentRevision} onEdit={canEdit ? () => setEditingSection('about') : undefined} />
        <Skill revision={contentRevision} onEdit={canEdit ? () => setEditingSection('skills') : undefined} />
        <ProjectSection isAdmin={canEdit} />
        <Contact
          revision={contentRevision}
          onEdit={canEdit ? () => setEditingSection('contact') : undefined}
          isAuthenticated={Boolean(auth.session)}
          onOpenAdmin={() => setIsAdminLoginOpen(true)}
        />
      </main>
      {canEdit && editingSection && <SectionEditorModal section={editingSection} onClose={() => setEditingSection(null)} onSaved={() => { setEditingSection(null); setContentRevision((value) => value + 1); }} />}
      {isAdminLoginOpen && (auth.phase === 'signed-out'
        ? <AdminLogin onClose={() => setIsAdminLoginOpen(false)} />
        : <AdminAccess
            auth={auth}
            onClose={() => setIsAdminLoginOpen(false)}
            onRetry={() => authController.current?.retry()}
            onOpenAdmin={() => { setIsAdminLoginOpen(false); setIsAdminView(true); }}
            onSignOut={handleSignOut}
            signOutError={signOutError}
            signingOut={signingOut}
          />)}
    </div>
  );
}

export default App;
