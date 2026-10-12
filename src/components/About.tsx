import EditButton from './admin/EditButton';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle2, Zap, Users } from 'lucide-react';
import { defaultSiteContent } from '../lib/defaultPortfolio';
import { fetchSiteContent } from '../lib/portfolioApi';
import type { AboutIconName } from '../types/portfolio';
import { useLanguageStore } from '../store/languageStore';

const aboutEnglish = {
  paragraphs: [
    'Hello, I’m Kim Yun Ji. I turn design intent into web experiences that work.',
    'With React and TypeScript, I build interfaces that communicate information clearly and guide users through natural interactions. I have experience across the full web-service process, from Figma-based screen design to frontend development, data integration, deployment, and operations.',
    'In professional work, I designed 126 e-commerce product detail pages, shaping product strengths and purchase flows visually. In development projects, I used technologies including Next.js and Supabase to turn ideas into usable services.',
    'I aim to be a designer and developer who considers both the user experience and the purpose of the service—not just how the screen looks.',
  ],
  highlights: [
    { iconName: 'Zap' as const, title: 'DESIGN TO DEVELOPMENT', description: 'I translate design intent into accurate, responsive web interfaces.' },
    { iconName: 'CheckCircle2' as const, title: 'SERVICE DEVELOPMENT', description: 'I have experience planning, developing, deploying, and operating web services.' },
    { iconName: 'Users' as const, title: '126 PRODUCT PAGES', description: 'I designed information structures and purchase journeys across 126 product detail pages.' },
  ],
};

const koreanHighlightTitles: Record<string, string> = {
  'DESIGN TO DEVELOPMENT': '디자인에서 개발까지',
  'SERVICE DEVELOPMENT': '서비스 개발',
  '126 PRODUCT PAGES': '126개 상품 상세페이지',
};

const aboutIconMap = {
  Users,
  Zap,
  CheckCircle2,
} satisfies Record<AboutIconName, typeof Users>;

const hasLegacyAboutContent = (content: typeof defaultSiteContent) =>
  content.aboutParagraphs.includes(
    '안녕하세요! 4년제 대학교를 졸업하고, 현재는 풀스택 개발자를 꿈꾸며 성장 중인 KIM YUNJI입니다.',
  ) || content.aboutHighlights.some((item) => item.title === 'Problem Solver');

const About = ({ onEdit, revision = 0 }: { onEdit?: () => void; revision?: number }) => {
  const [content, setContent] = useState(defaultSiteContent);
  const { language } = useLanguageStore();
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    let isMounted = true;

    fetchSiteContent().then((nextContent) => {
      if (isMounted && nextContent) {
        const mergedContent = { ...defaultSiteContent, ...nextContent };

        setContent(
          hasLegacyAboutContent(mergedContent)
            ? {
                ...mergedContent,
                aboutParagraphs: defaultSiteContent.aboutParagraphs,
                aboutHighlights: defaultSiteContent.aboutHighlights,
                aboutCtaText: defaultSiteContent.aboutCtaText,
              }
            : mergedContent,
        );
      }
    });

    return () => {
      isMounted = false;
    };
  }, [revision]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section id="about" className="relative py-20 lg:py-32 px-6">
      {onEdit && <EditButton label="About" onClick={onEdit} />}
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="space-y-12"
        >
          {/* 섹션 제목 */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              {language === 'ko' ? <>나를 <span className="text-gradient">소개합니다</span></> : <>About <span className="text-gradient">Me</span></>}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto" />
            <p className="mx-auto mt-8 max-w-3xl text-2xl font-bold leading-tight text-gray-900 dark:text-white md:text-4xl">
              {language === 'ko' ? '디자인 의도를 이해하고' : 'I understand design intent and'}
              <span className="text-gradient block">{language === 'ko' ? '실제로 동작하는 경험으로 구현합니다.' : 'turn it into experiences that work.'}</span>
            </p>
          </motion.div>

          {/* 소개 카드 */}
          <motion.div
            variants={itemVariants}
            className="glass p-8 md:p-12 rounded-2xl"
          >
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed space-y-4">
              {(language === 'ko' ? content.aboutParagraphs : aboutEnglish.paragraphs).map((paragraph) => (
                <span key={paragraph} className="block">
                  {paragraph}
                </span>
              ))}
            </p>
          </motion.div>

          {/* 강점 하이라이트 */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {(language === 'ko' ? content.aboutHighlights : aboutEnglish.highlights).map((item, index) => {
              const Icon = aboutIconMap[item.iconName] ?? Users;
              const displayTitle = language === 'ko' ? koreanHighlightTitles[item.title] ?? item.title : item.title;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="glass p-6 rounded-xl hover:shadow-lg dark:hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-2"
                >
                  <Icon className="w-12 h-12 text-blue-500 dark:text-cyan-400 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {displayTitle}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* 하단 CTA */}
          <motion.div variants={itemVariants} className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {language === 'ko' ? content.aboutCtaText : 'I connect design and development to turn ideas into complete services.'}
            </p>
            <button
              onClick={() =>
                document
                  .getElementById('projects')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
            >
              {language === 'ko' ? '프로젝트 살펴보기' : 'Explore Projects'} <span aria-hidden="true">→</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
