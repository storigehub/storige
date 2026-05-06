'use client'

import { useDiaryList } from '@/hooks/useDiaryList'

type PublishType = 'diary' | 'dear' | 'album' | 'mystory'

interface PublishSelectStepProps {
  publishType: PublishType
  setPublishType: (t: PublishType) => void
  entries: ReturnType<typeof useDiaryList>['entries']
  selectedIds: string[]
  onToggle: (id: string) => void
  onSelectAll: () => void
  onNext: () => void
}

const PUBLISH_TYPES: { value: PublishType; label: string; icon: string; desc: string }[] = [
  { value: 'diary', label: '일기 단행본', icon: '📓', desc: '일기를 모아 한 권의 책으로' },
  { value: 'dear', label: '편지 모음집', icon: '✉️', desc: '소중한 편지를 책으로 엮어' },
  { value: 'mystory', label: 'AI 자서전', icon: '📖', desc: '내 삶의 이야기를 담은 자서전' },
  { value: 'album', label: '포토앨범', icon: '📸', desc: '사진 중심의 추억 앨범' },
]

// Step 1 — 출판 유형 선택 + 글 목록 선택
export function PublishSelectStep({
  publishType,
  setPublishType,
  entries,
  selectedIds,
  onToggle,
  onSelectAll,
  onNext,
}: PublishSelectStepProps) {
  return (
    <div className="space-y-5">
      {/* 출판 유형 선택 */}
      <div>
        <p className="text-xs text-[#888] mb-2">출판 유형</p>
        <div className="space-y-2">
          {PUBLISH_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setPublishType(t.value)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                publishType === t.value
                  ? 'border-primary bg-diary-open'
                  : 'border-outline-variant/30 bg-white'
              }`}
            >
              <span className="text-2xl">{t.icon}</span>
              <div>
                <p className={`text-sm font-semibold ${publishType === t.value ? 'text-primary' : 'text-[#1A1A1A]'}`}>
                  {t.label}
                </p>
                <p className="text-xs text-[#888]">{t.desc}</p>
              </div>
              {publishType === t.value && <span className="ml-auto text-primary">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* 글 목록 선택 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-[#888]">
            글 선택 <span className="text-primary">({selectedIds.length}/{entries.length})</span>
          </p>
          <button onClick={onSelectAll} className="text-xs text-primary">
            {selectedIds.length === entries.length ? '전체 해제' : '전체 선택'}
          </button>
        </div>

        {entries.length === 0 ? (
          <p className="text-sm text-[#888] text-center py-6">출판할 글이 없습니다</p>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => {
              const selected = selectedIds.includes(entry.id)
              return (
                <button
                  key={entry.id}
                  onClick={() => onToggle(entry.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                    selected ? 'border-primary bg-diary-open' : 'border-outline-variant/30 bg-white'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs ${
                      selected ? 'border-primary bg-primary text-white' : 'border-[#e0e0e0]'
                    }`}
                  >
                    {selected && '✓'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A1A] truncate">
                      {entry.title || '제목 없음'}
                    </p>
                    <p className="text-xs text-[#888] truncate">{entry.content_text}</p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <button
        onClick={onNext}
        disabled={selectedIds.length === 0}
        className="w-full py-3 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-40"
      >
        미리보기 →
      </button>
    </div>
  )
}
