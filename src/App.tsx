import { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skill from './components/Skill';
import ProjectSection from './components/ProjectSection';
import Contact from './components/Contact';

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      <main className="pt-20">
        <Hero />
        <About />
        <Skill />
        <ProjectSection />
        <Contact />
      </main>
    </div>
  );
}

export default App;
