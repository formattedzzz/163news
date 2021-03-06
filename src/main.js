// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import  { ToastPlugin } from 'vux';
import './assets/css/font-awesome.css';
import VueJsonp from 'vue-jsonp';
import VueScroller from 'vue-scroller'
import { Toast } from 'vux';

Vue.use(VueJsonp);
Vue.use(Toast);
Vue.use(ToastPlugin);
Vue.use(VueScroller);
// Vue.use(VueScroller);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
