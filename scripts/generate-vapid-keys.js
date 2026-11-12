const fs = require("node:fs");
const webpush = require("web-push");

const envPath = ".env";
const current = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
const keys = webpush.generateVAPIDKeys();
const values = {
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: keys.publicKey,
  VAPID_PRIVATE_KEY: keys.privateKey,
  VAPID_SUBJECT: "mailto:admin@example.com",
};
let lines = current.replace(/^\uFEFF/, "").split(/\r?\n/);
for (const [name, value] of Object.entries(values)) {
  const line = `${name}="${value}"`;
  const index = lines.findIndex((entry) => entry.startsWith(`${name}=`));
  if (index >= 0) lines[index] = line;
  else lines.push(line);
}
fs.writeFileSync(envPath, `${lines.filter((line, index) => line || index < lines.length - 1).join("\n")}\n`, { mode: 0o600 });
console.log("Generated VAPID keys in .env. Keep VAPID_PRIVATE_KEY server-side and out of Git.");
