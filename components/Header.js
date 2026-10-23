
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import EnquiryButton from "./EnquiryButton";
import { Menu, X, ArrowUpRight } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const header = useRef(null);

  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    const outside = (e) => {
      if (!header.current?.contains(e.target)) setOpen(false);
    };

    document.addEventListener("keydown", key);
    document.addEventListener("click", outside);

    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("click", outside);
    };
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setOpen(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <div className="topline">
        <div className="container">
          A bridge between Canada and Sri Lanka
          <span>Property guidance, wherever you call home.</span>
        </div>
      </div>

      <header className="header" ref={header}>
        <div className="container nav-shell">
          <a
            href="#home"
            className="brand"
            aria-label="Serendib Condos home"
            onClick={(e) => scrollToSection(e, "home")}
          >
            <img
              src="/assets/logo.png"
              alt="Serendib Condos"
              width={280}
              height={95}
            />
          </a>

          <button
            className="menu"
            type="button"
            aria-controls="navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            Menu {open ? <X size={17} /> : <Menu size={17} />}
          </button>

          <nav
            id="navigation"
            className={open ? "open" : ""}
            aria-label="Main navigation"
          >
            {[
              ["home", "Home"],
              ["properties", "Properties"],
              ["how", "How it works"],
              ["about", "About us"],
              ["contact", "Consultation"],
            ].map(([id, label]) =>
              id === "contact" ? (
                <EnquiryButton
                  key={id}
                  className="button small"
                  onOpen={() => setOpen(false)}
                >
                  Book a consultation
                  <ArrowUpRight size={15} aria-hidden="true" />
                </EnquiryButton>
              ) : (
                <a
                  href={`#${id}`}
                  key={id}
                  onClick={(e) => scrollToSection(e, id)}
                >
                  {label}
                </a>
              )
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
