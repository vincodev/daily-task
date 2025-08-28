const { execSync } = require("child_process");

console.log("🚀 Daily Task App Update Script");
console.log("================================");

console.log("\n📱 To push updates to your installed app:");
console.log("1. Make your code changes");
console.log("2. Run: npx expo export");
console.log("3. Run: npx expo publish");
console.log("\n💡 This will update the app on your phone without rebuilding!");

console.log("\n🔄 Alternative method (if OTA fails):");
console.log("1. Make your code changes");
console.log("2. Run: npx eas-cli build --platform android --profile preview");
console.log("3. Download and install the new APK");

console.log("\n🎯 For quick updates, use the OTA method above!");
console.log(
  "   Your users will get updates automatically when they open the app."
);
