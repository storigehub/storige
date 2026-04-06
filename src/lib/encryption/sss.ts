// Shamir's Secret Sharing (SSS) — 유고 시 복호화 키 분산 저장
// 순수 TypeScript 구현 (GF(256) 기반)
// 의존성 없이 Web Crypto API와 함께 동작

const GF256_EXP = new Uint8Array(512)
const GF256_LOG = new Uint8Array(256)

// GF(256) 룩업 테이블 초기화 (생성 다항식 0x11d)
;(function initGF() {
  let x = 1
  for (let i = 0; i < 255; i++) {
    GF256_EXP[i] = x
    GF256_EXP[i + 255] = x
    GF256_LOG[x] = i
    x = x ^ (x << 1) ^ (x & 0x80 ? 0x1d : 0)
    x &= 0xff
  }
  GF256_LOG[0] = 0
})()

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0
  return GF256_EXP[(GF256_LOG[a] + GF256_LOG[b]) % 255]
}

function gfDiv(a: number, b: number): number {
  if (b === 0) throw new Error('GF256: division by zero')
  if (a === 0) return 0
  return GF256_EXP[(GF256_LOG[a] + 255 - GF256_LOG[b]) % 255]
}

// 다항식 평가 f(x) over GF(256)
function evalPoly(poly: Uint8Array, x: number): number {
  let result = 0
  for (let i = poly.length - 1; i >= 0; i--) {
    result = gfMul(result, x) ^ poly[i]
  }
  return result
}

// 비밀값(바이트 배열)을 n개 조각으로 분할, k개로 복원 가능
export function split(secret: Uint8Array, n: number, k: number): Uint8Array[] {
  if (k < 2 || k > n || n > 255) {
    throw new Error('SSS: invalid parameters (2 ≤ k ≤ n ≤ 255)')
  }

  const shares: Uint8Array[] = Array.from({ length: n }, () => new Uint8Array(secret.length + 1))

  for (let byteIdx = 0; byteIdx < secret.length; byteIdx++) {
    // 랜덤 계수로 다항식 생성 (상수항 = secret[byteIdx])
    const poly = new Uint8Array(k)
    poly[0] = secret[byteIdx]
    crypto.getRandomValues(poly.subarray(1))

    for (let shareIdx = 0; shareIdx < n; shareIdx++) {
      const x = shareIdx + 1 // x값은 1부터 시작
      shares[shareIdx][0] = x
      shares[shareIdx][byteIdx + 1] = evalPoly(poly, x)
    }
  }

  return shares
}

// k개 조각으로 비밀값 복원 (라그랑주 보간)
export function combine(shares: Uint8Array[]): Uint8Array {
  if (shares.length < 2) throw new Error('SSS: minimum 2 shares required')

  const secretLength = shares[0].length - 1
  const secret = new Uint8Array(secretLength)

  for (let byteIdx = 0; byteIdx < secretLength; byteIdx++) {
    let value = 0

    for (let i = 0; i < shares.length; i++) {
      const xi = shares[i][0]
      const yi = shares[i][byteIdx + 1]

      let num = yi
      for (let j = 0; j < shares.length; j++) {
        if (i !== j) {
          const xj = shares[j][0]
          num = gfMul(num, xj)
          num = gfMul(num, gfDiv(1, xi ^ xj))
        }
      }
      value ^= num
    }

    secret[byteIdx] = value
  }

  return secret
}

// 조각 → Base64 문자열 (저장/전송용)
export function encodeShare(share: Uint8Array): string {
  return btoa(String.fromCharCode(...share))
}

// Base64 문자열 → 조각
export function decodeShare(encoded: string): Uint8Array {
  return Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0))
}

// 비밀 문자열을 n개 조각으로 분할 (편의 함수)
export function splitString(secret: string, n: number, k: number): string[] {
  const enc = new TextEncoder()
  const shares = split(enc.encode(secret), n, k)
  return shares.map(encodeShare)
}

// n개 조각 문자열로 비밀 복원 (편의 함수)
export function combineStrings(encodedShares: string[]): string {
  const shares = encodedShares.map(decodeShare)
  const dec = new TextDecoder()
  return dec.decode(combine(shares))
}
