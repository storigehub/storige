export type AppNavItem = {
  href: string
  label: string
  icon: string
}

// 앱 전역 1차 메뉴. 랜딩/앱 헤더/모바일 하단 탭은 반드시 이 값을 공유한다.
export const PRIMARY_NAV_ITEMS: AppNavItem[] = [
  { href: '/diary', label: '읽기', icon: 'auto_stories' },
  { href: '/dear', label: '편지', icon: 'mail' },
  { href: '/secret', label: '비밀', icon: 'lock' },
  { href: '/publish', label: '출판', icon: 'menu_book' },
  { href: '/settings', label: '관리', icon: 'manage_accounts' },
]

// 드로어/보조 영역에만 노출하는 확장 메뉴.
export const SECONDARY_NAV_ITEMS: AppNavItem[] = [
  { href: '/album', label: '포토앨범', icon: 'photo_library' },
  { href: '/mystory', label: 'AI 자서전', icon: 'history_edu' },
]
