import { useEffect } from 'react';
import { useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useThemeStore } from './store/themeStore';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skill from './components/Skill';
import ProjectSection from './components/ProjectSection';
import Contact from './components/Contact';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import { supabase } from './lib/supabase';

function App() {
  const { theme } = useThemeStore();
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsAdminView(Boolean(data.session));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        setIsAdminLoginOpen(false);
        setIsAdminView(true);
      } else {
        setIsAdminView(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (session && isAdminView) {
    return <AdminDashboard onExit={() => setIsAdminView(false)} />;
  }

  return (
    <div className="w-full min-h-screen bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      <main className="pt-20">
        <Hero />
        <About />
        <Skill />
        <ProjectSection />
        <Contact onOpenAdmin={() => (session ? setIsAdminView(true) : setIsAdminLoginOpen(true))} />
      </main>
      {isAdminLoginOpen && <AdminLogin onClose={() => setIsAdminLoginOpen(false)} />}
    </div>
  );
}

export default App;
