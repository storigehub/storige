import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDiaryEditor } from '../useDiaryEditor'

// saveNow()가 entry ID를 반환하는지 검증 (DearEditor recipient_id 버그 수정용)

const mockInsert = vi.fn()
const mockUpdate = vi.fn()
const mockFrom = vi.fn()
const mockSelect = vi.fn()
const mockSingle = vi.fn()
const mockEq = vi.fn()

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: mockFrom,
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }),
    },
  }),
}))

describe('useDiaryEditor — saveNow 반환값', () => {
  beforeEach(() => {
    vi.useFakeTimers()

    // 체이닝 모킹 설정
    mockSingle.mockResolvedValue({ data: { id: 'new-entry-id' }, error: null })
    mockSelect.mockReturnValue({ single: mockSingle })
    mockInsert.mockReturnValue({ select: mockSelect })
    mockUpdate.mockReturnValue({ eq: mockEq })
    mockEq.mockResolvedValue({ data: null, error: null })
    mockFrom.mockReturnValue({ insert: mockInsert, update: mockUpdate })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('신규 entry 생성 시 saveNow()가 생성된 ID를 반환한다', async () => {
    const { result } = renderHook(() => useDiaryEditor({ journalType: 'dear' }))

    act(() => { result.current.setTitle('편지 제목') })

    let returnedId: string | undefined
    await act(async () => {
      returnedId = await result.current.saveNow()
    })

    expect(returnedId).toBe('new-entry-id')
  })

  it('기존 entry 수정 시 saveNow()가 기존 ID를 반환한다', async () => {
    const { result } = renderHook(() =>
      useDiaryEditor({ entryId: 'existing-id', journalType: 'dear' })
    )

    act(() => { result.current.setTitle('수정된 제목') })

    let returnedId: string | undefined
    await act(async () => {
      returnedId = await result.current.saveNow()
    })

    expect(returnedId).toBe('existing-id')
  })

  it('빈 제목/내용이면 saveNow()가 undefined를 반환한다', async () => {
    const { result } = renderHook(() => useDiaryEditor({ journalType: 'dear' }))

    let returnedId: string | undefined
    await act(async () => {
      returnedId = await result.current.saveNow()
    })

    expect(returnedId).toBeUndefined()
  })
})
