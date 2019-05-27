<template>
	<div class="mine set">
		 <div class="longLines">
			<ul class="line2 mt-line">
				<li>
					<input type="text" :value="userInfo.phoneNo|phoneNoDesensitization"  disabled="disabled"/>
				</li>
				 <li v-for="item in form" >
					<input type="text" :placeholder="item.value"  v-model.trim="item.param"/>
					<button v-if="item.option=='短信验证码'" class="captcha" :class="verifiybtn?'cap2':'cap1'" @click="sendCode(userInfo)" :disabled="verifiybtn">{{verifiytext}}</button>
				</li>
				
				<li v-if="captcha>5">
					<input type="text" placeholder="请输入图片验证" v-model.trim="picnum"/>
					<img :src="captchaPic" class="captcha" @click="getCaptcha"/>
				</li>
			</ul>
		</div>
		<div class="btn-div">
			<button class="submit2" @click="cardnext(userInfo,form)">下一步</button>
		</div>
	</div>
 
</template>

<script>
	import { mapState } from 'vuex'
	import { post, get } from '@/server/index.js'
	import { fileStream } from '@/server/file-stream'
	import { Toast } from 'mint-ui'
	import { guid } from '@/utils/utils.js'
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
				captcha: "", //显示的变量
				captchaPic: "",
				allAppCode: "",
				verifiybtn: false,
				verifiytext: "发送验证码" //发送短信验证码按钮
				
				
   			}
		},
		mounted() {
			this.form =[
				{option:'短信验证码',type:'input',value:'请输入短信验证码',param: ""},
				{option:'证件号后6位',type:'input',value:'请输入证件号后6位',param:"" },
			]
			this.captchaNum()
		},
		methods:{
			//判断缓存请求次数
			captchaNum(){
				if(this.captcha>5){
					this.getCaptcha();
				}
			},
			//图片验证
			getCaptcha() {
				let _this = this;
				fileStream({url:'/app/api/v1/captcha-image', data: { appCode: guid() }}).then(data => {
					_this.captchaPic = data;
					_this.allAppCode = items.appCode;
				}).catch(function (error) {
					console.log(error);
			  	});
			},
			//发送验证码 
			sendCode(user) {
				let _this = this;
				let data = {
					mobile: user.phoneNo
				}
				get({url: '/app/api/v1/user/mobile/sendCode', data: data}).then(data => {
					if (data.code === "000000") {
						
						Toast("验证码已发送");
						_this.countDown(_this);
						_this.captchaNum();

					} else {
						Toast(data.desc);
					}
				}).catch(function (error) {
					console.log(error);
			  	});
			},
			//倒计时
			countDown ( _this ) {
				var time = 60;
				_this.verifiybtn = true;
				let timer = setInterval(()=>{
					time--;
					_this.verifiytext = time + "秒后可重新获取";
					if(time == 0){
						_this.verifiytext = "发送验证码";
						_this.verifiybtn = false;
						clearInterval(timer);
					}
				},1000)
			},
			//忘记交易密码前置校验
			cardnext(user,params){
				let _this = this;
				let data = {
					mobile: user.phoneNo,
					smsCode: params[0].param, 
					idCardSuffix: params[1].param, 
					appCode: _this.allAppCode,
					captcha: _this.picnum, // 图片验证码
					operatorId: user.operatorId,
				}
				if (validation.ifNum(data.smsCode, "短信验证码", 6)!=true) {
					
					Toast(validation.ifNum(data.smsCode, "短信验证码", 6));
					
				} else if(data.idCardSuffix.length!=6){
					
					Toast("请输入证件号后6位")
					
				} else {
					post({url: '/app/api/v1/users/tradePwdForget/check', data: data}).then(data => {
						if (data.code === "000000") {
							Toast(data.desc);
							 _this.$router.push({ name:"设置新密码", params:{ pcode:data.data}})
						} else {
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