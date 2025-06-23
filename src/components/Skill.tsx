// src/components/Skill.tsx
const Skill = () => (
  <section id="skill" className="min-h-screen flex items-center justify-center px-10">
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6">SKILL</h2>
      <br/>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        <div>
          <h3 className="font-bold">Front-End</h3>
          <br />
          <ul>
            <li>• HTML / CSS / Tailwind CSS</li>
            <li>• React</li>
            <li>• Next.js</li>
            <li>• Vite</li>
            <li>• JavaScript(ts), TypeScript(ts)</li>
            <li>• electron</li>
            <li>• Jest(테스트)</li>
            <li>• Figma(UI/UX 디자인)</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold">Back-End & DB</h3>
          <br />
          <ul>
            <li>• Node.js</li>
            <li>• Express</li>
            <li>• NestJS</li>
            <li>• MongoDB, MySQL, PostgreSQL, Supabase(DB)</li>
            <li>• REST API</li>
            <li>• Docker</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold">DevOps & Tools</h3>
          <br />
          <ul>
            <li>• Git / Github</li>
            <li>• Notion</li>
            <li>• Postman</li>
            <li>• yarn, npm</li>
            <li>• VS Code</li>
            <li>• Slack</li>
            <li>• AWS / Vercel / Github Action</li>
            <li>• ubuntu, PowerShell</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);
export default Skill;
