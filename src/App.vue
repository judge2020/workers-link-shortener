<template>
    <div id="app">
        <header>
            <nav class="navbar" role="navigation" aria-label="main navigation">
                <div class="navbar-brand">
                    <!-- TODO: navbar icon -->
                    <a role="button" class="navbar-burger burger" aria-label="menu"
                       data-target="navbar">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>
                <div id="navbarBasicExample" class="navbar-menu">
                    <div class="navbar-start">
                        <router-link class="navbar-item" to="/">Home</router-link>
                        <router-link class="navbar-item" to="/create">New Link</router-link>
                    </div>
                </div>
            </nav>
        </header>
        <router-view/>
    </div>
</template>


<style lang="scss">
    @import "~bulma/css/bulma.css";

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
</style>
