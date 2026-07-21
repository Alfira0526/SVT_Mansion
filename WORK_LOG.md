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

## 사용자 확인 필요 (마지막에 정리)
- 모바일 실기기 Web Share 동작 확인
- 디자인 방향(상징색 강도 등) 최종 취향 확인
- Google Apps Script 엔드포인트 보안/레이트리밋 (백엔드 영역)
- 로컬 html2canvas 벤더링 여부 (현재 프록시로 다운로드 불가 → 이중 CDN으로 대체)
