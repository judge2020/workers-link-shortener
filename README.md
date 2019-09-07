## CLoudflare Workers Link Shortener (WIP)

Utilizes Workers KV as a link shortener.

This is still a WIP and feature-incomplete. Analytics are not implemented. 


#### Usage

Requirements: [node/npm](https://nodejs.org) v10+, Cloudflare account with the $5/month workers subscription.

1. clone or download this repo
2. run `npm install`
3. run `npm run buildworker`
4. [Create a KV namespace](https://dash.cloudflare.com/?account=workers/kv/namespaces) at Cloudflare (name it whatever you wish).
5. in Cloudflare, create a new workers script and paste the entire contents of `dist/worker.js`.
6. set up routes, or if using a `workers.dev` subdomain, set up a subdomain to use.
7. add a KV binding with the variable name set to "LINKS_KV", and targeting the KV namespace you made earlier.

#### Enabling the frontend UI

The frontend UI uses [cloudflare-file-hosting](https://github.com/judge2020/cloudflare-file-hosting), which requires extra setup to upload the files correctly.

1. [Create another KV namespace](https://dash.cloudflare.com/?account=workers/kv/namespaces)
2. copy `.env.example` to `.env` and fill in all values
3. run `npm run build` to build the UI
4. run `npm run uploadfrontend` to upload the built frontend to the KV namespace.
5. add a KV binding to your script with the variable `FILES_KV` targeting the namespace.

#### Preventing unauthorized shortlinks

The admin interface has no authentication currently, so it is highly recommended to set up Cloudflare access for the `/admin` path.
