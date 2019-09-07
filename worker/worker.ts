import CloudflareWorkerGlobalScope, { CloudflareDefaultCacheStorage, CloudflareWorkerKV } from 'types-cloudflare-worker';

import CF_FILES from 'cloudflare-file-hosting';

declare let self: CloudflareWorkerGlobalScope;
const cache: CloudflareDefaultCacheStorage = caches.default;

// KV declarations
// injected by Cloudflare at runtime
declare let LINKS_KV: CloudflareWorkerKV;
declare let ANALYTICS_KV: CloudflareWorkerKV;
declare let FILES_KV: CloudflareWorkerKV;

export class Worker {
    analytics = false

    frontend = false

    url: URL

    constructor(request: Request) {
      // hack to detect whether or not to enable analytics based on if the analytics KV namespace is defined
      if (typeof (ANALYTICS_KV) !== 'undefined') {
        this.analytics = true;
      }
      if (typeof (FILES_KV) !== 'undefined') {
        this.frontend = true;
      }
      this.url = new URL(request.url);
    }

    public async handle_analytics(request: Request) {
      if (!this.analytics) {
        return;
      }

      // future use for when storing analytics is implemented
      const path = this.url.pathname.substr(1);

      const userinfo = {
        ip: request.headers.get('cf-connecting-ip'),
        colo: request.cf.colo,
        country: request.cf.country,
      };
      // (@ts-ignore here because the types package doesn't include the business plan-only geoip information)
      // @ts-ignore
      if (request.cf.latitude) {
        // NOTE: since KV costs a fair amount for storage, these keys need to be fairly short.
        // @ts-ignore
        userinfo.lat = request.cf.latitude;
        // @ts-ignore
        userinfo.lng = request.cf.longitude;
        // @ts-ignore
        userinfo.asn = request.cf.asn;
        // @ts-ignore
        userinfo.prov = request.cf.region;
        // @ts-ignore
        userinfo.provcode = request.cf.regionCode;
        // @ts-ignore
        userinfo.code = request.cf.postalCode;
        // @ts-ignore
        userinfo.city = request.cf.city;
        // @ts-ignore
        userinfo.tz = request.cf.tz;
      }

      // TODO: referrer analytics
      // probably should split this into its own key due to the bloat from many different referrers
      // and even then, might need to handle multiple keys if enough different referrers call a link and the value is >2mb

      // TODO: storing analytics
      // potential issues:
      // more than 1 analytics log per second, causing an issue with the 1 write/second limitation
    }

    public async new_link(request: Request) {
      const json = await request.json();
      const { path } = json;
      const { target } = json;
      await LINKS_KV.put(`/${path}`, target);
    }

    public async delete_key(request: Request) {
      const json = await request.json();
      const { path } = json;
      await LINKS_KV.delete(path);
    }

    public async get_links() {
      // @ts-ignore
      const links = await LINKS_KV.list();
      return new Response(JSON.stringify(links.keys));
    }

    public async router(request: Request) {
      // disable CORS for admin:
      if (this.url.pathname.startsWith('/admin') && request.method === 'OPTIONS') {
        return new Response(null, { headers: { 'Access-Control-Allow-Origin': this.url.origin } });
      }

      // Plans are to recommend protecting /admin with Cloudflare Access, but basic auth could be added in the future
      switch (this.url.pathname) {
        case '/index.html':
          // limit index.html to the admin UI.
          return new Response(null, { status: 302, headers: { location: '/admin' } });
        case '/admin':
          const _filesResponse = await CF_FILES.getFile('/index.html', FILES_KV, true, request);
          if (_filesResponse) {
            return _filesResponse;
          }
          return new Response('404', { status: 404 });
        case '/admin/create':
          switch (request.method) {
            case 'POST':
              await this.new_link(request);
              return new Response('Success');
            default:
              return new Response('501', { status: 501 });
          }
        case '/admin/list':
          return await this.get_links();
        case '/admin/delete':
          switch (request.method) {
            case 'POST':
              await this.delete_key(request);
              return new Response('Success');
            default:
              return new Response('501', { status: 501 });
          }
      }
    }

    public async handle(event: FetchEvent) {
      const { request } = event;

      // handle API routes first
      const _routerResponse = await this.router(request);
      if (_routerResponse) {
        return _routerResponse;
      }

      // handle service static files (via cloudflare-file-hosting) if the frontend KV is set up
      if (this.frontend) {
        const _filesResponse = await CF_FILES.getFile(this.url.pathname, FILES_KV, true, event.request);
        if (_filesResponse) {
          return _filesResponse;
        }
      }

      // Serve cached redirects if possible
      const _cached = await cache.match(request);
      if (_cached) {
        event.waitUntil(this.handle_analytics(request));
        return _cached;
      }

      // main URL redirection logic
      // TODO: potential future options
      // would need to turn the KV response object
      // into a JSON object including properties like
      // statusCode (301 or 302), (possibly) selective analytics, etc.
      const potentialRedirect = await LINKS_KV.get(new URL(request.url).pathname, 'text');
      if (!potentialRedirect) {
        return new Response('404 not found', {
          status: 404,
        });
      }
      const response = new Response(null, {
        headers: {
          location: potentialRedirect,
        },
        status: 301,
      });

      event.waitUntil(this.handle_analytics(request));
      event.waitUntil(cache.put(request, response.clone()));
      return response;
    }
}

self.addEventListener('fetch', (event: FetchEvent) => {
  const worker = new Worker(event.request);
  event.respondWith(worker.handle(event));
});
