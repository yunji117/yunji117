import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  label: string;
  value: string[];
  onChange: (nextValue: string[]) => void;
  placeholder?: string;
  hashtags?: boolean;
}

const TagInput = ({ label, value, onChange, placeholder, hashtags = false }: TagInputProps) => {
  const [draft, setDraft] = useState('');

  const addTag = () => {
    const tags = hashtags ? draft.split(/[\s#]+/).map((tag) => tag.replace(/^#+/, '').trim()).filter(Boolean) : [draft.trim()].filter(Boolean);
    if (tags.length) onChange([...new Set([...value, ...tags])]);
    setDraft('');
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((item) => item !== tag));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key !== 'Enter' && !(hashtags && event.key === ' ')) return;
    event.preventDefault();
    addTag();
  };

  return (
    <div className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
        {label}
      </span>
      <input
        aria-label={label}
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
            {hashtags ? tag.replace(/^#+/, '') : tag}
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
    </div>
  );
};

export default TagInput;
