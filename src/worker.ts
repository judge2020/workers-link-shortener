import CloudflareWorkerGlobalScope, {CloudflareDefaultCacheStorage, CloudflareWorkerKV} from 'types-cloudflare-worker';

declare var self: CloudflareWorkerGlobalScope;
let cache: CloudflareDefaultCacheStorage = caches.default;

// KV declarations
// injected by Cloudflare at runtime
declare var LINKS_KV: CloudflareWorkerKV;
declare var ANALYTICS_KV: CloudflareWorkerKV;

export class Worker {

    analytics = false;

    constructor() {
        // hack to detect whether or not to enable analytics based on if the analytics KV namespace is defined
        if (typeof(ANALYTICS_KV) != "undefined") {
            this.analytics = true;
        }
    }

    public async handle_analytics(request: Request) {
        if (!this.analytics) {
            return
        }

        // future use for when storing analytics is implemented
        let path = new URL(request.url).pathname.substr(1);

        let userinfo = {
            "ip": request.headers.get("cf-connecting-ip"),
            "colo": request.cf.colo,
            "country": request.cf.country,
        }
        // (@ts-ignore here because the types package doesn't include the business plan-only geoip information)
        // @ts-ignore
        if (request.cf.latitude) {
            // NOTE: since KV costs a fair amount for storage, these keys need to be fairly short.
            // @ts-ignore
            userinfo["lat"] = request.cf.latitude;
            // @ts-ignore
            userinfo["lng"] = request.cf.longitude;
            // @ts-ignore
            userinfo["asn"] = request.cf.asn;
            // @ts-ignore
            userinfo["prov"] = request.cf.region;
            // @ts-ignore
            userinfo["provcode"] = request.cf.regionCode;
            // @ts-ignore
            userinfo["code"] = request.cf.postalCode;
            // @ts-ignore
            userinfo["city"] = request.cf.city;
            // @ts-ignore
            userinfo["tz"] = request.cf.tz;
        }

        // TODO: referrer analytics
        // probably should split this into its own key due to the bloat from many different referrers
        // and even then, might need to handle multiple keys if enough different referrers call a link and the value is >2mb

        // TODO: storing analytics
        // potential issues:
        // more than 1 analytics log per second, causing an issue with the 1 write/second limitation
    }

    public async new_link(event: FetchEvent) {
        let json = await event.request.json();
        let path = json["path"];
        let target = json["target"];
        await LINKS_KV.put(`/${path}`, target);
    }

    public async handle(event: FetchEvent) {
        let request = event.request;
        let _cached = await cache.match(request);
        if (_cached) {
            event.waitUntil(this.handle_analytics(request));
            return _cached;
        }

        // makeshift router for handling NEW links
        let url = new URL(request.url);

        // Plans are to recommend protecting /admin with Cloudflare Access, but basic auth could be added in the future
        if (url.pathname.startsWith("/admin/create")) {
            switch (request.method) {
                case "OPTIONS":
                    return new Response(null, {
                        headers: {
                            "Access-Control-Allow-Origin": url.origin
                        }
                    });
                case "GET":
                    // TODO: basic UI for creating
                    return new Response("501 not implemented", {status: 501});
                case "POST":
                    await this.new_link(event);
                    return new Response("Success");
                default:
                    break;

            }
        }

        let potentialRedirect = await LINKS_KV.get(url.pathname, "text");
        if (!potentialRedirect) {
            return new Response("404 not found", {
                status: 404
            });
        }
        let response = new Response(null, {
            headers: {
                "location": potentialRedirect,
            },
            status: 301
        });

        event.waitUntil(this.handle_analytics(request));
        event.waitUntil(cache.put(request, response.clone()));
        return response;
    }
}

self.addEventListener('fetch', (event: FetchEvent) => {
    const worker = new Worker();
    event.respondWith(worker.handle(event));
});
