import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { moveProject } from '../../lib/projectOrder';

export function useProjectDrag(ids: string[], enabled: boolean, onDrop: (ids: string[]) => void) {
  const [dragged, setDragged] = useState<string | null>(null);
  const [preview, setPreview] = useState<string[] | null>(null);
  const gesture = useRef<{ id: string; x: number; y: number; timer: ReturnType<typeof setTimeout>; active: boolean; ids: string[]; element: HTMLElement; pointerId: number } | null>(null);
  const suppressClick = useRef(false);
  const reset = () => {
    if (gesture.current) {
      clearTimeout(gesture.current.timer);
      if (gesture.current.element.hasPointerCapture(gesture.current.pointerId)) gesture.current.element.releasePointerCapture(gesture.current.pointerId);
    }
    gesture.current = null; setDragged(null); setPreview(null);
  };
  useEffect(() => () => { if (gesture.current) clearTimeout(gesture.current.timer); }, []);
  const onPointerDown = (event: PointerEvent<HTMLElement>, id: string) => {
    if (!enabled || event.button !== 0 || (event.target as HTMLElement).closest('button:not([data-drag-handle]), a, input')) return;
    suppressClick.current = false;
    const element = event.currentTarget;
    const pointerId = event.pointerId;
    const timer = setTimeout(() => {
      const current = gesture.current;
      if (!current) return;
      current.active = true; suppressClick.current = true;
      element.setPointerCapture(pointerId); setDragged(id); setPreview(current.ids);
    }, 300);
    gesture.current = { id, x: event.clientX, y: event.clientY, timer, active: false, ids: [...ids], element, pointerId };
  };
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const current = gesture.current; if (!current) return;
    if (!current.active) {
      if (Math.hypot(event.clientX - current.x, event.clientY - current.y) > 8) reset();
      return;
    }
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-project-id]')?.dataset.projectId;
    if (target) { current.ids = moveProject(current.ids, current.id, target); setPreview(current.ids); }
    if (event.clientY < 90) window.scrollBy(0, -16);
    else if (event.clientY > window.innerHeight - 90) window.scrollBy(0, 16);
  };
  const onPointerUp = () => {
    const current = gesture.current;
    if (current?.active && current.ids.join() !== ids.join()) onDrop(current.ids);
    reset();
  };
  return { dragged, preview, onPointerDown, onPointerMove, onPointerUp, onPointerCancel: reset, suppressClick };
}
