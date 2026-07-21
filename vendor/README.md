# vendor — 외부 라이브러리 로컬 보관 (제안)

## 배경
`index.html`의 **이미지 저장/공유** 기능은 [html2canvas](https://html2canvas.hertzen.com/)에 의존합니다. 현재는 CDN에서 불러오며, 안정성을 위해 **jsdelivr 실패 시 unpkg로 자동 폴백**하도록 이중화되어 있습니다.

하지만 CDN 방식은 다음 약점이 있습니다:
- 사용자가 오프라인이거나 CDN이 차단된 네트워크(사내망 등)에선 저장/공유가 동작하지 않음
- CDN 장애·버전 변경에 노출됨

## 현재 상태: ✅ 로컬 우선(vendor) + CDN 폴백 적용됨
`vendor/html2canvas.min.js`(버전 1.4.1)가 리포에 포함되어 있고, `index.html`은 **로컬을 먼저 로드**하되 실패 시 `jsdelivr → unpkg` 순으로 폴백합니다. 완전 오프라인 동작 + 버전 고정 + (원하면) SRI 무결성 검증이 가능합니다.

> 파일은 `npm pack html2canvas@1.4.1`로 취득한 공식 배포본(`dist/html2canvas.min.js`)입니다.

### 적용 절차
1. html2canvas 1.4.1 minified 파일을 이 폴더에 `html2canvas.min.js`로 저장합니다.
   - 출처 예: `https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js`
   - (현재 개발 환경은 프록시로 CDN 다운로드가 막혀 있어 파일을 직접 넣지 못했습니다. 네트워크가 열린 환경에서 받아 커밋하거나, 파일을 전달해 주시면 반영하겠습니다.)
2. `index.html`의 CDN `<script>` 한 줄을 아래로 교체합니다(주석에 동일 안내 있음):
   ```html
   <script src="vendor/html2canvas.min.js"
     onerror="this.onerror=null;var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';document.head.appendChild(s);"></script>
   ```
   → 로컬이 있으면 로컬, 없거나 실패하면 CDN으로 폴백됩니다.

## 되돌리기 (원하면)
로컬 파일을 두고 싶지 않다면 `index.html`의 스크립트 `src`를 다시 CDN(`https://cdn.jsdelivr.net/...`)으로 바꾸고 이 파일을 지우면 됩니다. 다만 로컬 우선이 오프라인·버전 고정 면에서 더 안전합니다.
