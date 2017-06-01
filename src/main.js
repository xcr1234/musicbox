// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import resource from 'vue-resource';


//定义http接口的全局变量
global.appid = 39367;
global.sign = "c4528d67e59a46b5a201a9c74c8b7b05";


Vue.config.productionTip = false

Vue.use(resource);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
