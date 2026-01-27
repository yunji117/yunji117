import { useThemeStore } from '../store/themeStore';
import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass absolute inset-0" />
      <nav className="relative px-6 py-4 lg:px-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="cursor-pointer"
          >
            <h1 className="text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              YJ
            </h1>
          </motion.div>

          {/* 네비게이션 링크 */}
          <div className="hidden md:flex items-center gap-8">
            {['hero', 'about', 'projects', 'skills', 'contact'].map((item) => (
              <motion.button
                key={item}
                onClick={() => handleNavClick(item)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors capitalize"
              >
                {item}
              </motion.button>
            ))}
          </div>

          {/* 테마 토글 */}
          <motion.button
            onClick={toggleTheme}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="p-2.5 rounded-lg glass hover:bg-blue-500/20 dark:hover:bg-cyan-500/20 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </motion.button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
