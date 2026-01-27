import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle2, Zap, Users } from 'lucide-react';

const About = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

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

  const highlights = [
    {
      icon: Users,
      title: 'User-Centric Design',
      description: '사용자 중심의 UI/UX를 고려한 서비스 개발',
    },
    {
      icon: Zap,
      title: 'Full-Stack Development',
      description: 'React, Node.js, MySQL 등 풀스택 기술 보유',
    },
    {
      icon: CheckCircle2,
      title: 'Problem Solver',
      description: '실제 프로젝트를 통한 실무 경험 축적',
    },
  ];

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
              <span className="block">
                안녕하세요! 4년제 대학교를 졸업하고, 현재는{' '}
                <span className="font-bold text-blue-500 dark:text-cyan-400">풀스택 개발자</span>를
                꿈꾸며 성장 중인 KIM YUNJI입니다.
              </span>
              <span className="block">
                평소 사람들에게 도움을 주는 일을 좋아하고, 더 넓은 세상에서 영향력을 주는 방법을
                고민하다가 개발에 관심을 갖게 되었습니다.
              </span>
              <span className="block">
                이후 본격적으로 개발을 공부하기 위해 풀스택 개발자 양성과정에 등록했고, 현재{' '}
                <span className="font-bold text-purple-500 dark:text-purple-400">React, JavaScript, Node.js, MySQL</span> 등
                프론트엔드부터 백엔드까지 폭넓게 배우고 있습니다.
              </span>
              <span className="block">
                프로젝트 기반의 실습을 통해 로그인/회원가입 기능, 커뮤니티 게시판 등 실제 서비스를
                구현하는 경험을 쌓고 있습니다.
              </span>
            </p>
          </motion.div>

          {/* 강점 하이라이트 */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {highlights.map((item, index) => {
              const Icon = item.icon;
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
              끈기 있게 한 걸음씩 나아가고 있는 개발자입니다 👨‍💻
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
