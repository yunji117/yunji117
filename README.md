## Hi there 👋

<!--
**yunji117/yunji117** is a ✨ _special_ ✨ repository because its `README.md` (this file) appears on your GitHub profile.

Here are some ideas to get you started:

- 🔭 I’m currently working on ...
- 🌱 I’m currently learning ...
- 👯 I’m looking to collaborate on ...
- 🤔 I’m looking for help with ...
- 💬 Ask me about ...
- 📫 How to reach me: ...
- 😄 Pronouns: ...
- ⚡ Fun fact: ...
-->
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```


```
yunji117
├─ .nojekyll
├─ eslint.config.js
├─ firstpopol.html
├─ index.html
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  ├─ img
│  │  ├─ banpick.png
│  │  ├─ Create.svg
│  │  ├─ Dayjscode.svg
│  │  ├─ DayTime.svg
│  │  ├─ DayTimeQRcode.svg
│  │  ├─ Delete.svg
│  │  ├─ Elcode.svg
│  │  ├─ firstDayTime.svg
│  │  ├─ firstmealpicker.svg
│  │  ├─ FirstWrite.svg
│  │  ├─ gameover.svg
│  │  ├─ ingDayTime.svg
│  │  ├─ Mealpicker.svg
│  │  ├─ Mealpickerinsert.svg
│  │  ├─ MealpickerQRcode.svg
│  │  ├─ modal.svg
│  │  ├─ Motoshoot.svg
│  │  ├─ Mss.svg
│  │  ├─ Obj.svg
│  │  ├─ OutPutDayTime.svg
│  │  ├─ pooptime.png
│  │  ├─ Pooptime.svg
│  │  ├─ react-custom-roulettecode.svg
│  │  ├─ RunnerFirst.svg
│  │  ├─ Runnergame.svg
│  │  ├─ running.svg
│  │  ├─ Update.svg
│  │  ├─ UsepixiJS.svg
│  │  ├─ write.png
│  │  ├─ Writing.svg
│  │  ├─ writingcut.png
│  │  └─ yunjicharacternobg.png
│  └─ vite.svg
├─ README.md
├─ src
│  ├─ App.css
│  ├─ App.tsx
│  ├─ assets
│  │  └─ react.svg
│  ├─ components
│  │  ├─ About.tsx
│  │  ├─ Contact.tsx
│  │  ├─ Encyclopedia.tsx
│  │  ├─ Hero.tsx
│  │  ├─ ProjectCard.tsx
│  │  ├─ ProjectModal.tsx
│  │  ├─ ProjectSection.tsx
│  │  ├─ Sidebar.tsx
│  │  ├─ Skill.tsx
│  │  ├─ thanks.tsx
│  │  └─ Warning.tsx
│  ├─ index.css
│  ├─ main.tsx
│  └─ vite-env.d.ts
├─ tailwind.config.js
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```