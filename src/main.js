import Vue from 'vue';
import moment from 'moment';
import Vuetify from 'vuetify';


import App from './App.vue';
import router from './router';
import store from './store';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

Vue.filter('formatDate', (value) => {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY hh:mm');
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify: new Vuetify(),
  render: (h) => h(App),
}).$mount('#app');
