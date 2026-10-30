# ATLAS Gallery v3.2.7 — 신규 미구현 항목 20개 실행형 보강 (2026-10-30)

- 기존 canonical ID 20개에 **실제 조작 가능한** HTML/CSS/JavaScript 학습용 시연을 추가했습니다. 아이콘 상태 4종, 게임 조작·피드백 13종, 사용자 흐름·반응형 3종입니다.
- 대표 항목: Permission Denied Indicator, Non-text Contrast, Icon State Variant, Nine-slice Scaling, Coyote Time, Jump Buffer, Variable Jump Height, Cooldown, Stamina System, Hitbox, Hurtbox, Invincibility Frames, Parry Window, Dead Zone, Hit Stop, Damage Number, Fog of War, Progression System, User Flow, Responsive QA.
- 카드별 한·영 명칭 복사, 스크롤형 예시 프롬프트, 코드 복사, `구현 예정` 상태, 독립 HTML 예제 및 기존 기능을 유지합니다.
- **GitHub 정적 소스 계열**은 2,189개 중 1,204개 구체적 시각/실행 예시(55.0%), 남은 985개 구현 예정으로 집계됩니다. 각 항목의 정확한 구현 상태는 빌드가 생성하는 `qa/preview-progress.json`에서 확인합니다.
- **Cloudflare 운영 계열은 GitHub 소스와 별도**로 발전한 v3.10이었으며 2,153개 항목 중 906개가 도식이었습니다. 새 기능을 이 운영 계열에 안전하게 이식한 **ATLAS v3.11** 릴리스에서는 기존 391개 직접 조작 카드에 20개를 더해 411개, 도식은 886개입니다. 두 데이터셋의 숫자를 합산하지 않습니다.
- 검증: `scripts/test-next-studies.py`, 기존 인터랙션/Three.js/광고/미리보기/모바일 테스트. R2 `releases/v310`과 `releases/v39`는 삭제하지 않고 유지하며 새 릴리스는 `releases/v311`을 사용합니다.
- 실제 이용 가능한 기능은 HTML·CSS·브라우저 API의 원리 시연입니다. 게임 엔진의 네이티브 렌더링·실측 프레임·상용 툴과의 동등성을 주장하지 않습니다.

# ATLAS Gallery v3.2.6

## v3.2.6 미구현 미리보기 계속 구현 / 구현 예정 상태 (2026-10-30)

- **기존 미구현 항목 44개**에 원본 실행형 HTML/CSS/JavaScript 미리보기를 연결합니다. 용어 ID와 기존 프롬프트·복사 기능을 보존합니다.
- 주요 구현: CSS Transitions / Keyframes / Animations, Web Animations API, View Transition API(비지원 시 대체), FLIP, Scrollytelling, 스크롤 진행률, 이징 곡선, Frame-by-frame / Sprite Animation, Recoil / Recovery, 입력 버퍼, 보조 작업, 피드백 루프.
- **실행형이 없는 카드에는 ‘구현 예정’ / 'Planned' 라벨**을 표시합니다. 카드의 개념 도식, 한·영 상세 정의, 미리보기 필터에도 동일하게 구분합니다. 미구현 상태에서 복사되는 코드는 실제 구현이 아니라 **설명용 도식 코드**임을 명시합니다.
- 이전 **1,140 / 2,189**에서 44개를 업그레이드해 빌드 기준 목표는 **1,184 / 2,189**, **잔여 1,005개**입니다. 정확한 수치는 `qa/preview-progress.json` 및 CI 빌드 결과를 확인합니다.
- 원본 구현 모듈 `src/interactive/backlog.js` 및 `src/interactive/backlog.css`, 정확한 매핑 `data/backlog-studies.tsv`, 회귀 검사 `scripts/test-backlog-batch.py`, 상세 설명 `docs/NEXT_PREVIEW_BATCH_V326.md`.
- 구현 상태는 샘플/도식의 실제 연결 기준이며, 모든 시각 예시의 의미 정확성·전 기기 성능·Cloudflare 운영 사이트 배포를 자동 보증하지 않습니다.

# ATLAS Gallery v3.2.5

## v3.2.5 카드별 명칭 복사·예시 프롬프트 (2026-10-30)

