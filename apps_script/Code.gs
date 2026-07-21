/**
 * SVT Mansion — 결과 수집 엔드포인트 (하드닝판)
 *
 * 사용법: Google Sheet → 확장 프로그램 → Apps Script 에 이 코드를 붙여넣고
 *         "배포 > 새 배포 > 웹 앱"으로 배포한다. (실행: 나, 액세스: 익명 포함 모든 사용자)
 *         배포 URL 을 index.html 의 <form id="gsheetForm" action="..."> 에 넣는다.
 *
 * 방어선(정적 페이지라 클라이언트 검증은 우회 가능 → 실제 방어는 여기 서버측):
 *   - 허니팟(hp) 채워지면 저장 안 함
 *   - 본문 크기 상한
 *   - 스키마 검증: 정확히 15칸, floor 1..5 / unit 1..3, 허용된 입주자만
 *   - 좌표 중복·멤버 중복 거부
 *   - (선택) 공유 토큰 확인
 *
 * 주의: Apps Script 웹앱의 ContentService 응답은 항상 HTTP 200 이다.
 *       따라서 성공/실패는 응답 JSON 의 ok 필드로 구분한다(4xx 유사).
 */

var SHEET_NAME = 'responses';        // 기록 대상 시트 탭 이름 (없으면 자동 생성)
var MAX_BODY_BYTES = 10 * 1024;      // payload 최대 10KB
var EXPECT_TOKEN = '';               // 선택: 클라이언트와 공유할 토큰. 비우면 검사 안 함.

// 허용 입주자(멤버 13 + 캐럿 + 공실 + 빈칸). index.html 의 residents 와 일치시킬 것.
var ALLOWED_RESIDENTS = [
  '에스쿱스', '정한', '조슈아', '준', '호시', '원우', '우지',
  '디에잇', '민규', '도겸', '승관', '버논', '디노', '캐럿', '공실', ''
];

function doPost(e) {
  try {
    if (!e || !e.parameter) return _json({ ok: false, error: 'no_params' });

    // 1) 허니팟: 값이 있으면 봇 → 성공처럼 응답하되 저장은 하지 않음
    if (e.parameter.hp) return _json({ ok: true, skipped: true });

    // 2) 본문 크기 상한
    var raw = e.parameter.payload || '';
    if (raw.length > MAX_BODY_BYTES) return _json({ ok: false, error: 'too_large' });

    // 3) (선택) 토큰 검사
    if (EXPECT_TOKEN && e.parameter.token !== EXPECT_TOKEN) {
      return _json({ ok: false, error: 'bad_token' });
    }

    // 4) JSON 파싱
    var data;
    try { data = JSON.parse(raw); } catch (err) { return _json({ ok: false, error: 'bad_json' }); }

    // 5) 스키마 검증
    var results = data && data.results;
    if (!Array.isArray(results) || results.length !== 15) {
      return _json({ ok: false, error: 'bad_results' });
    }

    var seenCoord = {};
    var seenMember = {};
    for (var i = 0; i < results.length; i++) {
      var r = results[i] || {};
      var f = r.floor, u = r.unit, res = r.resident;

      if (!(f >= 1 && f <= 5) || !(u >= 1 && u <= 3)) return _json({ ok: false, error: 'bad_cell' });
      if (ALLOWED_RESIDENTS.indexOf(res) === -1) return _json({ ok: false, error: 'bad_resident' });

      var ck = f + '-' + u;
      if (seenCoord[ck]) return _json({ ok: false, error: 'dup_cell' });
      seenCoord[ck] = true;

      if (res && res !== '공실') {
        if (seenMember[res]) return _json({ ok: false, error: 'dup_member' });
        seenMember[res] = true;
      }
    }

    // 6) 시트 append (미리보기와 동일한 5층→1층, 1호→3호 순서로 평탄화)
    var map = {};
    results.forEach(function (r) { map[r.floor + '-' + r.unit] = r.resident || ''; });

    var row = [
      new Date(),
      String(data.submittedAt || ''),
      String(data.userAgent || '').slice(0, 300)
    ];
    for (var fl = 5; fl >= 1; fl--) {
      for (var un = 1; un <= 3; un++) {
        row.push(map[fl + '-' + un] || '');
      }
    }
    _sheet().appendRow(row);

    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: 'server_error' });
  }
}

// 헬스체크용 (배포 확인)
function doGet() {
  return _json({ ok: true, service: 'svt-mansion', ready: true });
}

function _sheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(_headerRow());
  }
  return sheet;
}

function _headerRow() {
  var h = ['recordedAt', 'submittedAt', 'userAgent'];
  for (var fl = 5; fl >= 1; fl--) {
    for (var un = 1; un <= 3; un++) {
      h.push(fl + '0' + un + '호'); // 501호 ... 103호
    }
  }
  return h;
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
