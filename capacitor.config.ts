import type { CapacitorConfig } from '@capacitor/cli'

/**
 * Storige Capacitor 설정
 * 앱 ID: co.kr.storige
 * 웹 디렉토리: out (Next.js static export)
 */
const config: CapacitorConfig = {
  appId: 'co.kr.storige',
  appName: '스토리지',
  webDir: 'out',
  server: {
    // 개발 시 로컬 서버로 연결 (프로덕션 빌드 시 이 블록 제거)
    // url: 'http://localhost:3000',
    // cleartext: true,
  },
  plugins: {
    // 카메라 플러그인
    Camera: {
      // iOS: NSCameraUsageDescription, NSPhotoLibraryUsageDescription
      // Android: CAMERA, READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE
    },
    // 생체 인증 (별도 플러그인 @capacitor-community/biometric-auth 필요 시)
    // Biometrics: {},

    // 위치 정보
    Geolocation: {
      // iOS: NSLocationWhenInUseUsageDescription
      // Android: ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION
    },

    // 푸시 알림
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },

    // 스플래시 스크린
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#FFFFFF',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },

    // 상태 표시줄
    StatusBar: {
      style: 'Default',
      backgroundColor: '#FFFFFF',
    },
  },
  ios: {
    contentInset: 'automatic',
    limitsNavigationsToAppBoundDomains: true,
    preferredContentMode: 'mobile',
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
}

export default config
