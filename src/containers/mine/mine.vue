<template>
	<div class="mine" style="padding-top: 0px">
		<div class="top">
			<button>
				<router-link to="setpasswords">
					<img src="../../assets/images/set.png"/>
				</router-link>
			</button>
			<div class="topSelf">
				<router-link to="">
					<router-link to="setuser" style="margin-right: 0px;">
						<img :src="userInfo.headUrl" alt="" />
					</router-link>
					<span style="padding-top: 15px;" v-if="!userInfo.operatorId"><span>登录</span></span>
					
					<span v-if="userInfo.ifrealname=='已实名'"  style="margin-top: 3px;">
						{{userInfo.username|nameDesensitization}} <br />
						<span>{{userInfo.userTypeName}}</span>
					</span>
					
					<span v-if="userInfo.ifrealname=='未实名'"  style="margin-top: 3px;">
						{{userInfo.phoneNo|phoneNoDesensitization}} <br />
						<router-link to="relationBankCard">
							<label><span style="padding:1px 10px;">未实名</span></label>
						</router-link>
					</span>
				</router-link>
			</div> 
		</div>
		
		<router-link to="score" v-if="userInfo.userTypeName == '养老用户'">
			<div class="code">
				<img :src="img_code"/>
				<label>可用积分</label>
				<span>10000</span>
				<i class="icon icon-right"></i>
			</div>
		</router-link>

		<div class="longLines">
			<ul class="line1">
				<li  v-if="userInfo.ifrealname=='已实名'"> 	
					<router-link to="pensionCard">
						<img src="../../assets/images/min/p1.png" class="left"/>
						<label>关联养老助残卡</label>
						<i class="icon icon-right"></i>
					</router-link>
				</li>
				<li v-if="userInfo.ifrealname=='未实名'"> 	
					<router-link to="relationBankCard">
						<img src="../../assets/images/min/p1.png" class="left"/>
						<label>关联养老助残卡</label>
						<i class="icon icon-right"></i>
					</router-link>
				</li>
				<li> 	
					<router-link to="bankCard">
						<img src="../../assets/images/min/p2.png" class="left"/>
						<label>银行卡</label>
						<i class="icon icon-right"></i>
					</router-link>           
				</li>
				<li> 	
					<router-link to="setorderMes">
						<img src="../../assets/images/min/p3.png" class="left"/>
						<label>消费记录</label>
						<i class="icon icon-right"></i>
					</router-link>
				</li>
				<li v-if="userInfo.ifrealname=='已实名'&& userInfo.usertype=='PENSION_CARD'" > 	
					<router-link to="setorderMes">
						<img src="../../assets/images/min/p4.png" class="left"/>
						<label>积分兑换记录</label>
						<i class="icon icon-right"></i>
					</router-link>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { Http } from '@/server/index.js'
	import pic from '@/assets/images/person.png'
	import img_code from '@/assets/images/code.png'

	export default {
		computed: {
			...mapState({
				userInfo: state => state.user.user.userInfo
			}),
		},
		data() {
			return {
				usertypeDic : {
					"COMMON":"普通用户",
					"PENSION_CARD":"养老助残卡用户"
				},
				img_code,
			}
		},
		created(){
			 this.mine();
		},
		mounted(){
			console.log("this.$route获取的路由:"+this.$route)
		},
		//路由组件内的守卫
		//进入路由前
		beforeRouteEnter(to, from, next){
			console.log("beforeRouterEnter:"+to+ ","+from)
			next()
		},
		//路由复用同一个组件时
		beforeRouteUpdate(to, from, next){
			console.log("beforRouterUpdate")
			next()
		},
		//进入路由后
		beforeRouteLeave(to, from, next){
			console.log("beforeRouterLeave")
			next()
		},
		
		methods: {
			mine(){
				this.$store.dispatch('getUser',0);
			}, 
		}
	}
</script>

<style lang="scss">
	.num {
		color: #999999;
		float: right;
		right: 20px;
	}
</style>