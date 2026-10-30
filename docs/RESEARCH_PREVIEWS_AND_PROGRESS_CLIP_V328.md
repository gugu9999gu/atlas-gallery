# ATLAS v3.2.8 / 운영 v3.12 — 진행 표시기 경계 수정 및 설계·검증 예제

기준일: 2026-10-30.

## 사용자 보고 문제

카드 `dar-191b8376a8af` (**선형 진행 표시기 / Linear Progress Indicator**)에서 **불확정형 로딩**을 보여주는 초록색 움직이는 세그먼트가 회색 트랙의 좌우 밖으로 드러났습니다.

기존 SVG 렌더러는 224 × 10 크기의 회색 트랙 위에 독립적으로 움직이는 `.native-segment`를 배치하지만, 움직이는 사각형에 마스킹/클리핑 경계가 없었습니다. `@keyframes atlas-segment`는 좌측 -50px부터 우측 +180px까지 이동하므로 트랙 밖 노출이 발생했습니다.

### 수정

세그먼트를 다음과 같은 **트랙과 정확히 일치하는 내부 SVG 뷰포트** 안으로 이동했습니다.

```svg
<svg data-progress-clip="linear-family"
     x="38" y="116" width="224" height="10"
     viewBox="0 0 224 10" overflow="hidden"
     preserveAspectRatio="none">
  <rect class="native-segment"
        x="0" y="0" width="61" height="10" rx="5"
        fill="#1cae9b" />
</svg>
```

확정형 진행률 68% 및 슬라이더 값 변경, 비교 카드의 라벨·데이터는 그대로 유지합니다. 내부 SVG는 고유 ID를 만들지 않아 카드 복제/비교에서도 ID 충돌을 피합니다. DOM에서 `overflow=hidden`, CSS computed overflow 및 재렌더링 뒤 구조 유지를 검증합니다. 크롬의 위치 측정값이 이동 요소 자체의 전체 기하 영역을 반환할 수 있다는 점과 **실제 페인트가 클리핑되는 것**은 구별합니다.

## 추가 실행형 레퍼런스 20개

분야: **설계·검증**, 기존 canonical ID 보존.

- 구조·시나리오: Information Architecture (IA), Task Flow, User Journey Map, Service Blueprint, Persona, State Matrix, Content Model, Design Handoff
- 테스트 방법: Usability Testing, Heuristic Evaluation, Cognitive Walkthrough, Card Sorting, Tree Testing, Visual Regression Test, Accessibility Audit
- 분석·선택 행동: A/B Testing, Funnel Analysis, Heatmap Analysis, Fitts's Law, Hick–Hyman Law

모든 예제는 HTML/CSS/JavaScript로 직접 제작했으며 카드에서 조작할 수 있습니다. 한·영 UI, 14px 이상 텍스트, 키보드·터치 입력, 코드 복사를 제공합니다. A/B·퍼널·히트맵의 데이터는 **가상 값**입니다. 접근성 감사는 실제 인증이 아닌 체크리스트 시연입니다.

## 구현률과 릴리스 간 구분

| 지표 | GitHub 소스 v3.2.8 | Cloudflare 운영 v3.12 |
|---|---:|---:|
| 고유 레퍼런스 | 2,189 | 2,153 |
| 구체적 시각/실행형 예시 | 1,224 | 1,287 |
| 구현 예정 도식 | 965 | 866 |
| 직접 조작 카드 | 별도 메트릭 | 431 |

이 두 데이터 계열은 서로 독립적으로 발전했으며 혼합 계산하지 않습니다.

## 배포 안전성

Cloudflare는 기존 운영 v3.11의 `releases/v311` 자산을 변경하지 않고 새 `releases/v312`에 복제·수정했습니다. 릴리스 후 이전 Worker 버전을 롤백에 사용할 수 있도록 보존합니다.

검증 범위: GitHub 빌드/원래 기능/AdFit/WebGL/시각 검수, 20개 한·영 시연 및 코드 내보내기, 진행 표시기 SVG 클리핑, Cloudflare 미리보기 Worker의 상세 화면·구현 현황. 실제 광고 재고·외부 장치 전체 동작까지 보증하지 않습니다.

릴리스 완료 여부와 Cloudflare API 배포 버전 ID는 `releases/v312/deployment.json`에 기록합니다.
