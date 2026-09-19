import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

export default function EditorModal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); close.current(); }
      if (event.key !== 'Tab') return;
      const elements = [...(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href]') ?? [])].filter((element) => element.getClientRects().length);
      const first = elements[0]; const last = elements[elements.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panel.current)) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', keydown);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', keydown); previous?.focus(); };
  }, []);
  return <div className="fixed inset-0 z-[90] overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-6" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className="relative mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-[#fffdf8] p-5 text-gray-900 shadow-2xl outline-none dark:border-white/10 dark:bg-slate-900 dark:text-white sm:p-8">
      <header className="mb-6 flex items-center justify-between gap-4"><h2 className="text-lg font-bold">{title}</h2><button type="button" onClick={onClose} aria-label="편집 닫기" className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-white/10"><X /></button></header>
      {children}
    </div>
  </div>;
}
