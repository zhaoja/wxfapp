<template>
	<div class="login">
		<Header topName="新用户注册"></Header>
		<form>
			<div class="form-item">
				<i class="icon icon-phone"></i>
				<input type="number" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"  @keyup="keyupInput" placeholder="请输入手机号" :maxlength="11" v-model.trim="userInfo.phone">
			</div>
			
			<div class="form-item" v-if="isshowcaptcha">
				<i class="icon icon-imgcode"></i>
				<div class="codeButton" @click="getCapture">
					<img :src="captchasrc" alt="" class="imgCode" ref="captchasrc" v-if="captchasrc!=''">
				</div>
				<div>
					<input type="text" placeholder="请输入图形验证码" v-model.trim="userInfo.captcha" @keyup="keyupInput" maxlength="4">
				</div>
			</div>
			<div class="form-item">
				<i class="icon icon-smscode"></i>
				<div class="codeButton">
					<button type="button" :disabled="verifiybtn" @click="verifiyCode(userInfo.phone)">{{verifiytext}}</button>
				</div>
				<div>
					<input type="number" placeholder="请输入短信验证码" v-model.trim="userInfo.verifiyCode" @keyup="keyupInput" maxlength="6">
				</div>
			</div>
			<div class="form-item">
				<i class="icon icon-pwd"></i>
				<input v-model="userInfo.pwd" :type="inputtype == '0' ? 'password' : 'text'" @keyup="keyupInput" placeholder="请设置登录密码" maxlength="20" ref="inputpwd" >
				<i class="icon pull-right" @click="showPwd" :class="{'icon-eye':inputtype == '0','icon-openeye':inputtype == '1'}"></i>
			</div>
			
			<div class="alert" v-if="message"> {{message}} </div>
			<p class="prompt">提示：必须是6-20位英文字母，数字或符号（空格除外），且字母，数字和符号至少包含两种</p>
			<div class="oparote-list">
				注册即视为同意<a @click="flolayer = true">《微孝付用户协议》</a>和<a @click="flolayerR = true">《微孝付使用协议》</a>
			</div>
		</form>
		<div class="lbtn-container">
			<button class="lbtn" :class="registerbtn?'longbtn1':'longbtn2'" :disabled='registerbtn' @click="regist(userInfo)">立即注册</button>
		</div>

		<div class="flolayer" v-if="flolayer">
			<div class="inner">
				<i class="close icon icon-close" @click="close()"></i>
				<h3>《微孝付用户协议》</h3>
				<div class="text">
					<p>1、用户承诺其具有完全民事行为能力的民事主体，且具有达成交易履行其义务的权利。</p>
					<p>2、用户有义务在注册是提供自己真实的资料，并保证手机号码、姓名、所在地区等内容的有效性即安全性。</p>
					<p>3、用户有义务在注册是提供自己真实的资料，并保证手机号码、姓名、所在地区等内容的有效性，并保证手机号码、姓名、所在地区等内容的有效性即安全性。</p>
				</div>
				<button class="Iagree" @click="Iagree()">同意并继续</button>
				
			</div>
 		
		</div>
		<div class="flolayer" v-if="flolayerR">
			<div class="inner">
				<i class="close icon icon-close" @click="close()"></i>
				<h3>《微孝付使用协议》</h3>
				<div class="text">
					<p>1、用户承诺其具有完全民事行为能力的民事主体，且具有达成交易履行其义务的权利。</p>
					<p>2、用户有义务在注册是提供自己真实的资料，并保证手机号码、姓名、所在地区等内容的有效性即安全性。</p>
					<p>3、用户有义务在注册是提供自己真实的资料，并保证手机号码、姓名、所在地区等内容的有效性，并保证手机号码、姓名、所在地区等内容的有效性即安全性。</p>
				</div>
				<button class="Iagree" @click="Iagree()">同意并继续</button>
				
			</div>
		
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
					pwd:"",
					captcha:""
				},
				isshowcaptcha:false,
				registerbtn:true,
				flolayer:false,
				flolayerR:false,
				message:"",
				verifiytext:"发送验证码",
				verifiybtn:false,
				inputtype:"0",
				sendNum:0,
				captchasrc:"",
				appCode:""
			}
		},
		created(){
			this.getCapture();
		},
		methods: {
			showPwd(){
				this.inputtype = this.inputtype == '0' ? '1' :'0';
			},
			getCapture(){
				let _this = this;
				_this.appCode = guid();
				let param = {
					appCode: _this.appCode
				}
				fileStream({url: '/app/api/v1/captcha-image', data: param}).then(data => {
					var url = data;
				
					_this.captchasrc = url;
					
				})
				.catch(function (error) {
					console.log(error,"请求失败");
				});
			},
			changeloginstate(id){
				this.$router.push("/registor")
			},
			//输入电话号码验证
			keyupInput() {
				this.userInfo.phone = this.userInfo.phone.slice(0,11);
				this.userInfo.pwd = this.userInfo.pwd.trim().replace(/[\u4E00-\u9FA5]/g,'');
				this.userInfo.verifiyCode = this.userInfo.verifiyCode.slice(0,6);
				this.userInfo.captcha = this.userInfo.captcha.slice(0,4);
				this.registerbtn = true;
				if(!this.phone(this.userInfo.phone)) {
					this.message = "*请注意填写正确手机号格式";
					return false;
				} 
				if(this.isshowcaptcha&&this.userInfo.captcha.length<4){
					this.message = "*请输入正确的图片验证码";
					return false;
				}
				if(this.userInfo.verifiyCode.length == 0) {
					this.message = "*请输入正确的短信验证码";
					return false;
				}
				if(this.userInfo.pwd.length == 0) {
					this.message = "*请输入登录密码";
					return false;
				}
				if(!this.pwd(this.userInfo.pwd)) {
					this.message = "*密码格式不正确";
					return false;
				}
				this.message = "";
				this.registerbtn = false;
				return true;
			},
			pwd(data){
				return !!(/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/.test(data))
			},
			//同意按钮与注册联动1
			agreeChange(a) {

			},
			//同意按钮与注册联动2
			Iagree() {
				this.flolayerR = false;
				this.flolayer = false;
			},
			close() {
				this.flolayerR = false;
				this.flolayer = false;
			},

			//电话号码验证
			phone(data) {
				return !!(/^1[3|4|5|6|7|8][0-9]\d{8}$/.test(data))
			},
			checkPhone(phonenum){
				return new Promise(resolve => {
					post({url: '/app/api/v1/user/register/checkPhone', data: { mobile: phonenum }}).then(data => {
						console.log(data)
						if (data.code === "000000") {
							resolve({isexit:false,desc:data.desc});
						}else{
							resolve({isexit:true,desc:data.desc});
						}
					}).catch(function (error) {
						console.log(error,"请求失败");
					});
				}) 
			},
			codeRequest(phonenum){
				if(!this.phone(this.userInfo.phone)) {
					this.message = "*请注意填写正确手机号格式";
					return false;
				}else{
					this.message = "";
				}
				if(this.sendNum>=5 && !this.isshowcaptcha){
					this.isshowcaptcha = true;
					Toast("请输入图片验证码");
					this.getCapture();
					return false;
				}
				var _this = this;
				var time = 60;
				if(this.isshowcaptcha){
					if(this.userInfo.captcha.length<4){
						this.message = "*请输入图片验证码";
						return false;
					}
					let params = {
						mobile:this.userInfo.phone,
						appCode:_this.appCode,
						captcha :this.userInfo.captcha
					}
					console.log(params)
					get({url: '/app/api/v1/user/mobile/sendSmsCheckCaptcha', data: params}).then(data => {
						_this.sendNum ++ ;
						console.log(data)
						if (data.code === "000000") {
							_this.isshowcaptcha = false;
							Toast("验证码已发送");
							_this.verifiybtn = true;
							let timer = setInterval(()=>{
								time--;
								_this.verifiytext = time + "秒之后可重新获取";
								if(time == 0){
									_this.verifiytext = "发送验证码";
									_this.verifiybtn = false;
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
					get({url: '/app/api/v1/user/mobile/sendCode', data: { mobile: phonenum }}).then(data => {
						_this.sendNum ++ ;
						if (data.code === "000000") {
							Toast("验证码已发送");
							_this.verifiybtn = true;
							let timer = setInterval(()=>{
								time--;
								_this.verifiytext = time + "秒之后可重新获取";
								if(time == 0){
									_this.verifiytext = "发送验证码";
									_this.verifiybtn = false;
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
			},
			//获取验证码
			verifiyCode(phonenum) {
				let _this = this;
				if(!this.phone(this.userInfo.phone)) {
					this.message = "*请注意填写正确手机号格式";
					return false;
				}else{
					this.message = "";
				}
				this.checkPhone(phonenum).then((data)=>{
					if(data.isexit){
						Toast(data.desc);
						return false;
					}else{
						_this.codeRequest(phonenum);
					}
				})
				
				
			}, 
			
			//注册
			regist(userInfo) {
				let _this = this;
				let test = this.keyupInput();
				
				/**
				 * 发送接口请求
				 */
				let params = {
					"mobile": userInfo.phone,
					"loginPassword": userInfo.pwd,
					"smsCode": userInfo.verifiyCode
				}
				console.log(params)
				if(_this.isshowcaptcha){
					params.captcha = _this.userInfo.captcha;
					params.appCode = _this.appCode;
				}
				if(_this.isshowcaptcha&&params.captcha.length<4){
					_this.message = "*请输入正确的图片验证码";
					return false;
				}
				if(!test) {
					return false;
				}
				post({url: '/app/api/v1/user/register', data: params }).then(data => {
					console.log(data)
					if (data.code === "000000") {
						Toast("注册成功");
						_this.gologin();
					}else if(data.code === "100009"){
						Toast(data.desc);
						if(parseInt(data.data)>=5){
							_this.isshowcaptcha = true;
							_this.getCapture();
							_this.keyupInput();
							return false;
						}
					}
					else{
						_this.getCapture();
						Toast(data.desc);
					}
				}).catch(function (error) {
					console.log(error,"请求失败");
				});
			},
			gologin(){
				let _this = this;
				let params = {
					mobile: _this.userInfo.phone,
					password : _this.userInfo.pwd
				}
				post({url: '/app/api/v1/login', data: params}).then(data => {
					if (data.code === "000000") {
						_this.$store.dispatch('setUserInfo',data.data);
						_this.$router.push("/mine");
					}else{
						Toast(data.desc);
					}
				})
			}
		},
		mounted() {
			
		},
		beforeDestroy() {
			
		},
		watch: {

		}

	}
</script>

</script>

<style lang="scss" scoped>
	.prompt{
		color:#999;
		margin-top:10px;
	}
	.alert{
		margin-top:10px;
	}
</style>