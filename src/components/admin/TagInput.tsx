import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  label: string;
  value: string[];
  onChange: (nextValue: string[]) => void;
  placeholder?: string;
}

const TagInput = ({ label, value, onChange, placeholder }: TagInputProps) => {
  const [draft, setDraft] = useState('');

  const addTag = () => {
    const nextTag = draft.trim();
    if (!nextTag || value.includes(nextTag)) return;
    onChange([...value, nextTag]);
    setDraft('');
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((item) => item !== tag));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    addTag();
  };

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
        {label}
      </span>
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-cyan-500/20"
      />
      <div className="mt-3 flex min-h-8 flex-wrap gap-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="relative inline-flex items-center rounded-lg bg-blue-500/20 px-3 py-1.5 pr-6 text-xs font-semibold text-blue-700 dark:text-cyan-300"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`${tag} 삭제`}
              className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-gray-700 shadow ring-1 ring-slate-200 hover:bg-red-50 hover:text-red-500 dark:bg-slate-900 dark:text-gray-200 dark:ring-white/10"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </label>
  );
};

export default TagInput;
