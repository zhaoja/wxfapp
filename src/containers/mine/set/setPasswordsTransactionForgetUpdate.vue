<template>
	<div class="mine set">
		 <div class="longLines">
			<ul class="line2 mt-line">
				 <li v-for="item in form" >
					<input :type="item.type" :placeholder="item.value"  v-model.trim="item.param"/>
				</li>
			</ul>
		</div>
		<div class="btn-div">
			<button class="submit2" @click="cardnext(userInfo,form)">确认</button>
		</div>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import { post } from '@/server/index.js'
	import validation from '@/utils/validation.js'
	import { Toast } from 'mint-ui'
	
	export default {
		
		components:{
		
		},
		computed: {
			...mapState({
				userInfo: state => state.user.user.userInfo
			})
		},
		data() {
			return {
				form :[]
			}
		},
		mounted() {
			 
			this.form =[
				{option:'新密码',type:'password',value:'请输入新交易密码',param:"" },
				{option:'确认新密码',type:'password',value:'请确认新交易密码',param: "" },
			]
		},
		methods: {
			 
			cardnext(user,params){
				let _this = this;
				let data = {
					passCode: _this.$route.params.pcode, 
					tradePassword: params[0].param, 
					operatorId: user.operatorId,
					mobile: user.phoneNo
				}
		 	 	if (validation.ifNum(data.tradePassword, "新交易密码", 6)!=true) {
					
					Toast(validation.ifNum(data.tradePassword, "新交易密码", 6));
					
				} else if(params[1].param != params[0].param){
					
					Toast("确认新交易密码与交易密码不一致")
					
				} else {
					
					post({url: '/app/api/v1/users/tradePwdForget', data: data}).then(data => {
						if (data.code === "000000") {
							Toast("修改成功");
							_this.$router.push("/setpasswords")
						} else{
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
