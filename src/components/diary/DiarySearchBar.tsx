'use client'

import { useState, useCallback } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

interface DiarySearchBarProps {
  onSearch: (query: string) => void
}

// 일기 검색 바
export function DiarySearchBar({ onSearch }: DiarySearchBarProps) {
  const [value, setValue] = useState('')

  const debouncedSearch = useDebounce((query: string) => {
    onSearch(query)
  }, 300)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setValue(v)
    debouncedSearch(v)
  }, [debouncedSearch])

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <div className="px-4 py-2">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0] text-sm">🔍</span>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="일기 검색..."
          className="w-full bg-[#f5f5f5] rounded-xl pl-8 pr-8 py-2 text-sm text-[#1A1A1A] placeholder-[#B0B0B0] outline-none"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0B0B0] text-sm"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
