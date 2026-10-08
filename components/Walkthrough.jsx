"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import w from "./Walkthrough.module.css";

/**
 * Numbered steps beside a device that plays each step's screen. A finger (phone) or cursor (Mac) moves to the
 * element marked data-tap={step.key} on that screen and taps it. Plays while on screen; picking a step pauses it.
 */
export default function Walkthrough({ steps, screens, device = "phone", stepMs = 3800, cta }) {
  const reduce = useReducedMotion();
  const root = useRef(null);
  const screen = useRef(null);
  const inView = useInView(root, { amount: 0.35 });
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [tap, setTap] = useState(null);
  const cur = steps[step];
  const playing = auto && inView && !reduce;
  const mac = device === "mac";

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setStep((i) => (i + 1) % steps.length), stepMs);
    return () => clearTimeout(t);
  }, [step, playing, steps.length, stepMs]);

  // The pointer goes to the middle of the current screen's target, wherever it lays out.
  useLayoutEffect(() => {
    const place = () => {
      const box = screen.current;
      const el = box?.querySelector(`[data-tap="${cur.key}"]`);
      if (!el) return setTap(null);
      const a = box.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      setTap({ x: ((b.left + b.width / 2 - a.left) / a.width) * 100, y: ((b.top + b.height / 2 - a.top) / a.height) * 100 });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [cur.key]);

  const pick = (i) => {
    setAuto(false);
    setStep(i);
  };
  const replay = () => {
    setStep(0);
    setAuto(true);
  };

  return (
    <div className={`${w.layout} ${mac ? w.wide : ""}`} ref={root}>
      <div>
        <ol className={w.steps}>
          {steps.map((st, i) => (
            <li key={st.key}>
              <button className={w.step} aria-current={i === step ? "step" : undefined} onClick={() => pick(i)}>
                <span className={w.num}>{i + 1}</span>
                <span>
                  <span className={w.title}>{st.title}</span>
                  <span className={w.text}>{st.text}</span>
                </span>
                {i === step && playing && (
                  <span key={step} className={w.progress} style={{ animationDuration: `${stepMs}ms` }} />
                )}
              </button>
            </li>
          ))}
        </ol>
        <div className={w.ctas}>
          {cta}
          {!auto && !reduce && (
            <button className="btn quiet" onClick={replay}>Play the steps</button>
          )}
        </div>
      </div>

      <figure className={mac ? w.macFigure : w.figure} aria-hidden="true">
        <div className={mac ? w.mac : w.phone}>
          <div className={mac ? w.macScreen : w.screen} ref={screen}>
            <AnimatePresence initial={false}>
              <motion.div
                key={cur.key}
                className={w.layer}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.35 }}
              >
                {screens[cur.key]}
              </motion.div>
            </AnimatePresence>
            {tap && !reduce && (
              <motion.span
                className={mac ? w.cursor : w.finger}
                initial={false}
                animate={{ left: `${tap.x}%`, top: `${tap.y}%` }}
                transition={{ type: "spring", stiffness: 110, damping: 18 }}
              >
                <span key={step} className={mac ? w.click : w.press} />
              </motion.span>
            )}
          </div>
        </div>
        {mac && <div className={w.macBase} />}
      </figure>
    </div>
  );
}

/** iPhone status bar: time, Dynamic Island, battery. */
export const Status = () => (
  <div className={w.status}>
    <span>9:41</span>
    <span className={w.island} />
    <span className={w.battery} />
  </div>
);
