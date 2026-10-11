import styles from "./Faq.module.css";

const faqs = [
  [
    "Does my Mac need to be plugged in?",
    "No. On battery it still checks in and wakes when you ask, it just checks in less often. Plugged in, it can wake in about a second.",
  ],
  [
    "How fast does it wake?",
    "On charger, about a second: Instant wake keeps the Mac listening on a push channel instead of in deep sleep. On battery, or with Instant off, it waits for its next check-in, up to 5 minutes by default and up to 10 on battery.",
  ],
  [
    "Does it work with the lid closed?",
    "Yes. The Mac stays awake with the screen off, and Screen Sharing and SSH work as usual.",
  ],
  [
    "What can I do once it's awake?",
    "Connect with Screen Sharing or SSH. It stays awake for your “Stay awake for” time, 30 minutes by default, then lets itself sleep again. Tap “Let it sleep” to end it early.",
  ],
  [
    "Can I see my Mac's screen?",
    "Yes. Tap Watch screen in the app or the console. It wakes the Mac if needed and shows its screen live, view-only. On the Mac, allow Screen Recording for MacWake once when it asks. With the lid closed and no external display there's no screen to show, and right after a wake you may see the lock screen.",
  ],
  [
    "Will it drain my battery?",
    "Each check-in is brief: the Mac asks whether anyone wants it awake and goes straight back to sleep if not. On battery it backs off to every 10 minutes.",
  ],
  [
    "Is this Wake-on-LAN?",
    "No. There's no always-on box at home, no router setup and no port forwarding. The Mac wakes itself on its own hardware timer and asks your console whether you want it.",
  ],
  [
    "Where is my data?",
    "The pairing token is made on your Mac. The console stores only its SHA-256 hash and your Mac's status. The iPhone and Android apps keep the token in the device keychain; the web console keeps it in your browser. Instant wakes are nudged through the ntfy.sh push service on a channel derived from that hash. Screen video goes directly from your Mac to your phone, encrypted; the console only passes along the connection setup. The token now opens the screen too, so treat it like a password: New token in the MacWake menu unpairs every phone.",
  ],
];

export default function Faq() {
  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className={`wrap ${styles.grid}`}>
        <h2 className="h2" id="faq-title">Questions</h2>
        <div className={styles.list}>
          {faqs.map(([q, a]) => (
            <details key={q} className={styles.item}>
              <summary className={styles.q}>
                {q}
                <span className={styles.light} aria-hidden="true" />
              </summary>
              <p className={styles.a}>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
