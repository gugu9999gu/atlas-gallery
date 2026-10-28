# ATLAS Gallery v3.1.1

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
