import { Onest } from "next/font/google";
import "./globals.css";

// Variable Onest (100-900): the site animates weight, thin while the Mac sleeps, heavy once it's awake.
const onest = Onest({ subsets: ["latin"], variable: "--font", display: "swap" });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://macwake.vercel.app"),
  title: "MacWake: wake your Mac at home from anywhere",
  description: "Tap Wake on your phone and your sleeping MacBook at home is ready for Screen Sharing and SSH. For macOS, iPhone, iPad and Android.",
  openGraph: {
    title: "MacWake",
    description: "Wake your Mac at home from anywhere.",
    type: "website",
  },
};

export const viewport = { themeColor: "#12142b", colorScheme: "dark" };

export default function Layout({ children }) {
  return (
    <html lang="en" className={onest.variable}>
      <body>{children}</body>
    </html>
  );
}
