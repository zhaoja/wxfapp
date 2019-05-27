<template>
	<div class="mine set">
		<div class="longLines">
			<ul class="line2 mt-line">
				 <li v-for="item in form" >
				 	<input :type="item.type" :placeholder="item.value"  v-model.trim="item.param"  />
				</li>
				<li v-if="captcha>5">
					<input type="text" placeholder="请输入图片验证" v-model.trim="picnum"/>
					<img :src="captchaPic" class="captcha" @click="getCaptcha"/>
				</li>
			</ul>
		</div>
		<div class="note0">
			提示：必须是6位数字
		</div>
		<div class="btn-div">
			<button class="submit2" @click="cardnext(userInfo,form)">下一步</button>
		</div>
		<!--<calculation @confirmEvent="_confirmEvent"></calculation>-->
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import { guid } from '@/utils/utils.js'
	import {post } from '@/server/index.js'
	import { fileStream } from '@/server/file-stream'
	import validation from '@/utils/validation.js'
	import { Toast } from 'mint-ui';
	import calculation from '@/components/calculation'
	
	export default {
		components : {
			calculation
		},
		computed: {
			...mapState({
				userInfo: state => state.user.user.userInfo
			})
		},
		data() {
			return {
				picnum:"",
				form :[],
				captcha: "", 
				captchaPic: "",
				allAppCode: ""
			}
		},
		mounted() {
			this.form =[
				{option:'原密码',type:'password',value:'请输入原密码',param: "" },
				{option:'新密码',type:'password',value:'请输入新密码',param:  "" },
				{option:'确认新密码',type:'password',value:'请确认新密码',param: "" },
			];
			this.captchaNum()
		},
		methods:{
			_confirmEvent(res){
				console.log(res)
           },
			captchaNum(){
				if(this.captcha>5){
					this.getCaptcha();
				}
			},
			getCaptcha() {
				let _this = this;
				let items = {
					appCode: guid()
				}
				fileStream({url:'/app/api/v1/captcha-image', data: items}).then(data => {
					_this.captchaPic = data;
					_this.allAppCode = items.appCode;
					
				}).catch(function (error) {
					console.log(error);
			  	});
			},
			cardnext(user,params){
				let _this = this;
				let data = {
					tradePassword: params[0].param, 
					newTradePassword: params[1].param, 
					appCode: _this.allAppCode||guid(),
					captcha: _this.picnum,
					operatorId: user.operatorId,
					mobile: user.phoneNo
				};
		 
				if (validation.ifNum(data.tradePassword, "原密码", 6)!=true) {
					
					Toast(validation.ifNum(data.tradePassword, "原密码", 6));
					
				} else if(validation.ifNum(data.newTradePassword, "新密码", 6)!=true) {
					
					Toast(validation.ifNum(data.newTradePassword, "新密码", 6));
					
				} else if(params[2].param != params[1].param){
					
					Toast("确认新密码与新密码输入不一致")
					
				} else if(_this.captcha>5&&data.captcha.length!=4){
					
					Toast("图片验证请输入4为数字")
					
				} else {
					post({url: '/app/api/v1/users/tradePwd', data: data}).then(data => {
						if (data.code === "000000") {
							
							Toast(data.desc)
//							_this.captchaNum()
							_this.$router.push("/setpasswords")
							
						} else {
							Toast(data.desc)
							if(data.data==""){
								
							}else if(data.data<6){
								this.captcha =  data.data;
								
							}else{
								this.captcha =  data.data;
								_this.captchaNum()
							}
							
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
