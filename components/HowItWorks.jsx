"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from "motion/react";
import s from "./HowItWorks.module.css";

// One hour of night, 11:00 PM to midnight, in minutes. Check-ins every 5 min (the default interval).
const SPAN = 60;
const CHECKINS = [2, 7, 12, 17, 22, 57];
const TAP = 19;
const WAKE = 22;
const SLEEP = 52; // 30 min "Stay awake for" default
const at = (m) => m / SPAN;
const pct = (m) => `${(m / SPAN) * 100}%`;
const clock = (m) => (m >= 60 ? "12:00 AM" : `11:${String(m).padStart(2, "0")} PM`);

function stateAt(m) {
  if (m < TAP) return ["sleep", "Asleep"];
  if (m < WAKE) return ["pending", "Waking up…"];
  if (m < SLEEP) return ["awake", "Awake"];
  return ["sleep", "Back asleep"];
}

const STEPS = [
  {
    title: "Your Mac sleeps and checks in",
    body: "Every few minutes it wakes itself on its hardware timer, asks the console whether you want it, and goes straight back to sleep. These are dark wakes: screen off, a few seconds each.",
  },
  {
    title: "You tap Wake",
    body: "Tap “Wake up Mac” on your phone or in the web console. The console holds the request until your Mac asks.",
  },
  {
    title: "Your Mac stays awake",
    body: "At its next check-in it sees the request and stays awake, 30 minutes by default, lid open or closed. Screen Sharing and SSH are ready. On charger, Instant wake gets it there in about a second.",
  },
];

function Blip({ p, m }) {
  const a = at(m);
  // The wake check-in hands over to the mint bar, so it doesn't leave an afterglow.
  const rest = m === WAKE ? 0 : 0.4;
  const opacity = useTransform(p, [a - 0.004, a, a + 0.05], [0.18, 1, rest]);
  const scale = useTransform(p, [a - 0.004, a, a + 0.05], [1, 1.6, 1]);
  return <motion.span className={s.blip} style={{ left: pct(m), opacity, scale }} />;
}

export default function HowItWorks() {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Gate on mount so server and first client render agree.
  const reduce = mounted && prefersReduced;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.3"] });
  const p = useTransform(scrollYProgress, (v) => (reduce ? 1 : v));

  const [minute, setMinute] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setMinute(Math.round(v * SPAN)));
  const m = reduce ? SPAN : minute;
  const [led, status] = stateAt(m);
  const step = m < TAP ? 0 : m < WAKE ? 1 : 2;

  const wait = useTransform(p, [at(TAP), at(WAKE)], [0, 1]);
  const awake = useTransform(p, [at(WAKE), at(SLEEP)], [0, 1]);
  const tap = useTransform(p, [at(TAP) - 0.004, at(TAP)], [0.2, 1]);
  const signal = useTransform(p, [at(TAP), at(TAP) + 0.05], [0.6, 3.2]);
  const signalFade = useTransform(p, [at(TAP) - 0.001, at(TAP), at(TAP) + 0.05], [0, 1, 0]);
  const playhead = useTransform(p, (v) => `${v * 100}%`);

  return (
    <section className="section" id="how" aria-labelledby="how-title">
      <div className="wrap">
        <h2 id="how-title" className="h2">How a sleeping Mac hears you</h2>
        <p className="lead">
          A sleeping Mac can&rsquo;t receive anything from the internet. So MacWake turns it around: your Mac does the asking.
        </p>

        <figure ref={ref} className={s.figure}>
          <div aria-hidden="true">
            <div className={s.readout}>
              <span className="led" data-state={led} />
              <span className={s.clock}>{clock(m)}</span>
              <span className={s.status} data-state={led}>{status}</span>
            </div>

            <div className={s.above}>
              <span className={`${s.label} ${s.alignEnd}`} style={{ right: `${100 - at(TAP) * 100}%` }}>
                You tap Wake<small>11:19 PM</small>
              </span>
              <span className={`${s.label} ${s.heavy}`} style={{ left: pct(WAKE) }}>
                Awake<small>11:22 PM</small>
              </span>
            </div>

            <div className={s.track}>
              <span className={s.base} />
              <motion.span className={s.drawn} style={{ scaleX: p, originX: 0 }} />
              <motion.span className={s.wait} style={{ left: pct(TAP), width: pct(WAKE - TAP), scaleX: wait, originX: 0 }} />
              <motion.span className={s.awake} style={{ left: pct(WAKE), width: pct(SLEEP - WAKE), scaleX: awake, originX: 0 }} />
              <motion.span className={s.tap} style={{ left: pct(TAP), opacity: tap }} />
              <motion.span className={s.signal} style={{ left: pct(TAP), scale: signal, opacity: signalFade }} />
              {CHECKINS.map((c) => <Blip key={c} p={p} m={c} />)}
              {!reduce && <motion.span className={s.playhead} style={{ left: playhead }} />}
            </div>

            <div className={s.below}>
              <span className={`${s.label} ${s.thin}`} style={{ left: 0 }}>Checks in every 5 min</span>
              <span className={`${s.label} ${s.thin} ${s.alignEnd}`} style={{ right: `${100 - at(SLEEP) * 100}%` }}>
                Back asleep<small>11:52 PM</small>
              </span>
            </div>
          </div>

          <figcaption className={s.caption}>
            One hour of a sleeping Mac. Each flash is a check-in.
            <span className="sr-only">
              {" "}From 11:00 PM to midnight the Mac checks in at 11:02, 11:07, 11:12 and 11:17 and sleeps in between.
              You tap Wake at 11:19. At the 11:22 check-in it wakes and stays awake until 11:52, then goes back to sleep.
            </span>
          </figcaption>
        </figure>

        <ol className={s.steps}>
          {STEPS.map((st, i) => (
            <li key={st.title} className={s.step} data-active={i === step}>
              <span className={s.num}>{i + 1}</span>
              <h3 className={s.title}>{st.title}</h3>
              <p className={s.body}>{st.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
