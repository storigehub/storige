// Shamir's Secret Sharing (SSS) 래퍼 — secrets.js-34r7h 기반
// 유고 시 복호화 키를 n명에게 분산, k명이 모이면 복원 가능

// eslint-disable-next-line @typescript-eslint/no-require-imports
const secrets = require('secrets.js-34r7h') as typeof import('secrets.js-34r7h')

/**
 * 비밀 문자열을 n개 조각으로 분할 (k개 조합으로 복원 가능)
 * @param secret 분산할 비밀값 (패스프레이즈 등)
 * @param n 총 조각 수 (예: 가족 3명)
 * @param k 복원에 필요한 최소 조각 수 (예: 2명)
 * @returns Base64 인코딩된 조각 문자열 배열
 */
export function splitSecret(secret: string, n: number, k: number): string[] {
  if (k < 2 || k > n || n > 255) {
    throw new Error(`SSS: 유효하지 않은 파라미터 (2 ≤ k ≤ n ≤ 255), 입력값: k=${k}, n=${n}`)
  }

  // secrets.js는 hex 문자열로 동작 — UTF-8 바이트를 hex로 변환
  const enc = new TextEncoder()
  const bytes = enc.encode(secret)
  const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')

  return secrets.share(hex, n, k)
}

/**
 * k개 이상의 조각으로 비밀값 복원
 * @param shares 조각 문자열 배열 (최소 k개)
 * @returns 복원된 비밀 문자열
 */
export function combineSecrets(shares: string[]): string {
  if (shares.length < 2) {
    throw new Error('SSS: 최소 2개 이상의 조각이 필요합니다')
  }

  const hex = secrets.combine(shares)

  // hex → UTF-8 바이트 → 문자열
  const bytes = new Uint8Array(hex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)))
  const dec = new TextDecoder()
  return dec.decode(bytes)
}

/**
 * 조각 유효성 검증 — 잘못된 조각 형식 감지
 */
export function isValidShare(share: string): boolean {
  try {
    return typeof share === 'string' && share.length > 0 && /^[0-9a-f]+$/i.test(share)
  } catch {
    return false
  }
}
