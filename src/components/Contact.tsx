import EditButton from './admin/EditButton';
// src/components/Contact.tsx
import { useEffect, useState } from 'react';
import { defaultSiteContent } from '../lib/defaultPortfolio';
import { fetchSiteContent } from '../lib/portfolioApi';

interface ContactProps {
  onEdit?: () => void;
  revision?: number;
  isAuthenticated: boolean;
  onOpenAdmin: () => void;
}

const Contact = ({ isAuthenticated, onOpenAdmin, onEdit, revision = 0 }: ContactProps) => {
  const [content, setContent] = useState(defaultSiteContent);

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

  return (
    <>
      <section id="contact" className="relative min-h-[60vh] flex items-center justify-center px-4 sm:px-10">
        {onEdit && <EditButton label="Contact" onClick={onEdit} />}
        <div className="text-center text-sm sm:text-base">
          <h2 className="text-xl sm:text-2xl font-bold">{content.contactTitle}</h2>
          <div className="mt-6 space-y-2">
            {content.contactItems.map((item) => (
              <p key={item.label}>
                {item.label}:{' '}
                {item.url ? (
                  <a href={item.url} target={item.url.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 flex flex-col items-center justify-center gap-8">
        <h1 className="text-6xl font-bold opacity-0 animate-hero-fade">{content.thankYouText}</h1>
        <button
          type="button"
          onClick={onOpenAdmin}
          aria-label={isAuthenticated ? '관리자 메뉴' : '관리자 로그인'}
          className="absolute bottom-6 right-6 h-11 w-11 rounded-full border border-transparent transition-colors duration-300 hover:border-gray-400 focus-visible:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
        >
          <span className="sr-only">{isAuthenticated ? '관리자 메뉴' : '관리자 로그인'}</span>
        </button>
      </section>
    </>
  );
};

export default Contact;
