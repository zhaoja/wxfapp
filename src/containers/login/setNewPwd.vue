<template>
	<div class="forgetpwd bg-gray">
		<Header topName="设置新密码"></Header>
		
		<form>
			<div class="form-item">
				<input type="password"  @keyup="keyupInput" placeholder="请输入新密码" maxlength="20" v-model="userInfo.pwd">
			</div>
			<div class="form-item">
				<input type="password"  @keyup="keyupInput" placeholder="请确认新密码" maxlength="20" v-model="userInfo.pwdAgain">
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
	import myutils,{guid} from '@/utils/utils.js';
	import { Toast } from 'mint-ui';
	export default {
		components:{
			Header
		},
		data() {
			return {
				userInfo:{
					pwd:"",
					pwdAgain:""
				},
				message:"",
				registerbtn:true
			}
		},
		created(){

		},
		methods: {
			//输入电话号码验证
			keyupInput() {
				this.userInfo.pwd = this.userInfo.pwd.trim().replace(/[\u4E00-\u9FA5]/g,'');
				this.userInfo.pwdAgain = this.userInfo.pwdAgain.trim().replace(/[\u4E00-\u9FA5]/g,'');
				if(this.userInfo.pwd.length == 0) {
					this.message = "*请输入密码";
					return false;
				}
				if(this.userInfo.pwdAgain.length == 0) {
					this.message = "*请再次输入密码";
					return false;
				}
				if(!this.pwd(this.userInfo.pwd)) {
					this.message = "*必须是6-20位英文字母、数字或符号(空格除外)，且字母、数字和符号至少包含两种";
					return false;
				}
				if(this.userInfo.pwd!=this.userInfo.pwdAgain){
					this.message = "*两次密码输入不一致";
					return false;
				}
				this.message = "";
				this.registerbtn = false;
				return true;
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
					passCode : _this.$route.query.passCode,
					userId : _this.$route.query.userId,
					newLoginPassword : _this.userInfo.pwd,
					mobile :_this.$route.query.mobile,
				}
				post({url: '/app/api/v1/users/loginPwdForget', data: params}).then(data => {
					console.log(data)
					if (data.code === "000000") {
						Toast("密码重置成功");
						_this.$router.push("/login");
					}else{
						Toast(data.desc);
					}
				}).catch(function (error) {
					console.log(error,"请求失败");
				});
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