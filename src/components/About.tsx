import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle2, Zap, Users } from 'lucide-react';
import { defaultSiteContent } from '../lib/defaultPortfolio';
import { fetchSiteContent } from '../lib/portfolioApi';
import type { AboutIconName } from '../types/portfolio';

const aboutIconMap = {
  Users,
  Zap,
  CheckCircle2,
} satisfies Record<AboutIconName, typeof Users>;

const About = () => {
  const [content, setContent] = useState(defaultSiteContent);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

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
  }, []);

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
              About <span className="text-gradient">Me</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto" />
          </motion.div>

          {/* 소개 카드 */}
          <motion.div
            variants={itemVariants}
            className="glass p-8 md:p-12 rounded-2xl"
          >
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed space-y-4">
              {content.aboutParagraphs.map((paragraph) => (
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
            {content.aboutHighlights.map((item, index) => {
              const Icon = aboutIconMap[item.iconName] ?? Users;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="glass p-6 rounded-xl hover:shadow-lg dark:hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-2"
                >
                  <Icon className="w-12 h-12 text-blue-500 dark:text-cyan-400 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* 하단 CTA */}
          <motion.div variants={itemVariants} className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {content.aboutCtaText}
            </p>
            <button
              onClick={() =>
                document
                  .getElementById('projects')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
            >
              See My Projects
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
