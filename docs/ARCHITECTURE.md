# 기술 개요 (Architecture)

`index.html` **단일 파일**에 HTML·CSS·JavaScript가 모두 인라인으로 들어 있습니다. 빌드 단계가 없어 파일을 브라우저로 열면 바로 동작합니다. 이 문서는 내부 구조와 데이터 흐름을 요약합니다.

## 화면 구성

1. **편집 영역** (`#building`) — 5층 × 3호 = 15개의 `.unit`. 각 유닛은 호실명, 입주자 `select`, 선택 미리보기, 초기화 버튼으로 구성.
2. **액션 버튼** (`.actions`) — 🎲 랜덤 배치 / 이사하기 / 전체 초기화 / (미리보기 후) 이미지 저장 · 공유.
3. **결과 카드** (`#previewContainer`) — 옥상 사인 → 타이틀·날짜 → 층별 그리드 → 1F 출입구 → 해시태그 푸터. **이 요소 전체가 html2canvas 캡처 대상**이라, 브랜딩(옥상·날짜·해시태그)이 저장 이미지에 항상 포함됩니다.
4. **토스트** (`#toast`) — 전송/저장 상태 알림(position: fixed).

## 핵심 데이터

```js
const residents = [ { id, label, img }, ... ]  // 멤버 13 + 캐럿 + 공실
const allSelects = []                          // 15개 select 참조
const STORAGE_KEY = "svt_mansion_state_v1"     // 자동저장 키
```

## 주요 함수 (index.html 내 `<script>`)

| 함수 | 역할 |
|---|---|
| `createBuilding()` / `createUnit()` | 편집 영역 DOM 생성. 각 select에 `change` 리스너 등록 |
| `updateAllSelectOptions()` | 이미 배치된 멤버를 다른 select 목록에서 제거(중복 방지). 공실은 예외 |
| `getSelectedUniqueIds()` | 공실 제외, 현재 선택된 멤버 id 목록 |
| `randomAssign()` | 멤버+캐럿을 Fisher–Yates 셔플로 무작위 14칸 배치, 1칸 공실 |
| `saveState()` / `loadSavedState()` / `restoreState()` | localStorage 자동 저장·복원 |
| `clearAll()` | 전체 초기화 + 저장 데이터 삭제 |
| `collectResults()` | 15칸을 `{floor, unit, resident}[]`로 수집 |
| `renderPreview(results)` | 결과 카드 DOM 렌더 + 날짜 세팅 + 저장/공유 버튼 노출 |
| `renderPreviewBlob()` | `#previewContainer`를 html2canvas로 PNG **Blob** 렌더(저장·공유 공용) |
| `downloadPreviewAsImage()` / `sharePreview()` | 저장 / Web Share(미지원 시 저장+클립보드 폴백) |
| `sendToSheetAndPreview()` | 검증 → 스로틀 → 확인 → 미리보기 → 시트 전송 |
| `showToast()` / `ensureLib()` | 상태 알림 / html2canvas 로드 가드 |

## 흐름: 이사하기

```
사용자 클릭
  → collectResults()               # 현재 배치 수집
  → 빈 배치 / 멤버 중복 검증
  → 5초 재전송 스로틀 검사
  → confirm("이대로 이사할까요?")
  → renderPreview()                # 결과 카드 생성 + 스크롤
  → hidden form POST (payload+hp)  # Apps Script 웹앱으로 전송
  → iframe onload → 완료 토스트     # (+ 6s 타임아웃 폴백)
```

## 흐름: 이미지 저장 / 공유

```
renderPreviewBlob()  # ensureLib() 가드 → html2canvas(#previewContainer) → toBlob(PNG)
  ├─ 저장: Blob → <a download>
  └─ 공유: navigator.canShare({files}) 지원 → navigator.share()
           미지원 → 저장 + 해시태그 문구 클립보드 복사
```

## 외부 의존성

- **html2canvas 1.4.1** — `vendor/html2canvas.min.js` 로컬 우선, 실패 시 CDN(jsdelivr → unpkg) 폴백. 자세한 내용은 [`vendor/README.md`](../vendor/README.md).
- **Google Apps Script**(선택) — 결과 집계. [`apps_script/README.md`](../apps_script/README.md).

## 알려진 제약

- **html2canvas는 그라디언트 글자(`background-clip:text`)를 렌더하지 못합니다.** 저장 이미지에 들어가는 텍스트는 반드시 **솔리드 컬러**를 써야 합니다(푸터가 이 이유로 솔리드 라일락 사용). 그라디언트가 필요하면 층 태그처럼 *배경*에만 적용하고 글자는 솔리드로 둡니다.
- 정적 페이지라 클라이언트측 검증/토큰은 우회 가능 — 실제 스팸 방어는 Apps Script 서버측 검증이 담당합니다.
