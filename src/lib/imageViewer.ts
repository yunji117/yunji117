export type ImageViewerBoundary = 'first' | 'last';

export type ImageViewerMove = {
  image: string;
  boundary?: ImageViewerBoundary;
};

export const moveImageViewer = (
  images: string[],
  currentImage: string,
  direction: -1 | 1,
): ImageViewerMove => {
  const currentIndex = images.indexOf(currentImage);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextIndex = safeIndex + direction;

  if (nextIndex < 0) return { image: images[safeIndex] ?? currentImage, boundary: 'first' };
  if (nextIndex >= images.length) return { image: images[safeIndex] ?? currentImage, boundary: 'last' };
  return { image: images[nextIndex] ?? currentImage };
};
