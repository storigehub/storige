// @vitest-environment node
// SSS 복구 키 매니저 — 마스터 키 생성/분할/배분 로직 테스트

import { describe, it, expect } from 'vitest'
import { generateMasterKey, computeThreshold, buildShareMap } from '@/hooks/useSSSKeyManager'
import { combineSecrets } from '@/lib/encryption/sss'

describe('SSS 복구 키 매니저', () => {
  describe('generateMasterKey', () => {
    it('32바이트 hex 문자열(64자)을 생성한다', () => {
      const key = generateMasterKey()
      expect(key).toHaveLength(64)
      expect(/^[0-9a-f]+$/i.test(key)).toBe(true)
    })

    it('호출할 때마다 다른 키를 생성한다', () => {
      const k1 = generateMasterKey()
      const k2 = generateMasterKey()
      expect(k1).not.toBe(k2)
    })
  })

  describe('computeThreshold', () => {
    it('1명이면 k=1을 반환한다', () => {
      expect(computeThreshold(1)).toBe(1)
    })

    it('2명이면 k=2를 반환한다', () => {
      expect(computeThreshold(2)).toBe(2)
    })

    it('3명이면 k=2를 반환한다 (과반수)', () => {
      expect(computeThreshold(3)).toBe(2)
    })

    it('5명이면 k=3을 반환한다 (과반수)', () => {
      expect(computeThreshold(5)).toBe(3)
    })
  })

  describe('buildShareMap', () => {
    it('n명 가족에게 n개 조각을 매핑한다', () => {
      const memberIds = ['m1', 'm2', 'm3']
      const masterKey = generateMasterKey()
      const map = buildShareMap(masterKey, memberIds)

      expect(Object.keys(map)).toHaveLength(3)
      expect(map['m1']).toBeDefined()
      expect(map['m2']).toBeDefined()
      expect(map['m3']).toBeDefined()
    })

    it('각 가족의 조각이 모두 다르다', () => {
      const memberIds = ['m1', 'm2', 'm3']
      const masterKey = generateMasterKey()
      const map = buildShareMap(masterKey, memberIds)

      const shares = Object.values(map)
      const unique = new Set(shares)
      expect(unique.size).toBe(3)
    })

    it('k개 조각으로 마스터 키를 복원할 수 있다', () => {
      const memberIds = ['m1', 'm2', 'm3', 'm4', 'm5']
      const masterKey = generateMasterKey()
      const map = buildShareMap(masterKey, memberIds)
      const k = computeThreshold(5) // 3

      // 3개 조각만으로 복원
      const shares = Object.values(map).slice(0, k) as string[]
      const recovered = combineSecrets(shares)
      expect(recovered).toBe(masterKey)
    })
  })
})
