import { getAssetFromKV } from "@cloudflare/kv-asset-handler"

// https://github.com/judge2020/workers-link-shortener/issues/21

export async function handleEvent(event: FetchEvent): Promise<Response> {
  let potentialAsset = getAssetFromKV(event, {defaultDocument: "index.html"});
  if (potentialAsset) {
    return potentialAsset;
  }
  return new Response(`not found`, {
    status: 404,
    statusText: "not found",
  })
}
