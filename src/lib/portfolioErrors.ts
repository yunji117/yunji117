export function portfolioErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object') return fallback;
  const detail = error as { code?: unknown; message?: unknown };
  const message = typeof detail.message === 'string' ? detail.message : '';
  if (detail.code === 'PGRST202' || detail.code === 'PGRST205' || detail.code === 'PGRST204' || detail.code === '42703') {
    return '이 기능에 필요한 데이터베이스 업데이트가 아직 적용되지 않았습니다. 저장 구조와 순서 변경 기능의 DB 설정을 적용한 뒤 다시 시도해 주세요.';
  }
  if (detail.code === '42501') {
    return message.includes('row-level security')
      ? '현재 계정에는 이 작업의 저장 권한이 없습니다. 관리자 등록 상태를 확인해 주세요.'
      : '프로젝트 데이터베이스 접근 권한이 설정되지 않았습니다. 데이터베이스 권한 업데이트를 적용한 뒤 다시 시도해 주세요.';
  }
  return message || fallback;
}
