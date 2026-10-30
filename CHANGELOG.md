## 2026-10-30 — v3.2.8 source / v3.12 Cloudflare release

- Linear Progress Indicator 불확정형 SVG 세그먼트에 로딩 트랙 224×10 내부 클리핑 적용.
- 설계·검증 분야 기존 20개 카드에 실제 HTML/CSS/JavaScript 시연 및 한·영 코드 복사 추가.
- 소스 구현 1,224/2,189, 예정 965개; 운영 v3.12 목표 직접 조작 431개, 도식 866개.
- 기존 Worker/R2 배포는 버전별로 보존하고, v3.12 운영 트래픽 100% 전환 및 실제 제보 카드 렌더링 검증 완료.

## 2026-10-30 — ATLAS v3.2.7 source / operational v3.11

- 기존 20개 미구현 항목을 실시간 아이콘·게임·UI 레퍼런스로 전환.
- GitHub 소스 1,204/2,189 구체 미리보기, 구현 예정 985개.
- 기존 Cloudflare v3.10을 유지한 별도 릴리스 v3.11 R2 자산/Worker 배포 지원.
- 20종 한영 인터랙션/복사 및 기존 성능·광고·시각 회귀 검사 보강.

## v3.2.6 — 2026-10-30

- 기존 개념 도식 44종에 실제 CSS/WAAPI/스크롤/상태 상호작용을 구현.
- 미구현 카드는 구현 예정 배지, 상세 상태 안내, 필터 표시.
- 한·영 정적 문서에 상태 명시 및 `qa/preview-progress.json` 연계 테스트 추가.
- 기본 canonical 용어 ID 유지. 운영 배포와 CI는 별개.

## v3.2.5 — 2026-10-30

- 전체 카드의 한국어·영어 명칭을 각각 아이콘으로 즉시 복사.
- 2,189개 용어의 정의·용도별 예시 프롬프트, 카드 안 스크롤 미리보기 및 프롬프트 복사.
- 한·영 전환, 모바일, 다크 모드, 키보드, 클립보드 권한 실패 회귀 테스트 추가.
- 운영 배포는 자동화하지 않음.

## v3.2.4 — 2026-10-30

- 모션그래픽 26개 한·영 실행형 참고 카드 및 독립 도메인/4개 분류 추가.
- 카드 미리보기·일시정지·재생·배속·키보드·감소된 모션 및 독립 코드 복사 연동.
- SEO 용어 정의 페이지와 코드 내보내기, 모션그래픽 Chromium 회귀 테스트 추가.
- 운영 배포와 CI 테스트는 별개.

# Changes

## 3.1.0 — 2026-10-28
- Preserve the v3 deployed baseline in the user-selected Git repository.
- Replace 237 concept diagrams with explicit original SVG previews: 38 motion, 105 VFX, 51 map/level, 43 model/rendering.
- Add 104 scrub/replay studies; animate only one hovered/focused study at a time.
- Add side-by-side comparisons, a new-preview filter, and a machine-readable remaining-work ledger.
- Retain all 2,112 records, 2,109 canonical entries, Korean/English support and disabled advertising.
- Test geometry sequences without labels, actual small-grid search paths, responsive layouts, reduced motion, and prior progress-ring behavior.

## 3.0.0 — 2026-10-28
- Analytics collection, semantic distinctions, public site, bilingual corpus, and optional light advertising placements.
