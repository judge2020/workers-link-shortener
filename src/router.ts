import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import NewLink from './views/NewLink.vue';
import ListLinks from '@/views/ListLinks.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/list',
      name: 'list',
      component: ListLinks,
    },
    {
      path: '/create',
      name: 'new link',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: NewLink,
    },
  ],
});
