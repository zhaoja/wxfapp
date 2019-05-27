// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'

import App from './App'
import router from './router'
import axios from 'axios'
Vue.prototype.$http = axios
 
import 'lib-flexible'

import user from './models/user'
import merchant from './models/merchant'

import "@/assets/scss/image.scss";
import "@/assets/scss/login.scss";
import "@/assets/scss/index.scss";
import "@/assets/scss/business.scss";
import "@/assets/scss/mine.scss";
import "@/assets/scss/merchant.scss";
import "@/assets/scss/mall.scss";
/*  eslint-disable no-new */
Vue.use(Vuex)

//mint-ui 地址：http://mint-ui.github.io/docs/#/zh-cn2
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)

//处理手机返回键
import Mui from 'vue-awesome-mui';
Vue.use(Mui);
//import 'swiper/dist/css/swiper.css'

//加密
import JSEncrypt from 'jsencrypt';

//过滤器
import * as filters from '@/utils/filters'

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})


//pdf
import pdf from '@/components/pdf/index'
Vue.use(pdf)


Vue.config.productionTip = false

const store = new Vuex.Store({
	modules: {
		user: user,
		merchant: merchant,
	}	 
})
export default { store }

//路由跳转后保持在最顶部
//router.beforeEach((to, from, next) => {
//	// chrome
//	document.body.scrollTop = 0
//	// firefox
//	document.documentElement.scrollTop = 0
//	// safari
//	window.pageYOffset = 0
//	next()
//})

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>',
	store
})

store.dispatch('getUser',0);//获取userID 用户信息

//全局路由守卫
//1.beforeEach() 进去以前
router.beforeEach((to, from, next) => {
	console.log("beforeEach")
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
		
		let permission = store.state.user.user.userInfo.operatorId;
			
        if (!permission) {  // 通过vuex state获取当前的token是否存在
			next({
                path: '/login',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
        else {
          next();
        }
    }
    else {
        next();
    }
});
//2.beforeResolve() 全局解析守卫(2.5.0+) 在beforeRouteEnter调用之后调用
router.beforeResolve((to, from, next)=>{
	console.log("beforeResolve")
	next()
})
//3.afterEach() 出来了
router.afterEach((to, from, next) => {
	console.log('afterEach')
})

