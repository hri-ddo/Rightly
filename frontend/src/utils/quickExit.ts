const QUICK_EXIT_URL = 'https://www.wikipedia.org'

const REMINDER =
  'You are leaving Rightly. This page will be removed from your browser history for this visit.'

/** Shows a brief browser-history reminder and replaces the current page with a neutral site (FR-19). */
export function triggerQuickExit(): void {
  window.alert(REMINDER)
  window.location.replace(QUICK_EXIT_URL)
}