- 모든 **2,189개 canonical 카드**의 한글명과 영문명 옆에 각각 독립적인 복사 아이콘 버튼을 표시합니다. 언어를 전환해도 양쪽 명칭을 모두 복사할 수 있습니다.
- 각 카드에 **예시 프롬프트**를 표시합니다. 용어의 정의·사용 상황·구분 포인트와 실제 분야(모션, 3D, 차트, 게임, 도구, UI)에 맞춘 구현 요구가 들어가며, 한국어·영어 자동 전환을 지원합니다.
- 예시 프롬프트는 카드 안의 높이 제한된 스크롤 영역에서 읽고 **프롬프트 복사** 버튼으로 전체 원문을 가져갈 수 있습니다. 카드의 **코드 복사** 및 **자세히** 버튼은 유지합니다.
- 키보드 스크롤, 14px 이상 텍스트, 포커스 표시, 모바일·다크 테마 및 클립보드 권한 실패 시 수동 복사 대안을 포함했습니다.
- `src/interactive/card-prompts.js`(용어별 프롬프트 생성), `src/interactive/card-prompts.css`(카드 레이아웃), `scripts/test-card-prompts.py`(양 언어·전 항목 검증)를 추가했습니다. 원본 용어 정의의 ID는 보존합니다.
- 프롬프트는 **기존 백과사전 기록을 바탕으로 조합한 활용 예시**이며, 외부 AI 서비스를 호출해 생성한 문장이나 공식 제공자 프롬프트가 아닙니다.
- GitHub 코드 변경과 `https://atlas-gallery.app/`의 운영 배포는 별개입니다.

# ATLAS Gallery v3.2.4

## v3.2.4 모션그래픽 용어·실행형 미리보기 확장 (2026-10-30)

- 기존 **모션그래픽** 관련 개념을 재사용하고, **26개의 실행형 모션그래픽 레퍼런스**를 추가했습니다. 새 레퍼런스는 기존 canonical ID가 있을 때 중복 정의 대신 해당 ID에 실시간 시연을 연결합니다.
- 신규 전용 분야 **모션그래픽 / Motion Graphics**, 네 개 세부 분류: **타이포·브랜드 모션**, **셰이프·마스크·레이어**, **타임라인·속도 설계**, **합성·절차적 이펙트**.
- 대표 미리보기: Kinetic Typography, Character Stagger, Lower Third, Trim Paths, Shape Morphing, Alpha Matte, Luma Matte, Time Remapping, Hold Keyframe, Seamless Loop, Motion Blur, Echo Trails, Glitch Transition, Particle Burst, Liquid Morphing.
- 카드와 개별 설명 페이지에서 원본 **CSS / SVG 애니메이션을 실행**, **다시 재생·일시정지·0.5×/1×/2× 배속** 조작. 문서 보이지 않을 때 모션 중단, `prefers-reduced-motion` 및 사이트 전역 모션 중지 존중.
- **코드 복사**는 같은 미리보기 소스로 구성한 독립 HTML/CSS/SVG 예제. 각 용어 한·영 정의, 정적 Markdown/HTML 설명, JSON-LD `DefinedTerm`, 검색 색인, 관련 Adobe 공식 분야 참고 링크 보존.
- `src/interactive/mograph.js`와 `src/interactive/mograph.css`에 시각 구현, `data/interaction-recipes.tsv`에 설명을 관리합니다. 빌드는 `npm run build`; Chromium 회귀 테스트는 `python scripts/test-motion-graphics.py` (26개 정의·카드 실행·배속·일시정지·복사·영어·움직임 감소).
- 전문가용 After Effects 프로젝트나 실제 합성 엔진 렌더링이 아니라 **직접 제작한 웹 기반 원리 시연**입니다. 블러·매트·리퀴드 표현의 결과는 전문 제작 도구와 다를 수 있습니다.
- GitHub 커밋과 운영 Cloudflare 배포는 별도 작업입니다. CI는 빌드·검증 및 `wrangler --dry-run`만 수행합니다.

# ATLAS Gallery v3.2.2

## v3.2.2 시각 품질 검수 및 추가 구현 (2026-10-29)

기존 2,167개 고유 레퍼런스를 Chromium 브라우저에서 한 번씩 렌더링해 검사했습니다. **1,100개는 구체적 시각/동작 미리보기**, **1,067개는 개념 도식**입니다. Three.js 24종은 별도 실 WebGL 검증과 렌더링 이미지를 유지합니다.

