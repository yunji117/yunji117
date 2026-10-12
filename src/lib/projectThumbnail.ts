export const resolveProjectThumbnail = (
  projectImage: string,
  currentThumbnail?: string,
  bundledImage?: string,
  bundledThumbnail?: string,
) => currentThumbnail ?? (projectImage === bundledImage ? bundledThumbnail : undefined);
