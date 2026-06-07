// Date 객체 → "YYYY-MM-DD" (내부 헬퍼)
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// "YYYY-MM-DD" → Date 객체 (로컬 시간 기준, 내부 헬퍼)
function parseDate(dateString) {
  return new Date(dateString + "T00:00:00");
}

// 오늘을 "YYYY-MM-DD"로
export function getToday() {
  return formatDate(new Date());
}

// "YYYY-MM-DD"에 days를 더한 새 "YYYY-MM-DD" (음수면 이전 날)
export function addDays(dateString, days) {
  const date = parseDate(dateString);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

// "YYYY-MM-DD" → "YYYY-MM-DD (요일)" 표시용
export function formatDisplay(dateString) {
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  return `${dateString} (${dayNames[parseDate(dateString).getDay()]})`;
}