# ATLAS v3.2.6 — 남은 미리보기 44개 실행형 전환 및 구현 예정 상태

2026-10-30. 범위: 기존 용어 **2,189개**. 기존 ID 변경 및 동의어 복제 없음.

## 구현 상태 정의

- **구현 완료**: 카드가 용어별 구체적인 시각화 또는 실행형 미리보기를 제공함. 실제 제3자 라이브러리의 공식 구현임을 의미하지 않음
- **구현 예정 / Planned**: 아직 실제 구현이 없어 정의·사용처를 정리한 개념 도식만 제공함. 카드·상세 설명·한영 정적 레퍼런스에 이 상태 표시
- 코드 복사는 상태에 따라 실제 실행 가능한 독립 HTML 혹은 설명용 도식 HTML을 복사함. 미구현 라이브러리의 원본 실행 코드를 복사한다고 주장하지 않음
- 필터의 **구현 예정 · 개념 도식**은 해당 상태만 표시하고, 전체/인터랙션/3D 필터는 기존 기능을 유지함

## 이번 배치: 44개 기존 레퍼런스

| 분야 | 기존 용어 |
|---|---|
| 웹 모션·타이밍 | CSS Transitions, CSS Keyframes, CSS Animations, Web Animations API, Animation Cancel, Keyframe Animation, Animation Curve, Animation Timing, Stagger, Animation Blending |
| 스크롤·화면 전환 | Scrollytelling, Layout / Reflow, View Transition API, FLIP Layout Animation, Interruptible Transition, Reversible Transition, View Timeline, Overscroll Effect, Velocity-based Animation |
| 모션 시스템·접근성 | Performance Budget, Motion Hierarchy, Motion Preference, Essential Animation, Compositor Animation, Animation State Machine, Animation Retargeting (UI), Motion Specification |
| 프레임·레이어·이펙트 | Frame-by-frame Animation, Sprite Animation, Procedural Animation, Animation Clip, Additive Animation, Animation Layer, Animation Mask, Animation Event / Notify |
| 게임 인터랙션·피드백 | Recoil Animation, Recovery Animation, Animation Synchronization, Input Buffer, Secondary Action, Feedback Loop, Positive Feedback Loop, Negative Feedback Loop, Hit Reaction |

각 예제는 직접 작성한 HTML/CSS/JavaScript를 사용하고, 역할에 따라 키프레임·Web Animations API·실제 화면 상태 변경·스크롤 진행·드래그·보조 메뉴·피드백 등을 보여줍니다. 프레임 예산·피드백 예시의 값은 설명용 가상 데이터입니다.

## 출처·성능·접근성 경계

- 브라우저 API 참고: MDN [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API), [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API), [view()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline/view).
- View Transition API는 지원 브라우저에서 사용하고 비지원 또는 모션 감소 환경에서는 상태를 바로 전환합니다. View Timeline은 지원 범위가 달라 스크롤 이벤트로 진행률을 계산하는 대체 설명 예시입니다.
- 애니메이션은 카드가 보일 때 재생하고, 문서 숨김·모션 감소 선호·갤러리 모션 일시정지에 대응합니다.
- 카드 내 버튼·입력은 실제 조작 가능하고 14px 이상의 글자를 사용합니다.
- 새 예시는 ATLAS가 만든 학습용 구현으로, 특정 벤더·게임 엔진·GPU의 실측 성능이나 동일 렌더링을 보증하지 않습니다.

## 진척도와 검증

빌드 스크립트 `scripts/build-interactions.py`는 매번 `qa/preview-progress.json`을 다시 계산하고 `implementation_status`를 각 canonical 항목에 붙입니다. 이전 기준 **1,140 / 2,189**에서 이번 44개 구현을 더한 목표는 **1,184 / 2,189 (약 54.09%)**, 잔여 **1,005개**입니다. 정확한 수치는 성공한 빌드의 영수증과 CI 결과를 우선합니다.

`scripts/test-backlog-batch.py`는 44개 ID/키, 한·영 레퍼런스, 카드/필터 구현 예정 표시, 독립 HTML 및 실행 동작, Web Animations API, View Transition API, 드래그, 관련 카드를 검사합니다. 기존 인터랙션·AdFit·3D·모션그래픽·모바일·시각 검사도 함께 수행합니다. CI 통과와 Cloudflare 운영 배포는 별개입니다.
