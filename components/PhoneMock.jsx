"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import s from "./PhoneMock.module.css";

const MAC = "MacBook Pro";
const EASE = [0.2, 0.8, 0.2, 1];

// Copy is the app's own (mobile/src/core.ts), so the mock never says something the real screen doesn't.
const STATES = {
  awake: {
    led: "awake",
    word: "Awake.",
    weight: 700,
    line: "Staying awake until 11:42 PM. Screen Sharing and SSH should work now.",
    seen: "8 s ago",
    pill: "Let it sleep",
    quiet: true,
  },
  sleep: {
    led: "sleep",
    word: "Asleep.",
    weight: 250,
    line: `${MAC} is resting and checks in every 10 min.`,
    seen: "3 min ago",
    pill: "Wake up Mac",
  },
  // On charger a wake lands in about a second, so the mock waits about that long.
  pending: {
    led: "pending",
    word: "Waking up…",
    weight: 450,
    line: "Your Mac will see the request at its next check-in, in about 3 min.",
    seen: "3 min ago",
    pill: "Waiting for your Mac…",
    disabled: true,
  },
};

export default function PhoneMock() {
  const reduce = useReducedMotion();
  const [state, setState] = useState("awake");
  const [touched, setTouched] = useState(false);
  const v = STATES[state];

  useEffect(() => {
    if (state !== "pending") return;
    const t = setTimeout(() => setState("awake"), 1200);
    return () => clearTimeout(t);
  }, [state]);

  function press() {
    if (v.disabled) return;
    setTouched(true);
    setState(state === "awake" ? "sleep" : "pending");
  }

  const facts = [
    ["Last check-in", v.seen],
    ["Lid", "Open"],
    ["Power", "On battery, 64%"],
    ["Mac", MAC],
  ];

  return (
    <figure className={s.figure}>
      <div className={s.phone}>
        <div className={s.screen} data-state={v.led}>
          <div className={s.status} aria-hidden="true">
            <span>11:12</span>
            <span className={s.island} />
            <span className={s.battery} />
          </div>

          <div className={s.top} aria-hidden="true">
            <span className={s.brand}>MacWake</span>
            <span>Sign out</span>
          </div>

          <div className={s.hero} aria-live="polite" aria-atomic="true">
            <div className={s.light} aria-hidden="true">
              <span className={s.spill} />
              <span className={`led ${s.led}`} data-state={v.led} />
            </div>
            {/* Thin while it sleeps, heavy once it's awake: the weight eases like the Mac settling. */}
            <motion.p
              className={s.word}
              initial={false}
              animate={{ fontWeight: v.weight }}
              transition={{ duration: reduce ? 0 : state === "sleep" ? 1.4 : 0.5, ease: EASE }}
            >
              {v.word}
            </motion.p>
            <motion.p
              key={state}
              className={s.line}
              initial={touched && !reduce ? { opacity: 0, y: 6 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease: EASE }}
            >
              {v.line}
            </motion.p>
          </div>

          <dl className={s.facts}>
            {facts.map(([k, val]) => (
              <div className={s.fact} key={k}>
                <dt>{k}</dt>
                <dd>{val}</dd>
              </div>
            ))}
          </dl>

          <div className={s.dock}>
            {/* aria-disabled, not disabled, so keyboard focus stays on the button through the wake. */}
            <button
              type="button"
              className={s.pill}
              data-quiet={v.quiet || undefined}
              aria-disabled={v.disabled || undefined}
              onClick={press}
            >
              {v.pill}
            </button>
          </div>
          <span className={s.home} aria-hidden="true" />
        </div>
      </div>
      <figcaption className={s.caption}>
        The same screen on iPhone, Android and the web. Try the button.
      </figcaption>
    </figure>
  );
}
