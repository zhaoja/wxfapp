<template>
	<div class="forgetpwd bg-gray">
		<Header topName="找回密码"></Header>
		
		<form>
			<div class="form-item">
				<input type="number" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"  @keyup="keyupInput" placeholder="请输入手机号" :maxlength="11" v-model.trim="userInfo.phone">
			</div>
			<div class="form-item" v-if="isshowcaptcha">
				<div class="codeButton" @click="getCapture">
					<img :src="captchasrc" alt="" class="imgCode" v-if="captchasrc!=''">
				</div>
				<div>
					<input type="text" placeholder="请输入图形验证码" v-model.trim="userInfo.captcha" @keyup="keyupInput" >
				</div>
			</div>
			<div class="form-item">
				<i class="icon icon-smscode"></i>
				<div class="codeButton">
					<button type="button" :disabled="verifiybtn" @click="verifiyCode(userInfo.phone)">{{verifiytext}}</button>
				</div>
				<div>
					<input type="number" placeholder="请输入短信验证码" @keyup="keyupInput" v-model.trim="userInfo.verifiyCode" maxlength="6" :disabled='codeinput'>
				</div>
			</div>
		</form>
		<div class="lbtn-container">
			<div class="alert" v-if="message"> {{message}} </div>
			<button class="lbtn" :class="registerbtn?'longbtn1':'longbtn2'" :disabled='registerbtn' @click="login(userInfo)">下一步</button>
		</div>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import Header from "@/components/Header";
	import {post, get} from '@/server/index.js';
	import { fileStream } from '@/server/file-stream';
	import myutils,{guid} from '@/utils/utils.js';
	import { Toast } from 'mint-ui';
	export default {
		components:{
			Header
		},
		data() {
			return {
				userInfo:{
					phone:"",
					verifiyCode:"",
					captcha:""
				},
				codeinput:true,
				registerbtn:true,
				flolayer:false,
				flolayerR:false,
				message:"",
				verifiytext:"发送验证码",
				verifiybtn:true,
				active:"disban",
				inputtype:"0",
				isshowcaptcha:false,
				captchasrc:"",
				sendNum:0,
				appcode:"",
				timerCount:60
			}
		},
		created(){
			
		},
		methods: {
			getCapture(){
				let _this = this;
				_this.appcode = guid();
				let param = {
					appCode: _this.appcode
				}
				fileStream({url: '/app/api/v1/captcha-image', data: param}).then(data => {
					var url = data;
				
					_this.captchasrc = url;
					
				})
				.catch(function (error) {
					console.log(error,"请求失败");
				});
			},
			showPwd(){
				this.inputtype = this.inputtype == '0' ? '1' :'0';
			},
			//输入电话号码验证
			keyupInput() {
				this.userInfo.phone = this.userInfo.phone.slice(0,11);
				this.userInfo.verifiyCode = this.userInfo.verifiyCode.slice(0,6);
				this.userInfo.captcha = this.userInfo.captcha.slice(0,4);
				this.registerbtn = true;
				if(!this.phone(this.userInfo.phone)) {
					this.message = "*请注意填写正确手机号格式";
					this.verifiybtn = true;
					return false;
				} else{
					 if(this.timerCount == 60){this.verifiybtn = false};
				}
				if(this.userInfo.verifiyCode.length == 0) {
					this.message = "*请输入短信验证码";
					return false;
				}
				if(this.userInfo.verifiyCode.length < 6) {
					this.message = "*短信验证码格式不正确";
					return false;
				}
				if(this.isshowcaptcha&&this.userInfo.captcha.length<4){
					this.message = "*请输入正确的图片验证码";
					return false;
				}
				this.message = "";
				this.registerbtn = false;
				return true;
			},
			//电话号码验证
			phone(data) {
				return !!(/^1[3|4|5|6|7|8][0-9]\d{8}$/.test(data))
			},
			pwd(data){
				return !!(/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/.test(data))
			},
			//登录
			login(userInfo) {
				let _this = this;
				let test = this.keyupInput();
				if(!test){
					return false;
				}
				let params = {
					mobile: userInfo.phone,
					smsCode: userInfo.verifiyCode
				}
				if(_this.isshowcaptcha){
					params.captcha = _this.userInfo.captcha;
					params.appCode = _this.appcode;
				}
				post({url: '/app/api/v1/users/loginPwdForget/check', data: params}).then(data => {
					if (data.code === "000000") {
						let res = JSON.parse(data.data);
						_this.$router.push({path:"/setnewpwd",query:{passCode:res.passCode,userId:res.userId,mobile:userInfo.phone}});
					}else if(data.code === "100009"){
						Toast(data.desc);
						if(parseInt(data.data)>=5){
							_this.isshowcaptcha = true;
							_this.getCapture();
							_this.keyupInput();
							return false;
						}
					}else{ 
						_this.keyupInput();
						Toast(data.desc);
					}
				}).catch(function (error) {
					console.log(error,"请求失败");
				});
			},
			verifiyCode(phonenum) {
				var _this = this;
				if(!this.phone(this.userInfo.phone)) {
					this.message = "*请注意填写正确手机号格式";
					return false;
				}else{
					this.message = "";
				}
				//第6次 弹出图片验证码
				if(this.sendNum>=5&&!this.isshowcaptcha){
					this.isshowcaptcha = true;
					this.keyupInput();
					this.getCapture();
					Toast("请输入图片验证码");
					return false;
				}
				 ;
				if(this.isshowcaptcha){
					if(this.userInfo.captcha.length<4){
						this.message = "*请输入图片验证码";
						return false;
					}
					let params = {
						mobile:this.userInfo.phone,
						appCode:_this.appcode,
						captcha :this.userInfo.captcha
					}
					get({url: '/app/api/v1/user/mobile/sendSmsCheckCaptcha', data: params}).then(data => {
						_this.sendNum ++;
						if (data.code === "000000") {
							Toast("验证码已发送");
							_this.userInfo.verifiyCode = "";
							_this.verifiybtn = true;
							_this.registerbtn = true;
							_this.codeinput = false;
							let timer = setInterval(()=>{
								_this.timerCount--;
								_this.verifiytext = _this.timerCount + "秒之后可重新获取";
								if(_this.timerCount == 0){
									_this.timerCount = 60;
									_this.verifiytext = "发送验证码";
									_this.keyupInput();
									clearInterval(timer);
								}
							},1000)
						}else{
							Toast(data.desc)
						}
					}).catch(function (error) {
						console.log(error,"请求失败");
					});
				}else{
					let params = {
						mobile:this.userInfo.phone
					};
					get({url: '/app/api/v1/user/mobile/sendCode', data: params}).then(data => {
						_this.sendNum ++;
						if (data.code === "000000") {
							_this.userInfo.verifiyCode = "";
							_this.registerbtn = true;
							Toast("验证码已发送");
							_this.verifiybtn = true;
							_this.codeinput = false;
							let timer = setInterval(()=>{
								_this.timerCount--;
								_this.verifiytext = _this.timerCount + "秒之后可重新获取";
								if(_this.timerCount == 0){
									_this.timerCount = 60;
									_this.verifiytext = "发送验证码";
									_this.keyupInput();
									clearInterval(timer);
								}
							},1000)
						}else{
							Toast(data.desc)
						}
					}).catch(function (error) {
						console.log(error,"请求失败");
					});
				}
				
			}
		},
		mounted() { 
		},
		beforeDestroy() { 
		}

	}
</script>

</script>

<style lang="scss" scoped>
	
</style>