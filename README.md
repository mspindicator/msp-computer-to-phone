# MSP Computer-to-Phone

Deploy as a Node/Express **Web Service**, not a static site.

## Render
Build command: `npm install`
Start command: `npm start`

## Important: VAPID keys
Set these Render Environment Variables so phone subscriptions survive server restarts/redeploys:

- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT` (for example `mailto:your@email.com`)

If these are not set, the server generates temporary VAPID keys at startup. Existing phone subscriptions can then stop working after a restart/redeploy.

After setting the variables, redeploy, open the site on the phone, press CONNECT THIS PHONE again, and test a NOW notification.

The server now also reports push-send failures instead of falsely reporting success.
