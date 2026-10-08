"use client";

import { useState } from "react";
import { site } from "../lib/site";
import Walkthrough, { Status } from "./Walkthrough";
import s from "./Setup.module.css";

// ---------- On your Mac: the Mac app's real setup flow (mac/Sources/main.swift). ----------
const MAC_STEPS = [
  { key: "dmg", title: "Install the app", text: "Open MacWake.dmg and drag MacWake into Applications. Then open it from Applications." },
  {
    key: "allow",
    title: "Allow it once",
    text: "The first time, macOS blocks apps from outside the App Store. Open System Settings, Privacy & Security, and click Open Anyway.",
  },
  {
    key: "password",
    title: "Let it set up",
    text: "MacWake sets itself up and asks for your Mac password once, to install the background service that wakes your Mac.",
  },
  { key: "menu", title: "Find it in the menu bar", text: "MacWake lives in the menu bar. Click it and choose Pair phone… whenever you add a phone." },
  {
    key: "pair",
    title: "Your pairing code",
    text: "The Pair your phone window shows a QR code and your token. Keep it open and pick up your phone.",
  },
];

// ---------- On your phone: two ways to pair. ----------
const SCAN_STEPS = [
  {
    key: "camera",
    title: "Point your camera at the code",
    text: "Open the Camera app and point it at the QR code on your Mac. The MacWake app and the console also have Scan pairing code.",
  },
  { key: "link", title: "Tap the link", text: "A yellow link appears under the code. Tap it." },
  {
    key: "ready",
    title: "You're paired",
    text: "MacWake opens already signed in and shows your Mac. Wake up Mac is now one tap away.",
  },
];
const TOKEN_STEPS = [
  {
    key: "field",
    title: "Copy the token",
    text: "On your Mac, click Copy token in the Pair your phone window, or choose Copy token from MacWake in the menu bar. On your phone, open MacWake and tap the Token field.",
  },
  {
    key: "paste",
    title: "Paste it",
    text: "Tap the field again and choose Paste. With the same Apple ID on both, Universal Clipboard carries the token over. You can also type it.",
  },
  { key: "signin", title: "Sign in", text: "Tap Sign in." },
  { key: "ready", title: "You're paired", text: "Your Mac's status shows up. Tap Wake up Mac whenever you need it." },
];

export default function Setup() {
  const [mode, setMode] = useState("scan");
  return (
    <section className="section" id="setup" aria-labelledby="setup-title">
      <div className="wrap">
        <h2 className="h2" id="setup-title">Set up and pair</h2>
        <p className="lead">Set up the Mac app first. Then pair your phone by scanning a QR code or pasting a token.</p>

        <h3 className={s.h3}>On your Mac</h3>
        <Walkthrough
          device="mac"
          steps={MAC_STEPS}
          screens={MAC_SCREENS}
          cta={<a className="btn" href={site.mac} download>Download for Mac</a>}
        />

        <h3 className={s.h3}>On your phone</h3>
        <div className={s.toggle} role="group" aria-label="How to pair">
          <button aria-pressed={mode === "scan"} onClick={() => setMode("scan")}>Scan the QR code</button>
          <button aria-pressed={mode === "token"} onClick={() => setMode("token")}>Paste the token</button>
        </div>
        <Walkthrough
          key={mode}
          steps={mode === "scan" ? SCAN_STEPS : TOKEN_STEPS}
          screens={mode === "scan" ? SCAN_SCREENS : TOKEN_SCREENS}
        />
      </div>
    </section>
  );
}

// A stand-in QR code: finder squares in three corners and a fixed pattern of modules. Not scannable on purpose.
const QR_PATH = (() => {
  const n = 25, cells = [];
  let seed = 7;
  const finder = (x, y) => x < 7 && y < 7;
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      if (finder(x, y) || finder(n - 1 - x, y) || finder(x, n - 1 - y)) continue;
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      if (seed % 100 < 46) cells.push(`M${x} ${y}h1v1h-1z`);
    }
  for (const [x, y] of [[0, 0], [n - 7, 0], [0, n - 7]])
    cells.push(`M${x} ${y}h7v7h-7zM${x + 1} ${y + 1}v5h5v-5zM${x + 2} ${y + 2}h3v3h-3z`);
  return cells.join("");
})();
const Qr = (props) => (
  <svg viewBox="-2 -2 29 29" className={s.qr} {...props}>
    <rect x="-2" y="-2" width="29" height="29" fill="#fff" />
    <path d={QR_PATH} fill="#000" fillRule="evenodd" />
  </svg>
);

const AppIcon = ({ className = "", ...rest }) => <span className={`${s.appIcon} ${className}`} {...rest} />;

// ---------- Mac screens ----------
const MenuBar = ({ open }) => (
  <div className={s.menubar}>
    <span className={s.menuLeft}><b>Finder</b><span>File</span><span>Edit</span><span>View</span><span>Go</span><span>Window</span></span>
    <span className={s.menuRight}>
      <span className={`${s.mwIcon} ${open ? s.mwOpen : ""}`} />
      <span>Thu 9:41 PM</span>
    </span>
  </div>
);

const Window = ({ title, className = "", children }) => (
  <div className={`${s.window} ${className}`}>
    <div className={s.titlebar}>
      <span className={s.lights}><i /><i /><i /></span>
      <span>{title}</span>
    </div>
    {children}
  </div>
);

