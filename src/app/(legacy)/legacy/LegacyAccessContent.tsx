'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useLegacyViewer } from '@/hooks/useLegacy'
import type { Entry } from '@/types/database'

/**
 * Legacy Access 콘텐츠 — 승인된 가족 열람 뷰어
 * 오너의 비암호화 기록만 표시
 */
export function LegacyAccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const ownerUserId = searchParams.get('owner') ?? ''

  const { entries, loading, authorized } = useLegacyViewer(ownerUserId)

  if (!ownerUserId) {
    return <LegacyError message="잘못된 접근 경로입니다." />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
          <p className="text-white/40 text-sm">기록을 불러오는 중…</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return <LegacyUnauthorized />
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 py-12 max-w-2xl mx-auto">
      {/* 헤더 */}
      <header className="mb-12 text-center">
        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-5">
          <span className="material-symbols-outlined text-3xl text-white/60" style={{ fontVariationSettings: "'FILL' 1" }}>lock_open</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2 font-headline">남겨진 이야기</h1>
        <p className="text-white/40 text-sm">승인된 기록을 열람하고 있습니다.</p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-xs text-white/60">열람 권한 승인됨</span>
        </div>
      </header>

      {/* 기록 목록 */}
      {entries.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/30 text-sm">열람 가능한 기록이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map(entry => (
            <LegacyEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      {/* 푸터 */}
      <footer className="mt-16 text-center border-t border-white/5 pt-8">
        <p className="text-white/20 text-xs">Storige Legacy Access · 이 화면은 기록 보관 목적으로만 사용됩니다.</p>
      </footer>
    </div>
  )
}

function LegacyEntryCard({ entry }: { entry: Entry }) {
  const date = new Date(entry.created_at)
  const dateStr = date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
  const typeLabel = entry.journal_type === 'diary' ? '일기' : entry.journal_type === 'dear' ? '편지' : '기록'

  return (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:bg-white/[0.07] transition-colors">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">{typeLabel} · {dateStr}</span>
          {entry.title && (
            <h3 className="text-base font-bold text-white mt-1 font-headline">{entry.title}</h3>
          )}
        </div>
        {entry.mood && (
          <span className="text-lg flex-shrink-0">{moodEmoji(entry.mood)}</span>
        )}
      </div>
      {entry.content_text && (
        <p className="text-white/50 text-sm leading-relaxed line-clamp-4 whitespace-pre-line">
          {entry.content_text}
        </p>
      )}
      {entry.location_name && (
        <div className="flex items-center gap-1.5 mt-3">
          <span className="material-symbols-outlined text-[12px] text-white/30">location_on</span>
          <span className="text-[11px] text-white/30">{entry.location_name}</span>
        </div>
      )}
    </div>
  )
}

function moodEmoji(mood: string): string {
  const map: Record<string, string> = {
    happy: '😊', sad: '😢', angry: '😠', anxious: '😰',
    grateful: '🙏', excited: '🎉', calm: '😌', reflective: '🤔',
  }
  return map[mood] ?? '📝'
}

function LegacyUnauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-3xl text-white/30" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-3 font-headline">접근 권한이 없습니다</h2>
        <p className="text-white/40 text-sm leading-relaxed mb-6">
          열람 요청이 승인되지 않았거나,<br />
          아직 요청 검토가 진행 중입니다.
        </p>
        <a
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white text-sm font-bold rounded-xl transition-colors"
        >
          <span className="material-symbols-outlined text-base">login</span>
          로그인하여 요청하기
        </a>
      </div>
    </div>
  )
}

function LegacyError({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-6">
      <div className="text-center">
        <p className="text-white/40 text-sm">{message}</p>
      </div>
    </div>
  )
}
