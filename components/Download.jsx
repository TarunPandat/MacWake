"use client";

import { useSyncExternalStore } from "react";
import { site } from "../lib/site";
import PhoneMock from "./PhoneMock";
import s from "./Download.module.css";

const ORDER = ["mac", "ios", "android", "console"];

function detect() {
  const ua = navigator.userAgent;
  const p = navigator.userAgentData?.platform || navigator.platform || "";
  // iPadOS Safari introduces itself as a Mac; the touch screen gives it away.
  if (/iPhone|iPad|iPod/.test(ua) || (/Mac/.test(p) && navigator.maxTouchPoints > 1)) return "ios";
  if (/Android/i.test(ua) || /Android/i.test(p)) return "android";
  if (/Mac/.test(p) || /Macintosh/.test(ua)) return "mac";
  return "other";
}

const subscribe = () => () => {};
// The server can't know the visitor's device, so it renders the Mac first: every setup starts there.
const usePlatform = () => useSyncExternalStore(subscribe, detect, () => "mac");

function arrange(platform) {
  const first = platform === "other" ? "console" : platform;
  const order = [first, ...ORDER].filter((id, i, all) => all.indexOf(id) === i);
  return { order, primary: first };
}

const btn = (solid) => (solid ? "btn" : "btn quiet");

const ROWS = {
  mac: {
    name: "Mac",
    action: (solid) => (
      <a className={btn(solid)} href={site.mac} download>
        Download for Mac
      </a>
    ),
    small: `macOS 13 or later. Apple silicon and Intel. Version ${site.macVersion}.`,
    note: "Open the DMG and drag MacWake to Applications. macOS blocks the first launch because the app isn't notarized yet: open System Settings, Privacy & Security, and click Open Anyway. Then it sits in the menu bar.",
  },
  ios: {
    name: "iPhone and iPad",
    action: (solid) =>
      site.ios ? (
        <a className={btn(solid)} href={site.ios}>
          Get it on the App Store
        </a>
      ) : (
        <a className={btn(solid)} href={site.iosProfile}>
          Install on iPhone
        </a>
      ),
    small: site.ios
      ? "Wake your Mac from your phone."
      : "Adds MacWake to your Home Screen, no App Store needed. Open this page in Safari on your iPhone, tap Install on iPhone and Allow, then in Settings tap Profile Downloaded and Install.",
  },
  android: {
    name: "Android",
    action: (solid) => (
      <a className={btn(solid)} href={site.android} download>
        Download for Android
      </a>
    ),
    small: "Android 7 or later. Allow installs from your browser when asked.",
  },
  console: {
    name: "Web console",
    action: (solid) => (
      <a className={btn(solid)} href={site.console} target="_blank" rel="noopener">
        Open the console
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    ),
    small: "The admin console. Works in any browser.",
  },
};

export default function Download() {
  const { order, primary } = arrange(usePlatform());

  return (
    <section className="section" id="download" aria-labelledby="download-title">
      <div className="wrap">
        <h2 className="h2" id="download-title">Get MacWake</h2>
        <p className="lead">
          Install the Mac app on the Mac you want to wake. Then wake it from your phone, or from the
          console in any browser.
        </p>

        <div className={s.layout}>
          <div>
            <ul className={s.list}>
              {order.map((id) => {
                const row = ROWS[id];
                return (
                  <li className={s.row} key={id}>
                    <div>
                      <h3 className={s.name}>{row.name}</h3>
                      <p className={s.small}>{row.small}</p>
                      {row.note && <p className={s.note}>{row.note}</p>}
                    </div>
                    <div className={s.action}>{row.action(id === primary)}</div>
                  </li>
                );
              })}
            </ul>
            <p className={s.pair}>
              To pair your phone, choose Pair phone… from MacWake in your Mac&apos;s menu bar, then scan
              the QR code with your phone’s camera or the MacWake app.
            </p>
          </div>

          <PhoneMock />
        </div>
      </div>
    </section>
  );
}
