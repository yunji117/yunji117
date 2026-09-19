// src/components/Contact.tsx
import { useEffect, useState } from 'react';
import { defaultSiteContent } from '../lib/defaultPortfolio';
import { fetchSiteContent } from '../lib/portfolioApi';

interface ContactProps {
  onOpenAdmin: () => void;
}

const Contact = ({ onOpenAdmin }: ContactProps) => {
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
  }, []);

  return (
    <>
      <section id="contact" className="min-h-[60vh] flex items-center justify-center px-4 sm:px-10">
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

      <section className="py-20 flex flex-col items-center justify-center gap-8">
        <h1 className="text-6xl font-bold opacity-0 animate-hero-fade">{content.thankYouText}</h1>
        <button
          type="button"
          onClick={onOpenAdmin}
          aria-label="Open portfolio admin login"
          className="h-3 w-3 rounded-full bg-gray-300/40 text-transparent hover:bg-cyan-400/80 focus:h-auto focus:w-auto focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-gray-900 dark:bg-white/20 dark:hover:bg-cyan-300"
        >
          Admin
        </button>
      </section>
    </>
  );
};

export default Contact;
