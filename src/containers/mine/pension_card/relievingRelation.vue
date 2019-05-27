<template>
	<div class="personcard bg_white">
		<div class="text_list"> 
			<div><label>亲情账号：  	</label> {{this.$route.params.userName|nameDesensitization}}       </div> 
			<div><label>证件号码：	</label> {{this.$route.params.pensionIdCardNo|IdNoDesensitization}}      </div> 
			<div><label>养老助残卡号：</label> {{this.$route.params.pensionCardNo|pensionNoDesensitization}}  </div> 
		</div>
		<div class="aform">
			<input type="password" placeholder="请输入交易密码"  v-model.trim="password"/>
			<button type="primary" @click="cardnext(userInfo,password)">确认</button>
		</div>	
		
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import { guid } from '@/utils/utils.js'
	import { post } from '@/server/index.js'
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
			}
		},
		mounted() {
			 
		},
		methods:{
			cardnext(user, param){
				
				let _this = this;
				
				if (validation.ifNum(param, "交易密码", 6)!=true){
					
					Toast(validation.ifNum(param, "交易密码", 6));
					
				}else {
					
					let data = {
						pensionCardNo: _this.$route.params.pensionCardNo,
						tradePassword: param,
						operatorId: user.operatorId,
						mobile: user.phoneNo
					};
					post({url: '/app/api/v1/pension/cards/unbind', data: data}).then(data => {
						if (data.code === "000000") {
							Toast("解除关联成功");  
							_this.$router.push({path:"/pensionCard"})
						}else {
							Toast(data.desc)
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