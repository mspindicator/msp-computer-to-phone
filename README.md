# MSP Computer-to-Phone

Deploy as a Node/Express Web Service.

Render:
- Build command: `npm install`
- Start command: `npm start`

The server automatically generates a VAPID key pair if VAPID environment variables are absent.
It saves the pair to `vapid-keys.json` so the same running instance can reuse the keys.

For persistence across Render redeploys, the recommended production setup is still to set:
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`

After deployment, open the site on Android, connect the phone again, then close the site and
test a NOW notification from the computer.
