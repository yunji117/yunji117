export type ImageViewerBoundary = 'first' | 'last';
export type ImageSwipeAction = 'previous' | 'next' | 'exit' | null;
export type SwipePoint = { x: number; y: number };

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

export const getImageSwipeAction = (
  start: SwipePoint,
  end: SwipePoint,
  viewportWidth: number,
): ImageSwipeAction => {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const isMostlyHorizontal = Math.abs(deltaX) > Math.abs(deltaY) * 1.25;
  if (!isMostlyHorizontal) return null;

  const startedNearRightEdge = start.x >= viewportWidth - 80;
  if (startedNearRightEdge && deltaX < -90) return 'exit';
  if (deltaX < -60) return 'previous';
  if (deltaX > 60) return 'next';
  return null;
};
