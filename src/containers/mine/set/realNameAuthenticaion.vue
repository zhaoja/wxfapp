<template>
 	<div class="mine set">
		 <div class="longLines">
			<ul class="line2 mt-line">
				 <li v-for="item in form" >
				 	<label>{{item.option}}</label><input type="text" :placeholder="item.value"  v-model.trim="item.param"  />
				</li>
			</ul>
		</div>
		<div class="note0">
			提示：第一次绑定银行卡同时进行实名认证，实名认证通过后不可以修改实名信息，请确认是本人操作
		</div>
		<div class="btn-div">
			<button class="submit2" @click="setRealName(userInfo,form)">下一步</button>
		</div>
	</div>
 
 </template>

<script>
	import { mapState } from 'vuex'
	import {post, get} from '@/server/index.js'
  import { Toast } from 'mint-ui'
  
	export default { 
		computed: {
			...mapState({
				userInfo: state => state.user.user.userInfo
			}),
		},
		data() {
			return {
			 
				form :[
					{option:'姓名',type:'input',value:'请输入姓名',param:""},
					{option:'证件号码',type:'input',value:'请输入证件号码',param: "" },
					{option:'交易密码',type:'input',value:'请输入交易密码',param: "" },
				]
			}
		},

		methods:{
//			
			setRealName(user,params){
				console.log(user, params,8998)
				let _this = this;
				let data = {
					userName: params[0].param, 
					idCard: params[1].param,
					tradePassword: params[2].param,
					operatorId: user.operatorId,
					mobile: user.phoneNo
				}
				
				post({url: '/app/api/v1/users/approve', data: data}).then(data => {
					if (data.code === "000000") {
						alert("认证成功");
						_this.$router.push("/realnameInfo")
					}else{
							Toast(data.desc)
						}
				}).catch(function (error) {
					console.log(error);
			  	});
			}
		},
		
		mounted() {
//			this.form =[
//				
//				 
//			]
		}
	}
</script>

<style>

</style>
