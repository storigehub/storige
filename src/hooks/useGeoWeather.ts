'use client'

import { useState, useCallback } from 'react'

interface GeoWeatherResult {
  locationName: string
  lat: number
  lng: number
  weather: string
  temperature: number
}

// 위치 + 날씨 자동 태깅 훅
export function useGeoWeather() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGeoWeather = useCallback(async (): Promise<GeoWeatherResult | null> => {
    if (!navigator.geolocation) {
      setError('위치 정보를 지원하지 않는 브라우저입니다.')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      // 위치 정보 획득
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 60000,
        })
      })

      const { latitude: lat, longitude: lng } = position.coords

      // 역지오코딩 (Kakao API — 클라이언트 직접 호출)
      let locationName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      try {
        const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY
        if (kakaoKey) {
          const res = await fetch(
            `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`,
            { headers: { Authorization: `KakaoAK ${kakaoKey}` } }
          )
          const data = await res.json()
          const addr = data.documents?.[0]?.address
          if (addr) {
            locationName = addr.region_2depth_name
              ? `${addr.region_2depth_name} ${addr.region_3depth_name || ''}`.trim()
              : addr.address_name
          }
        }
      } catch {
        // 위치 이름 실패해도 좌표는 저장
      }

      // 날씨 정보 (OpenWeatherMap — Edge Function으로 API 키 은닉)
      let weather = ''
      let temperature = 0
      try {
        const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`)
        if (res.ok) {
          const data = await res.json()
          weather = data.weather
          temperature = data.temperature
        }
      } catch {
        // 날씨 실패해도 위치는 저장
      }

      return { locationName, lat, lng, weather, temperature }
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        if (err.code === 1) setError('위치 권한이 거부되었습니다.')
        else setError('위치를 가져올 수 없습니다.')
      }
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { fetchGeoWeather, loading, error }
}
