'use client'

import { useRef, useState } from 'react'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useDiaryEditor } from '@/hooks/useDiaryEditor'
import { useGeoWeather } from '@/hooks/useGeoWeather'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import { RichTextEditor } from '@/components/editor/RichTextEditor'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { formatDate } from '@/lib/utils/date'

interface DiaryEditorProps {
  entryId?: string
  initialTitle?: string
}

// 일기 작성/편집 메인 컴포넌트 — 미디어 업로드 + 위치/날씨 태깅 포함
export function DiaryEditor({ entryId, initialTitle }: DiaryEditorProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    id,
    title,
    setTitle,
    handleContentChange,
    isSaving,
    lastSaved,
    saveNow,
    locationMeta,
    setLocationMeta,
  } = useDiaryEditor({ entryId })

  const { fetchGeoWeather, loading: geoLoading } = useGeoWeather()
  const { uploading, uploadFiles } = useMediaUpload(id)

  // 업로드된 이미지 미리보기 URL 목록
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: '오늘의 이야기를 기록하세요...' }),
    ],
    onUpdate({ editor }) {
      handleContentChange(editor.getJSON())
    },
    immediatelyRender: false,
  })

  const handleDone = async () => {
    await saveNow()
    router.push('/diary')
  }

  // 위치/날씨 태깅
  const handleGeoTag = async () => {
    const result = await fetchGeoWeather()
    if (result) setLocationMeta(result)
  }

  // 미디어 파일 선택 → 업로드
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // 미리보기 추가
    const newPreviews = Array.from(files).map((f) => URL.createObjectURL(f))
    setPreviewUrls((prev) => [...prev, ...newPreviews])

    // entryId 없으면 먼저 저장해서 ID 획득
    const savedId = id ?? (await saveNow())
    if (!savedId) return

    await uploadFiles(files, savedId)
    // input 초기화
    e.target.value = ''
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-outline-variant/30">
        <button onClick={() => router.back()} className="text-[#888] text-sm">
          취소
        </button>
        <span className="text-xs text-[#B0B0B0]">
          {isSaving ? '저장 중...' : lastSaved ? `저장됨 ${formatTime(lastSaved)}` : ''}
        </span>
        <button onClick={handleDone} className="text-primary font-semibold text-sm">
          완료
        </button>
      </div>

      {/* 날짜 표시 */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs text-[#B0B0B0]">{formatDate(new Date())}</p>
      </div>

      {/* 위치/날씨 태그 표시 */}
      {locationMeta && (
        <div className="px-4 pb-2 flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-primary bg-primary-container px-2.5 py-1 rounded-full">
            <span className="material-symbols-outlined text-[13px]">location_on</span>
            {locationMeta.locationName}
          </span>
          {locationMeta.weather && (
            <span className="flex items-center gap-1 text-xs text-outline bg-surface-container-low px-2.5 py-1 rounded-full">
              <span className="material-symbols-outlined text-[13px]">cloud</span>
              {locationMeta.weather} {locationMeta.temperature}°
            </span>
          )}
          <button
            onClick={() => setLocationMeta(null)}
            className="text-[11px] text-outline-variant hover:text-error transition-colors"
            aria-label="위치 삭제"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>
      )}

      {/* 제목 입력 */}
      <div className="px-4 pb-2">
        <input
          type="text"
          placeholder="제목"
          value={initialTitle ?? title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-xl font-semibold text-[#1A1A1A] placeholder-[#B0B0B0] outline-none bg-transparent"
        />
      </div>

      {/* 서식 툴바 */}
      <EditorToolbar editor={editor} />

      {/* 에디터 본문 */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <RichTextEditor onChange={handleContentChange} />

        {/* 업로드된 이미지 미리보기 */}
        {previewUrls.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-4 pt-4 border-t border-outline-variant/30">
            {previewUrls.map((url, i) => (
              <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-outline-variant/20">
                <Image src={url} alt={`첨부 ${i + 1}`} fill className="object-cover" />
                <button
                  onClick={() => setPreviewUrls((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center"
                  aria-label="삭제"
                >
                  <span className="material-symbols-outlined text-white text-[11px]">close</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 하단 액션 바 — 미디어 업로드 + 위치/날씨 */}
      <div className="border-t border-outline-variant/30 px-4 py-3 flex items-center gap-1">
        {/* 사진 첨부 */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-outline hover:text-primary hover:bg-primary-container/50 transition-colors text-sm disabled:opacity-50"
          aria-label="사진 첨부"
        >
          <span className="material-symbols-outlined text-[20px]">
            {uploading ? 'hourglass_empty' : 'photo_camera'}
          </span>
          <span className="text-xs font-medium hidden sm:block">사진</span>
        </button>

        {/* 위치/날씨 태깅 */}
        <button
          onClick={handleGeoTag}
          disabled={geoLoading || !!locationMeta}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors text-sm disabled:opacity-50"
          style={{
            color: locationMeta ? '#0061A5' : '#747878',
          }}
          aria-label="위치 태그"
        >
          <span className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: locationMeta ? "'FILL' 1" : "'FILL' 0" }}>
            {geoLoading ? 'hourglass_empty' : 'location_on'}
          </span>
          <span className="text-xs font-medium hidden sm:block">
            {geoLoading ? '위치 중...' : locationMeta ? '위치 등록됨' : '위치'}
          </span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}
