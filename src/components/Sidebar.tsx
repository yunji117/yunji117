// src/components/Sidebar.tsx
const Sidebar = () => (
  <aside className="w-full sm:w-40 bg-[#FFAAAA] p-4 flex sm:flex-col flex-row items-center sm:items-center justify-between sm:justify-start fixed top-0 left-0 sm:h-full h-20 z-10">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
          <p>PROFILE</p>
          <p>IMG</p>
        </div>
        <nav className="flex sm:flex-col flex-row sm:space-y-4 space-x-2 sm:space-x-0 text-[10px] sm:text-base font-semibold sm:mt-6">
          <a href="#warning">주의사항</a>
          <a href="#about">ABOUT</a>
          <a href="#encyclopedia">백과사전</a>
          <a href="#skill">SKILL</a>
          <a href="#project">PROJECT</a>
          <a href="#contact">CONTACT</a>
        </nav>
      </aside>
);
export default Sidebar;
