// AES-256-GCM 클라이언트 사이드 암호화 모듈
// Web Crypto API 기반 — 서버에 평문이 전달되지 않음

const ALGO = 'AES-GCM'
const KEY_LENGTH = 256 // bits

// 사용자 패스프레이즈 → CryptoKey (PBKDF2)
async function deriveKey(passphrase: string, salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 310_000, // OWASP 권장
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGO, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  )
}

// 평문 → 암호화 (Base64 인코딩된 결과 반환)
export async function encrypt(plaintext: string, passphrase: string): Promise<string> {
  const enc = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16)) as Uint8Array<ArrayBuffer>
  const iv = crypto.getRandomValues(new Uint8Array(12)) as Uint8Array<ArrayBuffer>
  const key = await deriveKey(passphrase, salt)

  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGO, iv },
    key,
    enc.encode(plaintext)
  )

  // salt(16) + iv(12) + ciphertext 를 하나의 배열로 합쳐 Base64 인코딩
  const combined = new Uint8Array(salt.byteLength + iv.byteLength + ciphertext.byteLength)
  combined.set(salt, 0)
  combined.set(iv, salt.byteLength)
  combined.set(new Uint8Array(ciphertext), salt.byteLength + iv.byteLength)

  return btoa(String.fromCharCode(...combined))
}

// Base64 암호문 → 복호화
export async function decrypt(encoded: string, passphrase: string): Promise<string> {
  const dec = new TextDecoder()
  const combined = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0))

  const salt = combined.slice(0, 16) as Uint8Array<ArrayBuffer>
  const iv = combined.slice(16, 28) as Uint8Array<ArrayBuffer>
  const ciphertext = combined.slice(28)

  const key = await deriveKey(passphrase, salt)

  const plaintext = await crypto.subtle.decrypt(
    { name: ALGO, iv },
    key,
    ciphertext
  )

  return dec.decode(plaintext)
}

// 암호화 검증 — 복호화 성공 여부만 확인
export async function verifyPassphrase(encoded: string, passphrase: string): Promise<boolean> {
  try {
    await decrypt(encoded, passphrase)
    return true
  } catch {
    return false
  }
}
