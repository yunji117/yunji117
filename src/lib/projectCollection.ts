import type { PortfolioProject } from '../types/portfolio';

/**
 * Keep code-bundled projects available until they have a database record, then
 * let the database version take over without losing a valid bundled cover.
 */
export function mergePortfolioProjects(
  fallbackProjects: PortfolioProject[],
  databaseProjects: PortfolioProject[],
): PortfolioProject[] {
  const databaseById = new Map(databaseProjects.map((project) => [project.id, project]));

  const mergedFallbacks = fallbackProjects.map((fallback) => {
    const saved = databaseById.get(fallback.id);
    if (!saved) return fallback;

    databaseById.delete(fallback.id);
    const image = saved.image || fallback.image;

    return {
      ...fallback,
      ...saved,
      image,
      thumbnailUrl:
        image === fallback.image
          ? saved.thumbnailUrl ?? fallback.thumbnailUrl
          : saved.thumbnailUrl,
    };
  });

  return [...mergedFallbacks, ...databaseProjects.filter((project) => databaseById.has(project.id))];
}
