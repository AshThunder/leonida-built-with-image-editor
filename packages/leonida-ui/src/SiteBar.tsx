import type { ReactNode } from 'react'
import { BroadcastIcon, DeviceMobileCameraIcon } from '@phosphor-icons/react'

export type SiteSection = 'home' | 'stories' | 'hijack'

const LINKS: {
  id: Exclude<SiteSection, 'home'>
  label: string
  href: string
  bar: string
  Icon: typeof BroadcastIcon
}[] = [
  { id: 'stories', label: 'Stories', href: '/stories/', bar: 'bg-vice', Icon: DeviceMobileCameraIcon },
  { id: 'hijack', label: 'Hijack', href: '/hijack/', bar: 'bg-sodium', Icon: BroadcastIcon },
]

/** Cross-app navigation shared by the landing page and both apps. */
export function SiteBar({
  current,
  children,
}: {
  current: SiteSection
  children?: ReactNode
}) {
  return (
    <header className="sticky top-0 z-30 h-14 border-b border-line bg-ink-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1400px] items-center gap-4 px-4 md:px-6">
        <a
          href="/"
          className="type-display text-[22px] tracking-[0.04em] text-fg hover:text-white"
          aria-current={current === 'home' ? 'page' : undefined}
        >
          Leonida
        </a>
        {children && <div className="hidden min-w-0 flex-1 md:block">{children}</div>}
        <nav aria-label="Apps" className="ml-auto flex h-full items-stretch gap-1">
          {LINKS.map(({ id, label, href, bar, Icon }) => {
            const active = current === id
            return (
              <a
                key={id}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`relative flex items-center gap-2 px-3 text-sm font-medium transition-colors ${
                  active ? 'text-fg' : 'text-muted hover:text-fg'
                }`}
              >
                <Icon size={18} weight={active ? 'fill' : 'regular'} aria-hidden />
                {label}
                {active && (
                  <span aria-hidden className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full ${bar}`} />
                )}
              </a>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
