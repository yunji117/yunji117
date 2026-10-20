import { motion } from 'framer-motion';
import type { ProjectChartPoint } from '../types/portfolio';

const WIDTH = 640;
const HEIGHT = 320;
const PADDING = { top: 34, right: 28, bottom: 58, left: 48 };

export default function ProjectLineChart({
  points,
  animated = false,
  className = '',
}: {
  points: ProjectChartPoint[];
  animated?: boolean;
  className?: string;
}) {
  if (!points.length) {
    return <div className={`flex h-full min-h-48 items-center justify-center text-sm text-gray-500 ${className}`}>이름과 값을 추가하면 그래프가 표시됩니다.</div>;
  }

  const values = points.map((point) => point.value);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const padding = rawMin === rawMax ? Math.max(1, Math.abs(rawMin) * 0.15) : (rawMax - rawMin) * 0.12;
  const min = rawMin - padding;
  const max = rawMax + padding;
  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const coordinates = points.map((point, index) => ({
    ...point,
    x: points.length === 1 ? PADDING.left + plotWidth / 2 : PADDING.left + (plotWidth * index) / (points.length - 1),
    y: PADDING.top + ((max - point.value) / (max - min)) * plotHeight,
  }));
  const path = coordinates.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ');
  const summary = points.map((point) => `${point.name || '이름 없음'} ${point.value}`).join(', ');

  return (
    <div className={`h-full w-full overflow-hidden rounded-xl bg-white/75 p-2 dark:bg-slate-950/45 ${className}`}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`프로젝트 그래프: ${summary}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {[0, 1, 2, 3, 4].map((step) => {
          const y = PADDING.top + (plotHeight * step) / 4;
          return <line key={step} x1={PADDING.left} x2={WIDTH - PADDING.right} y1={y} y2={y} stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeDasharray="5 7" />;
        })}
        <line x1={PADDING.left} x2={PADDING.left} y1={PADDING.top} y2={HEIGHT - PADDING.bottom} stroke="currentColor" className="text-slate-400 dark:text-slate-600" />
        <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={HEIGHT - PADDING.bottom} y2={HEIGHT - PADDING.bottom} stroke="currentColor" className="text-slate-400 dark:text-slate-600" />
        {animated ? (
          <motion.path d={path} fill="none" stroke="#06b6d4" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: 'easeInOut' }} />
        ) : (
          <path d={path} fill="none" stroke="#06b6d4" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        )}
        {coordinates.map((point, index) => (
          <g key={`${point.name}-${index}`}>
            {animated ? (
              <motion.circle cx={point.x} cy={point.y} r="7" fill="#fff" stroke="#0891b2" strokeWidth="4" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: coordinates.length === 1 ? 0.2 : (index / (coordinates.length - 1)) * 1.35, duration: 0.25 }} />
            ) : (
              <circle cx={point.x} cy={point.y} r="7" fill="#fff" stroke="#0891b2" strokeWidth="4" />
            )}
            <text x={point.x} y={point.y - 14} textAnchor="middle" className="fill-slate-700 text-[14px] font-bold dark:fill-slate-100">{point.value}</text>
            <text x={point.x} y={HEIGHT - 28} textAnchor="middle" className="fill-slate-600 text-[13px] dark:fill-slate-300">{point.name || `항목 ${index + 1}`}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
