import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Move, RotateCcw, ZoomIn } from 'lucide-react';

export type CoverCropValue = { x: number; y: number; scale: number };

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const distance = (points: { x: number; y: number }[]) => Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);

export default function CoverImageCropper({
  src,
  initial,
  saving = false,
  onCancel,
  onSave,
}: {
  src: string;
  initial: CoverCropValue;
  saving?: boolean;
  onCancel: () => void;
  onSave: (value: CoverCropValue) => void | Promise<void>;
}) {
  const [crop, setCrop] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const pinchDistanceRef = useRef<number | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return;
      event.preventDefault();
      const factor = Math.exp(-event.deltaY * 0.004);
      setCrop((current) => ({ ...current, scale: clamp(current.scale * factor, MIN_SCALE, MAX_SCALE) }));
    };
    frame.addEventListener('wheel', handleWheel, { passive: false });
    return () => frame.removeEventListener('wheel', handleWheel);
  }, []);

  const finishPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(event.pointerId);
    if (pointersRef.current.size === 1) lastPointRef.current = [...pointersRef.current.values()][0] ?? null;
    else lastPointRef.current = null;
    pinchDistanceRef.current = null;
    setDragging(pointersRef.current.size > 0);
  };

  return (
    <section aria-label="대표 이미지 위치 조정 패널" className="space-y-5 rounded-2xl border border-cyan-200 bg-cyan-50/60 p-4 dark:border-cyan-400/20 dark:bg-cyan-500/5 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold">대표 이미지 위치 조정</h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">이미지를 드래그해 위치를 옮기세요. Ctrl + 마우스 휠 또는 두 손가락 벌리기·모으기로 확대하거나 축소할 수 있습니다.</p>
        </div>
        <button type="button" onClick={() => setCrop({ x: 50, y: 50, scale: 1 })} className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-white dark:hover:bg-white/10"><RotateCcw className="h-4 w-4" />초기화</button>
      </div>

      <div
        ref={frameRef}
        role="application"
        aria-label="대표 이미지 드래그 및 확대·축소 영역"
        tabIndex={0}
        className={`relative aspect-[8/5] w-full select-none overflow-hidden rounded-xl border-2 border-dashed border-cyan-500 bg-slate-200 shadow-inner outline-none focus-visible:ring-4 focus-visible:ring-cyan-300 dark:bg-slate-800 ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ touchAction: 'none' }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          const point = { x: event.clientX, y: event.clientY };
          pointersRef.current.set(event.pointerId, point);
          lastPointRef.current = point;
          if (pointersRef.current.size === 2) pinchDistanceRef.current = distance([...pointersRef.current.values()]);
          setDragging(true);
        }}
        onPointerMove={(event) => {
          if (!pointersRef.current.has(event.pointerId)) return;
          const point = { x: event.clientX, y: event.clientY };
          pointersRef.current.set(event.pointerId, point);
          const points = [...pointersRef.current.values()];
          if (points.length >= 2) {
            const nextDistance = distance(points);
            const previousDistance = pinchDistanceRef.current;
            if (previousDistance && previousDistance > 0) setCrop((current) => ({ ...current, scale: clamp(current.scale * (nextDistance / previousDistance), MIN_SCALE, MAX_SCALE) }));
            pinchDistanceRef.current = nextDistance;
            return;
          }
          const previous = lastPointRef.current;
          lastPointRef.current = point;
          if (!previous) return;
          const rect = event.currentTarget.getBoundingClientRect();
          setCrop((current) => ({
            ...current,
            x: clamp(current.x - ((point.x - previous.x) / rect.width) * 100 / current.scale, 0, 100),
            y: clamp(current.y - ((point.y - previous.y) / rect.height) * 100 / current.scale, 0, 100),
          }));
        }}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
      >
        <img src={src} alt="조정 중인 대표 이미지" draggable={false} className="pointer-events-none h-full w-full" style={{ objectFit: 'cover', objectPosition: `${crop.x}% ${crop.y}%`, transform: `scale(${crop.scale})`, transformOrigin: 'center' }} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-lg border-2 border-dashed border-white/80 shadow-[0_0_0_999px_rgba(15,23,42,0.08)]" />
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 before:absolute before:left-1/2 before:top-[-7px] before:h-10 before:w-px before:-translate-x-1/2 before:bg-white/70 after:absolute after:left-[-7px] after:top-1/2 after:h-px after:w-10 after:-translate-y-1/2 after:bg-white/70" />
        <span className="pointer-events-none absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-black/70 px-3 py-2 text-xs font-semibold text-white"><Move className="h-4 w-4" />드래그하여 위치 조정</span>
      </div>

      <label className="block">
        <span className="mb-2 flex items-center justify-between text-sm font-semibold"><span className="inline-flex items-center gap-2"><ZoomIn className="h-4 w-4" />확대 비율</span><span className="font-normal text-gray-500">{Math.round(crop.scale * 100)}%</span></span>
        <input type="range" min={MIN_SCALE} max={MAX_SCALE} step="0.01" value={crop.scale} onChange={(event) => setCrop((current) => ({ ...current, scale: Number(event.target.value) }))} aria-label="대표 이미지 확대 비율" className="w-full accent-cyan-500" />
      </label>

      <div className="grid gap-2 sm:grid-cols-[auto_1fr]">
        <button type="button" disabled={saving} onClick={onCancel} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm disabled:opacity-50 dark:border-white/15 dark:bg-white/5">취소</button>
        <button type="button" disabled={saving} onClick={() => void onSave(crop)} className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-600 disabled:cursor-wait disabled:opacity-60">{saving ? '대표 이미지 저장 중…' : '대표 이미지 수정 저장'}</button>
      </div>
    </section>
  );
}
