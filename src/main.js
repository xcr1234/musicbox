// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import resource from 'vue-resource';


//定义http接口的全局变量
global.appid = 36320;
global.sign = "ab25b71f4a8a4aba8f58c68f3b50de9b";




Vue.config.productionTip = false

Vue.use(resource);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
