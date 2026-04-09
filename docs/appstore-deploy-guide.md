# Storige 앱스토어 배포 가이드

> 최종 업데이트: 2026-04-09  
> 대상: iOS App Store + Google Play Store

---

## 1. 사전 준비사항

### 필요 계정
| 항목 | 비고 |
|------|------|
| Apple Developer Program | 연 $99 (개인/조직) |
| Google Play Developer | 일회 $25 |
| App Store Connect 접근 권한 | Apple ID로 로그인 |

### 필요 도구
```bash
# Xcode (iOS 빌드)
xcode-select --install   # CLI 도구
# Xcode 15+ 권장 (Mac App Store에서 설치)

# Android Studio (Android 빌드)
# https://developer.android.com/studio

# Capacitor CLI
npx cap --version  # 설치 확인
```

---

## 2. iOS 빌드 & 배포

### 2-1. 프로비저닝 설정
1. [Apple Developer](https://developer.apple.com) → Certificates, Identifiers & Profiles
2. **App ID 생성**: Bundle ID = `co.kr.storige`
3. **Capabilities 추가**: Push Notifications, Camera, Photo Library
4. **Distribution Certificate** 생성 (App Store 배포용)
5. **Provisioning Profile** 생성 → 다운로드 → Xcode에 추가

### 2-2. 빌드 실행
```bash
# 1. Next.js static export
npm run build:mobile

# 2. Capacitor sync
npx cap sync ios

# 3. Xcode 오픈
npx cap open ios
```

### 2-3. Xcode에서 설정
| 항목 | 값 |
|------|-----|
| Bundle Identifier | `co.kr.storige` |
| Version | `1.0.0` |
| Build | `1` |
| Deployment Target | iOS 16.0+ |
| Signing Team | Storige 팀 계정 |

### 2-4. Info.plist 권한 설정

Xcode → storige → Info → Custom iOS Target Properties에서 추가:

| 키 | 값 |
|----|-----|
| NSCameraUsageDescription | 가족 사진과 기억을 기록하기 위해 카메라에 접근합니다. |
| NSPhotoLibraryUsageDescription | 앨범에서 사진을 선택하기 위해 사진 보관함에 접근합니다. |
| NSPhotoLibraryAddUsageDescription | 촬영한 사진을 저장하기 위해 사진 보관함에 접근합니다. |
| NSLocationWhenInUseUsageDescription | 일기 작성 시 위치를 자동으로 기록하기 위해 위치 정보에 접근합니다. |
| NSFaceIDUsageDescription | 안전한 인증을 위해 Face ID를 사용합니다. |

### 2-5. App Store Connect 업로드
1. Xcode → Product → Archive
2. Organizer → Distribute App → App Store Connect
3. App Store Connect에서 릴리스 노트 작성 후 심사 제출

---

## 3. Android 빌드 & 배포

### 3-1. 키스토어 생성 (최초 1회)
```bash
keytool -genkey -v -keystore storige-release.keystore \
  -alias storige -keyalg RSA -keysize 2048 -validity 10000
```

> ⚠️ **키스토어 파일은 절대 git에 커밋하지 않는다.** `.gitignore`에 추가 확인 필수.

### 3-2. 서명 설정

`android/app/build.gradle`에 추가:
```groovy
android {
    signingConfigs {
        release {
            storeFile file('../../storige-release.keystore')
            storePassword System.getenv('KEYSTORE_PASSWORD')
            keyAlias 'storige'
            keyPassword System.getenv('KEY_PASSWORD')
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 3-3. 빌드 실행
```bash
# 1. Next.js static export
npm run build:mobile

# 2. Capacitor sync
npx cap sync android

# 3. Release APK/AAB 빌드
cd android
./gradlew bundleRelease   # AAB (Google Play 권장)
./gradlew assembleRelease # APK (직접 배포 시)
```

### 3-4. Google Play Console 업로드
1. [Google Play Console](https://play.google.com/console) → 새 앱 만들기
2. 앱 정보: 패키지명 `co.kr.storige`, 국가 한국
3. AAB 파일 업로드 → 출시 노트 작성 → 검토 제출

---

## 4. 앱 메타데이터

### 앱스토어 공통
| 항목 | 내용 |
|------|------|
| 앱 이름 | 스토리지 (Storige) |
| 부제 (iOS) | 기억을 저장하고, 내일을 준비하는 |
| 짧은 설명 (Android) | 디지털 헤리티지 플랫폼 |
| 카테고리 | 라이프스타일 / 생산성 |
| 콘텐츠 등급 | 4세 이상 (iOS) / 전체 이용가 (Android) |
| 가격 | 무료 (인앱 결제: 프리미엄 구독) |

### 앱 설명 (한국어)
```
스토리지(Storige)는 소중한 기억을 안전하게 보관하고,
언젠가 사랑하는 가족에게 전달하는 디지털 헤리티지 플랫폼입니다.

✍️ 일기 · 편지 작성
일상의 이야기, 자녀에게 전하는 편지를 기록하세요.

🔐 암호화된 보안 코드
금융 정보, 부동산, 법적 서류를 E2E 암호화로 보관하세요.

📸 가족 포토앨범
소중한 순간들을 가족과 함께 아카이빙하세요.

📖 기록물 출판
디지털 기록을 한 권의 책으로 출판할 수 있습니다.

🔑 Legacy Access
유고 시 지정된 가족이 안전하게 기록을 열람할 수 있습니다.
```

---

## 5. 아이콘 & 스플래시 스크린 명세

### iOS 아이콘 (필수)
| 크기 | 용도 |
|------|------|
| 1024×1024 | App Store |
| 180×180 @3x | iPhone |
| 120×120 @2x | iPhone |
| 167×167 @2x | iPad Pro |
| 152×152 @2x | iPad |

### Android 아이콘 (Adaptive Icon)
| 밀도 | 크기 |
|------|------|
| mdpi | 48×48 |
| hdpi | 72×72 |
| xhdpi | 96×96 |
| xxhdpi | 144×144 |
| xxxhdpi | 192×192 |
| Play Store | 512×512 |

### 아이콘 디자인 가이드
- **배경색**: `#0061A5` (Midnight Archive cobalt)
- **아이콘 심볼**: 열린 책 + 열쇠 조합 또는 'S' 모노그램
- **여백**: 아이콘 크기의 10% (safe zone)
- **스타일**: 둥근 모서리, 플랫 디자인

### 스플래시 스크린
- **배경**: 흰색 `#FFFFFF`
- **로고**: 중앙 배치, 뷰포트 대비 40% 크기
- **표시 시간**: 2초 후 자동 숨김 (capacitor.config.ts 설정 완료)

---

## 6. 배포 체크리스트

### iOS 심사 전 확인
- [ ] Bundle ID `co.kr.storige` 등록
- [ ] Info.plist 권한 설명 모두 작성
- [ ] App Store Connect 스크린샷 (6.7", 6.1", iPad)
- [ ] 개인정보처리방침 URL 등록
- [ ] 앱 심사 정보 (데모 계정 제공)
- [ ] 암호화 사용 신고 (HTTPS + AES-256 사용)

### Android 심사 전 확인  
- [ ] Google Play 앱 서명 설정 완료
- [ ] `targetSdkVersion` 34 이상
- [ ] 사용 권한 최소화 검토
- [ ] Privacy Policy 링크 등록
- [ ] 64-bit 지원 확인 (AAB 빌드)

---

## 7. CI/CD 확장 계획 (Phase 5)

현재 배포: `git push origin main` → GitHub Actions → Vercel (웹)

모바일 추가 시:
```yaml
# .github/workflows/mobile-build.yml (추후 추가)
on:
  push:
    tags: ['v*']  # 버전 태그 푸시 시 모바일 빌드

jobs:
  ios:
    runs-on: macos-latest
    steps:
      - Xcode build + code sign
      - Upload to TestFlight

  android:
    runs-on: ubuntu-latest
    steps:
      - ./gradlew bundleRelease
      - Upload to Play Console (fastlane 또는 Google Play API)
```

---

## 8. 긴급 연락처 & 리소스

| 항목 | URL |
|------|-----|
| App Store Connect | https://appstoreconnect.apple.com |
| Google Play Console | https://play.google.com/console |
| Capacitor 문서 | https://capacitorjs.com/docs |
| Supabase 대시보드 | https://supabase.com/dashboard/project/uobbgxwuukwptqtywxxj |
