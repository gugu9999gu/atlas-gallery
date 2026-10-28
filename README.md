# ATLAS Gallery v3.1.0

배포 주소: https://atlas-gallery.app/

2026-10-28 공개판. Cloudflare Worker `atlas-gallery` + 비공개 R2 `atlas-gallery-assets` + 엣지 캐시로 제공됩니다. Sites 배포가 아니라 사용자가 지정한 Cloudflare 배포입니다.

저장소: https://github.com/gugu9999gu/atlas-gallery

## 콘텐츠
- 원본 2,112개 기록, 대표 항목 2,109개, 25개 분야, 111개 세부 분류.
- 차트·분석 UI/UX 특집 110개(신규와 기존 보강 항목 포함).
- 항목에 대응하는 구체적인 시각/모션 예시 999개.
- 추상적 원리·라이브러리 등 1,110개는 설명·적용 관계를 담은 개념 도식. 실제 라이브러리/게임 엔진 실행 화면이 아님을 표시합니다.
- 진행 링, 원형 진행 표시기 계열, 스피너, 도넛 차트, 게이지를 명시적 렌더러 키로 분리합니다.
- 원형 진행 표시기는 상위 개념으로 확정형과 불확정형을 함께 보여주며, 동일 용어의 다른 이름을 억지로 별개 개념으로 만들지 않습니다.
- 차트 수치는 가상 데이터입니다. 제품 제공자의 공식 번역이나 공식 데모를 표방하지 않습니다.

## 실행·편집
`public/index.html`은 단독 실행형입니다. 다만 소개/정책/분류 문서 링크는 웹서버에서 열어야 작동합니다.

로컬 서버 예시: `python -m http.server 8000 --directory public`

- `src/app.js`: 애플리케이션, 명시적 미리보기 레지스트리, 광고 로더(기본 비활성).
- `src/style.css`: 디자인 시스템과 모션.
- `src/layout.html`: HTML 템플릿.
- `data/atlas-gallery-bilingual.json`: 전체 정의·용도·주의사항·출처·영문 번역.
- `data/i18n.json`: 한영 인터페이스 사전.
- `data/advertising.json`: 광고 활성화 게이트.
- `public/category-*.html`: 검색엔진 및 JavaScript 비활성 환경용 읽기 페이지.
- `worker.mjs`: 공개 파일 허용목록, 읽기 전용 요청, 응답 헤더, 캐시, 404.
- `wrangler.jsonc`: 실제 배포 자원과 일치하는 설정. 토큰·개인 계정 키는 미포함.

앱 재빌드: `python scripts/build.py`

분류 데이터나 설명을 수정하면 정적 분류 문서와 소개 페이지의 개수도 갱신해야 합니다. 현재 빌드 스크립트는 앱 HTML만 재빌드합니다.

R2 업로드 계획: `python scripts/upload-r2.py`
실제 업로드는 로컬 환경변수 `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` 설정 후 `--apply`를 명시할 때만 수행합니다. 토큰을 코드나 채팅에 넣지 마세요. Worker 배포와는 별도 단계이며, 새 릴리스 시 Worker의 캐시 버전도 갱신하세요.

## 주요 주소
- `/?lang=ko&collection=charts`: 차트.
- `/?lang=en&collection=analytics`: 영어 분석 UI.
- `/?lang=ko#term=dar-591d4726c6a6`: 원형 진행 표시기 및 비교.
- `/?adpreview=1`: 광고를 요청하지 않고 배치만 확인.
- `/catalog.html`: 전체 문서 색인.

## 광고
현재 **광고 비활성화**, 외부 광고 스크립트 요청 0건. 일반 방문자에게 빈 광고 자리도 보이지 않습니다.
16번째, 40번째 카드 뒤에 최대 2개 수동 배너만 준비했습니다. 고정/앵커/전면/팝업/자동 광고는 사용하지 않습니다.

실제 연결에는 발급된 AdSense publisher/slot 또는 AdFit unit ID, 매체 심사, 정책 검토가 필요합니다. 광고 제공자에 맞는 동의 관리와 개인정보 안내, 운영자 문의 연락처를 준비한 다음 활성화해야 합니다. 단순 동의 버튼을 인증된 CMP로 간주하지 않습니다.

