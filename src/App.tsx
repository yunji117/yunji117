// src/App.tsx
import Sidebar from "./components/Sidebar";
import Hero from "./components/Hero";
import Warning from "./components/Warning";
import About from "./components/About";
import Encyclopedia from "./components/Encyclopedia";
import Skill from "./components/Skill";
import ProjectSection from "./components/ProjectSection";
import Contact from "./components/Contact";
import Thanks from "./components/thanks"

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="mt-20 sm:mt-0 sm:ml-40 w-full">
        <Hero />
        <Warning />
        <About />
        <Encyclopedia />
        <Skill />
        <ProjectSection />
        <Contact />
        <Thanks/>
      </main>
    </div>
  );
}

export default App;
