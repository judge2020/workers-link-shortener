# Workers Link Shortener (v2)

A link shortener built on Cloudflare Workers utilizing Durable Objects to provide things like analytics.

This is not backwards compatible with Workers Link Shortener v1.

## dev

Prerequisites: node LTS, wrangler

1. clone repository and open in vscode/console
2. run `npm install`
3. edit `wrangler.toml` and set account_id to your account id
4. generate a KV namespace like so (the name can be different if you wish):

```bash
wrangler kv:namespace create WLS_LINK_LIST
```
5. Append the KV namespace config it gives you to your `wrangler.toml`
6. run `npm run build` (builds the frontend, however it is non-functional for now, see https://github.com/judge2020/workers-link-shortener/issues/21)
7. run `wrangler publish`

### Customize frontend configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
