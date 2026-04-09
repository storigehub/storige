'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLegacyAdmin } from '@/hooks/useLegacy'
import type { LegacyRequest } from '@/types/database'

/**
 * 유고 열람 설정 — Settings > Legacy
 * 열람 공개 일정 설정 + 요청 승인/거부
 */
export default function LegacySettingsPage() {
  const router = useRouter()
  const { requests, settings, loading, updateLegacySettings, reviewRequest, activateLegacy } = useLegacyAdmin()
  const [scheduledDate, setScheduledDate] = useState(settings?.scheduled_date?.slice(0, 10) ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showActivateConfirm, setShowActivateConfirm] = useState(false)

  const handleSaveDate = async () => {
    setSaving(true)
    await updateLegacySettings({ scheduled_date: scheduledDate ? new Date(scheduledDate).toISOString() : null })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReview = async (req: LegacyRequest, status: 'approved' | 'rejected') => {
    await reviewRequest(req.id, status)
  }

  const statusLabel = (s: string) => {
    if (s === 'pending') return { text: '검토 중', color: 'text-yellow-600 bg-yellow-50' }
    if (s === 'approved') return { text: '승인됨', color: 'text-green-700 bg-green-50' }
    return { text: '거부됨', color: 'text-error bg-error-container' }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 pt-6 pb-32">

      {/* 헤더 */}
      <section className="py-4 mb-6">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-outline mb-4 hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          뒤로
        </button>
        <span className="inline-flex items-center gap-2 mb-3">
          <span className="w-5 h-px bg-primary" />
          <p className="text-[10px] tracking-[0.25em] text-primary uppercase font-bold font-headline">Heritage &amp; Legacy</p>
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-on-surface leading-tight font-headline">유고 열람 관리</h2>
        <p className="text-sm text-outline mt-1">유고 시 가족에게 기록을 전달하는 설정을 관리하세요.</p>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="material-symbols-outlined text-3xl text-outline animate-spin">progress_activity</span>
        </div>
      ) : (
        <>
          {/* Legacy 활성 상태 배너 */}
          {settings?.is_active && (
            <div className="mb-6 p-4 bg-error-container/40 rounded-2xl flex items-center gap-3">
              <span className="material-symbols-outlined text-error text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <div>
                <p className="text-sm font-bold text-error font-headline">Legacy Access 활성화됨</p>
                <p className="text-xs text-error/70 mt-0.5">
                  활성화 일자: {settings.activated_at ? new Date(settings.activated_at).toLocaleDateString('ko-KR') : '—'}
                </p>
              </div>
            </div>
          )}

          {/* 열람 공개 예약 */}
          <section className="mb-6">
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-outline uppercase mb-3 font-headline">열람 공개 예약일</h4>
            <div className="bg-white p-5 rounded-2xl shadow-sm">
              <p className="text-xs text-outline mb-3 leading-relaxed">
                지정된 날짜가 지나면 가족 구성원의 열람 요청이 자동으로 승인됩니다.<br />
                비워두면 수동으로만 열람 요청을 승인할 수 있습니다.
              </p>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 mb-3"
              />
              <button
                onClick={handleSaveDate}
                disabled={saving}
                className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving
                  ? <><span className="material-symbols-outlined text-base animate-spin">progress_activity</span> 저장 중…</>
                  : saved
                  ? <><span className="material-symbols-outlined text-base">check</span> 저장됨</>
                  : '저장하기'
                }
              </button>
            </div>
          </section>

          {/* 수동 활성화 */}
          {!settings?.is_active && (
            <section className="mb-6">
              <h4 className="text-[10px] font-bold tracking-[0.2em] text-outline uppercase mb-3 font-headline">수동 활성화</h4>
              <div className="bg-white p-5 rounded-2xl shadow-sm">
                <p className="text-xs text-outline mb-4 leading-relaxed">
                  본인 또는 대리인이 직접 Legacy Access를 활성화합니다.<br />
                  <span className="text-error font-semibold">활성화 후에는 되돌릴 수 없습니다.</span>
                </p>
                <button
                  onClick={() => setShowActivateConfirm(true)}
                  className="w-full py-3 border-2 border-error/30 text-error rounded-xl text-sm font-bold hover:bg-error-container/20 transition-colors"
                >
                  Legacy Access 수동 활성화
                </button>
              </div>
            </section>
          )}

          {/* 열람 요청 목록 */}
          <section className="mb-6">
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-outline uppercase mb-3 font-headline">
              열람 요청 {requests.length > 0 && `(${requests.length})`}
            </h4>
            {requests.length === 0 ? (
              <div className="bg-white p-5 rounded-2xl shadow-sm text-center">
                <p className="text-sm text-outline">아직 열람 요청이 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map(req => {
                  const badge = statusLabel(req.status)
                  return (
                    <div key={req.id} className="bg-white p-5 rounded-2xl shadow-sm">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="text-xs text-outline">{new Date(req.created_at).toLocaleDateString('ko-KR')}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${badge.color}`}>{badge.text}</span>
                      </div>
                      {req.document_url && (
                        <a
                          href={req.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-primary mb-3 hover:underline"
                        >
                          <span className="material-symbols-outlined text-[14px]">description</span>
                          증빙 서류 확인
                        </a>
                      )}
                      {req.status === 'pending' && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleReview(req, 'rejected')}
                            className="flex-1 py-2.5 border border-outline-variant rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container-low transition-colors"
                          >
                            거부
                          </button>
                          <button
                            onClick={() => handleReview(req, 'approved')}
                            className="flex-1 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:brightness-110 transition-all"
                          >
                            승인
                          </button>
                        </div>
                      )}
                      {req.admin_note && (
                        <p className="text-xs text-outline mt-2 italic">{req.admin_note}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </>
      )}

      {/* 수동 활성화 확인 모달 */}
      {showActivateConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setShowActivateConfirm(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-t-3xl md:rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-error text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <h3 className="text-lg font-extrabold text-on-surface text-center font-headline mb-2">Legacy Access 활성화</h3>
            <p className="text-sm text-outline text-center mb-5 leading-relaxed">
              활성화하면 승인된 가족 구성원이 기록을 열람할 수 있습니다.<br />
              <span className="text-error font-semibold">이 작업은 되돌릴 수 없습니다.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowActivateConfirm(false)}
                className="flex-1 py-3 border border-outline-variant rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container-low transition-colors"
              >
                취소
              </button>
              <button
                onClick={async () => { await activateLegacy(); setShowActivateConfirm(false) }}
                className="flex-1 py-3 bg-error text-white rounded-xl text-sm font-bold hover:brightness-110 transition-all"
              >
                활성화
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
