<template>
	<div class="login">
		<Header topName="登录" isselfback="true" @back="back"></Header>
		
		<form>
			<div class="logo">LOGO</div>
			<div class="form-item">
				<i class="icon icon-phone"></i>
				<input type="number" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"  @keyup="keyupInputPhone" placeholder="请输入手机号" :maxlength="11" v-model.trim="userInfo.phone">
			</div>
			<div class="form-item">
				<i class="icon icon-pwd"></i>
				<i class="icon pull-right" @click="showPwd" :class="{'icon-eye':inputtype == '0','icon-openeye':inputtype == '1'}"></i>
				<input :type="inputtype == '0' ? 'password' : 'text'"  @keyup="keyupInput" placeholder="请输入密码" maxlength="20" v-model="userInfo.pwd">
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
			<div class="alert" v-if="message"> {{message}} </div>
			<div class="oparote-list-login">
				<a class="pull-left" @click="changeloginstate('2')">忘记密码？</a>
				<a class="pull-right" @click="changeloginstate('1')">新用户注册</a>
			</div>
		</form>
		<div class="lbtn-container">
			<button class="lbtn" :class="registerbtn?'longbtn1':'longbtn2'" :disabled='registerbtn' @click="login(userInfo)">登录</button>
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
	import { isMobile } from "@/utils/browser"//判断是否在webview环境
	export default {
		components:{
			Header
		},
		data() {
			return {
				userInfo:{
					phone:"",
					pwd:"",
					captcha:""
				},
				registerbtn:true,
				flolayer:false,
				flolayerR:false,
				message:"",
				verifiytext:"发送验证码",
				verifiybtn:"",
				active:"disban",
				inputtype:"0",
				isshowcaptcha:false,
				captchasrc:"",
				errorNo:0,
				appcode:""
			}
		},
		created(){
			//this.getCapture();
		},
		methods: {
			getCapture(){
				let _this = this;
				_this.appcode = guid();
				console.log(_this.appcode)
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
			changeloginstate(id){
				switch(id){
					case "1" : 
					this.$router.push("/registor");
					break;
					case "2" :
					this.$router.push("/forgetpwd");
					break;
				}
			},
			keyupInputPhone(){
				this.userInfo.phone = this.userInfo.phone.slice(0,11);
				this.registerbtn = true;
				if(!this.phone(this.userInfo.phone)) {
					this.message = "*请注意填写正确手机号格式";
					return false;
				}
				this.message = "";
				if(!this.pwd(this.userInfo.pwd)) {
					return false;
				}
				if(this.isshowcaptcha&&this.userInfo.captcha.length<4){
					return false;
				}
				this.registerbtn = false;
			},
			//输入电话号码验证
			keyupInput() {
				this.userInfo.captcha = this.userInfo.captcha.slice(0,4);
				this.userInfo.pwd = this.userInfo.pwd.trim().replace(/[\u4E00-\u9FA5]/g,'');
				this.registerbtn = true;
				if(!this.phone(this.userInfo.phone)) {
					this.message = "*请注意填写正确手机号格式";
					return false;
				} 
				if(this.userInfo.pwd.length == 0) {
					this.message = "*请输入密码";
					return false;
				}
				if(!this.pwd(this.userInfo.pwd)) {
					this.message = "*密码格式不正确";
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
				let params = {
					mobile: _this.userInfo.phone,
					password : _this.userInfo.pwd
				}
				if(_this.isshowcaptcha){
					params.captcha = _this.userInfo.captcha;
					params.appCode = _this.appcode;
				}
				if(!test){
					return false;
				}
				post({url: '/app/api/v1/login', data: params}).then(data => {
					console.log(data)
					if (data.code === "000000") {
						Toast('登录成功');
						
						_this.$store.dispatch('setUserInfo',data.data);

						if(_this.$route.query.redirect != undefined){
							_this.$router.go(-1);
						}else{
							_this.$router.push("/index");
						}
					}else if(data.code == "100002"){
						_this.errorNo = data.data ;
						if(_this.errorNo >= 5){
							_this.isshowcaptcha = true;
							_this.getCapture();
							_this.keyupInput();
						}
						_this.message = data.desc;
					}else{
						Toast(data.desc);
					}
				}).catch(function (error) {
					console.log(error,"请求失败");
				});
			},
			back(){
				if(this.$route.query.redirect != undefined){
					this.$router.go(-1);
				}else{
					this.$router.push("/index");
				}
			},
			toAppData(data){
				if (isMobile) {
					dsBridge.call("saveUserInfo", data, function(res) {
						//成功
						if (res.code == "0") {
							alert(res.data.data)
						} else {
							alert(res.message)
						}
					});
					return false;
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