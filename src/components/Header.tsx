import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, Menu, Moon, Sun, X } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

interface HeaderProps {
  isAdmin: boolean;
  onOpenAdmin: () => void;
}

const navigation = ['hero', 'about', 'skills', 'projects', 'contact'];

const Header = ({ isAdmin, onOpenAdmin }: HeaderProps) => {
  const { theme, toggleTheme } = useThemeStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => menuPanelRef.current?.querySelector<HTMLElement>('button, a')?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }
      if (event.key !== 'Tab' || !menuPanelRef.current) return;
      const focusable = Array.from(menuPanelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const closeMenu = (restoreFocus = false) => {
    setIsMenuOpen(false);
    if (restoreFocus) window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  const handleNavClick = (sectionId: string) => {
    closeMenu();
    window.requestAnimationFrame(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' }));
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="glass absolute inset-0" />
      <nav aria-label="주요 메뉴" className="relative mx-auto max-w-7xl px-6 py-3 lg:px-12">
        <div className="flex items-center justify-between">
          <motion.button type="button" onClick={() => handleNavClick('hero')} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex min-h-11 min-w-11 items-center rounded-lg bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 lg:text-3xl" aria-label="페이지 맨 위로 이동">
            YJ
          </motion.button>

          <div className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => (
              <motion.button key={item} type="button" onClick={() => handleNavClick(item)} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="min-h-11 rounded-lg px-2 text-sm font-medium capitalize text-gray-700 transition-colors hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-gray-300 dark:hover:text-cyan-400">
                {item}
              </motion.button>
            ))}
            <a href="https://github.com/yunji117" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-gray-700 hover:text-violet-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-gray-300 dark:hover:text-violet-300"><Github className="h-4 w-4" />GitHub</a>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && <button type="button" onClick={onOpenAdmin} className="hidden min-h-11 rounded-lg px-3 text-xs font-semibold text-cyan-600 hover:bg-cyan-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-cyan-300 sm:block">관리자</button>}
            <motion.button type="button" onClick={toggleTheme} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex h-11 w-11 items-center justify-center rounded-lg glass hover:bg-blue-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:hover:bg-cyan-500/20" aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}>
              {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-700" />}
            </motion.button>
            <button ref={menuButtonRef} type="button" onClick={() => isMenuOpen ? closeMenu(true) : setIsMenuOpen(true)} aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={isMenuOpen} aria-controls="mobile-navigation" className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-white md:hidden">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div key="mobile-menu" className="fixed inset-0 top-[68px] z-40 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" tabIndex={-1} aria-label="메뉴 닫기" className="absolute inset-0 h-full w-full cursor-default bg-slate-950/45 backdrop-blur-sm" onClick={() => closeMenu(true)} />
            <motion.div ref={menuPanelRef} id="mobile-navigation" role="dialog" aria-modal="true" aria-label="모바일 메뉴" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="relative mx-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xl dark:border-white/10 dark:bg-slate-900">
              {navigation.map((item) => (
                <button key={item} type="button" onClick={() => handleNavClick(item)} className="flex min-h-12 w-full items-center rounded-xl px-4 text-left text-base font-semibold capitalize text-gray-800 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500 dark:text-white dark:hover:bg-white/10">{item}</button>
              ))}
              <a href="https://github.com/yunji117" target="_blank" rel="noopener noreferrer" onClick={() => closeMenu()} className="flex min-h-12 w-full items-center gap-2 rounded-xl px-4 text-base font-semibold text-gray-800 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500 dark:text-white dark:hover:bg-white/10"><Github className="h-5 w-5" />GitHub</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
