import { useEffect, useRef, useState } from 'react';
import { useThemeStore } from './store/themeStore';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skill from './components/Skill';
import ProjectSection from './components/ProjectSection';
import Contact from './components/Contact';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import AdminAccess from './components/admin/AdminAccess';
import { initialAuthState, observePortfolioAuth } from './lib/portfolioAuth';
import { supabase } from './lib/supabase';

function App() {
  const { theme } = useThemeStore();
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(() => sessionStorage.getItem('portfolio-admin-view') === 'true');
  const [startNewProject, setStartNewProject] = useState(false);
  const [auth, setAuth] = useState(initialAuthState);
  const authController = useRef<ReturnType<typeof observePortfolioAuth> | null>(null);
  const [signOutError, setSignOutError] = useState('');
  const [signingOut, setSigningOut] = useState(false);
  const isAdmin = auth.phase === 'admin';

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
      // Return to the portfolio with the add card visible after Google sign-in.
      setIsAdminView(false);
      setIsAdminLoginOpen(false);
    }
  }, [auth.phase]);

  useEffect(() => {
    sessionStorage.setItem('portfolio-admin-view', String(isAdminView));
  }, [isAdminView]);

  if (isAdmin && isAdminView) {
    return (
      <AdminDashboard
        startWithNewProject={startNewProject}
        onExit={() => {
          setStartNewProject(false);
          setIsAdminView(false);
        }}
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header
        isAdmin={isAdmin}
        onOpenAdmin={() => {
          setStartNewProject(false);
          setIsAdminView(true);
        }}
      />
      <main className="pt-20">
        <Hero />
        <About />
        <Skill />
        <ProjectSection
          isAdmin={isAdmin}
          onCreateProject={() => {
            setStartNewProject(true);
            setIsAdminView(true);
          }}
        />
        <Contact
          isAuthenticated={Boolean(auth.session)}
          onOpenAdmin={() => setIsAdminLoginOpen(true)}
        />
      </main>
      {isAdminLoginOpen && (auth.phase === 'signed-out'
        ? <AdminLogin onClose={() => setIsAdminLoginOpen(false)} />
        : <AdminAccess
            auth={auth}
            onClose={() => setIsAdminLoginOpen(false)}
            onRetry={() => authController.current?.retry()}
            onOpenAdmin={() => { setIsAdminLoginOpen(false); setStartNewProject(false); setIsAdminView(true); }}
            onSignOut={handleSignOut}
            signOutError={signOutError}
            signingOut={signingOut}
          />)}
    </div>
  );
}

export default App;
