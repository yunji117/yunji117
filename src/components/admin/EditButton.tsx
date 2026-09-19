import { Pencil } from 'lucide-react';
export default function EditButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button type="button" aria-label={`${label} 수정`} title={`${label} 수정`} onClick={(event) => { event.stopPropagation(); onClick(); }} className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200 bg-white/95 text-cyan-700 shadow-md transition hover:bg-cyan-50 focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-cyan-500/30 dark:bg-slate-900 dark:text-cyan-300"><Pencil className="h-4 w-4" /></button>;
}
