"use client";
import { useEffect, useState } from "react";
import { site } from "../lib/site";
import css from "./Nav.module.css";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={css.nav} data-scrolled={scrolled}>
      <div className={`wrap ${css.row}`}>
        <a href="#top" className={css.brand} aria-label="MacWake home">
          <span className="led" data-state="sleep" aria-hidden="true" />
          MacWake
        </a>
        <nav aria-label="Main" className={css.links}>
          <a href="#how">How it works</a>
          <a href="#setup">Set up</a>
          <a href="#features">Features</a>
          <a href="#faq">Questions</a>
          <a href={site.console} target="_blank" rel="noopener">Console</a>
        </nav>
        <a className={`btn ${css.cta}`} href="#download">Download</a>
      </div>
    </header>
  );
}
