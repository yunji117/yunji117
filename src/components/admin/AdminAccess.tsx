import { Loader2, X } from 'lucide-react';
import type { PortfolioAuthState } from '../../lib/portfolioAuth';

interface AdminAccessProps {
  auth: PortfolioAuthState;
  onClose: () => void;
  onRetry: () => void;
  onOpenAdmin: () => void;
  onSignOut: () => Promise<void>;
  signOutError: string;
  signingOut: boolean;
}

export default function AdminAccess({ auth, onClose, onRetry, onOpenAdmin, onSignOut, signOutError, signingOut }: AdminAccessProps) {
  const busy = auth.phase === 'initializing' || auth.phase === 'checking';
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="admin-access-title" className="relative w-full max-w-md rounded-2xl bg-white p-6 text-gray-900 shadow-2xl dark:bg-slate-950 dark:text-white" onClick={(event) => event.stopPropagation()}>
        <button type="button" aria-label="관리자 메뉴 닫기" onClick={onClose} className="absolute right-4 top-4 rounded-lg p-2"><X className="h-5 w-5" /></button>
        <h2 id="admin-access-title" className="mb-3 text-xl font-bold">{auth.session ? '로그인된 계정' : '로그인 상태 확인'}</h2>
        {auth.session && <p className="mb-4 break-all text-sm text-gray-600 dark:text-gray-300">{auth.session.user.email}</p>}
        {busy && <p role="status" className="flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin" />{auth.session ? '관리자 권한을 확인하고 있습니다.' : '저장된 로그인 상태를 확인하고 있습니다.'}</p>}
        {auth.message && <p role="alert" className="whitespace-pre-wrap break-words text-sm leading-relaxed">{auth.message}</p>}
        {auth.phase === 'admin' && <>
          <p className="text-sm">관리자 로그인 상태입니다. 포트폴리오의 마지막 프로젝트 뒤에 있는 ＋ 버튼으로 프로젝트를 추가할 수 있습니다.</p>
          <button type="button" onClick={onOpenAdmin} className="mt-5 w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-white">관리자 페이지 열기</button>
        </>}
        {(auth.phase === 'error' || auth.phase === 'member') && <button type="button" onClick={onRetry} className="mt-5 rounded-lg bg-cyan-500 px-4 py-2 text-white">{auth.session ? '관리자 권한 다시 확인' : '로그인 상태 다시 확인'}</button>}
        {auth.session && <button type="button" disabled={signingOut} onClick={() => void onSignOut()} className="mt-4 block text-sm text-gray-500 disabled:opacity-50">{signingOut ? '로그아웃 중…' : '로그아웃 / 다른 계정으로 로그인'}</button>}
        {signOutError && <p role="alert" className="mt-3 text-sm text-red-500">{signOutError}</p>}
      </div>
    </div>
  );
}
