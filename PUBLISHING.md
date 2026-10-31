# Public deployment: nehitha-ss account only

Status: prepared locally, not published. No public URL has been created.
The original Vercel prototype and the existing Sites project are unchanged.

## Proposed deployment

`render.yaml` defines three NEW services from the dedicated
`feature/northstar-fastapi-integration` branch of
`https://github.com/nehitha-ss/aegis-agent-security`:

- AEGIS console: Node 24 / Next.js, public, health `/api/health`.
- AEGIS ingestion: authenticated Node service, persistent evidence disk.
- Northstar Finance: independent Python FastAPI service, persistent fake-finance disk.

The frontend can use Render's free plan. The two services with persistent disks
require paid compute. No paid service or disk has been created or charged.
Review the actual monthly estimate in Render before authorising provisioning.
These service names are configuration names, not confirmed public domains.

The local Vinext build remains available. The separate public-hosting scripts
build and serve the same app with Next.js on a normal Node host; Sites' Workers
runtime cannot run the Python and SQLite processes unchanged.

## Account requirements

1. Connect GitHub as **nehitha-ss**, with write access to the selected repository.
   The currently observed account is shozzz-coder; do not publish under that account.
2. Install/connect Render using the intended owner/workspace and verify its identity.
3. Push this dedicated branch only. Do not modify main or deploy an existing service.
4. Confirm the actual paid hosting estimate before creating billable resources.

## Deployment order and configuration

Create the ingestion service first, with a persistent disk mounted at `/var/data`.
Set `AEGIS_OWNER_KEYS` privately (JSON map of owner to a random private key of at
least 32 characters). Never put that value in the repository or public frontend.
Use `AEGIS_INTEGRATION_HOST=0.0.0.0` on this hosting target, and port 10000.
Set `AEGIS_ORIGIN` to the eventual exact public AEGIS console HTTPS origin.
Until the console exists and this value is correct, owner sign-in will be blocked.

Create the Finance service with its persistent disk and generated secrets. Set
`AEGIS_ENDPOINT` to the actual HTTPS ingestion origin. Privately register Northstar
using the ingestion owner's API (the Python connector registration helper is
available), then supply its returned `AEGIS_APP_ID` and `AEGIS_CONNECTION_KEY`
as Finance runtime secrets. Owner registration requires the exact configured Origin.
Generate a separate `AEGIS_PSEUDONYM_KEY`; do not reuse an owner/connection key.
Do not label the connection as received/live before actual reports arrive.

Render provides `RENDER_EXTERNAL_HOSTNAME`; Finance derives its HTTPS form origin
and Secure-cookie policy from it. Owner-lab internal HTTP calls use the local
`PORT`. The direct shared fictional customer entry stays enabled; unsafe helper
mode stays disabled. Private customer/owner passwords remain separate.

Create the console and set:

- `NEXT_PUBLIC_NORTHSTAR_URL`: the actual Finance HTTPS origin (public address only).
- `AEGIS_INTEGRATION_URL`: the actual ingestion HTTPS origin (server-side value).

The public build refuses missing, HTTP or localhost target addresses. Placeholder
example domains used in CI are only compilation fixtures, not deployed services.
Once its origin is assigned, update ingestion's `AEGIS_ORIGIN` and redeploy that
service. Verify owner access, a real customer statement report and correlated
evidence in the public console. Verify direct customer access and owner denial.

## Automatic updates

`.github/workflows/northstar-ci.yml` checks the dedicated branch. Render's
`autoDeployTrigger: checksPass` deploys a pushed commit only after its checks pass.
Every service builds the same branch; changing the public Finance address requires
rebuilding the console because its public link is embedded at build time.

Local unsaved edits do not change the public sites. Save, commit and push the
intended changes to this branch. A failed build leaves the previous deployment
in place. Persistent disks retain application records across normal redeploys;
disk-attached services may briefly stop during deployment. This is not an
unattended watcher that publishes all filesystem changes.

## Limits

Local validation: the Node/Next target compiled and passed its TypeScript step,
but Windows denied a filesystem write during final static prerendering (EPERM).
It has not passed a full public production build yet. The Linux CI production
build must pass before publishing; do not treat successful compilation alone as
a deployment. The local Vinext target remains the existing working preview.

The public frontend currently embeds the recovered prototype build; its original
editable Vercel source/backend are not available. Source-level maintenance of
those original screens requires obtaining that repository. Node/FastAPI owner
authentication is prototype authentication, not an enterprise identity provider.
This deployment is fictional/demo-only, single-instance SQLite storage, with no
banking connections or production data. Follow INTEGRATION.md for other limits.
