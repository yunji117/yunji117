import { useEffect, useState } from 'react';
import { Check, Copy, Download, Github, Mail } from 'lucide-react';
import EditButton from './admin/EditButton';
import { defaultSiteContent } from '../lib/defaultPortfolio';
import { fetchSiteContent } from '../lib/portfolioApi';
import { getResumeUrl, isResumeContactItem, resumeDefinitions } from '../lib/contactLinks';
import { useLanguageStore } from '../store/languageStore';

interface ContactProps {
  onEdit?: () => void;
  revision?: number;
  isAuthenticated: boolean;
  onOpenAdmin: () => void;
}

const Contact = ({ isAuthenticated, onOpenAdmin, onEdit, revision = 0 }: ContactProps) => {
  const [content, setContent] = useState(defaultSiteContent);
  const [copied, setCopied] = useState(false);
  const { language } = useLanguageStore();

  useEffect(() => {
    let isMounted = true;
    fetchSiteContent().then((nextContent) => {
      if (isMounted && nextContent) setContent({ ...defaultSiteContent, ...nextContent });
    });
    return () => { isMounted = false; };
  }, [revision]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const publicContacts = content.contactItems.filter((item) => item.value.trim() && !isResumeContactItem(item));
  const emailItem = publicContacts.find((item) => item.label.toLocaleLowerCase().includes('email') || item.url?.startsWith('mailto:'));
  const githubItem = publicContacts.find((item) => item.label.toLocaleLowerCase().includes('github'));
  const email = emailItem?.value.trim() ?? '';
  const emailUrl = emailItem?.url?.trim() || (email ? `mailto:${email}` : '');
  const resumeLinks = resumeDefinitions
    .map((definition) => ({ ...definition, url: getResumeUrl(content.contactItems, definition.role) }))
    .filter((item): item is typeof item & { url: string } => Boolean(item.url));
  const title = language === 'ko'
    ? '함께 이야기해요'
    : (content.contactTitle === 'KIM YUNJI Contact' || !content.contactTitle.trim() ? 'LET’S WORK TOGETHER' : content.contactTitle);
  const closing = content.thankYouText === 'Thank You •͜•'
    || content.thankYouText === 'Thank you for visiting.'
    || !content.thankYouText.trim()
    ? 'Thank you for visiting. •͜•'
    : content.thankYouText;

  const copyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = email;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    setCopied(true);
  };

  return (
    <section id="contact" className="relative overflow-hidden px-4 py-20 sm:px-10 lg:py-28">
      {onEdit && <EditButton label="Contact" onClick={onEdit} />}
      <div className="absolute left-[10%] top-[12%] -z-10 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="absolute bottom-[8%] right-[8%] -z-10 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />

      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-extrabold tracking-[0.2em] text-violet-600 dark:text-violet-300">{title}</p>
          <h2 className="mt-5 text-3xl font-black leading-tight text-gray-900 dark:text-white sm:text-5xl">
            {language === 'ko' ? '디자인과 개발을 연결해' : 'Connecting design and development'}
            <span className="hero-name-gradient block pb-1">{language === 'ko' ? '더 나은 웹 경험을 만들겠습니다.' : 'to create better web experiences.'}</span>
          </h2>
          
        </div>

        <div className={`mt-12 grid gap-5 ${resumeLinks.length ? 'lg:grid-cols-3' : 'md:grid-cols-2'}`}>
          {email && (
            <article className="flex min-h-64 flex-col rounded-3xl border border-slate-200/80 bg-white/75 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:p-8">
              <Mail className="h-7 w-7 text-cyan-600 dark:text-cyan-300" />
              <p className="mt-6 text-xs font-extrabold tracking-[0.18em] text-gray-500 dark:text-gray-400">{language === 'ko' ? '이메일' : 'EMAIL'}</p>
              <a href={emailUrl} className="mt-2 break-all text-lg font-bold text-gray-900 hover:text-cyan-600 dark:text-white dark:hover:text-cyan-300">{email}</a>
              <div className="mt-auto flex flex-wrap gap-2 pt-7">
                <a href={emailUrl} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-cyan-700"><Mail className="h-4 w-4" /> {language === 'ko' ? '메일 보내기' : 'Send Email'}</a>
                <button type="button" onClick={() => void copyEmail()} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:border-cyan-500 hover:text-cyan-600 dark:border-white/15 dark:text-gray-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? (language === 'ko' ? '복사 완료' : 'Copied') : (language === 'ko' ? '주소 복사' : 'Copy Address')}
                </button>
              </div>
            </article>
          )}

          {githubItem?.url && (
            <article className="flex min-h-64 flex-col rounded-3xl border border-slate-200/80 bg-white/75 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:p-8">
              <Github className="h-7 w-7 text-violet-600 dark:text-violet-300" />
              <p className="mt-6 text-xs font-extrabold tracking-[0.18em] text-gray-500 dark:text-gray-400">{language === 'ko' ? '깃허브' : 'GITHUB'}</p>
              <p className="mt-2 break-all text-lg font-bold text-gray-900 dark:text-white">github.com/yunji117</p>
              <a href={githubItem.url} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-violet-700 dark:bg-white dark:text-gray-900 dark:hover:bg-violet-300"><Github className="h-4 w-4" /> {language === 'ko' ? 'GitHub 방문' : 'Visit GitHub'}</a>
            </article>
          )}

          {resumeLinks.length > 0 && (
            <article className="flex min-h-64 flex-col rounded-3xl border border-violet-200/80 bg-violet-50/65 p-6 shadow-lg shadow-violet-200/40 backdrop-blur-xl dark:border-violet-400/20 dark:bg-violet-500/10 dark:shadow-none sm:p-8">
              <Download className="h-7 w-7 text-violet-600 dark:text-violet-300" />
              <p className="mt-6 text-xs font-extrabold tracking-[0.18em] text-gray-500 dark:text-gray-400">{language === 'ko' ? '이력서' : 'RESUME'}</p>
              <p className="mt-2 leading-7 text-gray-700 dark:text-gray-300">{language === 'ko' ? '지원 직무에 맞는 이력서를 확인할 수 있습니다.' : 'Download a resume tailored to each role.'}</p>
              <div className="mt-auto space-y-2 pt-7">
                {resumeLinks.map((resume) => (
                  <a key={resume.role} href={resume.url} download target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-violet-700"><Download className="h-4 w-4" /> {language === 'ko' ? resume.label : `${resume.role === 'frontend' ? 'Frontend' : resume.role === 'fullstack' ? 'Full-Stack' : 'Web Design'} Resume PDF`}</a>
                ))}
              </div>
            </article>
          )}
        </div>

        <div className="mt-16 border-t border-slate-200/80 pt-10 text-center dark:border-white/10">
          <p className="text-2xl font-black text-gray-900 dark:text-white sm:text-3xl">{language === 'ko' ? '방문해주셔서 감사합니다. •͜•' : closing}</p>
          <p className="mt-4 leading-7 text-gray-600 dark:text-gray-300">{language === 'ko' ? <>아이디어를 시각적 경험으로 만드는<br />김윤지였습니다.</> : <>I’m Kim Yun Ji,<br />turning ideas into visual experiences.</>}</p>
          <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">© 2026 Kim Yun Ji · Yunify Studio</p>
        </div>
      </div>

      {copied && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-950 px-5 py-3 text-sm font-semibold text-white shadow-2xl" role="status" aria-live="polite">{language === 'ko' ? '이메일 주소가 복사되었습니다.' : 'Email address copied.'}</div>}
      <button type="button" onClick={onOpenAdmin} aria-label={isAuthenticated ? '관리자 메뉴' : '관리자 로그인'} className="absolute bottom-6 right-6 h-11 w-11 rounded-full border border-transparent transition-colors duration-300 hover:border-gray-400 focus-visible:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"><span className="sr-only">{isAuthenticated ? '관리자 메뉴' : '관리자 로그인'}</span></button>
    </section>
  );
};

export default Contact;
