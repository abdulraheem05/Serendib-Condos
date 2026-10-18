"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { CONSULTATION_HREF, CONTACT_EMAIL, navLinks } from "@/data/site";
import { ArrowUpRight, CloseIcon, MenuIcon } from "./Icons";

const ANNOUNCEMENT_HEIGHT = 36; // keep in sync with AnnouncementBar (h-9)

export default function Header() {
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const overlayRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Slide under the announcement bar while at the top, then stick to the viewport top.
  // Writes straight to the DOM (no React state per scroll frame).
  useEffect(() => {
    let frame = 0;
    let last = null;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (headerRef.current) headerRef.current.style.top = `${Math.max(0, ANNOUNCEMENT_HEIGHT - y)}px`;
      const next = y > 80;
      if (next !== last) {
        last = next;
        setScrolled(next);
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  // Menu overlay: Escape closes, Tab is trapped, page scroll is locked.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      overlayRef.current ? Array.from(overlayRef.current.querySelectorAll("a[href], button:not([disabled])")) : [];
    focusables()[0]?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
      } else if (e.key === "Tab") {
        const items = focusables();
        if (!items.length) return;
        const first = items[0];
        const lastItem = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          lastItem.focus();
        } else if (!e.shiftKey && document.activeElement === lastItem) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, closeMenu]);

  return (
    <>
      <header
        ref={headerRef}
        style={{ top: ANNOUNCEMENT_HEIGHT }}
        className={clsx(
          "fixed inset-x-0 z-50 transition-[background-color,box-shadow,color] duration-500 ease-[var(--ease-cine)]",
          scrolled ? "bg-paper/95 text-brand-navy shadow-[0_1px_0_rgba(13,28,49,0.08)] backdrop-blur-md" : "bg-transparent text-white"
        )}
      >
        <div className="mx-auto grid h-[4.5rem] max-w-[1800px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 md:px-8">
          <div className="flex items-center gap-2 md:gap-3">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              className="flex min-h-11 items-center gap-2.5 rounded-full px-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em]"
            >
              <MenuIcon />
              <span>Menu</span>
            </button>
            <a href="#properties" className={clsx("btn hidden !min-h-9 !px-4 !text-[0.625rem] lg:inline-flex", scrolled ? "btn-ghost" : "btn-paper")}>
              Explore properties
            </a>
            <a
              href="#how"
              className="hidden text-[0.6875rem] font-semibold uppercase tracking-[0.18em] opacity-90 hover:opacity-100 lg:inline"
            >
              How it works
            </a>
          </div>

          <a href="#home" aria-label="Serendib Condos – home" className="rounded-lg bg-white/95 px-2 py-1 shadow-sm">
            <Image
              src="/assets/logo/serendib-condos-logo.png"
              alt="Serendib Condos"
              width={350}
              height={341}
              priority
              className="h-11 w-auto md:h-12"
            />
          </a>

          <div className="flex items-center justify-end gap-4">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="hidden text-[0.6875rem] font-semibold uppercase tracking-[0.14em] opacity-90 hover:opacity-100 xl:inline"
            >
              {CONTACT_EMAIL}
            </a>
            <a href={CONSULTATION_HREF} className={clsx("btn !min-h-10 !px-4 !text-[0.625rem] md:!px-5", scrolled ? "btn-navy" : "btn-gold")}>
              <span className="hidden sm:inline">Book a consultation</span>
              <span className="sm:hidden">Book</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!menuOpen}
        className={clsx(
          "fixed inset-0 z-[70] flex flex-col bg-brand-navy text-white transition-[opacity,visibility,transform] duration-500 ease-[var(--ease-cine)]",
          menuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0"
        )}
      >
        <div className="flex h-[4.5rem] items-center justify-between px-4 md:px-8">
          <span className="eyebrow text-brand-gold">Menu</span>
          <button
            type="button"
            onClick={closeMenu}
            className="flex min-h-11 items-center gap-2 rounded-full border border-white/30 px-4 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] hover:border-brand-gold"
          >
            <CloseIcon className="h-4 w-4" /> Close
          </button>
        </div>
        <nav aria-label="Primary" className="flex flex-1 flex-col justify-center gap-1 px-6 pb-16 md:px-16">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="group flex items-baseline gap-5 border-b border-white/10 py-3 font-display text-[clamp(2.25rem,7vw,5rem)] font-bold leading-none tracking-tight transition-colors hover:text-brand-gold"
            >
              <span className="font-sans text-xs font-medium tracking-[0.2em] text-brand-gold">0{i + 1}</span>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 pb-8 text-sm text-white/70 md:px-16">
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-brand-gold">
            {CONTACT_EMAIL}
          </a>
          <span>A bridge between Canada and Sri Lanka</span>
        </div>
      </div>
    </>
  );
}
