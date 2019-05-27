import Vue from 'vue'
import Router from 'vue-router'

/*
 * made by 赵佳
 */

// 项目组件
import Layout from '@/containers/Layout'
import Page404 from '@/components/Status404'
//import Page404 from '@/components/Page404'

//我的
import Mine from '@/containers/mine/mine'
import setWhiteHead from '@/containers/mine/setWhiteHead'

//我的-个人信息
import SetUser from '@/containers/mine/set/setUser' 
import SetUserHead from '@/containers/mine/setUserHead' 
import RealNameInfo from '@/containers/mine/set/realNameInfo'
import RealNameAuthenticaion from '@/containers/mine/set/realNameAuthenticaion' 

//我的-设置
import SetPasswords from '@/containers/mine/set/setPasswords' 
import SetPasswordsLogin from '@/containers/mine/set/setPasswordsLogin' 
import SetPasswordsTransaction from '@/containers/mine/set/setPasswordsTransaction' 

import SetPasswordsTransactionUpdate from '@/containers/mine/set/setPasswordsTransactionUpdate' 
import SetPasswordsTransactionForget from '@/containers/mine/set/setPasswordsTransactionForget' 
import SetPasswordsTransactionForgetUpdate from '@/containers/mine/set/setPasswordsTransactionForgetUpdate'

//我的-养老助残卡
import PensionCard from '@/containers/mine/pension_card/pensionCard' 
import RelationPensionCard from '@/containers/mine/pension_card/relationPensionCard' 
import RelationResult from '@/containers/mine/pension_card/relationResult' 
import RelievingRelation from '@/containers/mine/pension_card/relievingRelation' 

//我的-银行卡
import BankCard from '@/containers/mine/bank_card/bankCard' 
import RelationBankCard from '@/containers/mine/bank_card/relationBankCard' 
import RelationResultBankCard from '@/containers/mine/bank_card/relationResult' 
import RelievingRelationBankCard from '@/containers/mine/bank_card/relievingRelation' 

//我的-积分（养老用户）
import Score from '@/containers/mine/score/score' //银行卡-关联养银行卡

//我的-相关协议（暂无）
//import SetRelatedAgreements from '@/containers/mine/set/setRelatedAgreements' //相关协议

////////////////////////////////////////////////by zhaojia////////////////////////////////////////////////////////////

/*
 *  made by 张茂梅
 */

//用户登录
import Login from '@/containers/login/login' 
import Register from '@/containers/login/registor' 
import Forgetpwd from '@/containers/login/forgetpwd' 
import SetNewPwd from '@/containers/login/setNewPwd' 

//首页
import Home from '@/containers/index/home' 
import Business from '@/containers/business/index' 
//import Location from '@/containers/index/location' //首页-商户位置
import Search from "@/containers/index/search" 
import LinkPage from "@/containers/business/linkPage"

//商城
import Mall from '@/containers/mall/index' 
import MallSearch from '@/containers/mall/search'
import ProductDetail from '@/containers/mall/productDetail' 

//订单
import ConfirmOrder from '@/containers/order/confirmOrder' 
import PayResult from '@/containers/order/payResult'
////////////////////////////////////////////////by zhangmaomei////////////////////////////////////////////////////////////

///////////////////////////////////////////////////by zhaojia////////////////////////////////////////////////////////////
//商户系统

import MerchantRegister from '@/containers/merchant/register' 
import MerchantPosition from '@/containers/merchant/position' 
import MerchantSuccess from '@/containers/merchant/success' 
import MerchantQuery from '@/containers/merchant/query' 
import MerchantQueryResult from '@/containers/merchant/queryResult' 
import MerchantQueryContract from '@/containers/merchant/contract' 

Vue.use(Router)

