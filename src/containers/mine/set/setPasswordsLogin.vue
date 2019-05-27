<template>
	<div class="mine set">
		 <div class="longLines">
			<ul class="line2 mt-line">
				 <li v-for="item in form" >
					<input :type="item.type" :placeholder="item.value" v-model.trim="item.param"/>
				</li>
				<li v-if="captcha>5">
					<input type="text" placeholder="请输入图片验证" v-model.trim="picnum"/>
					<img :src="captchaPic" class="captcha" @click="getCaptcha"/>
				</li>
			</ul>
		</div>
		<div class="note0">
			提示：必须是6-20位英文字母、数字或符号(空格除外)，且字母、数字和符号至少包含两种
		</div>
		<div class="btn-div">
			<button class="submit2" @click="cardnext(userInfo,form)">确认修改</button>
		</div>
	</div>
  
</template>

<script>
	import { mapState } from 'vuex'
	import { guid } from '@/utils/utils.js'
	import { post } from '@/server/index.js'
	import { fileStream } from '@/server/file-stream'
	import { Toast } from 'mint-ui';
	import validation from '@/utils/validation.js'
	
	export default {
 
		computed: {
			...mapState({
				userInfo: state => state.user.user.userInfo
			})
		},
		data() {
			return {
				picnum:"",
				form: [],
				captcha: "", 
				captchaPic: "",
				allAppCode: ""
			}
		},
		mounted() {
			this.form =[
				{option:'原密码',type:'password',value:'请输入原密码',param: "" },
				{option:'新密码',type:'password',value:'请输入新密码',param: "" },
				{option:'确认新密码',type:'password',value:'请确认新密码',param: "" }, 
			];
			this.captchaNum()
		},
		
		methods:{
			//请求错误超过5次加上验证码
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
					loginPassword: params[0].param, 
					newLoginPassword: params[1].param, 
					appCode: _this.allAppCode||guid(),
					captcha: _this.picnum,
					operatorId: user.operatorId,
					mobile: user.phoneNo
				}
				
				if (validation.ifPassword(data.loginPassword, "中")!=true) {
					
					Toast(validation.ifPassword(data.loginPassword, "中"));
					
				} else if (validation.ifPassword(data.newLoginPassword, "中")!=true){
				 
					Toast(validation.ifPassword(data.newLoginPassword, "中"));
					
				} else if(params[2].param!=params[1].param){
					Toast("确认新密码错误")
				} else if(_this.captcha>5&&data.captcha.length!=4){
					
					Toast("图片验证请输入4为数字")
					
				} else {
					
					post({url: '/app/api/v1/users/loginPwd', data: data}).then(data => {
						if (data.code === "000000") {
							Toast(data.desc);
							_this.captchaNum()
							_this.$router.push("/setpasswords")
						} else{
							Toast(data.desc);
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
 