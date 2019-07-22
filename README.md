## CLoudflare Workers Link Shortener (WIP)

Utilizes Workers KV as a link shortener.

This is still a WIP and feature-incomplete. Analytics are not implemented. 


#### Usage

No build artifacts will be available while the API may break at any time.

1. clone this repo
2. run `npm i`
3. run `npm build`
4. Create a KV namespace at Cloudflare (name it whatever you wish)
5. in Cloudflare, create a new workers script and paste the entire contents of `dist/worker.js`.
5. set up routes (if non-`workers.dev` subdomain)
6. add a KV binding with the variable name set to "LINKS_KV", and targeting the KV namespace you made earlier


#### Preventing unauthorized shortlinks

It is recommended to set up Cloudflare access for the `/admin` path. Basic auth is planned.

UI for creating shortlinks is also planned, currently you'll need to run a `fetch` in your browser's JS console to make the post request with the Access authorization.



