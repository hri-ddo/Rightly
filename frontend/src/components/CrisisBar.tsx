import { Button } from './ui/Button'
import { triggerQuickExit } from '../utils/quickExit'

export function CrisisBar() {
  return (
    <aside
      aria-label="Emergency Crisis Bar"
      className="w-full border-b border-white/10 bg-[#161614] text-inverse-on-surface"
    >
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-4 px-4 lg:px-12">
        <div className="flex items-center gap-4 overflow-x-auto text-xs sm:text-sm">
          <div className="flex shrink-0 items-center gap-2">
            <span className="material-symbols-outlined text-base text-primary-container">phone_in_talk</span>
            <span className="font-semibold">Crisis Helplines:</span>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-inverse-on-surface/90">
            <a className="hover:text-primary-container" href="tel:999">
              Emergency: <strong className="font-semibold underline">999</strong>
            </a>
            <span className="text-tertiary select-none">|</span>
            <a className="hover:text-primary-container" href="tel:109">
              Women &amp; Children: <strong className="font-semibold underline">109</strong>
            </a>
            <span className="hidden text-tertiary select-none sm:inline">|</span>
            <a
              className="hidden hover:text-primary-container sm:inline"
              href="https://www.shantibari.org/kaan-pete-roi"
              target="_blank"
              rel="noreferrer noopener"
            >
              Mental Health: <strong>Kaan Pete Roi</strong>
            </a>
          </div>
        </div>
        <Button variant="danger" className="shrink-0 px-2.5 py-1 text-[10px] uppercase tracking-wider" onClick={triggerQuickExit}>
          <span className="material-symbols-outlined text-sm">close</span>
          Quick Exit
        </Button>
      </div>
    </aside>
  )
}