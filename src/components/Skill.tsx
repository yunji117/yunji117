import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Code2,
  Database,
  GitBranch,
} from 'lucide-react';

const Skill = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const skills = [
    {
      category: 'Frontend',
      icon: Code2,
      color: 'from-blue-500 to-cyan-500',
      items: [
        'HTML / CSS / Tailwind CSS',
        'React',
        'Next.js',
        'Vite',
        'JavaScript / TypeScript',
        'Electron',
        'Jest (Testing)',
        'Figma (UI/UX Design)',
      ],
    },
    {
      category: 'Backend & Database',
      icon: Database,
      color: 'from-purple-500 to-pink-500',
      items: [
        'Node.js',
        'Express',
        'NestJS',
        'MongoDB / MySQL / PostgreSQL',
        'Firebase',
        'Supabase',
        'REST API',
        'Docker',
      ],
    },
    {
      category: 'DevOps & Tools',
      icon: GitBranch,
      color: 'from-green-500 to-emerald-500',
      items: [
        'Git / Github',
        'Notion',
        'Postman',
        'npm / yarn',
        'VS Code',
        'Slack',
        'AWS / Vercel / Github Action',
        'Ubuntu / PowerShell',
      ],
    },
  ];

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

  const skillItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="skills" className="relative py-20 lg:py-32 px-6">
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
              Technical <span className="text-gradient">Skills</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto" />
          </motion.div>

          {/* 스킬 카드 그리드 */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {skills.map((skillGroup, index) => {
              const Icon = skillGroup.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group glass p-8 rounded-2xl hover:shadow-2xl dark:hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-2"
                >
                  {/* 아이콘 */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${skillGroup.color} p-3 mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* 카테고리 제목 */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {skillGroup.category}
                  </h3>

                  {/* 스킬 목록 */}
                  <motion.ul
                    className="space-y-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                  >
                    {skillGroup.items.map((skill, skillIndex) => (
                      <motion.li
                        key={skillIndex}
                        variants={skillItemVariants}
                        className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-2 bg-gradient-to-r ${skillGroup.color} flex-shrink-0`}
                        />
                        <span className="text-sm">{skill}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              );
            })}
          </motion.div>

          {/* 추가 정보 */}
          <motion.div variants={itemVariants} className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              지속적으로 학습하고 새로운 기술을 탐구하는 개발자입니다 🚀
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skill;
