/* Card-level prompt examples. Grounded in canonical bilingual term records; no external requests. */
function cardPromptText(value){return String(value??'').replace(/\s+/g,' ').trim();}
function cardPromptField(entry,field,language){
 const translated=language==='en'?entry.translations?.en?.[field]:undefined;
 return cardPromptText(translated||entry[field]);
}
function cardPromptDeliverable(entry,language){
 const d=entry.domain||'',c=entry.category||'',kind=entry.kind||'',three=entry.demo?.engine==='three';
 if(three||d==='3D·렌더링'||c.includes('실시간 3D'))return language==='en'
  ?'Build a real interactive 3D example with Three.js where practical, including orbit/keyboard controls and a fallback when WebGL is unavailable.'
  :'가능한 경우 Three.js로 실제 조작 가능한 3D 예시를 구현하고, 시점 조작·키보드 입력과 WebGL 미지원 시 대안을 제공해줘.';
 if(d==='데이터 시각화'||d==='분석 UI·UX')return language==='en'
  ?'Create an appropriate chart or analysis UI with clearly labeled, synthetic example data, readable axes and a comparison of when this chart is appropriate.'
  :'형태에 맞는 차트나 분석 UI를 가상 데이터로 구현하고, 축·범례·수치의 의미와 이 표현이 적합한 상황을 명확히 설명해줘.';
 if(d==='게임 VFX'||d==='게임 애니메이션'||d==='모션그래픽'||d==='UI·UX 모션'||d==='모션·사운드'||d==='아이콘·모션·VFX 구현')return language==='en'
  ?'Provide a short, actually animated demonstration with a clear beginning, transition and end or loop; include replay/pause controls and a reduced-motion alternative.'
  :'시작·전환·종료 또는 반복 구간이 드러나는 실제 애니메이션을 만들고, 다시 재생·정지 조작과 모션 감소 대안을 제공해줘.';
 if(d==='맵·레벨 디자인'||d==='지도·GIS'||d==='게임 디자인')return language==='en'
  ?'Show the concept with a labeled map, level sketch or state diagram; distinguish its purpose and constraints using a realistic example scenario.'
  :'라벨이 있는 맵·레벨 스케치 또는 상태 도식으로 개념을 설명하고, 예시 상황에서의 역할과 제약을 구분해줘.';
 if(d==='Python·데스크톱'||d==='네이티브·모바일')return language==='en'
  ?'Present a small, runnable example in the relevant Python/desktop or native UI framework, with keyboard and touch alternatives where supported.'
  :'해당 Python·데스크톱 또는 네이티브 UI 환경에 맞는 작은 실행형 예제를 만들고, 지원되는 경우 키보드·터치 대안도 제공해줘.';
 if(d==='레퍼런스'||d==='제작 도구'||d==='웹 라이브러리'||kind.includes('라이브러리')||kind.includes('도구'))return language==='en'
  ?'Make an original explanatory comparison or simple demonstration of the tool or technique. Do not imply it is the vendor’s official UI, code or benchmark.'
  :'도구·기술의 역할을 이해할 수 있는 독자적 비교 도식 또는 간단한 시연을 만들어줘. 공급사의 공식 UI·원본 코드·성능 측정치처럼 표현하지 마.';
 if(d==='UI·UX'||d==='웹·CSS'||d==='인터랙션 실습'||d==='아이콘·상태 표시')return language==='en'
  ?'Build a self-contained HTML/CSS/JavaScript interface example showing the default, interactive and feedback states, including keyboard and touch input.'
  :'기본 상태·상호작용 상태·피드백 상태가 드러나는 독립 실행형 HTML/CSS/JavaScript UI 예제를 만들고, 키보드·터치 입력을 지원해줘.';
 return language==='en'
  ?'Create a faithful original visual reference or small runnable study, with labels explaining the essential shape, behavior and use case.'
  :'핵심 형태·동작·사용처를 알아볼 수 있는 독자적 시각 레퍼런스나 작은 실행형 예제를 만들고, 주요 요소에 설명을 붙여줘.';
}
function examplePromptFor(entry,language=locale){
 const lang=language==='en'?'en':'ko';
 const nameKo=cardPromptText(entry.ko),nameEn=cardPromptText(entry.en);
 const definition=cardPromptField(entry,'description',lang);
 const usage=cardPromptField(entry,'usage',lang);
 const distinction=cardPromptField(entry,'difference',lang)||cardPromptField(entry,'notes',lang);
 const topic=lang==='en'?`${nameEn} (${nameKo})`:`${nameKo} (${nameEn})`;
 const category=language===locale?`${label('domains',entry.domain)} / ${label('categories',entry.category)}`:`${entry.domain} / ${entry.category}`;
 const result=cardPromptDeliverable(entry,lang);
 if(lang==='en')return [
  `Create a precise, reusable visual reference for “${topic}”.`,
  `Category: ${category}.`,
  `Definition: ${definition||'Explain this design concept accurately.'}`,
  usage?`Use case: ${usage}`:'',
  distinction?`Distinction / caution: ${distinction}`:'',
  '',
  `Deliverable: ${result}`,
  'Make the defining characteristics recognizable and explain one practical usage example. Include runnable code or a reproducible procedure when appropriate. Use text at least 14px, accessible controls, and a responsive layout. Label any invented numbers as illustrative; do not claim a vendor-official implementation.'
 ].filter((line,i)=>line||i===5).join('\n');
 return [
  `‘${topic}’ 개념을 정확하게 보여주는 실무용 시각 레퍼런스를 제작해줘.`,
  `분류: ${category}.`,
  `정의: ${definition||'이 디자인 개념을 정확하게 설명해줘.'}`,
  usage?`사용 상황: ${usage}`:'',
  distinction?`구분·주의사항: ${distinction}`:'',
  '',
  `구현 요청: ${result}`,
  '핵심 특징이 한눈에 구분되도록 만들고 실제 활용 예시를 하나 설명해줘. 적절한 경우 실행 가능한 코드나 재현 절차를 제공해줘. 텍스트는 최소 14px, 접근 가능한 조작과 반응형 배치를 적용해줘. 임의의 수치는 예시 데이터로 표시하고 공급사 공식 구현이라고 주장하지 마.'
 ].filter((line,i)=>line||i===5).join('\n');
}