- 기존 미구현 용어 **12개**를 실행형 데모로 전환. 총 실행형 인터랙션 **115개**(DOM 91 + Three.js 24)이며 신규 고유 용어를 추가하지 않았습니다.
- 소스 기준 구현률 **1,100 / 2,167 = 50.76%**, 잔여 도식 **1,067개**. `qa/preview-progress-v322.json`과 `qa/preview-progress.json`을 빌드마다 생성합니다.
- SVG 레이블 겹침을 측정해 작은 카드에서는 겹치는 보조 라벨만 가리고 상세 보기에서는 원본 레이블을 유지합니다.
- 데이터/차트 특집의 3개 대표 미니 차트를 14px 글자 충돌이 없는 독립 시각 아이콘으로 교체했습니다.
- 개념 도식은 14px 글자와 말줄임 구조로 개선했고 좁은 모바일에서는 카드 1열을 사용합니다.
- `src/interactive/studies.js`: 전환·등장·퇴장·이징·블러·백드롭 블러·글래스모피즘·뉴모피즘·고대비·색상 비의존·감소된 모션·본문 건너뛰기 등 12개 독립 실행형 예제.
- `scripts/visual-audit-local.py`: 전체 카드별 이미지 캡처 및 SVG 글자 겹침, 미리보기 영역 이탈, 14px 미만, 빈 영역, JS 오류 검사. GitHub Actions가 계량 보고서와 컨택트시트를 보관합니다.
- 자동검수는 모든 아이템을 렌더링한 수치/위치 검사입니다. 2,167개 각각의 의미 정확성을 사람 눈으로 정밀 평가한 증명이 아니며 대표 화면과 46개 오류 후보만 별도 수동 비교했습니다.
- CI 성공과 운영 Cloudflare 배포는 별개입니다.

## v3.2.1 추가 인터랙션 및 진행률 (2026-10-29)

- 기존 미구현 디자인 용어 **30개**에 실행형 예제를 연결했습니다. 이 중 4개는 직전 추가했던 유사 신규 항목을 기존 정의 ID로 정리한 것이며, 26개는 이번 배치의 새 구현입니다.
- 실행형 레시피 **103종**(DOM/CSS/Pointer/Keyboard 79종, Three.js 24종). 신규 도메인 용어를 중복 증가시키지 않도록 기존 canonical ID를 우선 보존합니다.
- 원래 3.1의 2,109개 항목 중 도식으로 남아 있던 항목은 1,110개였습니다. v3.2.1의 빌드 산출물 `qa/preview-progress-v321.json`은 원래 미구현 ID와 실제 레시피 매핑을 대조해 진척도를 자동 계산합니다. 현재 소스 기반 계산 목표는 **1,088 / 2,167 = 50.21%**, 잔여 **1,079개**입니다.
- 진행률은 코드와 미리보기 매핑 기준입니다. 개별 시각화의 의미 검증, 사용자 브라우저 전수 검증, 검색엔진 색인 및 실제 운영 배포 성공률과는 구별합니다.
- `src/interactive/advanced.js`는 Live Region, 드래그 앤 드롭, 핀치 확대, 목록 재정렬, 단축키, Undo/Redo, 확인 패널, 디바운스/스로틀, 포커스 트랩, 스크롤 스크러빙 등 22가지 독립 조작 예제를 제공합니다.
- 기존에 제공한 카드별 코드 복사, 한국어/영어 정적 설명 페이지, 최소 14px 글자, Three.js 렌더링, 사용자 동의형 AdFit 설정은 유지합니다.
- 로컬 테스트: `npm run check && npm run build && python scripts/test-interactions.py`. GitHub Actions는 코드 검증 및 배포 dry-run만 수행하므로 별도의 운영 배포 확인이 필요합니다.


배포 주소: https://atlas-gallery.app/
저장소: https://github.com/gugu9999gu/atlas-gallery

2026-10-28 공개판. Cloudflare Worker `atlas-gallery` + 비공개 R2 `atlas-gallery-assets` + 엣지 캐시로 제공됩니다. Sites가 아니라 사용자가 지정한 Cloudflare 배포입니다.

## 콘텐츠
- 원본 2,112개 기록, 대표 항목 2,109개, 25개 분야, 111개 세부 분류.
- 차트·분석 UI/UX 특집 110개(신규와 기존 보강 항목 포함).
- 항목에 대응하는 구체적인 시각/모션 예시 999개.
- 추상적 원리·라이브러리 등 1,110개는 설명·적용 관계를 담은 개념 도식입니다. 실제 라이브러리/게임 엔진 실행 화면으로 표시하지 않습니다.
- 진행 링, 원형 진행 표시기 계열, 스피너, 도넛 차트, 게이지를 명시적 렌더러 키로 구분합니다. 동일 개념의 별칭을 억지로 다른 개념으로 만들지 않습니다.
- 차트 수치는 가상 데이터이며, 번역과 시각화는 제품 제공자의 공식 번역·데모가 아닙니다.

