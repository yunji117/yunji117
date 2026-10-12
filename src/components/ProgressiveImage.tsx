import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react';

interface ProgressiveImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
}

export default function ProgressiveImage({
  wrapperClassName = '',
  className = '',
  src,
  onLoad,
  onError,
  style,
  ...props
}: ProgressiveImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [loadedSource, setLoadedSource] = useState<string>();
  const [failedSource, setFailedSource] = useState<string>();
  const loaded = Boolean(src && loadedSource === src);
  const failed = Boolean(src && failedSource === src);

  useEffect(() => {
    const image = imageRef.current;
    // Cached images may finish before React receives a browser load event.
    // Reading `complete` prevents the preview from remaining transparent.
    if (src && image?.complete) {
      if (image.naturalWidth > 0) {
        setLoadedSource(src);
        setFailedSource((current) => current === src ? undefined : current);
      }
      else setFailedSource(src);
    }
  }, [src]);

  return (
    <span className={`relative block overflow-hidden bg-slate-200/70 dark:bg-slate-700/60 ${wrapperClassName}`}>
      {!loaded && !failed && (
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/45 to-transparent dark:via-white/10"
        />
      )}
      {failed && (
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-gray-500 dark:text-gray-300">
          이미지를 불러오지 못했습니다
        </span>
      )}
      <img
        {...props}
        ref={imageRef}
        src={src}
        className={className}
        style={{
          ...style,
          opacity: loaded ? 1 : 0,
          transitionProperty: 'opacity, transform',
          transitionDuration: '300ms',
        }}
        onLoad={(event) => {
          if (src) {
            setLoadedSource(src);
            setFailedSource((current) => current === src ? undefined : current);
          }
          onLoad?.(event);
        }}
        onError={(event) => {
          if (src) {
            setFailedSource(src);
            setLoadedSource((current) => current === src ? undefined : current);
          }
          onError?.(event);
        }}
      />
    </span>
  );
}