const MAC_SCREENS = {
  dmg: (
    <div>
      <MenuBar />
      <Window title="MacWake" className={s.finder}>
        <div className={s.dmgBody}>
          <span className={s.dmgItem}>
            <AppIcon data-tap="dmg" />
            MacWake
            <AppIcon className={s.ghost} />
          </span>
          <span className={s.dmgArrow} />
          <span className={s.dmgItem}>
            <span className={s.folder} />
            Applications
          </span>
        </div>
      </Window>
    </div>
  ),
  allow: (
    <div>
      <MenuBar />
      <Window title="Privacy & Security" className={s.settings}>
        <div className={s.settingsBody}>
          <ul className={s.sidebar}>
            <li>Wi-Fi</li><li>Bluetooth</li><li>Network</li><li>Notifications</li><li>General</li>
            <li className={s.sel}>Privacy & Security</li><li>Desktop & Dock</li><li>Displays</li>
          </ul>
          <div className={s.pane}>
            <p className={s.paneH}>Security</p>
            <div className={s.card}>
              <p>“MacWake” was blocked to protect your Mac.</p>
              <span className={s.macBtn} data-tap="allow">Open Anyway</span>
            </div>
          </div>
        </div>
      </Window>
    </div>
  ),
  password: (
    <div>
      <MenuBar />
      <div className={s.dialog}>
        <AppIcon className={s.dialogIcon} />
        <b>MacWake wants to make changes.</b>
        <p>Enter your password to allow this.</p>
        <span className={s.field}>Your Name</span>
        <span className={s.field}><span className={s.typing}>••••••••••</span></span>
        <span className={s.dialogBtns}>
          <span className={s.macBtn}>Cancel</span>
          <span className={`${s.macBtn} ${s.default}`} data-tap="password">OK</span>
        </span>
      </div>
    </div>
  ),
  menu: (
    <div>
      <MenuBar open />
      <ul className={s.menu}>
        <li className={s.dim}>Running, checking in with the console</li>
        <li className={s.sep} />
        <li className={s.hl} data-tap="menu">Pair phone…</li>
        <li>Copy token</li>
        <li>Open console</li>
        <li className={s.sep} />
        <li>Change console URL…</li>
        <li>Show log</li>
        <li>Sleep now</li>
        <li className={s.sep} />
        <li>Uninstall…</li>
        <li>Quit MacWake</li>
      </ul>
    </div>
  ),
  pair: (
    <div>
      <MenuBar />
      <div className={`${s.dialog} ${s.pairDialog}`}>
        <AppIcon className={s.dialogIcon} />
        <b>Pair your phone</b>
        <p>Scan this with your phone camera to open the console signed in. Then use Add to Home Screen.</p>
        <p>Or paste this token on the sign-in screen:<br /><span className={s.token}>9f3c41…e07b2d</span></p>
        <Qr data-tap="pair" />
        <span className={s.dialogBtns}>
          <span className={s.macBtn}>Open console</span>
          <span className={s.macBtn}>Copy token</span>
          <span className={`${s.macBtn} ${s.default}`}>Done</span>
        </span>
      </div>
    </div>
  ),
};

// ---------- Phone screens ----------
const Camera = ({ link }) => (
  <div className={s.camera}>
    <Status />
    <div className={s.viewfinder}>
      <div className={s.photoMac}>
        <Qr />
        <span className={s.brackets} data-tap={link ? undefined : "camera"} />
      </div>
      {link && <span className={s.qrLink} data-tap="link">mac-wake-console.vercel.app</span>}
    </div>
    <div className={s.shutterRow}><span className={s.mode}>PHOTO</span><span className={s.shutter} /></div>
  </div>
);

// The MacWake screen itself (app, Home Screen icon or console look the same).
const Ready = () => (
  <div className={s.app}>
    <Status />
    <div className={s.appTop}><span>MacWake</span><span>Sign out</span></div>
    <span className="led" data-state="awake" />
    <p className={s.appWord}>Ready.</p>
    <p className={s.appLine}>Your MacBook is plugged in and listening, so it wakes within seconds.</p>
    <dl className={s.appFacts}>
      <dt>Last check-in</dt><dd>12 s ago</dd>
      <dt>Lid</dt><dd>Closed</dd>
      <dt>Power</dt><dd>On charger</dd>
    </dl>
    <span className={s.appPill} data-tap="ready">Wake up Mac</span>
  </div>
);

const SignIn = ({ value, callout }) => (
  <div className={s.app}>
    <Status />
    <span className={`led ${s.signLed}`} data-state="sleep" />
    <p className={s.appWord}>MacWake</p>
    <p className={s.appLine}>Scan the pairing code from the MacWake menu on your Mac, or paste its token.</p>
    <div className={s.signForm}>
      <span className={s.label}>Token</span>
      <span className={s.input} data-tap={value || callout ? undefined : "field"}>
        {value ? <span className={s.dots}>••••••••••••••••••••••••••</span> : <span className={s.placeholder}>48 letters and numbers</span>}
        {callout && <span className={s.callout} data-tap="paste">Paste</span>}
      </span>
      <span className={s.appPill} data-tap={value ? "signin" : undefined}>Sign in</span>
      <span className={`${s.appPill} ${s.quiet}`}>Scan pairing code</span>
    </div>
  </div>
);

const SCAN_SCREENS = { camera: <Camera />, link: <Camera link />, ready: <Ready /> };
const TOKEN_SCREENS = {
  field: <SignIn />,
  paste: <SignIn callout />,
  signin: <SignIn value />,
  ready: <Ready />,
};