## 실행·편집
`public/index.html`은 단독 실행형입니다. 소개/정책/분류 문서 링크는 웹서버에서 열어야 작동합니다. 운영 도메인이 아닌 로컬·파일 환경에서는 실제 광고 SDK를 요청하지 않습니다.

```sh
python scripts/build.py
python -m http.server 8000 --directory public
```

- `src/app.js`: 애플리케이션, 미리보기 레지스트리, 카드 렌더링.
- `src/advertising.js`, `src/advertising.css`: 애드핏 크기 선택, 동의, 지연 로드, 미공급 처리, 광고 설정.
- `src/style.css`, `src/layout.html`: 디자인·모션 및 HTML 템플릿.
- `src/previews/`: 분야별 SVG 및 조작형 미리보기.
- `data/atlas-gallery-bilingual.json`: 전체 정의·용도·주의사항·출처·영문 번역.
- `data/i18n.json`: 한영 인터페이스 사전.
- `data/advertising.json`: 광고 공급자·발급 단위·노출 제한·동의 설정.
- `public/category-*.html`: 검색엔진 및 JavaScript 비활성 환경용 읽기 페이지.
- `worker.mjs`: 공개 파일 허용목록, 읽기 전용 요청, 응답 헤더, 버전별 캐시, 404.
- `wrangler.jsonc`: 실제 배포 자원과 일치하는 설정. 토큰·개인 계정 키는 미포함.

분류 데이터나 설명을 수정하면 정적 분류 문서와 소개 페이지의 개수도 갱신해야 합니다. 현재 빌드 스크립트는 앱 HTML만 재빌드합니다.

R2 업로드 계획은 `python scripts/upload-r2.py`로 확인합니다. 실제 업로드는 환경변수 `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` 설정 후 `--apply`를 명시할 때만 수행됩니다. 토큰을 코드나 채팅에 넣지 마세요. Worker 배포와 별도 단계이며 새 릴리스 시 Worker 캐시 버전도 갱신해야 합니다.

## 주요 주소
- `/?lang=ko&collection=charts`: 차트.
- `/?lang=en&collection=analytics`: 영어 분석 UI.
- `/?lang=ko&collection=expanded`: v3.1 추가 미리보기 237개.
- `/?lang=ko#term=dar-591d4726c6a6`: 원형 진행 표시기 및 비교.
- `/?adpreview=1`: 실제 광고 요청 없이 배치만 확인.
- `/?adsettings=1`: 광고 허용·거절 설정.
- `/?ads=off`: 해당 방문에서 광고 요청하지 않기.
- `/catalog.html`: 전체 문서 색인.

## v3.1.1: 사이드바 정리와 Kakao AdFit
사이드바의 `VISUAL KNOWLEDGE BASE` 카드를 제거했습니다. 현재 카카오 애드핏 연결은 활성화되어 있지만, **방문자의 명시적인 허용 이전에는 광고 SDK를 요청하지 않습니다.** Google AdSense는 연결하지 않았습니다.

| 위치 | PC | 모바일 |
|---|---|---|
| 16번째 카드 뒤 | 충분한 너비일 때 728×90 | 320×100 |
| 40번째 카드 뒤 | 300×250 | 300×250 |

최대 두 개의 일반 문서 흐름 내 광고만 사용합니다. 매우 좁은 화면의 첫 슬롯은 250×250으로 대체하고, 원래 크기가 들어가지 않는 슬롯은 생략합니다. 320×480·160×600·320×50 단위는 설정에 보관하지만 현재 노출하지 않습니다. 발급 크기를 축소·확대·절단하지 않습니다. 팝업·고정·앵커·전면·자동 광고를 사용하지 않습니다.

