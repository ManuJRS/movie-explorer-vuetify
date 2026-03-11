export type HeaderLink = {
  label: string
  href: string
}

export interface FloatingHeaderProps {
  brand?: string
  links?: HeaderLink[]
  loginText?: string
  signInText?: string
  getStartedText?: string
}

export const DEFAULT_HEADER_LINKS: HeaderLink[] = [
  { label: 'nav.recommendations', href: '/recommendations' },
  { label: 'nav.statistics', href: '/stads' },
  { label: 'nav.watchList', href: '/watch-list' },
  { label: 'nav.settings', href: '/user-settings' },
  { label: 'nav.favorites', href: '/favorites' },
]
