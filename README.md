# MSP Computer Alert

This is a Node/Express app and **must be deployed to a Node-capable host**.
Do not deploy it as a static GitHub Pages site.

## Correct structure

- `server.js` — backend/API
- `package.json` — Node dependencies/start command
- `public/index.html` — webpage
- `public/sw.js` — phone push service worker

## Why you saw `Unexpected token '<'`

Your browser tried to parse the response from `/api/public-key` as JSON, but the server returned an HTML page beginning with `<!DOCTYPE html>`. That normally happens when the project is being served as a static site (for example, GitHub Pages) instead of running `server.js`.

## Deploy

Use a Node-capable service such as Render, Railway, or another host that runs:

```bash
npm install
npm start
```

After deployment, open the **deployed HTTPS URL on the phone first**, tap **CONNECT THIS PHONE**, then open the same URL on the computer.

## Environment variables

For a persistent deployment, set:

- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT` (for example `mailto:your@email.com`)

If VAPID keys are not supplied, the app generates temporary keys each time the server restarts.
