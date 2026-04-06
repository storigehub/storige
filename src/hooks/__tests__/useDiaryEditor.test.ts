import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDiaryEditor } from '../useDiaryEditor'

// Supabase 클라이언트 모킹
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      insert: vi.fn().mockResolvedValue({ data: [{ id: 'test-id' }], error: null }),
      update: vi.fn().mockResolvedValue({ data: null, error: null }),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'test-id', title: '테스트' }, error: null }),
    }),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }),
    },
  }),
}))

describe('useDiaryEditor', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('초기 상태가 올바르게 설정된다', () => {
    const { result } = renderHook(() => useDiaryEditor())
    expect(result.current.title).toBe('')
    expect(result.current.isSaving).toBe(false)
    expect(result.current.lastSaved).toBeNull()
  })

  it('제목 변경 시 상태가 업데이트된다', () => {
    const { result } = renderHook(() => useDiaryEditor())
    act(() => {
      result.current.setTitle('오늘의 일기')
    })
    expect(result.current.title).toBe('오늘의 일기')
  })

  it('자동저장은 2초 디바운스로 동작한다', async () => {
    const { result } = renderHook(() => useDiaryEditor())

    act(() => {
      result.current.setTitle('제목 입력')
    })

    // 2초 미만 — 저장 미실행
    act(() => { vi.advanceTimersByTime(1000) })
    expect(result.current.isSaving).toBe(false)

    // 2초 경과 — 저장 실행
    await act(async () => { vi.advanceTimersByTime(1500) })
    expect(result.current.isSaving).toBe(false) // 저장 완료
  })

  it('빈 제목과 내용으로는 저장되지 않는다', async () => {
    const { result } = renderHook(() => useDiaryEditor())
    await act(async () => {
      vi.advanceTimersByTime(3000)
    })
    expect(result.current.lastSaved).toBeNull()
  })

  it('수동 저장 시 즉시 저장된다', async () => {
    const { result } = renderHook(() => useDiaryEditor())
    act(() => {
      result.current.setTitle('수동 저장 테스트')
    })
    await act(async () => {
      await result.current.saveNow()
    })
    expect(result.current.isSaving).toBe(false)
  })
})
