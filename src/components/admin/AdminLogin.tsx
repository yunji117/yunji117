import { useState } from 'react';
import { Chrome, Lock, X } from 'lucide-react';
import { isSupabaseConfigured, supabase, supabaseConfigurationError } from '../../lib/supabase';

interface AdminLoginProps {
  onClose: () => void;
}

const AdminLogin = ({ onClose }: AdminLoginProps) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (!supabase) {
      setMessage('Supabase 환경변수를 먼저 설정해 주세요.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    sessionStorage.setItem('portfolio-open-admin', 'true');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.hostname === 'localhost'
            ? new URL(import.meta.env.BASE_URL, window.location.origin).href
            : 'https://yunji117.github.io/yunji117/',
          queryParams: { prompt: 'select_account' },
        },
      });

      if (error) throw error;
    } catch (error) {
      sessionStorage.removeItem('portfolio-open-admin');
      setMessage(error instanceof Error ? error.message : '로그인을 시작하지 못했습니다. 다시 시도해 주세요.');
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        autoComplete="off"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-white/20 bg-white/95 p-6 shadow-2xl dark:bg-slate-950/95"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-500">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Secret Admin</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              관리자 권한이 있는 Google 계정으로 로그인해 주세요.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
            aria-label="로그인 닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {supabaseConfigurationError}
          </div>
        )}

        {message && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-300">
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={() => void handleGoogleLogin()}
          disabled={isLoading || !isSupabaseConfigured}
          className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-lg bg-white px-5 py-3 font-semibold text-gray-900 shadow-lg shadow-black/10 ring-1 ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Chrome className="h-5 w-5 text-blue-500" />
          {isLoading ? 'Google 로그인 중...' : 'Google로 로그인'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
