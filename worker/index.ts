/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types */

export { Link } from './Link';

export default {
  async fetch(request: Request, env: any) {
    return await handleRequest(request, env);
  }
}

async function handleRequest(request: Request, env: Env) {
  // todo logic https://github.com/judge2020/workers-link-shortener/issues/22
  let id = env.LINK.idFromName("A");
  let obj = env.LINK.get(id);
  let resp = await obj.fetch(request);
  let count = await resp.text();

  return new Response(count);
}
