<template>
	<div class="personcard bg_white">
		<div class="bankcard">
		 	<ul class="card">
		 		<li>
		 			<img :src="pic1" class="pic_bg"/>
		 			<div class="card">
		 				<img :src="pic_1" class="pic_logo"/>
		 				<div class="inner">
		 					<button></button>
							<div>{{this.$route.params.name}}</div>
							<div> {{bankCardTypeDic[this.$route.params.type]}} </div>
	 					 	<div>{{this.$route.params.no|bankNoDesensitization}}</div>
		 				</div>
		 			</div>
		 		</li>
		 	</ul>
		 	<div class="aform" style="margin-top: 20px;">
				<input type="password" placeholder="请输入交易密码"  v-model.trim="password"/>
				<button type="primary" @click="cardnext(userInfo,password)">解除绑定</button>
			</div>	
		</div>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import { guid } from '@/utils/utils.js'
	import { post } from '@/server/index.js'
	import pic1 from '@/assets/images/cardbj2x.png'
	import pic_1 from '@/assets/images/cardlogo2x.png'
	import { Toast } from 'mint-ui'
	import validation from '@/utils/validation.js'
	
	export default {
 
		computed: {
			...mapState({
				userInfo: state => state.user.user.userInfo
			})
		},
		data() {
			return {
				password:"",
				pic1: pic1,
				pic_1: pic_1,
				bankCardTypeDic: {
					"X":"信用卡",
					"J":"借记卡"
				},
			}
		},
		methods:{
			cardnext(user, param){
				
				let _this = this;
				
				if (validation.ifNum(param, "交易密码", 6)!=true){
					
					Toast(validation.ifNum(param, "交易密码", 6));
					
				}else {

					let data = {
						bankCardId : _this.$route.params.id,
						tradePassword: _this.password,
						operatorId: user.operatorId,
						mobile: user.phoneNo
					}
	   
					post({url: '/app/api/v1/bankcard/unbind', data: data}).then(data => {
						if (data.code === "000000") {
							
							Toast("解除成功");
							_this.$router.push({path:"/bankCard"})
							
						}else {
							
							Toast("解除失败："+ data.desc);
							
						}
					}).catch(function (error) {
						console.log(error);
				  	});
				}
			}
		}
	}
</script>

<style>
</style>