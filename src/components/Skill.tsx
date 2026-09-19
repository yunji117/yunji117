import { useEffect, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Code2,
  Database,
  GitBranch,
  Palette,
} from 'lucide-react';
import { defaultSkillGroups, defaultSiteContent } from '../lib/defaultPortfolio';
import { fetchSiteContent, fetchSkillGroups } from '../lib/portfolioApi';
import type { SkillIconName } from '../types/portfolio';

const skillIconMap = {
  GitBranch,
  Database,
  Code2,
  Palette,
} satisfies Record<SkillIconName, typeof Code2>;

const Skill = () => {
  const reduceMotion = useReducedMotion();
  const [skills, setSkills] = useState(defaultSkillGroups);
  const [footerText, setFooterText] = useState(defaultSiteContent.skillsFooter);
  const { ref, inView } = useInView({
    threshold: 0.05,
    triggerOnce: true,
  });

  useEffect(() => {
    let isMounted = true;

    Promise.all([fetchSkillGroups(), fetchSiteContent()]).then(([nextSkills, nextContent]) => {
      if (!isMounted) return;
      if (nextSkills.length > 0) setSkills(nextSkills);
      if (nextContent?.skillsFooter) setFooterText(nextContent.skillsFooter);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: reduceMotion ? 1 : 0, rotateY: reduceMotion ? 0 : -55, x: 0 },
    visible: {
      opacity: 1,
      rotateY: 0,
      x: 0,
      transition: { 
        duration: reduceMotion ? 0 : 0.65,
        ease: [0.22, 0.61, 0.36, 1],
      },
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
              Skills <span className="text-gradient">& Tools</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto" />
          </motion.div>

          {/* 스킬 카드 그리드 */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8"
            style={{ perspective: 1200 }}
          >
            {skills.map((skillGroup, index) => {
              const Icon = skillIconMap[skillGroup.iconName] ?? Code2;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group glass p-8 rounded-2xl hover:shadow-2xl dark:hover:shadow-cyan-500/20 transition-shadow duration-300"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transformOrigin: 'center center',
                  }}
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
                  <ul className="space-y-3">
                    {skillGroup.items.map((skill, skillIndex) => (
                      <li
                        key={skillIndex}
                        className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-2 bg-gradient-to-r ${skillGroup.color} flex-shrink-0`}
                        />
                        <span className="text-sm">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>

          {/* 추가 정보 */}
          <motion.div variants={itemVariants} className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {footerText}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skill;
