// src/components/ProjectCard.tsx
interface ProjectCardProps {
  title: string;
  imgSrc: string;
  description: string;
  stack: string;
  onClick?: () => void;
  isPersonal?: boolean; // 프로젝트 구별
}

const ProjectCard = ({
  title,
  imgSrc,
  description,
  stack,
  onClick,
  isPersonal
}: ProjectCardProps) => {
  // bg-hover 개인 프로젝트/팀프로젝트 분기
  const baseBg = isPersonal ? "bg-[#C4E1E6]" : "bg-orange-100";
  const hoverBg = isPersonal ? "hover:bg-[#A4CCD9]" : "hover:bg-[#FFD09B]";

  const badgeText = isPersonal ? "Personal Project" : "Team Project";
  const badgeBg = isPersonal ? "bg-[#81b9cb]" : "bg-orange-400";

  return (
    <div
      className={`relative p-4 rounded-[1vw] cursor-pointer ${baseBg} ${hoverBg} transition duration-200`}
      onClick={onClick}
    >
      {/* 뱃지 표시 */}
      <span
        className={`absolute left-3 top-3 px-3 py-1 text-xs font-semibold rounded-full text-white shadow ${badgeBg}`}
      >
        {badgeText}
      </span>
      <br />
      <br />
      <div className="h-40 mb-4 flex justify-center items-center">
        <img src={imgSrc} alt={`${title} 이미지`} className="h-40" />
      </div>
      <p className="font-bold">{title}</p>
      <p>
        <br />
        {description}
        <br />
        <br />
        stack: {stack}
        
      </p>
    </div>
  );
};

export default ProjectCard;
