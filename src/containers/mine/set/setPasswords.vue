<template>
	<div class="mine set">
		<div class="longLines">
			<ul class="line0">
				<li> 	
					<router-link to="setPasswordsLogin">
						<label>登录密码</label>
						<i class="icon icon-right"></i>
					</router-link>
				</li>
				<li> 	
					<router-link to="setPasswordsTransaction" v-if="userInfo.ifrealname=='已实名'">
						<label>交易密码</label>
						<i class="icon icon-right"></i>
					</router-link>
					<router-link to="relationBankCard" v-if="userInfo.ifrealname!='已实名'">
						<label>交易密码</label>
						<i class="icon icon-right"></i>
					</router-link>
				</li>
				<li> 	
					<router-link to="setRelatedAgreements">
						<label>相关协议</label>
						<i class="icon icon-right"></i>
					</router-link>
				</li>
				<li>
					<label>当前版本</label>
					<i class="num">V1.0.0</i>
				</li>
			</ul>
			<div class="btn-div"><button class="submit2" @click="logout()">退出登录</button></div>
		</div>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { get } from '@/server/index.js';
	import { Toast } from 'mint-ui';
	import dsBridge from "dsbridge"
	import { isMobile } from "@/utils/browser";

	export default {
		computed: {
			...mapState({
				userInfo: state => state.user.user.userInfo,
			}),
		},
		created(){
			this.$store.dispatch('getUser');
		},
		data() {
			return {
			 
			}
		},
		mounted() {
		},
		methods:{
			 logout() {
			 	get({url: '/app/api/v1/logout'}).then(data => {
					if (data.code === "000000") {
						localStorage.setItem("operatorId", null)
						if (isMobile) {
							dsBridge.call("logOut", function(res) {
								//成功
//								if (res.code == "-1") {
//									Toast("退出系统111");
//								} else {
//									alert(res.message)
//								}
							});
						}
						Toast("退出系统");
						this.$router.push({
							path: '/login'
						})
						 window.location.reload()
					}else{
							Toast(data.desc)
						}
				}).catch(function (error) {
					console.log(error);
			  	});
			  	
			 	
			 	
				
			},
		}
	}
</script>

<style lang="scss">

</style>