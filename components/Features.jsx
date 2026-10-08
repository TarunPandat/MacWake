"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import s from "./Features.module.css";

const EASE = [0.2, 0.8, 0.2, 1];

// Where the wake signal sits on the rail in each phase: phone 0, console 50, Mac 100.
const POS = { idle: 0, toConsole: 50, waiting: 50, checkin: 50, toMac: 100, awake: 100 };

const STATUS = {
  idle: "Asleep",
  toConsole: "Waking up…",
  waiting: "Waiting for the next check-in",
  checkin: "The Mac checks in",
  toMac: "Waking up…",
  awake: "Awake",
};

const LANES = [
  {
    id: "charger",
    title: "On charger",
    time: "About 1 second",
    body: "Instant wake is on by default. While plugged in, the Mac skips deep sleep and listens on a push channel, so your tap gets there right away. The screen stays off.",
    done: "awake in about a second",
    // [ms after the tap, phase]. This lane plays at real speed.
    steps: [[80, "toConsole"], [530, "toMac"], [930, "awake"]],
  },
  {
    id: "battery",
    title: "On battery",
    time: "Up to 10 minutes",
    body: "Your wake waits for the Mac's next check-in: every 5 minutes by default, stretching to 10 on battery to save power.",
    done: "awake at its next check-in",
    // Sped up: the wait at the console stands in for minutes.
    steps: [[80, "toConsole"], [530, "waiting"], [2900, "checkin"], [3400, "toMac"], [3850, "awake"]],
  },
];

function Icon({ children }) {
  return (
    <svg className={s.icon} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

const ITEMS = [
  {
    term: "Works with the lid closed",
    text: "With the lid shut, the Mac stays awake with its screen off, and Screen Sharing and SSH still work.",
    icon: (
      <Icon>
        <rect x="3" y="9" width="18" height="6" rx="1.5" />
        <path d="M3 12h18" />
        <rect x="10.5" y="13.1" width="3" height="0.9" rx="0.45" fill="var(--led)" stroke="none" />
      </Icon>
    ),
  },
  {
    term: "Screen stays dark during check-ins",
    text: "Check-ins are silent dark wakes. The screen stays off and the Mac is back asleep within seconds.",
    icon: (
      <Icon>
        <rect x="4" y="4.5" width="16" height="11" rx="1.5" />
        <path d="M2.5 19h19" />
        <path d="M11.76 6.51A3.5 3.5 0 1 0 15.28 11.21 3 3 0 0 1 11.76 6.51Z" />
      </Icon>
    ),
  },
  {
    term: "Easy on the battery",
    text: "On battery the Mac checks in less often, every 10 minutes instead of 5. When your Stay awake time runs out, 30 minutes by default, it goes back to sleep on its own.",
    icon: (
      <Icon>
        <rect x="2.5" y="8" width="17" height="8" rx="2" />
        <path d="M21.5 11v2" />
        <rect x="5" y="10.5" width="10" height="3" rx="0.75" fill="currentColor" stroke="none" />
      </Icon>
    ),
  },
  {
    term: "Your token stays yours",
    text: "The Mac generates the pairing token. The phone apps keep it in the device keychain, and the console stores only its SHA-256 hash.",
    icon: (
      <Icon>
        <circle cx="8" cy="12" r="3.5" />
        <path d="M11.5 12H21M18 12v3M21 12v2" />
      </Icon>
    ),
  },
  {
    term: "No router setup",
    text: "No port forwarding, no always-on box at home, and it isn't Wake-on-LAN. The Mac reaches out on its own, so there's nothing to open on your network.",
    icon: (
      <Icon>
        <rect x="3" y="12" width="18" height="7" rx="2" />
        <path d="M7.5 12V6.5M16.5 12V6.5" />
        <path d="M4 4l16 16" />
      </Icon>
    ),
  },
];

// Keyed by run in the parent, so every wake remounts the lane and starts from "idle".
function Lane({ lane, run, reduce, live }) {
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    if (!run) return;
    const steps = reduce ? [[0, "awake"]] : lane.steps;
    const timers = steps.map(([ms, next]) => setTimeout(() => setPhase(next), ms));
    return () => timers.forEach(clearTimeout);
  }, [run, reduce, lane]);

  const awake = phase === "awake";
  const tone = phase === "idle" ? "sleep" : awake ? "awake" : "pending";
  const move = reduce ? { duration: 0 } : { duration: 0.45, ease: EASE };

  return (
    <li className={s.lane} data-awake={awake}>
      <div>
        <h3 className={s.laneTitle}>{lane.title}</h3>
        <p className={s.time}>{lane.time}</p>
        <p className={s.body}>{lane.body}</p>
      </div>

      <div className={s.track}>
        {/* Solid line to the Mac on charger (it's listening), dashed on battery (it only checks in). */}
        <div className={s.rail} data-lane={lane.id} aria-hidden="true">
          <span className={s.seg} />
          <span className={`${s.seg} ${s.far}`} />
          <span className={s.phone} />
          <span className={s.console} />
          <span className={s.mac}>
            <span className="led" data-state={awake ? "awake" : "sleep"} aria-hidden="true" />
          </span>
          {phase === "checkin" && (
            <motion.span className={s.blip} initial={{ left: "100%" }} animate={{ left: "50%" }} transition={move} />
          )}
          <motion.span
            className={s.signal}
            data-waiting={phase === "waiting"}
            initial={{ left: "0%", opacity: 0, scale: 1 }}
            animate={{ left: `${POS[phase]}%`, opacity: phase === "idle" || awake ? 0 : 1, scale: awake ? 0.4 : 1 }}
            transition={move}
          />
        </div>
        <div className={s.captions} aria-hidden="true">
          <span>Your phone</span>
          <span>Console</span>
          <span>Your Mac</span>
        </div>
        <p className={s.status} data-tone={tone}>
          <span className={s.dot} aria-hidden="true" />
          {STATUS[phase]}
        </p>
        <span className="sr-only" aria-live="polite">
          {live && awake ? `${lane.title}: ${lane.done}.` : ""}
        </span>
      </div>
    </li>
  );
}

export default function Features() {
  const reduce = useReducedMotion();
  const raceRef = useRef(null);
  const inView = useInView(raceRef, { once: true, amount: 0.4 });
  const [presses, setPresses] = useState(0);
  const run = presses + (inView ? 1 : 0);

  return (
    <section className="section" id="features" aria-labelledby="features-title">
      <div className="wrap">
        <h2 id="features-title" className="h2">A second on the charger. Minutes on battery.</h2>
        <p className="lead">How quickly your Mac answers depends on one thing: whether it&apos;s plugged in.</p>

        <div className={s.race} ref={raceRef}>
          <ul className={s.lanes}>
            {LANES.map((lane) => (
              <Lane key={`${lane.id}-${run}`} lane={lane} run={run} reduce={reduce} live={presses > 0} />
            ))}
          </ul>
          <div className={s.controls}>
            <button type="button" className="btn quiet" onClick={() => setPresses((p) => p + 1)}>
              <span className={s.spark} aria-hidden="true" />
              Send a wake
            </button>
            <p className={s.note}>The battery lane is sped up.</p>
          </div>
        </div>

        <h3 className={s.listTitle}>What you get</h3>
        <dl className={s.list}>
          {ITEMS.map(({ term, text, icon }) => (
            <div className={s.item} key={term}>
              <dt className={s.term}>
                {icon}
                {term}
              </dt>
              <dd className={s.def}>{text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
