'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SecretCode } from '@/types/database'
import { decrypt } from '@/lib/encryption/aes'

export interface DecryptedSecretCode extends Omit<SecretCode, 'encrypted_content' | 'encrypted_credentials'> {
  decryptedContent: string | null
  decryptedCredentials: CredentialEntry[] | null
  isDecrypted: boolean
}

export interface CredentialEntry {
  service: string
  username: string
  password: string
  memo?: string
}

// 시크릿 코드 목록 조회 훅
export function useSecretCodes() {
  const [codes, setCodes] = useState<SecretCode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = useMemo(() => createClient(), [])

  const fetchCodes = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('secret_codes')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order', { ascending: true })

      if (error) throw error
      setCodes(data ?? [])
    } catch {
      setError('시크릿 코드를 불러오는 데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => { fetchCodes() }, [fetchCodes])

  // 복호화 (passphrase 필요)
  const decryptCode = useCallback(async (
    code: SecretCode,
    passphrase: string
  ): Promise<DecryptedSecretCode | null> => {
    try {
      const decryptedContent = await decrypt(code.encrypted_content, passphrase)

      let decryptedCredentials: CredentialEntry[] | null = null
      if (code.encrypted_credentials) {
        const credJson = await decrypt(
          code.encrypted_credentials as string,
          passphrase
        )
        decryptedCredentials = JSON.parse(credJson) as CredentialEntry[]
      }

      return {
        ...code,
        decryptedContent,
        decryptedCredentials,
        isDecrypted: true,
      }
    } catch {
      return null // 패스프레이즈 불일치
    }
  }, [])

  // 삭제
  const deleteCode = useCallback(async (id: string) => {
    await supabase.from('secret_codes').delete().eq('id', id)
    setCodes((prev) => prev.filter((c) => c.id !== id))
  }, [supabase])

  return { codes, loading, error, refetch: fetchCodes, decryptCode, deleteCode }
}
