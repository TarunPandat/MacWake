import { readFileSync } from "node:fs";
import { join } from "node:path";
import { site } from "../../../lib/site";

// iPhone install without the App Store or a developer account: a configuration profile with one Web Clip.
// It puts a MacWake icon on the Home Screen that opens the console full screen. iOS can't install a native
// .ipa this way; that needs TestFlight, the App Store or an Ad Hoc build from a paid Apple Developer account.
export const dynamic = "force-static";

// Fixed UUIDs, so installing again replaces the profile instead of adding a second icon.
const PROFILE_UUID = "3F78223C-9D07-4BDA-BF20-B514A6787EE8";
const CLIP_UUID = "6C4E34E8-BB12-466A-BDC9-207D09433714";

const xml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
  const icon = readFileSync(join(process.cwd(), "app/apple-icon.png")).toString("base64");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>FullScreen</key><true/>
      <key>Icon</key><data>${icon}</data>
      <key>IsRemovable</key><true/>
      <key>Label</key><string>MacWake</string>
      <key>Precomposed</key><true/>
      <key>URL</key><string>${xml(site.console)}</string>
      <key>PayloadDescription</key><string>Adds MacWake to your Home Screen.</string>
      <key>PayloadDisplayName</key><string>MacWake</string>
      <key>PayloadIdentifier</key><string>io.macwake.webclip</string>
      <key>PayloadType</key><string>com.apple.webClip.managed</string>
      <key>PayloadUUID</key><string>${CLIP_UUID}</string>
      <key>PayloadVersion</key><integer>1</integer>
    </dict>
  </array>
  <key>PayloadDescription</key><string>Adds the MacWake app to your Home Screen. Remove it any time in Settings, General, VPN &amp; Device Management.</string>
  <key>PayloadDisplayName</key><string>MacWake</string>
  <key>PayloadIdentifier</key><string>io.macwake.profile</string>
  <key>PayloadOrganization</key><string>MacWake</string>
  <key>PayloadRemovalDisallowed</key><false/>
  <key>PayloadType</key><string>Configuration</string>
  <key>PayloadUUID</key><string>${PROFILE_UUID}</string>
  <key>PayloadVersion</key><integer>1</integer>
</dict>
</plist>
`;
  return new Response(body, {
    headers: {
      // This type is what makes Safari offer to install the profile.
      "Content-Type": "application/x-apple-aspen-config",
      "Content-Disposition": 'attachment; filename="MacWake.mobileconfig"',
    },
  });
}