- SDK는 한 번만 로드하고, 새로 보이는 슬롯에만 `adfit.render(element)`를 호출합니다.
- 검색·언어 전환·더 보기 때 이미 로드한 광고 iframe을 DOM에서 떼거나 다시 생성하지 않습니다. 앱 주도의 자동 광고 새로고침도 없습니다.
- NO-AD 콜백·스크립트 실패·로드 제한 시간 초과 시 빈 슬롯을 접습니다.
- 허용·거절 선택은 이 브라우저에 최대 180일 저장됩니다. 거절해도 모든 콘텐츠를 이용할 수 있습니다.
- 하단 ‘광고 설정’에서 철회하면 광고를 제거하고 SDK 없는 페이지로 다시 엽니다. 이미 전송된 정보의 회수나 제3자 쿠키의 삭제를 의미하지는 않습니다.
- Global Privacy Control이 활성화되면 이전 허용 여부와 관계없이 광고를 요청하지 않습니다.
- CSP는 애드핏 SDK·광고 응답·소재에 필요한 호스트만 허용하도록 갱신했습니다. 단순히 모든 외부 스크립트를 허용하지 않습니다.

운영자가 제공한 실제 일곱 단위 ID를 사용했습니다. 설치는 카카오의 매체 승인·광고 재고·수익을 보증하지 않습니다. 운영자가 자신의 광고를 클릭하거나 반복 노출로 시험하면 안 됩니다. 개발 검사는 모의 SDK와 `adpreview`를 사용합니다. 이 동의 UI를 인증된 CMP나 모든 관할지역의 법적 준수 증명으로 간주하지 않습니다.

공식 참고: https://github.com/adfit/adfit-web-sdk · https://adfit.kakao.com/web/html/use_kakao.html

## 사업자 정보
상호: 스투피아드  
사업자등록번호: 868-24-02133  
통신판매업 신고번호: 2026-화성동탄-0527

추가 연락처·주소는 제공받지 않아 임의 작성하지 않았습니다. 개인정보 문의용 담당자·연락처는 운영자가 별도로 등록해야 합니다. 개인정보·광고 안내는 선택적 AdFit 연결에 맞춰 갱신했으며 법률 검토를 보증하지 않습니다.

## 검증·배포
```sh
python -m pip install -r requirements-test.txt
python -m playwright install chromium
python scripts/build.py
python scripts/test-previews.py
python scripts/test-adfit.py
python scripts/build.py
```
설치된 Chromium을 쓰려면 `CHROMIUM_PATH`를 지정합니다. 기존 미리보기 검사 40개와 모의 SDK 광고 검사 45개를 제공합니다. 광고 검사는 실제 광고 요청이나 클릭을 발생시키지 않습니다.

- `qa/preview-expansion-tests.json`: 기존 미리보기 검사.
- `qa/adfit-tests.json`: 광고 크기·동의·GPC·미공급·지속 DOM·반응형 검사.
- `qa/adfit-deployment-v311.json`: 별도 운영 배포·확인 기록.
- GitHub Actions는 검증만 담당하며 Cloudflare 배포 비밀키를 저장하거나 자동 공개 배포하지 않습니다.
- 운영 게시에는 검증된 커밋과 빌드 해시를 확인한 별도 승인된 배포를 사용합니다. 기존 릴리스 원본은 비공개 R2에 보존합니다.
- 운영 R2 버킷은 서비스 원본이므로 삭제하지 마세요. API 키나 임시 업로드 URL은 저장소에 넣지 않습니다.

이는 명시된 범위의 검사이며 모든 브라우저·모든 미리보기의 개별 의미·상업 이용 라이선스를 전수 보증하는 것은 아닙니다.

## v3.1 미리보기 확장
237개 기존 개념 도식을 항목별 SVG 연구 예시로 교체했습니다. 새 용어를 부풀려 추가한 것이 아닙니다.

| 구현 모듈 | 추가 항목 |
|---|---:|
| motion.js | 38 |
| vfx.js | 105 |
| maps.js | 51 |
| model.js | 43 |

104개는 진행 슬라이더와 사용자 요청 재생을 제공합니다. 카드 포인터·키보드 초점에 따라 한 번에 하나만 짧게 재생하며 전역 일시정지·화면 숨김·감소된 모션 설정을 존중합니다. 나머지는 개념의 정적 구조를 보여줍니다.

`qa/preview-coverage.json`은 완료·잔여 개수와 레지스트리를, `qa/remaining-previews.json`과 `docs/PREVIEW_BACKLOG.md`는 남은 1,110개를 관리합니다. 그래픽 중복 검사는 제목·설명을 제외한 네 시간 위치의 도형 시퀀스를 비교하지만 모든 표현의 의미 정확성을 자동으로 보증하지 않습니다.
