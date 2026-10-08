"use client";
import { useEffect, useRef, useState } from "react";
import { site } from "../lib/site";
import css from "./Hero.module.css";

// The hero is a working demo of the real flow: asleep -> request sent -> awake -> let it sleep.
const COPY = {
  asleep: { led: "sleep", word: "Asleep.", line: "Your MacBook is asleep at home and checks in every few minutes." },
  sent: { led: "pending", word: "Waking up…", line: "Sent. Your Mac will see it at its next check-in." },
  awake: { led: "awake", word: "Awake.", line: "" },
};

const clock = t => new Date(t).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export default function Hero() {
  const [phase, setPhase] = useState("asleep");
  const [until, setUntil] = useState("");
  const touched = useRef(false);
  const timer = useRef(0);

  const wake = () => {
    touched.current = true;
    clearTimeout(timer.current);
    setPhase("sent");
    timer.current = setTimeout(() => {
      setUntil(clock(Date.now() + 30 * 60e3));
      setPhase("awake");
    }, 1700);
  };
  const sleep = () => {
    touched.current = true;
    clearTimeout(timer.current);
    setPhase("asleep");
  };

  // One orchestrated moment: if nobody has touched the demo, the Mac wakes itself once, a beat after load.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => { if (!touched.current) { wake(); touched.current = false; } }, 2600);
    return () => { clearTimeout(t); clearTimeout(timer.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const v = COPY[phase];
  const line = phase === "awake" ? `Staying awake until ${until}. Screen Sharing and SSH should work now.` : v.line;

  return (
    <section className={css.hero} id="top" aria-labelledby="hero-title" data-phase={phase}>
      <div className={css.room} aria-hidden="true" />
      <div className={`wrap ${css.grid}`}>
        <div className={css.copy}>
          <h1 id="hero-title" className={css.title}>
            <span>Wake your Mac</span> <span>at home from</span> <span>anywhere.</span>
          </h1>
          <p className={`lead ${css.lead}`}>
            Tap Wake on your phone. Your sleeping MacBook gets ready for Screen Sharing and SSH, even with the lid closed.
          </p>
          <div className={css.ctas}>
            <a className="btn" href="#download">Get MacWake</a>
            <a className="btn quiet" href={site.console} target="_blank" rel="noopener">Open the console</a>
          </div>
        </div>

        <div className={css.stage}>
          <div className={css.scene} aria-hidden="true">
            <div className={css.mac}>
              <div className={css.base}>
                <div className={css.keys} />
                <div className={css.pad} />
              </div>
              <div className={css.front}><span className={css.frontLight} /></div>
              <div className={css.lid}>
                <div className={css.shell}><span className={css.logo} /></div>
                <div className={css.screen}>
                  <div className={css.menubar}><span className="led" data-state="awake" /></div>
                  <div className={css.window}>
                    <span>you@home-mac ~ %</span>
                    <span className={css.cursor} />
                  </div>
                </div>
              </div>
            </div>
            <svg className={css.signal} viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M18 96 C 18 60, 60 70, 50 18" pathLength="1" />
            </svg>
          </div>

          <div className={css.readout} role="status" aria-live="polite">
            <span className="led" data-state={v.led} aria-hidden="true" />
            <p className={css.word}>{v.word}</p>
            <p className={css.line}>{line}</p>
            {phase === "awake"
              ? <button className="btn quiet" onClick={sleep}>Let it sleep</button>
              : <button className="btn" onClick={wake} disabled={phase === "sent"} aria-disabled={phase === "sent"}>
                  {phase === "sent" ? "Waiting for your Mac…" : "Wake up Mac"}
                </button>}
          </div>
        </div>
      </div>
    </section>
  );
}
