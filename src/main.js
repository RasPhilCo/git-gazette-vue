import Vue from 'vue';
import VueMaterial from 'vue-material';
import moment from 'moment';

import App from './App.vue';
import router from './router';
import store from './store';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

Vue.use(VueMaterial);

// eslint-disable-next-line consistent-return
Vue.filter('formatDate', (value) => {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY hh:mm');
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
