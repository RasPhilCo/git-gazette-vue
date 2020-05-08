import Vue from 'vue';
// import VueMaterial from 'vue-material';
import moment from 'moment';
import Vuetify from 'vuetify';


import App from './App.vue';
import router from './router';
import store from './store';
// import 'vue-material/dist/vue-material.min.css';
// import 'vue-material/dist/theme/default.css';
import 'vuetify/dist/vuetify.min.css';

// Vue.use(VueMaterial);
Vue.use(Vuetify);

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
  vuetify: new Vuetify(),
  render: (h) => h(App),
}).$mount('#app');
