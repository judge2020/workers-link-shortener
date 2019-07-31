import Axios from 'axios';

import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

// @ts-ignore
window.axios = Axios.create({
    baseURL: '/admin/',
    timeout: 1500,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    }
})


new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
