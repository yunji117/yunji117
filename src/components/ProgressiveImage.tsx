import { useEffect, useState, type ImgHTMLAttributes } from 'react';

interface ProgressiveImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
}

export default function ProgressiveImage({
  wrapperClassName = '',
  className = '',
  src,
  onLoad,
  style,
  ...props
}: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => setLoaded(false), [src]);

  return (
    <span className={`relative block overflow-hidden bg-slate-200/70 dark:bg-slate-700/60 ${wrapperClassName}`}>
      {!loaded && (
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/45 to-transparent dark:via-white/10"
        />
      )}
      <img
        {...props}
        src={src}
        className={className}
        style={{
          ...style,
          opacity: loaded ? 1 : 0,
          transitionProperty: 'opacity, transform',
          transitionDuration: '300ms',
        }}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
      />
    </span>
  );
}
