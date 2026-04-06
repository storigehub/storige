// 한국식 날짜 포맷 유틸리티

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

// 2025년 3월 31일 화요일
export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const dow = DAYS[date.getDay()]
  return `${y}년 ${m}월 ${d}일 ${dow}요일`
}

// 3월 31일 화
export function formatShortDate(date: Date): string {
  const m = date.getMonth() + 1
  const d = date.getDate()
  const dow = DAYS[date.getDay()]
  return `${m}월 ${d}일 ${dow}`
}

// 2025년 3월
export function formatMonth(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`
}

// 오후 12:56
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

// 상대 시간 (방금 전, 5분 전, ...)
export function formatRelative(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '방금 전'
  if (mins < 60) return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

// ISO 날짜 문자열 → Date 객체
export function parseDate(isoString: string): Date {
  return new Date(isoString)
}

// 날짜가 같은 달인지 확인
export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}
