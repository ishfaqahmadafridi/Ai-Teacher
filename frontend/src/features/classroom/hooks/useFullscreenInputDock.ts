'use client';

import { useEffect, useRef } from 'react';
import { FULLSCREEN_DOCK_REVEAL_DISTANCE } from '../constants/inputConstants';

/** Move the existing toolbar into the fullscreen board without resetting its controls. */
export function useFullscreenInputDock() {
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    if (!toolbar?.parentElement) return;
    const parent = toolbar.parentElement;
    const anchor = document.createComment('classroom-input-dock');
    parent.insertBefore(anchor, toolbar);
    let host: HTMLElement | null = null;
    const sync = () => {
      const nextHost = document.querySelector<HTMLElement>('[data-fullscreen-board="true"] [data-fullscreen-input-host]');
      if (nextHost === host) return;
      host = nextHost;
      if (host) host.appendChild(toolbar);
      else if (anchor.parentNode) anchor.parentNode.insertBefore(toolbar, anchor.nextSibling);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!host) return;
      const nearBottom = event.clientY >= window.innerHeight - FULLSCREEN_DOCK_REVEAL_DISTANCE;
      host.dataset.revealed = String(nearBottom || host.contains(event.target as Node));
    };
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['data-fullscreen-board'] });
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('fullscreenchange', sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('fullscreenchange', sync);
      if (anchor.parentNode) {
        anchor.parentNode.insertBefore(toolbar, anchor.nextSibling);
        anchor.remove();
      }
    };
  }, []);

  return toolbarRef;
}
