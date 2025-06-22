// src/components/Encyclopedia.tsx
const Encyclopedia = () => (
  <section id="encyclopedia" className="min-h-screen flex items-center justify-center px-10">
    <div>
      <h2 className="text-2xl font-bold">KIM HELLO 백과사전</h2>
      <div className="mt-4 flex gap-4 items-center">
        <img src="./img/yunjicharacternobg.png" alt="character" className="w-40" />
        <p>
          📏 기본 정보<br />
          “ 155cm의 키, 240mm의 발, M 사이즈의 옷.<br />
          겉보기엔 작고 조용해 보일 수 있지만, 머릿속에는 매일 새로운 도전이 뛰어다니고 있어요”<br />
          <br />
          🧠 성격 소개<br />
          “감정에 민감하지만 쉽게 울지 않아요. <br />
          낯을 처음에는 잠깐 가리지만 한 번 친해지면 개그코드 폭주합니다. 공감도 자신있습니다.”<br />
          <br />
          💛 취향 파트<br />
          “고기, 간식, 강아지, 산책을 사랑해요. <br />
          하지만 오이랑, 굴, 딸기, 번데기, 멍개는 제발 no thank you,,,,,,,”<br />
        </p>
      </div>
    </div>
  </section>
);
export default Encyclopedia;
