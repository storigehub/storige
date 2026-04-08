'use client'

import { useState, useMemo } from 'react'
import { Map, MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk'
import type { Entry } from '@/types/database'
import Script from 'next/script'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useRouter } from 'next/navigation'

interface DiaryMapViewProps {
  entries: Pick<Entry, 'id' | 'location_lat' | 'location_lng' | 'title' | 'content_text' | 'created_at' | 'weather'>[]
}

const DEFAULT_LAT = 37.5665
const DEFAULT_LNG = 126.9780

export function DiaryMapView({ entries }: DiaryMapViewProps) {
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null)
  const router = useRouter()

  // 위치 정보가 있는 일기만 필터링
  const validEntries = useMemo(() => {
    return entries.filter(e => e.location_lat !== null && e.location_lng !== null)
  }, [entries])

  const center = useMemo(() => {
    if (validEntries.length === 0) return { lat: DEFAULT_LAT, lng: DEFAULT_LNG }
    return { lat: validEntries[0].location_lat!, lng: validEntries[0].location_lng! }
  }, [validEntries])

  // 환경변수가 없으면 안내 메시지
  if (!process.env.NEXT_PUBLIC_KAKAO_JS_KEY) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-center px-4">
        <div className="text-4xl">🗺️</div>
        <p className="text-sm font-medium text-[#1A1A1A]">지도 뷰</p>
        <p className="text-xs text-[#888]">
          Kakao Maps API 키를 .env.local에 설정하면<br />
          위치 기반 일기 지도가 표시됩니다
        </p>
        <code className="text-xs bg-[#f5f5f5] px-3 py-1.5 rounded text-[#555]">
          NEXT_PUBLIC_KAKAO_JS_KEY=app_key
        </code>
      </div>
    )
  }

  return (
    <>
      <Script 
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&libraries=services,clusterer&autoload=false`}
        strategy="afterInteractive" 
      />
      
      <div className="w-full h-[calc(100vh-200px)] relative">
        <Map
          center={center}
          style={{ width: '100%', height: '100%' }}
          level={7}
          onClick={() => setSelectedEntry(null)}
        >
          {validEntries.map((entry) => (
            <div key={entry.id}>
              <MapMarker
                position={{ lat: entry.location_lat!, lng: entry.location_lng! }}
                onClick={() => setSelectedEntry(entry.id)}
              />
              
              {selectedEntry === entry.id && (
                <CustomOverlayMap
                  position={{ lat: entry.location_lat!, lng: entry.location_lng! }}
                  yAnchor={1.2}
                >
                  <div className="bg-white rounded-xl shadow-lg border border-[#f0f0f0] p-3 w-48 mb-2 z-10 cursor-pointer"
                       onClick={() => router.push(`/diary/${entry.id}`)}>
                    <div className="text-[10px] text-primary font-medium mb-1">
                      {format(new Date(entry.created_at), 'yyyy년 M월 d일 (E)', { locale: ko })}
                      {entry.weather && ` · ${entry.weather}`}
                    </div>
                    <div className="text-sm font-bold text-[#1A1A1A] truncate">
                      {entry.title || '제목 없는 일기'}
                    </div>
                    <div className="text-xs text-[#888] truncate mt-1">
                      {entry.content_text || '내용이 없습니다.'}
                    </div>
                  </div>
                </CustomOverlayMap>
              )}
            </div>
          ))}
        </Map>
      </div>
    </>
  )
}