const router = new Router({
	mode: 'history',
	base: __dirname,
  	routes: [
		{ path:"*",name:"404",component:Page404 },
		{
			path: '/',
			component: Layout,
			children:[
				{path:"/",name:"首页",component:Home},//首页
				{path:"/index",name:"首页",component:Home},//首页
				{path:"/mall",name:"首页",component:Mall},//积分商城
				{
					path:"/mine",
					name:"我的",
					component:Mine,
					beforeEnter:(to, from, next)=> {
						console.log("beforeEnter路由里边")
						next()
					},
					meta: {requireAuth: true}
				}, //我的
			]
		},
//		{path:"/location",name:"商户位置",component:Location},
		{path:"/search",name:"搜索",component:Search},
		{path: "/business",name:"商户列表",component:Business},
		{path: '/login',name: '登录',component: Login},
		{path: '/registor',name: '注册',component: Register},
		{path: '/forgetpwd',name: '找回密码',component: Forgetpwd},
		{path: '/setnewpwd',name: '设置新登录密码',component: SetNewPwd},
		{path: '/linkpage',name:"地图导航",component: LinkPage},
		{path: "/mallsearch",name:"商城搜索",component:MallSearch},
		{path: "/profuctDetail",name:"商品详情",component:ProductDetail},
		{path: "/confirmOrder",name:"确认订单",component:ConfirmOrder},
		{path: "/payResult",name:"支付结果",component:PayResult},
		{
			path:"/",
			component: setWhiteHead,
			children:[
				//我的二级页面
				{path:"/setuser",name:"个人信息",component:SetUser, meta: {requireAuth: true}},
 				//{path:"/realnameAuthenticaion",name:"实名认证",component:RealNameAuthenticaion},//实名认证(待定)
				{path:"/setpasswords",name:"设置",component:SetPasswords, meta: {requireAuth: true}},
				{path:"/setPasswordsLogin",name:"修改登录密码",component:SetPasswordsLogin, meta: {requireAuth: true}},
				{path:"/setPasswordsTransaction",name:"交易密码",component:SetPasswordsTransaction, meta: {requireAuth: true}},
				{path:"/setPasswordsTransactionUpdate",name:"修改交易密码",component:SetPasswordsTransactionUpdate, meta: {requireAuth: true}},
				{path:"/setPasswordsTransactionForget",name:"找回交易密码",component:SetPasswordsTransactionForget, meta: {requireAuth: true}},
				{path:"/setPasswordsTransactionForgetUpdate",name:"设置新密码",component:SetPasswordsTransactionForgetUpdate, meta: {requireAuth: false}},
				//{path:"/setRelatedAgreements",name:"相关协议",component:SetRelatedAgreements}, //相关协议(待定)
				//关联养老助残卡
				{path:"/pensionCard",name:"关联养老助残卡",component:PensionCard, meta: {requireAuth: true}}, 
				{path:"/relationPensionCard",name:"添加养老助残卡",component:RelationPensionCard, meta: {requireAuth: true}}, 
				{path:"/relationResult",name:"关联结果",component:RelationResult, meta: {requireAuth: true}}, 
				{path:"/relievingRelation",name:"解除关联",component:RelievingRelation, meta: {requireAuth: true}}, 
				//我的银行卡
				{path:"/bankCard",name:"我的银行卡",component:BankCard, meta: {requireAuth: true}}, 
				{path:"/relationBankCard",name:"绑定银行卡",component:RelationBankCard, meta: {requireAuth: true}}, 
				{path:"/relationResultBankCard",name:"关联银行卡结果",component:RelationResultBankCard, meta: {requireAuth: true}}, 
				{path:"/relievingRelationBankCard",name:"解绑银行卡",component:RelievingRelationBankCard, meta: {requireAuth: true}}, 
				//积分
//				{path:"/score",name:"我的积分",component:Score, meta: {requireAuth: true}}, //解绑银行卡
			]
		}, 
		{path:"/realnameInfo",name:"实名信息",component:RealNameInfo, meta: {requireAuth: true}}, 
		{path:"/sethead",name:"修改头像",component:SetUserHead, meta: {requireAuth: true}},
		//商户系统
		{
			path:"/",
			component: setWhiteHead,
			children:[
				{path:"/merchantRegister",name:"商户信息",component:MerchantRegister},
				{path:"/merchantPosition",name:"商户位置",component:MerchantPosition},
				{path:"/merchantSuccess",name:"登记成功",component:MerchantSuccess},
				{path:"/merchantQuery",name:"审核进度查询",component:MerchantQuery},
				{path:"/merchantQueryResult",name:"审核进度",component:MerchantQueryResult},
				{path:"/merchantQueryContract",name:"合同下载",component:MerchantQueryContract},
			]
		}
	],
	 
	scrollBehavior (to, from, savedPosition) {
		return { x: 0, y: 0 }
	}
})

export default router;
 