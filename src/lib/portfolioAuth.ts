import type { Session, SupabaseClient } from '@supabase/supabase-js';

export type AuthPhase = 'initializing' | 'signed-out' | 'checking' | 'admin' | 'member' | 'error';
export interface PortfolioAuthState {
  session: Session | null;
  phase: AuthPhase;
  message: string;
}
export const initialAuthState: PortfolioAuthState = { session: null, phase: 'initializing', message: '' };

// Authentication and permission checks are separate: an RPC failure never logs the user out.
export function observePortfolioAuth(
  client: SupabaseClient,
  publish: (state: PortfolioAuthState) => void,
) {
  let state = initialAuthState;
  let disposed = false;
  let revision = 0;
  let authEvents = 0;
  const emit = (next: PortfolioAuthState) => {
    if (disposed) return;
    state = next;
    publish(next);
  };
  const fail = (message: string) => emit({ ...state, phase: 'error', message });

  const checkAccess = async (session: Session) => {
    const request = ++revision;
    emit({ session, phase: 'checking', message: '' });
    try {
      const { data, error } = await client.rpc('is_portfolio_admin').abortSignal(AbortSignal.timeout(15000));
      if (disposed || request !== revision) return;
      if (error) {
        fail(`Google 로그인은 유지되어 있지만 관리자 권한 확인에 실패했습니다. ${error.code ? `[${error.code}] ` : ''}${error.message}`);
        return;
      }
      emit({ session, phase: data === true ? 'admin' : 'member', message: data === true ? '' : '현재 계정에 관리자 권한이 등록되어 있지 않습니다.' });
    } catch {
      if (!disposed && request === revision) fail('Google 로그인은 유지되어 있지만 관리자 권한 확인 서버에 연결하지 못했습니다. 다시 확인해 주세요.');
    }
  };
  const acceptSession = (session: Session | null) => {
    if (disposed) return;
    if (!session) {
      ++revision;
      emit({ session: null, phase: 'signed-out', message: '' });
      return;
    }
    if (state.session?.access_token === session.access_token && ['checking', 'admin', 'member'].includes(state.phase)) return;
    // Keep the auth event callback synchronous, and do database work outside it.
    void checkAccess(session);
  };
  const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
    ++authEvents;
    queueMicrotask(() => acceptSession(session));
  });

  const restore = async () => {
    const eventsAtStart = authEvents;
    try {
      // Surface OAuth callback errors that an INITIAL_SESSION(null) event alone hides.
      const { error: initializationError } = await client.auth.initialize();
      if (disposed) return;
      if (initializationError && !state.session) {
        fail(`로그인 복귀 처리에 실패했습니다: ${initializationError.message}`);
        return;
      }
      const { data, error } = await client.auth.getSession();
      if (disposed || eventsAtStart !== authEvents) return;
      if (error) {
        fail(`저장된 로그인 상태를 확인하지 못했습니다: ${error.message}`);
        return;
      }
      acceptSession(data.session);
    } catch {
      if (!disposed && eventsAtStart === authEvents) fail('로그인 상태를 복원하지 못했습니다. 브라우저의 사이트 저장소 허용 여부와 네트워크 연결을 확인해 주세요.');
    }
  };
  void restore();

  return {
    retry: () => {
      if (state.session) void checkAccess(state.session);
      else {
        emit({ ...state, phase: 'initializing', message: '' });
        void restore();
      }
    },
    dispose: () => {
      disposed = true;
      ++revision;
      subscription.unsubscribe();
    },
  };
}
