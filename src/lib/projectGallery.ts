export function moveGalleryImage(images: string[], from: number, to: number): string[] {
  if (from < 0 || from >= images.length || to < 0 || to >= images.length || from === to) return images;

  const next = [...images];
  const [image] = next.splice(from, 1);
  next.splice(to, 0, image);
  return next;
}
