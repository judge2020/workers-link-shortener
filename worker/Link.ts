export class Link {
    state: DurableObjectState;
    env: Env;

    hits = 0;
    //target: string = '';

    initializePromise: Promise<void> | undefined


    constructor(state: DurableObjectState, env: Env) {
        this.state = state;
        this.env = env;
    }
    async initialize() {
        let _hits = await this.state.storage.get<number>("hits");
        this.hits = _hits || 0;
        //let _target = await this.state.storage.get("target");
        //this.target = _target;
    }

    async fetch(request: Request) {
        if (!this.initializePromise) {
            this.initializePromise = this.initialize().catch((err) => {
                // If anything throws during initialization then we need to be
                // sure that a future request will retry initialize().
                // Note that the concurrency involved in resetting this shared
                // promise on an error can be tricky to get right -- we don't
                // recommend customizing it.
                this.initializePromise = undefined;
                throw err
            });
        }
        await this.initializePromise;
        //let newHits = this.hits + 1;
        //this.hits = newHits;
        //await this.state.storage.put("hits", newHits);

        return new Response(JSON.stringify(request));

    }
}

