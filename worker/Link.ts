// Link.ts
// only for analytics for now

export class Link {
    state: DurableObjectState;
    env: Env;

    hits = 0;
    countries: any;
    datetimes: any;
    //target: string = '';

    initializePromise: Promise<void> | undefined


    constructor(state: DurableObjectState, env: Env) {
        this.state = state;
        this.env = env;
    }

    async initialize() {
        let _hits = await this.state.storage.get<number>("hits");
        this.hits = _hits || 0;
        let _countries = await this.state.storage.get<any>("countries");
        this.countries = _countries || {};
        let _datetimes = await this.state.storage.get<any>("datetimes");
        this.datetimes = _datetimes || [];
    }

    async fetch(request: Request) {
        if (!this.initializePromise) {
            this.initializePromise = this.initialize().catch((err) => {
                this.initializePromise = undefined;
                throw err
            });
        }
        await this.initializePromise;

        let url = new URL(request.url);

        if (url.pathname == '/increment') {
            this.hits += 1;
            await this.state.storage.put("hits", this.hits);

            //country tracking increment logic
            let country = url.searchParams.get('country')!;

            // eslint-disable-next-line no-prototype-builtins
            if (this.countries.hasOwnProperty(country)) {
                this.countries[country] += 1;
            }
            else {
                this.countries[country] = 1;
            }
            await this.state.storage.put("countries", this.countries);

            //date time tracking logic
            // list of ISO date elements won't use much data - you'd need hundreds of millions of hits to get to 10gb
            let datetime = (new Date).toISOString().split('.')[0]+"Z"

            this.datetimes.push(datetime);
            await this.state.storage.put("datetimes", this.datetimes);

            return new Response(`Shortcode now has ${this.countries["US"]} US hits and ${this.hits} in total with hits at ${JSON.stringify(this.datetimes)}.`)
        }

        return new Response(JSON.stringify(request));
    }
}

