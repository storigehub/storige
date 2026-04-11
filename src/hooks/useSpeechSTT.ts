'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

// Web Speech API 타입 선언
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  onresult: ((e: SpeechRecognitionEvent) => void) | null
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance
  }
}

interface UseSpeechSTTResult {
  isRecording: boolean
  isSupported: boolean
  toggleRecording: () => void
}

/**
 * Web Speech API 기반 음성 인식 훅
 * @param onTranscribed 인식 완료 시 호출 — 최종 텍스트 반환
 */
export function useSpeechSTT(
  onTranscribed: (text: string) => void
): UseSpeechSTTResult {
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const onTranscribedRef = useRef(onTranscribed)

  useEffect(() => {
    onTranscribedRef.current = onTranscribed
  }, [onTranscribed])

  const isSupported =
    typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition)

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    setIsRecording(false)
  }, [])

  const startRecording = useCallback(() => {
    if (!isSupported) return

    const SpeechRecognition =
      window.SpeechRecognition ?? window.webkitSpeechRecognition!
    const recognition = new SpeechRecognition()

    recognition.lang = 'ko-KR'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = Array.from(e.results)
        .map(r => r[0].transcript)
        .join('')
      if (transcript.trim()) {
        onTranscribedRef.current(transcript.trim())
      }
    }

    recognition.onerror = () => {
      setIsRecording(false)
      recognitionRef.current = null
    }

    recognition.onend = () => {
      setIsRecording(false)
      recognitionRef.current = null
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }, [isSupported])

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, startRecording, stopRecording])

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
    }
  }, [])

  return { isRecording, isSupported, toggleRecording }
}
