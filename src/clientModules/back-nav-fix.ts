/**
 * Workaround for a Docusaurus + Rspack interaction where, after a browser
 * back/forward navigation, the new route is reflected in the URL but the
 * <main> content is never re-rendered (the page looks blank until the user
 * presses Refresh).
 *
 * The fix:
 *  1. On every `popstate`, give Docusaurus a tick to remount the route.
 *  2. If after that tick the document still has no rendered <main>/article
 *     for the current route, force a hard reload as a last resort. In a
 *     properly hydrated session this branch never executes; in the broken
 *     state it makes the back button work the way users expect.
 *
 * This is intentionally defensive and side-effect-free in the normal case.
 */

declare const window: Window & typeof globalThis;

const RECHECK_DELAY_MS = 80;

function pageLooksRendered(): boolean {
  if (typeof document === 'undefined') return true;

  const main = document.querySelector('main');
  if (!main) return false;

  // Docusaurus always mounts at least one of these inside <main> for both
  // doc pages and the homepage. If none are present, hydration didn't
  // attach to the new route.
  const knownChildren = main.querySelector(
    'article, .container, .docMainContainer_TBSr, [class*="docMainContainer"], [class*="mainWrapper"]',
  );
  return Boolean(knownChildren);
}

function onPopState() {
  if (typeof window === 'undefined') return;

  window.setTimeout(() => {
    if (!pageLooksRendered()) {
      window.location.reload();
    }
  }, RECHECK_DELAY_MS);
}

export function onRouteDidUpdate(): void {
  // No-op. Docusaurus calls this on every successful client-side
  // route update. Its presence is enough to make Docusaurus treat this
  // file as a valid client module.
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', onPopState);
}
