import { HouseIcon, PlusIcon, UserCircleIcon } from '@phosphor-icons/react'

export type Tab = 'feed' | 'you'

export function TabBar({
  tab,
  onTab,
  onCreate,
}: {
  tab: Tab
  onTab: (tab: Tab) => void
  onCreate: () => void
}) {
  const item = (id: Tab, label: string, Icon: typeof HouseIcon) => {
    const active = tab === id
    return (
      <button
        type="button"
        onClick={() => onTab(id)}
        aria-current={active ? 'page' : undefined}
        className={`flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors ${
          active ? 'text-fg' : 'text-subtle hover:text-muted'
        }`}
      >
        <Icon size={24} weight={active ? 'fill' : 'regular'} aria-hidden />
        {label}
      </button>
    )
  }

  return (
    <nav
      aria-label="Stories"
      className="relative z-10 flex items-center border-t border-line bg-ink-900 px-2 pb-[max(0.25rem,env(safe-area-inset-bottom))]"
    >
      {item('feed', 'Feed', HouseIcon)}
      <div className="flex flex-1 justify-center">
        <button
          type="button"
          onClick={onCreate}
          aria-label="Create story"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-ink-950 transition-transform hover:brightness-110 active:scale-95"
        >
          <PlusIcon size={24} weight="bold" aria-hidden />
        </button>
      </div>
      {item('you', 'You', UserCircleIcon)}
    </nav>
  )
}
