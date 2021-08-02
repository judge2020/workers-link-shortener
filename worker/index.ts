/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types */

export { Link } from './Link';

export default {
  async fetch(request: Request, env: any) {
    return await handleRequest(request, env);
  }
}

async function handleRequest(request: Request, env: Env) {
  let url = new URL(request.url);
  // remove leading slash
  let reqPath = url.pathname.substring(1);
  // default to the key `_index` for pulling the index redirect
  if (reqPath == '') {
    reqPath = '_index';
  }
  // handle creating via temporary API.
  if (reqPath == 'create') {
    let shortcode = url.searchParams.get("shortcode")!;
    let target = url.searchParams.get("target")!;
    let overwrite = url.searchParams.get("overwrite")!;
    if (!shortcode || !target) {
      return new Response("Please pass shortcode and target")
    }
    try {
      new URL(target!);
    }
    catch (TypeError) {
      return new Response(`Not a valid URL ${target}`)
    }
    if (!overwrite && (await env.WLS_LINK_LIST.get(shortcode)) != undefined) {
      // TODO: option to not generate new analytics durable object
      return new Response(`Shortcode ${shortcode} already exists. Use &overwrite=yes to overwrite it. This will also reset analytics.`)
    }
    let new_analytics_id = env.LINK.newUniqueId().toString();
    await env.WLS_LINK_LIST.put(shortcode, JSON.stringify({
      target: target,
      do_analytics_id: new_analytics_id
    }))
    return new Response(`created shortcode ${shortcode} with target ${target}`)
  }
  let potential_short = await env.WLS_LINK_LIST.get<any>(reqPath, "json");
  if (!potential_short) {
    return new Response(`404: ${reqPath} not found`, {status: 404});
  }
  let analytics_stub = await env.LINK.get(potential_short.do_analytics_id);
  // to show the response of the Durable Object during development, just prepend `return` to the next line.
  return await analytics_stub.fetch(`https://worker.local/increment?country=${request.cf.country}`);
  return new Response('', {headers: {"location": potential_short.target}, status: 302});
}
