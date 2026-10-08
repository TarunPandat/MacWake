import { site } from "../lib/site";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <div className={styles.top}>
          <div className={styles.brand}>
            <p className={styles.mark}>
              <span className="led" data-state="sleep" aria-hidden="true" />
              MacWake
            </p>
            <p className={styles.line}>Wake your Mac at home from anywhere.</p>
          </div>
          <nav aria-label="Footer">
            <ul className={styles.links}>
              <li><a href="#download">Download</a></li>
              <li><a href="#how">How it works</a></li>
              <li><a href="#faq">Questions</a></li>
              <li>
                <a href={site.console} target="_blank" rel="noopener">
                  Admin console<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className={styles.bottom}>
          {/* Static render: the year updates on the next deploy. */}
          <small>© {new Date().getFullYear()} MacWake</small>
          <span className={`led ${styles.goodnight}`} data-state="sleep" aria-hidden="true" />
        </div>
      </div>
    </footer>
  );
}
