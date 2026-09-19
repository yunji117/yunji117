export function moveProject(ids: string[], source: string, target: string): string[] {
  const from = ids.indexOf(source); const to = ids.indexOf(target);
  if (from < 0 || to < 0 || from === to) return ids;
  const next = [...ids]; next.splice(from, 1); next.splice(to, 0, source); return next;
}
export function sortProjects<T extends { id: string; sortOrder?: number }>(projects: T[], order: string[]): T[] {
  const ranks = new Map(order.map((id, index) => [id, index]));
  return [...projects].sort((a, b) => {
    const ar = ranks.get(a.id); const br = ranks.get(b.id);
    if (ar !== undefined || br !== undefined) return (ar ?? Infinity) - (br ?? Infinity);
    return (a.sortOrder ?? (Number(a.id) || 0)) - (b.sortOrder ?? (Number(b.id) || 0));
  });
}
