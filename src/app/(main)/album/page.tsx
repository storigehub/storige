'use client'

import { useRef, useState } from 'react'
import { useAlbum } from '@/hooks/useAlbum'
import { AlbumLightbox } from '@/components/album/AlbumLightbox'
import { isCapacitor, takeCameraPhoto, pickFromGallery } from '@/lib/utils/camera'
import type { AlbumPhoto } from '@/types/database'

/**
 * 가족 포토앨범 — Midnight Archive / Phase 4
 * Capacitor Camera 연동 준비 완료 (Phase 4-4에서 네이티브 활성화)
 */
export default function AlbumPage() {
  const { photos, loading, uploading, error, getPhotoUrl, uploadPhotos, deletePhoto, updateCaption } = useAlbum()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCaption, setEditCaption] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [nativeCamera] = useState(() => isCapacitor())

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadPhotos(e.target.files)
      e.target.value = ''
    }
  }

  // Capacitor 네이티브 카메라 촬영
  const handleNativeCamera = async () => {
    const file = await takeCameraPhoto()
    if (file) await uploadPhotos([file])
  }

  // Capacitor 갤러리 선택
  const handleNativeGallery = async () => {
    const files = await pickFromGallery()
    if (files.length > 0) await uploadPhotos(files)
  }

  const startEditCaption = (photo: AlbumPhoto) => {
    setEditingId(photo.id)
    setEditCaption(photo.caption ?? '')
  }

  const saveCaption = async () => {
    if (!editingId) return
    await updateCaption(editingId, editCaption)
    setEditingId(null)
  }

  const urls = photos.map(p => getPhotoUrl(p.storage_path))

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 pt-6 pb-32">

      {/* 페이지 헤더 */}
      <section className="py-4 mb-6">
        <span className="inline-flex items-center gap-2 mb-3">
          <span className="w-5 h-px bg-primary" />
          <p className="text-[10px] tracking-[0.25em] text-primary uppercase font-bold font-headline">Family Archive</p>
        </span>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-on-surface leading-tight font-headline">포토앨범</h2>
            <p className="text-sm text-outline mt-1">소중한 순간들을 가족과 함께 보관하세요.</p>
          </div>
          {nativeCamera ? (
            <div className="flex gap-2">
              <button
                onClick={handleNativeCamera}
                disabled={uploading}
                className="flex items-center gap-1.5 px-3 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:brightness-110 active:brightness-90 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">camera_alt</span>
                촬영
              </button>
              <button
                onClick={handleNativeGallery}
                disabled={uploading}
                className="flex items-center gap-1.5 px-3 py-2.5 bg-primary/10 text-primary text-sm font-bold rounded-xl hover:bg-primary/20 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">photo_library</span>
                갤러리
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:brightness-110 active:brightness-90 transition-all disabled:opacity-50"
            >
              {uploading
                ? <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                : <span className="material-symbols-outlined text-base">add_photo_alternate</span>
              }
              {uploading ? '업로드 중…' : '사진 추가'}
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </section>

      {/* 에러 */}
      {error && (
        <div className="mb-4 p-3 bg-error-container/40 rounded-xl text-sm text-error flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          {error}
        </div>
      )}

      {/* 로딩 */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <span className="material-symbols-outlined text-4xl text-outline animate-spin">progress_activity</span>
          <p className="text-sm text-outline">앨범 불러오는 중…</p>
        </div>
      )}

      {/* 빈 상태 */}
      {!loading && photos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-5">
          <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>photo_library</span>
          </div>
          <div className="text-center">
            <p className="font-bold text-on-surface mb-1 font-headline">아직 사진이 없습니다</p>
            <p className="text-sm text-outline">첫 번째 가족 사진을 추가해보세요.</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:brightness-110 transition-all"
          >
            <span className="material-symbols-outlined text-base">add_photo_alternate</span>
            첫 사진 추가하기
          </button>
        </div>
      )}

      {/* 사진 그리드 */}
      {!loading && photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {photos.map((photo, idx) => (
            <div key={photo.id} className="relative group rounded-xl overflow-hidden bg-surface-container aspect-square">
              {/* 이미지 */}
              <img
                src={getPhotoUrl(photo.storage_path)}
                alt={photo.caption ?? `사진 ${idx + 1}`}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105"
                onClick={() => setLightboxIndex(idx)}
                onError={(e) => {
                  const el = e.currentTarget
                  el.style.display = 'none'
                  el.nextElementSibling?.classList.remove('hidden')
                }}
              />
              {/* 이미지 로드 실패 fallback */}
              <div className="hidden absolute inset-0 flex items-center justify-center bg-surface-container">
                <span className="material-symbols-outlined text-3xl text-outline">broken_image</span>
              </div>

              {/* 캡션 오버레이 (있을 때만) */}
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-white text-xs leading-tight line-clamp-2">{photo.caption}</p>
                </div>
              )}

              {/* 액션 오버레이 (hover) */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); startEditCaption(photo) }}
                  className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                  title="캡션 편집"
                >
                  <span className="material-symbols-outlined text-[14px] text-on-surface">edit</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(photo.id) }}
                  className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                  title="삭제"
                >
                  <span className="material-symbols-outlined text-[14px] text-error">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 업로드 중 스피너 오버레이 */}
      {uploading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3 shadow-2xl">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            <p className="text-sm font-bold text-on-surface">사진 업로드 중…</p>
          </div>
        </div>
      )}

      {/* 캡션 편집 모달 */}
      {editingId && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setEditingId(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-t-3xl md:rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-extrabold text-on-surface font-headline mb-4">캡션 편집</h3>
            <textarea
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              placeholder="이 사진에 대한 설명을 입력하세요…"
              rows={3}
              className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setEditingId(null)}
                className="flex-1 py-3 border border-outline-variant rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container-low transition-colors"
              >
                취소
              </button>
              <button
                onClick={saveCaption}
                className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:brightness-110 transition-all"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-t-3xl md:rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-error text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>delete_forever</span>
            </div>
            <h3 className="text-base font-extrabold text-on-surface text-center font-headline mb-2">사진을 삭제하시겠어요?</h3>
            <p className="text-sm text-outline text-center mb-5">삭제된 사진은 복구할 수 없습니다.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-3 border border-outline-variant rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container-low transition-colors"
              >
                취소
              </button>
              <button
                onClick={async () => {
                  const photo = photos.find(p => p.id === confirmDeleteId)
                  if (photo) await deletePhoto(photo)
                  setConfirmDeleteId(null)
                }}
                className="flex-1 py-3 bg-error text-white rounded-xl text-sm font-bold hover:brightness-110 transition-all"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 라이트박스 */}
      {lightboxIndex !== null && (
        <AlbumLightbox
          urls={urls}
          currentIndex={lightboxIndex}
          caption={photos[lightboxIndex]?.caption}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex(i => i !== null ? Math.max(0, i - 1) : 0)}
          onNext={() => setLightboxIndex(i => i !== null ? Math.min(urls.length - 1, i + 1) : 0)}
        />
      )}
    </div>
  )
}