현재 Worker CSP는 외부 광고 SDK와 프레임을 차단합니다. 광고 활성화 시 필요한 도메인만 검토 후 허용해야 합니다. `advertising.json`의 enabled만 켜면 광고가 나오는 구조가 아닙니다. 승인/개인정보/동의 게이트, `window.atlasAdConsent()` 통합, 실제 단위 ID를 모두 연결해야 합니다. AdFit 코드/생성시점과 CSP는 실제 계정 환경에서 다시 검증하세요.

가짜 publisher ID나 ads.txt 레코드는 생성하지 않았습니다. 광고 심사 승인을 보장하지 않습니다.

## 사업자 정보
상호: 스투피아드
사업자등록번호: 868-24-02133
통신판매업 신고번호: 2026-화성동탄-0527

추가 연락처·주소는 제공받지 않아 임의 작성하지 않았습니다. 개인정보 안내는 현재 무회원·무결제·광고 비활성 기능을 기준으로 작성했으며 법률 검토를 보증하지 않습니다.

## 검증
`qa/live-verification.json`에 공개 URL에서 확인한 응답·동작·해시·광고 상태를 기록했습니다. API 키나 임시 업로드 URL은 포함하지 않습니다. 최초 배포 후 임시 R2 버킷과 다운로드 secret을 제거했습니다. 운영 R2 버킷은 서비스 원본이므로 삭제하지 마세요.

현재 범위의 확인이지 모든 브라우저·모든 미리보기의 개별 의미와 상업적 이용 라이선스를 전수 보증한 것은 아닙니다.


## v3.1 미리보기 확장
237개 기존 개념 도식을 항목별 SVG 연구 예시로 교체했습니다. 새 용어를 부풀려 추가한 것이 아닙니다.

| 구현 모듈 | 추가 항목 |
|---|---:|
| motion.js | 38 |
| vfx.js | 105 |
| maps.js | 51 |
| model.js | 43 |

104개는 진행 슬라이더와 사용자 요청 재생을 제공합니다. 카드에 포인터를 올리거나 키보드 초점을 옮겼을 때 해당 카드만 짧게 재생합니다. 동시에 하나만 재생하며, 전역 일시정지·화면 숨김·prefers-reduced-motion을 존중합니다. 나머지 새 예시는 해당 개념의 정적 구조를 보여줍니다.

- 새 미리보기 모음: `/?lang=ko&collection=expanded`
- `src/previews/`: 명시적 용어명 → 개별 SVG 렌더러. 일치하지 않는 항목은 기존 개념 도식을 유지합니다.
- `qa/preview-coverage.json`: 완료·잔여 개수와 이번에 추가한 항목별 레지스트리.
- `qa/remaining-previews.json`, `docs/PREVIEW_BACKLOG.md`: 남은 1,110개 추적 목록.
- `scripts/test-previews.py`: 실제 Chromium 기반 40개 검사. 한/영, 360~1440px, 슬라이더, 감소된 모션, 검색, 기존 진행 링 회귀 등을 점검합니다.
- `requirements-test.txt`: 검증한 브라우저 테스트 도구 버전.

SVG는 직접 제작한 설명용 시각화입니다. 특정 라이브러리나 게임 엔진을 실행한 결과로 표시하지 않습니다. 그래픽 중복 검사는 제목·설명 텍스트를 제외한 4개 시간 위치의 도형 시퀀스를 비교합니다. 차이를 검출할 수 있지만 모든 표현의 의미 정확성을 자동으로 보증하는 검사는 아닙니다.

테스트 실행:
```sh
python -m pip install -r requirements-test.txt
python -m playwright install chromium
python scripts/build.py
python scripts/test-previews.py
python scripts/build.py
```
설치된 Chromium을 쓰려면 `CHROMIUM_PATH`를 지정합니다. GitHub Actions는 검증만 담당하며 Cloudflare에 대한 배포 비밀키를 저장하거나 자동 공개 배포하지 않습니다. 운영 게시에는 검증한 커밋과 빌드 산출물의 해시를 확인한 별도 승인된 배포를 사용합니다.
