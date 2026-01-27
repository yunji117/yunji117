// src/components/Hero.tsx
import { motion, type Variants } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const handleScroll = () => {
    const aboutSection = document.getElementById('about');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* 배경 효과 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-40 left-10 w-72 h-72 bg-blue-500/30 dark:bg-blue-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-40 right-10 w-72 h-72 bg-purple-500/30 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-50 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/20 dark:bg-cyan-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30" />
      </div>

      {/* 메인 콘텐츠 */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 px-6 py-20 max-w-5xl mx-auto text-center"
      >
        <motion.div
          variants={itemVariants}
          className="mb-6 flex justify-center"
        >
          <div className="relative w-20 h-20 rounded-full glass flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 opacity-80" />
            <img
              src={`${import.meta.env.BASE_URL}img/yunjicharacternobg.png`}
              alt="Yunji avatar"
              className="relative w-full h-full object-contain"
            />
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
        >
          <span className="text-gray-900 dark:text-white">Hi, I'm </span>
          <span className="text-gradient">Yunji</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          아름답고
          <span className="font-semibold text-blue-500 dark:text-cyan-400"> 모던한 인터페이스</span>와
          <span className="font-semibold text-purple-500 dark:text-purple-400"> 견고한 애플리케이션</span>을 만드는 것을 좋아하는 풀스택 개발자입니다.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
        >
          <button
            onClick={handleScroll}
            className="px-8 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50"
          >
            View My Work
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 rounded-lg glass hover:bg-white/20 dark:hover:bg-white/10 text-gray-900 dark:text-white font-semibold transition-all duration-300"
          >
            Get In Touch
          </button>
        </motion.div>

        {/* 스크롤 표시기 */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-20"
        >
          <ChevronDown className="w-8 h-8 text-gray-500 dark:text-gray-400 mx-auto" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
