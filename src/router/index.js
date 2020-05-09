import Vue from 'vue';
import VueRouter from 'vue-router';
import OauthCallback from '../views/OauthCallback.vue';
import Frontpage from '../views/Frontpage.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/install',
    component: OauthCallback,
  },
  {
    path: '/',
    name: 'Frontpage',
    component: Frontpage,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
