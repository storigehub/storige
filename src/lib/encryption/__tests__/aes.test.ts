// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { encrypt, decrypt, verifyPassphrase } from '../aes'

// AES-256-GCM 암호화 모듈 테스트
describe('AES-256-GCM 암호화', () => {

  describe('encrypt / decrypt 기본 동작', () => {
    it('평문을 암호화하면 원문과 다른 Base64 문자열이 반환된다', async () => {
      const plaintext = '신한은행 계좌번호 1234-5678'
      const passphrase = 'test-passphrase-1234'

      const encrypted = await encrypt(plaintext, passphrase)

      expect(encrypted).not.toBe(plaintext)
      expect(typeof encrypted).toBe('string')
      // Base64 형식 확인 (문자 집합)
      expect(encrypted).toMatch(/^[A-Za-z0-9+/=]+$/)
    })

    it('암호화 후 복호화하면 원문이 복원된다', async () => {
      const plaintext = '비밀번호: P@ssw0rd!123'
      const passphrase = 'my-secure-passphrase'

      const encrypted = await encrypt(plaintext, passphrase)
      const decrypted = await decrypt(encrypted, passphrase)

      expect(decrypted).toBe(plaintext)
    })

    it('같은 평문을 두 번 암호화해도 결과가 다르다 (IV 랜덤성)', async () => {
      const plaintext = '동일한 내용'
      const passphrase = 'same-passphrase'

      const enc1 = await encrypt(plaintext, passphrase)
      const enc2 = await encrypt(plaintext, passphrase)

      // salt + IV가 매번 랜덤이므로 암호문이 달라야 함
      expect(enc1).not.toBe(enc2)
    })

    it('한국어, 특수문자, 이모지를 포함한 평문을 정확히 암호화/복호화한다', async () => {
      const plaintext = '🔐 비밀 정보: 가나다라마바사 & <script>alert("xss")</script>'
      const passphrase = 'unicode-test-pass'

      const encrypted = await encrypt(plaintext, passphrase)
      const decrypted = await decrypt(encrypted, passphrase)

      expect(decrypted).toBe(plaintext)
    })

    it('긴 텍스트(100KB)도 암호화/복호화가 정상 동작한다', async () => {
      // 실제 유스케이스: 긴 시크릿 코드 내용
      const plaintext = '나의 비밀 정보 '.repeat(5000) // ~100KB
      const passphrase = 'large-data-passphrase'

      const encrypted = await encrypt(plaintext, passphrase)
      const decrypted = await decrypt(encrypted, passphrase)

      expect(decrypted).toBe(plaintext)
    })
  })

  describe('패스프레이즈 검증', () => {
    it('올바른 패스프레이즈로 verifyPassphrase는 true를 반환한다', async () => {
      const plaintext = '검증 테스트 내용'
      const passphrase = 'correct-passphrase'

      const encrypted = await encrypt(plaintext, passphrase)
      const result = await verifyPassphrase(encrypted, passphrase)

      expect(result).toBe(true)
    })

    it('틀린 패스프레이즈로 verifyPassphrase는 false를 반환한다', async () => {
      const plaintext = '검증 테스트 내용'
      const passphrase = 'correct-passphrase'

      const encrypted = await encrypt(plaintext, passphrase)
      const result = await verifyPassphrase(encrypted, 'wrong-passphrase')

      expect(result).toBe(false)
    })

    it('틀린 패스프레이즈로 decrypt 시 에러가 발생한다', async () => {
      const plaintext = '비밀 내용'
      const passphrase = 'correct-pass'

      const encrypted = await encrypt(plaintext, passphrase)

      await expect(decrypt(encrypted, 'wrong-pass')).rejects.toThrow()
    })
  })

  describe('엣지 케이스', () => {
    it('빈 문자열도 암호화/복호화 가능하다', async () => {
      const plaintext = ''
      const passphrase = 'empty-string-test'

      const encrypted = await encrypt(plaintext, passphrase)
      const decrypted = await decrypt(encrypted, passphrase)

      expect(decrypted).toBe(plaintext)
    })

    it('JSON 형식 데이터를 암호화/복호화한다 (ID/PW 테이블)', async () => {
      const data = JSON.stringify([
        { service: '신한은행', username: 'user123', password: 'P@ss!', memo: '주계좌' },
        { service: '토스', username: 'toss_id', password: 'secret99' },
      ])
      const passphrase = 'json-data-passphrase'

      const encrypted = await encrypt(data, passphrase)
      const decrypted = await decrypt(encrypted, passphrase)

      expect(JSON.parse(decrypted)).toEqual(JSON.parse(data))
    })
  })
})
