<template>
    <div class="hero is-primary">
        <div class="hero-body">
            <div class="container">
                <h1 class="title" v-text="pagename"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    export default {
        name: 'HeroHeader',
        props: {
            pagename: String,
        },
    }
</script>
