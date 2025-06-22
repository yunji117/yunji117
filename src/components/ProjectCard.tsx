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

  return (
    <div
      className={`p-4 rounded-[1vw] cursor-pointer ${baseBg} ${hoverBg} transition duration-200`}
      onClick={onClick}
    >
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
