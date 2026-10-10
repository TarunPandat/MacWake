// Every outbound link on the site. Set the NEXT_PUBLIC_* variables in Vercel to change one without a code change.
export const site = {
  console: process.env.NEXT_PUBLIC_CONSOLE_URL || "https://mac-wake-console.vercel.app",
  mac: process.env.NEXT_PUBLIC_MAC_URL || "/downloads/MacWake.dmg",
  android: process.env.NEXT_PUBLIC_ANDROID_URL || "/downloads/MacWake.apk",
  ios: process.env.NEXT_PUBLIC_IOS_URL || "", // App Store or TestFlight link; empty offers the Home Screen profile
  iosProfile: "/downloads/MacWake.mobileconfig", // Web Clip profile, no developer account needed
  macVersion: "1.4",
};
