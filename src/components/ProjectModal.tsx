// src/components/ProjectModal.tsx
import {useState} from "react";

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  overview: string;
  goal: string;
  skill: string;
  difficulties: string[];
  outputs?: string[];
  codes?: string[];
}

const ProjectModal = ({
  open,
  onClose,
  title,
  overview,
  goal,
  skill,
  difficulties,
  outputs = [],
  codes = [],
}: ProjectModalProps) => {
  const [fullImg, setFullImg] = useState<string | null>(null);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-[95vw] animate-fadein"
        style={{ minWidth: 350 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="max-h-[80vh] overflow-y-auto">
          <div className="mb-7">
            <h3 className="text-2xl font-bold text-gray-900 text-center tracking-tight">{title}</h3>
          </div>

          {/* outputs 이미지/텍스트 렌더링 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {outputs.map((out, i) =>
              out.match(/\.(png|jpe?g|gif|svg)$/i) ? (
                <img
                  key={i}
                  src={out}
                  alt={`output-${i + 1}`}
                  className="rounded-xl object-cover h-28 w-full bg-gray-200"
                  onClick={() => setFullImg(out)}
                />
              ) : (
                <div key={i} className="rounded-xl bg-gray-200 h-28 flex items-center justify-center text-gray-500 text-sm font-semibold">
                  {out}
                </div>
              )
            )}
          </div>
          <div className="text-[16px] text-gray-800 mb-7">
            <div className="mb-1"><b>프로젝트 개요</b> : {overview}</div>
            <div className="mb-1"><b>프로젝트 목표</b> : {goal}</div>
            <div className="mb-3"><b>스킬</b> : {Array.isArray(skill) ? skill.join(', ') : skill}</div>
            <div className="mb-1 font-semibold text-gray-700">어려웠던 점 & 해결 방법</div>
            {difficulties.map((d, i) => (
              <div className="mb-2 text-[15px] text-gray-600" key={i}>→ {d}</div>
            ))}
          </div>
          
          {/* codes 이미지/텍스트 렌더링 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {codes.map((code, i) =>
              code.match(/\.(png|jpe?g|gif|svg)$/i) ? (
                <img
                  key={i}
                  src={code}
                  alt={`code-${i + 1}`}
                  className="rounded-xl object-cover h-28 w-full bg-gray-200"
                  onClick={() => setFullImg(code)}
                />
              ) : (
                <div key={i} className="rounded-xl bg-gray-200 h-28 flex items-center justify-center text-gray-500 text-sm font-semibold">
                  {code}
                </div>
              )
            )}
          </div>
          
          {/* 전체화면 이미지 모달 */}
          {fullImg && (
            <div className="fixed inset-0 bg-black bg-opacity-80 z-[999] flex items-center justify-center" onClick={() => setFullImg(null)}>
              <img src={fullImg} alt="full" className="max-w-full max-h-full rounded-2xl shadow-2xl" />
            </div>
          )}

          <div className="flex justify-center">
            <button onClick={onClose} className="px-8 py-2 rounded-xl bg-gray-300 text-gray-800 font-semibold shadow hover:bg-gray-400 transition text-lg">
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProjectModal;