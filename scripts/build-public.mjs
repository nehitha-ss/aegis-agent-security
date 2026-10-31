import { spawnSync } from 'node:child_process';
process.env.AEGIS_PUBLIC_BUILD = 'true';
// The console is deployed as a self-contained Render service.  These URLs are
// optional integration hints, not deployment prerequisites; using the service
// origin makes a first deploy safe before optional integration settings exist.
const publicOrigin = 'https://aegis-northstar-console.onrender.com';
for (const key of ['NEXT_PUBLIC_NORTHSTAR_URL', 'AEGIS_INTEGRATION_URL']) {
  const candidate = process.env[key] || publicOrigin;
  const url = new URL(candidate);
  if (url.protocol !== 'https:' || ['localhost', '127.0.0.1'].includes(url.hostname)) {
    throw new Error(`Set ${key} to a public HTTPS service origin when overriding the AEGIS default.`);
  }
  process.env[key] = url.origin;
}
const result = spawnSync(process.execPath, ['node_modules/next/dist/bin/next','build','--webpack'], {stdio:'inherit',env:process.env});
if(result.error)throw result.error;
process.exit(result.status ?? 1);
