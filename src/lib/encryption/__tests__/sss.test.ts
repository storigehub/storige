// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { splitSecret, combineSecrets, isValidShare } from '../sss'

// Shamir's Secret Sharing 테스트
describe('Shamir\'s Secret Sharing (SSS)', () => {

  describe('splitSecret / combineSecrets 기본 동작', () => {
    it('비밀값을 n=3개로 분할하고 k=2개로 복원한다', () => {
      const secret = 'my-passphrase-key'
      const shares = splitSecret(secret, 3, 2)

      expect(shares).toHaveLength(3)
      expect(combineSecrets([shares[0], shares[1]])).toBe(secret)
    })

    it('어떤 k개 조합으로도 복원된다 (n=5, k=3)', () => {
      const secret = 'storige-encryption-key-2025'
      const shares = splitSecret(secret, 5, 3)

      // 5C3 중 일부 조합 검증
      expect(combineSecrets([shares[0], shares[1], shares[2]])).toBe(secret)
      expect(combineSecrets([shares[0], shares[2], shares[4]])).toBe(secret)
      expect(combineSecrets([shares[1], shares[3], shares[4]])).toBe(secret)
    })

    it('k=n=2 — 2개 모두 있어야 복원된다', () => {
      const secret = 'two-of-two-secret'
      const shares = splitSecret(secret, 2, 2)

      expect(combineSecrets([shares[0], shares[1]])).toBe(secret)
    })

    it('한국어 비밀값을 정확히 복원한다', () => {
      const secret = '나의비밀패스프레이즈123!'
      const shares = splitSecret(secret, 3, 2)

      expect(combineSecrets([shares[0], shares[2]])).toBe(secret)
    })

    it('같은 비밀값을 분할해도 조각이 매번 달라진다 (랜덤성)', () => {
      const secret = 'random-test'
      const shares1 = splitSecret(secret, 3, 2)
      const shares2 = splitSecret(secret, 3, 2)

      // 랜덤 계수로 생성되므로 조각이 달라야 함
      expect(shares1[0]).not.toBe(shares2[0])
    })
  })

  describe('파라미터 유효성 검사', () => {
    it('k < 2이면 에러를 발생시킨다', () => {
      expect(() => splitSecret('secret', 3, 1)).toThrow()
    })

    it('k > n이면 에러를 발생시킨다', () => {
      expect(() => splitSecret('secret', 2, 3)).toThrow()
    })

    it('조각 1개로 combineSecrets 시 에러를 발생시킨다', () => {
      const shares = splitSecret('secret', 3, 2)
      expect(() => combineSecrets([shares[0]])).toThrow('최소 2개')
    })
  })

  describe('isValidShare', () => {
    it('유효한 조각은 true를 반환한다', () => {
      const shares = splitSecret('test-secret', 3, 2)
      shares.forEach((share) => {
        expect(isValidShare(share)).toBe(true)
      })
    })

    it('빈 문자열은 false를 반환한다', () => {
      expect(isValidShare('')).toBe(false)
    })

    it('잘못된 형식은 false를 반환한다', () => {
      expect(isValidShare('not-a-valid-share!!@#')).toBe(false)
    })
  })

  describe('Storige 시나리오', () => {
    it('가족 3명 중 2명이 있으면 유고 시 암호화 키 복원 가능', () => {
      const encryptionKey = 'aes-master-key-storige-vault-2025'
      const [wifeShare, sonShare, daughterShare] = splitSecret(encryptionKey, 3, 2)

      // 아내 + 아들로 복원
      expect(combineSecrets([wifeShare, sonShare])).toBe(encryptionKey)
      // 아들 + 딸로 복원
      expect(combineSecrets([sonShare, daughterShare])).toBe(encryptionKey)
      // 아내 + 딸로 복원
      expect(combineSecrets([wifeShare, daughterShare])).toBe(encryptionKey)
    })

    it('가족 5명 중 3명이 있어야 열람 가능 (더 높은 보안)', () => {
      const key = 'high-security-legacy-key'
      const shares = splitSecret(key, 5, 3)

      // 3명 조합으로 복원
      expect(combineSecrets([shares[0], shares[2], shares[4]])).toBe(key)
    })
  })
})
