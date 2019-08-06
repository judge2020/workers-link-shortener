<template>
    <div class="about">
        <hero-header pagename="All Links"/>
        <br>
        <div class="container">
            <div class="panel columns">
                <div class="column is-one-fifth"/>
                <div class="column is-three-fifths">
                    <div class="panel">
                        <p class="panel-heading">
                            See and manage existing links.
                            <br>
                            <small>Note: This will show a maximum of 1000 links.</small>
                        </p>
                        <a class="panel-block" v-for="link in links">
                            <span class="panel-icon">
                                <i aria-hidden="true" class="fas fa-times-circle hoverRed" @click="doDelete(link.name)"></i>
                            </span>
                            {{link.name.substr(1)}}
                        </a>
                    </div>
                </div>
                <div class="column is-one-fifth"/>
            </div>
        </div>

    </div>
</template>
<script lang="ts">
    import HeroHeader from '@/components/HeroHeader.vue'
    import Axios from '@/axios'

    export default {
        name: 'ListLinks',
        components: { HeroHeader },
        data() {
            return {
                links: [],
            }
        },
        mounted() {
            // @ts-ignore
            this.init()
        },
        methods: {
            doDelete(name: string) {
                if (confirm(`Delete shortlink ${name.substr(1)}?`)) {
                    Axios.post('delete', {'path': name}).then(res => {
                        alert(res.data);
                    })
                }
            },
            init() {
                Axios.get('list').then(res => {
                    if (res.status === 200) {
                        // @ts-ignore
                        this.links = res.data
                    }
                })
            },
        },
    }

</script>

<style lang="scss" scoped>
    .hoverRed:hover {
        transition: 0.3s;
        color: red;
    }
</style>
