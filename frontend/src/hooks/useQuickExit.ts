import { useEffect, useRef } from 'react'
import { triggerQuickExit } from '../utils/quickExit'

const ESC_WINDOW_MS = 2000
const ESC_COUNT = 3

/** Esc pressed {@link ESC_COUNT} times within {@link ESC_WINDOW_MS} triggers quick exit (FR-19). */
export function useQuickExit(): void {
  const presses = useRef<number[]>([])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      const now = Date.now()
      presses.current = presses.current.filter((t) => now - t < ESC_WINDOW_MS)
      presses.current.push(now)
      if (presses.current.length >= ESC_COUNT) {
        presses.current = []
        triggerQuickExit()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}