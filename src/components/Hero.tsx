import { useEffect, useMemo, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import EditButton from './admin/EditButton';
import yunjiAvatar from '../assets/img/3Dcharacter.png';
import { defaultSiteContent } from '../lib/defaultPortfolio';
import { fetchSiteContent } from '../lib/portfolioApi';

type Language = 'en' | 'ko';

interface HeroCopy {
  intro: string;
  lead: string;
  highlight: string;
  statement: string;
}

const heroCopy: Record<Language, HeroCopy> = {
  en: {
    intro: 'hello( );',
    lead: 'Welcome to',
    highlight: 'Kim Yun Ji\u2019s Portfolio.',
    statement: 'I turn ideas into\nvisual experiences.',
  },
  ko: {
    intro: '안녕하세요.',
    lead: '아이디어를\n시각적인 경험으로 만드는',
    highlight: '김윤지의 포트폴리오입니다.',
    statement: '',
  },
};

const getCopyLength = (copy: HeroCopy) =>
  copy.intro.length + copy.lead.length + copy.highlight.length + copy.statement.length;

const sliceCopy = (copy: HeroCopy, visibleCharacters: number): HeroCopy => {
  let remaining = visibleCharacters;
  const take = (value: string) => {
    const visible = value.slice(0, Math.max(0, remaining));
    remaining -= value.length;
    return visible;
  };

  return {
    intro: take(copy.intro),
    lead: take(copy.lead),
    highlight: take(copy.highlight),
    statement: take(copy.statement),
  };
};

const Hero = ({ onEdit, revision = 0 }: { onEdit?: () => void; revision?: number }) => {
  const [content, setContent] = useState(defaultSiteContent);
  const [language, setLanguage] = useState<Language>('en');
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);
  const [visibleCharacters, setVisibleCharacters] = useState(0);

  useEffect(() => {
    let isMounted = true;

    fetchSiteContent().then((nextContent) => {
      if (isMounted && nextContent) {
        setContent({ ...defaultSiteContent, ...nextContent });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [revision]);

  useEffect(() => {
    const copyLength = getCopyLength(heroCopy[language]);

    if (hasSelectedLanguage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisibleCharacters(copyLength);
      return;
    }

    const timer = window.setInterval(() => {
      setVisibleCharacters((current) => {
        if (current >= copyLength) {
          window.clearInterval(timer);
          return copyLength;
        }
        return current + 1;
      });
    }, 42);

    return () => window.clearInterval(timer);
  }, [hasSelectedLanguage, language]);

  const selectedCopy = heroCopy[language];
  const visibleCopy = useMemo(
    () => sliceCopy(selectedCopy, visibleCharacters),
    [selectedCopy, visibleCharacters],
  );
  const isTyping = visibleCharacters < getCopyLength(selectedCopy);
  const introEnd = selectedCopy.intro.length;
  const leadEnd = introEnd + selectedCopy.lead.length;
  const highlightEnd = leadEnd + selectedCopy.highlight.length;

  const selectLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    setHasSelectedLanguage(true);
    setVisibleCharacters(getCopyLength(heroCopy[nextLanguage]));
  };

  const handleScroll = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.16, delayChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100vh-5rem)] w-full items-center justify-center overflow-hidden"
    >
      {onEdit && <EditButton label="Hero" onClick={onEdit} />}

      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[8%] top-[18%] h-72 w-72 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-600/15" />
        <div className="absolute bottom-[8%] right-[5%] h-[30rem] w-[30rem] rounded-full bg-purple-500/25 blur-3xl dark:bg-purple-500/20" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto w-full max-w-7xl px-6 py-12 lg:px-12"
      >
        <div className="grid items-center gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-x-10 lg:gap-y-0">
          <div className="min-w-0 text-left lg:col-start-1 lg:row-start-1">
            <motion.div variants={itemVariants} className="mb-8 flex items-center gap-2" role="group" aria-label="언어 선택">
              {([
                ['en', 'English'],
                ['ko', '한글'],
              ] as const).map(([value, label]) => {
                const isActive = language === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => selectLanguage(value)}
                    aria-pressed={isActive}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                      isActive
                        ? 'border-violet-500 bg-violet-500 text-white shadow-lg shadow-violet-500/20'
                        : 'border-gray-300 bg-white/60 text-gray-600 hover:border-violet-400 hover:text-violet-600 dark:border-white/20 dark:bg-white/5 dark:text-gray-300 dark:hover:border-violet-400 dark:hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </motion.div>

            <div aria-live="polite" aria-label={`${selectedCopy.intro} ${selectedCopy.lead} ${selectedCopy.highlight} ${selectedCopy.statement}`}>
              <p className="mb-2 min-h-9 text-2xl font-bold tracking-tight text-gray-900 dark:text-white md:text-3xl">
                {visibleCopy.intro}
                {isTyping && visibleCharacters <= introEnd && <span className="hero-typing-cursor" aria-hidden="true" />}
              </p>
              <h1 className="min-h-[9rem] text-[2.55rem] font-bold leading-[1.08] tracking-tight text-gray-900 dark:text-white sm:text-5xl md:min-h-[10.5rem] md:text-6xl lg:text-[3.65rem]">
                <span className={`block ${language === 'ko' ? 'whitespace-pre-line' : ''}`}>
                  {visibleCopy.lead}
                  {isTyping && visibleCharacters > introEnd && visibleCharacters <= leadEnd && <span className="hero-typing-cursor" aria-hidden="true" />}
                </span>
                <span className={`hero-name-gradient block pb-2 ${language === 'ko' ? 'whitespace-nowrap' : ''}`}>
                  {visibleCopy.highlight}
                  {isTyping && visibleCharacters > leadEnd && visibleCharacters <= highlightEnd && <span className="hero-typing-cursor" aria-hidden="true" />}
                </span>
              </h1>
              {(selectedCopy.statement || (isTyping && visibleCharacters > highlightEnd)) && (
                <p className="mt-7 min-h-[7.5rem] whitespace-pre-line text-3xl font-bold leading-[1.28] tracking-tight text-gray-800 dark:text-white sm:text-4xl md:text-5xl md:leading-[1.35]">
                  {visibleCopy.statement}
                  {isTyping && visibleCharacters > highlightEnd && <span className="hero-typing-cursor" aria-hidden="true" />}
                </p>
              )}
            </div>
          </div>

          <motion.div
            variants={itemVariants}
            className="relative mx-auto flex w-full max-w-[31rem] items-end justify-center self-end lg:col-start-2 lg:row-span-2 lg:row-start-1"
          >
            <div className="absolute bottom-[8%] h-[68%] w-[86%] rounded-full bg-gradient-to-br from-violet-400/15 via-fuchsia-400/20 to-purple-600/35 blur-2xl dark:from-violet-500/10 dark:to-purple-500/25" />
            <img
              src={content.heroAvatarUrl || yunjiAvatar}
              alt="Kim Yun Ji 3D character"
              className="relative z-10 max-h-[43rem] w-full object-contain object-bottom drop-shadow-[0_24px_42px_rgba(79,42,112,0.32)]"
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:col-start-1 lg:row-start-2 lg:mt-10 lg:justify-start"
          >
            <button
              onClick={handleScroll}
              className="w-full rounded-lg bg-blue-500 px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/40 dark:bg-cyan-600 dark:hover:bg-cyan-700 sm:w-auto"
            >
              View My Work
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="glass w-full rounded-lg px-8 py-3 font-semibold text-gray-900 transition-all duration-300 hover:bg-white/20 dark:text-white dark:hover:bg-white/10 sm:w-auto"
            >
              Get In Touch
            </button>
          </motion.div>
        </div>

        <motion.button
          type="button"
          onClick={handleScroll}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mx-auto mt-8 block rounded-full p-2"
          aria-label="About 섹션으로 이동"
        >
          <ChevronDown className="h-8 w-8 text-gray-500 dark:text-gray-400" />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;
