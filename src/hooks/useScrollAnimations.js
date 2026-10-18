"use client";

import { useEffect, useLayoutEffect } from "react";
import { MOTION_QUERIES, registerGsap } from "@/lib/animation-utils";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Runs a GSAP scene for one component and cleans it up completely on unmount.
 *
 *   useScrollScene(rootRef, ({ gsap, ScrollTrigger, q, horizontal, desktopMotion, motion }) => { ... });
 *
 * - Uses gsap.matchMedia() so scenes only exist where their media query matches, and are
 *   reverted automatically when it stops matching (resize / orientation change / reduced motion).
 * - Everything created inside `setup` (tweens, timelines, ScrollTriggers, pins) is reverted on cleanup,
 *   so React Strict Mode's double-invoked effects never leave duplicate triggers behind.
 * - Initial "hidden" states are only ever applied inside GSAP, so content stays visible if JS fails.
 * - `setup` must be stable per mount (it is read once); put changing values in refs.
 */
export function useScrollScene(rootRef, setup) {
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const { gsap, ScrollTrigger } = registerGsap();
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add(
      {
        horizontal: MOTION_QUERIES.horizontal,
        desktopMotion: MOTION_QUERIES.desktopMotion,
        motion: MOTION_QUERIES.motion,
      },
      (context) => {
        const { horizontal, desktopMotion, motion } = context.conditions;
        try {
          setup({ gsap, ScrollTrigger, q, root, horizontal, desktopMotion, motion });
        } catch (error) {
          // Never let an animation error hide content or break the page.
          console.error("[Serendib] scroll scene failed – falling back to static layout", error);
        }
      }
    );

    return () => {
      mm.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
