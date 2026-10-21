export const isRealProfilePath = (pathname: string) => {
  const normalizedPath = pathname.replace(/\/+$/, '');
  return normalizedPath.endsWith('/realyunji');
};
