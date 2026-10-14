# Essentialke frontend — Hostinger

Vue 3 storefront built with Vite and Tailwind CSS. The production API remains at
https://api.essentialke.co.ke/api.

## hPanel web app settings

| Setting | Value |
| --- | --- |
| Repository | `web_essentialke` |
| Branch | `main` |
| Root directory | `./` |
| Framework | Vue.js |
| Node.js | 22.x |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |

For a repository containing both projects, use `web_essentialke` as the root
directory instead. This is a static frontend; no server entry file is required.

Production browser settings live in the tracked `.env.production`. hPanel build
environment variables override those values. Set `VITE_API_URL` to
`https://api.essentialke.co.ke/api`, `VITE_ASSET_URL` to
`https://api.essentialke.co.ke`, and retain the production Google client ID.
Only public browser settings belong in VITE variables; never add API secrets.

`public/.htaccess` is copied to `dist` and supplies Vue Router's history fallback
and security headers on Apache/LiteSpeed. Verify direct links after deployment;
if the hosting plan does not apply this file, enable its SPA/history fallback.

## Domain cutover

1. Deploy these changes in hPanel and check the deployment logs and preview.
2. Connect `essentialke.co.ke` and `www.essentialke.co.ke` to this web app using
   the DNS records supplied by hPanel. Keep API and email DNS records intact.
3. If testing on a Hostinger preview domain, add its exact HTTPS origin to the
   API's `ALLOWED_ORIGINS` and Google's authorized JavaScript origins before
   testing login. Rebuild/redeploy the API after changing its environment.
4. Check HTTPS, a direct product URL, `/login`, `/admin`, API requests, Google
   login, cart and checkout. Reload a direct URL to confirm routing works.
5. Keep the previous Netlify deployment available for rollback until these
   checks pass. Changing DNS does not require moving DNS nameservers.

## Local build

```sh
npm ci
npm run build
```

Hostinger deployment reference:
https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
