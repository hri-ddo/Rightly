import { Outlet } from 'react-router-dom'
import { CrisisBar } from '../components/CrisisBar'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import { useQuickExit } from '../hooks/useQuickExit'

export function SafetyLayout() {
  useQuickExit()

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <div className="fixed top-0 right-0 left-0 z-50 flex flex-col">
        <CrisisBar />
        <SiteHeader />
      </div>
      <main className="flex flex-1 flex-col pt-[6.5rem]">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}