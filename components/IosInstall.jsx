"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { site } from "../lib/site";
import s from "./IosInstall.module.css";

const STEP_MS = 3800;

// The real iOS screens for installing the profile, in order. Each screen marks its button with data-tap.
const STEPS = [
  {
    screen: "site",
    title: "Tap Install on iPhone",
    text: "Open this page in Safari on your iPhone or iPad and tap Install on iPhone.",
  },
  {
    screen: "allow",
    title: "Allow the download",
    text: "Safari asks whether this website may download a configuration profile. Tap Allow, then Close.",
  },
  {
    screen: "settings",
    title: "Open Settings",
    text: "Open the Settings app. Profile Downloaded is right under your name. Tap it.",
  },
  {
    screen: "profile",
    title: "Tap Install",
    text: "The MacWake profile holds one Web Clip: the Home Screen icon. Tap Install, and enter your passcode if asked.",
  },
  {
    screen: "confirm",
    title: "Confirm",
    text: "iOS notes that the profile isn't signed. That's expected for MacWake. Tap Install, then Install again.",
  },
  {
    screen: "home",
    title: "Open MacWake",
    text: "MacWake is on your Home Screen. Open it and sign in with the pairing code from your Mac.",
  },
];

export default function IosInstall() {
  const reduce = useReducedMotion();
  const section = useRef(null);
  const screen = useRef(null);
  const inView = useInView(section, { amount: 0.35 });
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [tap, setTap] = useState(null);
  const cur = STEPS[step];
  const playing = auto && inView && !reduce;

  // Plays through the steps while the section is on screen, until someone picks a step themselves.
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setStep((i) => (i + 1) % STEPS.length), STEP_MS);
    return () => clearTimeout(t);
  }, [step, playing]);

  // The finger goes to the middle of the current screen's button, wherever it lays out.
  useLayoutEffect(() => {
    const place = () => {
      const root = screen.current;
      const el = root?.querySelector(`[data-tap="${cur.screen}"]`);
      if (!el) return;
      const a = root.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      setTap({ x: ((b.left + b.width / 2 - a.left) / a.width) * 100, y: ((b.top + b.height / 2 - a.top) / a.height) * 100 });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [cur.screen]);

  const pick = (i) => {
    setAuto(false);
    setStep(i);
  };
  const replay = () => {
    setStep(0);
    setAuto(true);
  };

  return (
    <section className="section" id="install-iphone" aria-labelledby="install-iphone-title" ref={section}>
      <div className="wrap">
        <h2 className="h2" id="install-iphone-title">Install on iPhone and iPad</h2>
        <p className="lead">No App Store needed. Six taps, about a minute, and the same on iPad.</p>

        <div className={s.layout}>
          <div>
            <ol className={s.steps}>
              {STEPS.map((st, i) => (
                <li key={st.screen}>
                  <button className={s.step} aria-current={i === step ? "step" : undefined} onClick={() => pick(i)}>
                    <span className={s.num}>{i + 1}</span>
                    <span>
                      <span className={s.title}>{st.title}</span>
                      <span className={s.text}>{st.text}</span>
                    </span>
                    {i === step && playing && (
                      <span key={step} className={s.progress} style={{ animationDuration: `${STEP_MS}ms` }} />
                    )}
                  </button>
                </li>
              ))}
            </ol>
            <div className={s.ctas}>
              <a className="btn" href={site.iosProfile}>Install on iPhone</a>
              {!auto && !reduce && (
                <button className="btn quiet" onClick={replay}>Play the steps</button>
              )}
            </div>
          </div>

          <figure className={s.figure} aria-hidden="true">
            <div className={s.phone}>
              <div className={s.screen} ref={screen}>
                <AnimatePresence initial={false}>
                  <motion.div
                    key={cur.screen}
                    className={s.layer}
                    initial={{ opacity: 0, scale: 0.985 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.35 }}
                  >
                    {SCREENS[cur.screen]}
                  </motion.div>
                </AnimatePresence>
                {tap && !reduce && (
                  <motion.span
                    className={s.finger}
                    initial={false}
                    animate={{ left: `${tap.x}%`, top: `${tap.y}%` }}
                    transition={{ type: "spring", stiffness: 110, damping: 18 }}
                  >
                    <span key={step} className={s.press} />
                  </motion.span>
                )}
              </div>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}

const Status = () => (
  <div className={s.status}>
    <span>9:41</span>
    <span className={s.island} />
    <span className={s.battery} />
  </div>
);

// Step 1 and 2: this website in Safari.
const Site = ({ alert }) => (
  <div className={s.site}>
    <Status />
    <div className={s.siteNav}>
      <span className={s.siteBrand}><span className="led" data-state="sleep" />MacWake</span>
      <span className={s.sitePill}>Download</span>
    </div>
    <p className={s.siteH}>Get MacWake</p>
    <p className={s.siteRow}>iPhone and iPad</p>
    <p className={s.siteSmall}>Adds MacWake to your Home Screen, no App Store needed.</p>
    <span className={s.siteBtn} data-tap="site">Install on iPhone</span>
    <div className={s.safari}><span>macwake.vercel.app</span></div>
    {alert && (
      <>
        <div className={s.scrim} />
        <div className={s.alert}>
          <p>This website is trying to download a configuration profile. Do you want to allow this?</p>
          <div className={s.alertActions}>
            <span>Ignore</span>
            <b data-tap="allow">Allow</b>
          </div>
        </div>
      </>
    )}
  </div>
);

const Row = ({ color, label }) => (
  <div className={s.row}>
    <span className={s.icon} style={{ background: color }} />
    <span>{label}</span>
    <span className={s.chev} />
  </div>
);

// Step 4 and 5: the profile sheet in Settings.
const Sheet = ({ title, children }) => (
  <div className={s.ios}>
    <Status />
    <div className={s.sheet}>
      <div className={s.navbar}>
        <span>Cancel</span>
        <b>{title}</b>
        <span data-tap={title === "Install Profile" ? "profile" : undefined}>Install</span>
      </div>
      {children}
    </div>
  </div>
);

const SCREENS = {
  site: <Site />,
  allow: <Site alert />,
  settings: (
    <div className={s.ios}>
      <Status />
      <p className={s.large}>Settings</p>
      <div className={s.search}>Search</div>
      <div className={s.group}>
        <div className={s.account}>
          <span className={s.avatar} />
          <span>
            <b>Your Name</b>
            <small>Apple Account, iCloud and more</small>
          </span>
        </div>
      </div>
      <div className={`${s.group} ${s.downloaded}`} data-tap="settings">
        <div className={s.row}>
          <span>Profile Downloaded</span>
          <span className={s.chev} />
        </div>
      </div>
      <div className={s.group}>
        <Row color="#636366" label="General" />
        <Row color="#0a84ff" label="Accessibility" />
        <Row color="#636366" label="Camera" />
        <Row color="#0a84ff" label="Home Screen" />
        <Row color="#5e5ce6" label="Screen Time" />
      </div>
    </div>
  ),
  profile: (
    <Sheet title="Install Profile">
      <div className={s.group}>
        <div className={s.profileHead}>
          <span className={s.gear} />
          <span>
            <b>MacWake</b>
            <small>MacWake</small>
          </span>
        </div>
        <dl className={s.facts}>
          <dt>Signed by</dt>
          <dd className={s.red}>Not Signed</dd>
          <dt>Description</dt>
          <dd>Adds the MacWake app to your Home Screen.</dd>
          <dt>Contains</dt>
          <dd>Web Clip</dd>
        </dl>
        <div className={s.row}>
          <span>More Details</span>
          <span className={s.chev} />
        </div>
      </div>
    </Sheet>
  ),
  confirm: (
    <Sheet title="Warning">
      <p className={s.caption}>UNSIGNED PROFILE</p>
      <div className={s.group}>
        <div className={s.row}><span>The profile is not signed.</span></div>
      </div>
      <div className={s.scrim} />
      <div className={s.actionSheet}>
        <div className={s.red} data-tap="confirm">Install</div>
        <div><b>Cancel</b></div>
      </div>
    </Sheet>
  ),
  home: (
    <div className={s.home}>
      <Status />
      <div className={s.apps}>
        <span className={s.app}>
          <span className={`${s.appIcon} ${s.macwake}`} data-tap="home" />
          MacWake
        </span>
        {["#3a3c52", "#2c3e50", "#4a3b5c", "#2f4a45", "#3d3a2f", "#30344f", "#463042"].map((c, i) => (
          <span className={s.app} key={i}>
            <span className={s.appIcon} style={{ background: c }} />
            <span className={s.appLabel} />
          </span>
        ))}
      </div>
      <div className={s.dock}>
        {["#2f3b55", "#3b2f4f", "#2f4a45", "#4a3d2f"].map((c) => (
          <span className={s.appIcon} key={c} style={{ background: c }} />
        ))}
      </div>
    </div>
  ),
};
