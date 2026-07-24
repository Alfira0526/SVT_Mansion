# SVT Mansion 개선 작업 로그

세 페르소나 진단(A 재미·공유 / B 기술·안정성 / C 비주얼) 기반 개선 작업 기록.

## A. 재미·공유 — ✅ 완료 (commit 66e831b)
- [x] 🎲 랜덤 배치 버튼
- [x] 📲 원탭 공유 (Web Share API) + 다운로드/클립보드 폴백
- [x] 공유 이미지 해시태그 푸터 브랜딩

## B. 기술·안정성 — ✅ 완료
- [x] localStorage 자동저장/복원 + 전체 초기화 버튼
- [x] 전송 성공/실패 피드백 토스트 (iframe onload + 타임아웃 폴백)
- [x] html2canvas 이중 CDN 폴백(jsdelivr→unpkg) + 런타임 가드(ensureLib)
- [x] 깨진 이미지 onerror 폴백
- [x] 접근성(select/버튼 aria-label, focus-visible)
- [x] confirm 흐름 정리(확인 후 미리보기) + README 보강 + READNE.me 제거

## C. 비주얼 — ✅ 완료
- [x] 아파트 건물 메타포(옥상 사인·층 태그·출입구·창문형 유닛) + SVT 상징색(로즈쿼츠·세레니티) 그라디언트
- [x] 아바타 모양 통일(라운드 사각) + 배치 팝 애니메이션 + 유닛 hover
- [x] 저장 이미지 디자인(옥상 배너·날짜·그라디언트 해시태그 푸터) + 💎 파비콘

## 2차 개선 (밝기·보안·벤더링) — ✅ 완료
- [x] 테마 밝기 상향 + 색상 CSS 변수 토큰화 (기능 불변)
- [x] Apps Script 서버측 하드닝 `apps_script/Code.gs` (스키마 검증·허니팟·크기상한·중복거부) + 배포/보안 문서
- [x] 클라이언트 하드닝: 폼 허니팟 `hp` 필드 + 5초 재전송 스로틀
- [x] html2canvas 벤더링 방향 문서 `vendor/README.md` + index.html 전환 스니펫(주석)

## 3차 개선 (공유 이미지 버그 수정 + 벤더링 실현) — ✅ 완료
- [x] **공유 이미지 푸터 텍스트 누락 버그 수정** — html2canvas가 그라디언트 글자(background-clip:text)를 렌더 못 해 `#세븐틴아파트 · #SVT_Mansion`가 안 보이던 문제 → 솔리드 라일락(#cdb7e0)으로 교체
- [x] **실물 html2canvas 렌더 검증 하니스** 구축(npm으로 실물 취득 → Playwright route로 실제 렌더) — 버그 재현·수정 모두 실물로 확인
- [x] **로컬 벤더링(4-A) 실현** — `vendor/html2canvas.min.js` 포함, index.html 로컬 우선 → jsdelivr → unpkg 폴백. 로컬 로드(200)·실물 export·회귀 전부 확인

## 사용자 확인/결정 필요 (마지막 안내)
1. **모바일 실기기 공유 테스트** — 폰에서 📲 공유하기 → 트위터 공유 동작 확인 (내가 불가). ※ 저장 이미지 푸터 버그는 수정됨
2. **밝기 취향** — 현재 '밝은 다크'로 조정. 더 밝게/풀 라이트 원하면 알려주기
3. **Apps Script 배포** — `apps_script/Code.gs`를 스크립트 편집기에 붙여넣고 웹앱 재배포 (권한 부여 후)
4. ~~html2canvas 벤더링~~ — (A) 로컬 벤더링으로 완료. 원치 않으면 되돌리기 가능(vendor/README.md)
