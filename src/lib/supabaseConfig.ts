export function validateSupabaseConfig(url?: string, key?: string): string | null {
  if (!url || !key) return 'Supabase URL과 브라우저용 publishable 키를 설정해 주세요.';
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
  } catch {
    return 'Supabase URL 형식이 올바르지 않습니다.';
  }
  if (key.startsWith('sb_secret_')) {
    return '서버 전용 secret 키는 브라우저에서 사용할 수 없습니다. Supabase publishable 키를 설정해 주세요.';
  }
  if (key.startsWith('sb_publishable_')) return null;
  // Legacy JWT API keys are allowed only for the public anon role.
  try {
    const payload = JSON.parse(atob(key.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.role === 'anon') return null;
  } catch {
    // An invalid or privileged key must never be bundled into the site.
  }
  return '브라우저용 Supabase publishable 키 또는 anon 키가 필요합니다.';
}
