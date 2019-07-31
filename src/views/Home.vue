<template>
    <div class="home">
        <hero-header pagename="Workers Link Shortener"/>
        <br>
        <p>
            More stuff will be here in the future.
        </p>
        <p>Remember that there is no authentication for the admin page by default. It is recommended to set up CF
            access.</p>
    </div>
</template>

<script>
    // @ is an alias to /src
    import HeroHeader from '@/components/HeroHeader'

    export default {
        name: 'home',
        components: {
            HeroHeader,
        },
    }
</script>
