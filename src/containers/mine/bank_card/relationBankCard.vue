<template>
	<div class="mine set">
		 <div class="longLines">
			<ul class="line2 mt-line ss">
				<li>
					<input type="text" :value="userInfo.username|nameDesensitization"  disabled="disabled" v-if="userInfo.ifrealname=='已实名'"/>
					<input type="text" placeholder="请输入本人姓名"  v-model.trim="name" />
				</li>
				<li>
					<input type="text" :value="userInfo.IdcardNo|IdNoDesensitization"  disabled="disabled" v-if="userInfo.ifrealname=='已实名'"/>
					<input type="text" placeholder="请输入本人证件号"  v-model.trim="IDcard" />
				</li>
				 <li v-for="item in form" v-show="userInfo.ifrealname=='已实名'||item.option!='本人姓名'||item.option!='本人证件号'" v-if="item.display===0">
					<input :type="item.type" :placeholder="item.value"  v-model.trim="item.param"  v-if="item.option!='开户行'"/>
					<input type="button" :placeholder="item.value" v-model.trim="banks.name"  @click="popupVisible = true" v-if="item.option=='开户行'"/>
					<button v-if="item.option=='短信验证码'" class="captcha" :class="verifiybtn?'cap2':'cap1'" @click="sendCode(form)" :disabled="verifiybtn">{{verifiytext}}</button>					
				</li>
				<li v-if="userInfo.ifrealname!='已实名'"> 
					<input :type="pwd ? 'password' : 'number'" placeholder="请输入交易密码"  v-model.trim="trandpassword"/>
					<i class="icon-login"  @click="showPwd()" :class="pwd?'icon-eye':'icon-openeye'"></i>
				</li>
 			</ul>
		</div> 

		<div class="note0" v-if="userInfo.ifrealname=='已实名'">
			<div>提示：</div> 
			1.实名认证通过后不支持修改，只能绑定本人的银行卡
		</div>
		<div class="note0" v-if="userInfo.ifrealname!='已实名'">
			<div>提示：</div> 
			1.第一次绑定银行卡同时进行实名认证，实名认证通过后不可以修改实名信息，请确认是本人操作；<br />
			2.交易密码是6位数字			 
		</div>
		
		<div class="btn-div">
			<button class="submit2" @click="cardnext(userInfo,form)">下一步</button>
		</div>
	 
	 	<mt-popup v-model="popupVisible" position="bottom" class="mint-popup">
		  <mt-picker :slots="dataList" @change="onDateChange" :visible-item-count="5" :show-toolbar="false" ref="picker" value-key="name"></mt-picker>
		</mt-popup>

	</div>
 
</template>

<script>
	import { mapState } from 'vuex'
	import { guid } from '@/utils/utils.js'
	import { post, get } from '@/server/index.js'
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
				picnum:"",
				isshowcaptcha:false,
				pwd:true,
				form :[],
				name:"",
				IDcard:"",
				banks:{
					name: "",
					value: ""
				},
				popupVisible: false,
				dataList: [
			        {
			          flex: 1,
			          values: [],
			          className: 'slot1',
			          textAlign: 'center'
			        }
		      	],
				dateSlots: [],
				currentTags: {},
				verifiybtn: false,
				verifiytext: "发送验证码", //发送短信验证码按钮
				
				trandpassword:""
 			}
		}, 
		mounted() {
			this.form =[
//				{option:'本人姓名',type:'text',value:'请输入本人姓名',param: "" },
//				{option:'本人证件号',type:'text',value:'请输入本人证件号',param: "" },
				{option:'开户行', type:'text', value:'选择开户行', param:"", display: 0}, 
				{option:'银行卡号',type:'number',value:'请输入银行卡号', param: "", display: 0 }, 
				{option:'银行预留手机号',type:'number',value:'请输入银行预留手机号', param: "", display: 0 }, 
				{option:'短信验证码',type:'number',value:'请输入短信验证码', param: "" ,display: 0}, 
//				{option:'交易密码',type:'number',value:'请输入交易密码', param: "", display: 0 }, 
			],
			this.getBankName();
		},
		methods:{
			 
			openPicker() {
		        this.$refs.picker.open();
		    },
		    onDateChange (picker, values) {
		    	if(values[0]){
		    		this.banks = values[0];
		    	}
		    },
			showPwd(){
				this.pwd = !this.pwd;
			},
			sendCode(params) {
				if (validation.ifNum(params[2].param, "手机号", 11)!= true){
					
					Toast(validation.ifNum(params[2].param, "手机号", 11));
					
				}else{
					let data = {
						mobile: params[2].param
					}
					let _this = this;
					get({url: '/app/api/v1/user/mobile/sendCode', data: data}).then(data => {
						if (data.code === "000000") {
							Toast("验证码已发送");
							_this.countDown(_this)
						} else {
							Toast("验证码发送失败" + data.desc);
						}
					}).catch(function (error) {
						console.log(error);
				  	});
				}
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
			getBankName() {
//				console.log(this.userInfo,99999)
				var _this = this;
				let data = {
					operatorId: this.userInfo.operatorId,
					mobile: this.userInfo.phoneNo
				}
				get({url: '/app/api/v1/bankcard/support_banks', data: data}).then(data => {
					if (data.code === "000000") {
						var arry = [];
						for(let i=0; i<data.data.length; i++){
							var obj = {
								name: data.data[i].name,
								value: data.data[i].code
							}
							arry.push(obj);
						}
						_this.dataList[0].values = arry;
						console.log("获取成功",);
					} else {
						console.log("获取失败");
					}
				}).catch(function (error) {
					console.log(error);
			  	});
			},
			cardnext(user,params){
				let _this = this;
				let items = {
					name: user.username||_this.name, 
					idCardNo: user.IdcardNo||_this.IDcard, 
					bankCode: _this.banks.value,
					bankCardNo: params[1].param, 
					bankReservePhone: params[2].param, 
					smsCode: params[3].param, 
					tradePassword: _this.trandpassword, 
					operatorId: user.operatorId,
					mobile: user.phoneNo
				}
				if (validation.ifName(items.name)!=true) {
					
					Toast(validation.ifName(items.name));
					
				} else if (validation.isCardID(items.idCardNo)!=true){
					console.log(items.idCardNo)
					Toast(validation.isCardID(items.idCardNo));
					
				}
				//银行卡号校验
				else if (items.bankCardNo==""){
					Toast("银行卡号不为空！")
				}
//				else if (validation.isCardBank(items.bankCardNo)!=true){
//
//					Toast(validation.isCardBank(items.bankCardNo));
//					
//				}
				else if (validation.ifNum(items.bankReservePhone, "手机号", 11)!=true){
					
					Toast(validation.ifNum(items.bankReservePhone, "手机号", 11));
					
				}else if (validation.ifNum(items.smsCode, "验证码", 6)!=true){
					
					Toast(validation.ifNum(items.smsCode, "验证码", 6));
					
				}
				
				else if (_this.userInfo.bankcardNum==0&& validation.ifNum(items.tradePassword, "交易密码", 6)!=true){
					
					Toast(validation.ifNum(items.tradePassword, "交易密码", 6));
					
				} else {
					post({url: '/app/api/v1/bankcard/bind', data: items}).then(data => {
						if (data.code === "000000") {
							Toast("绑定成功")
							_this.$store.dispatch('getUser');
							_this.$router.push({path:"/bankCard"})
	
						}else {
							Toast("绑定失败:" + data.desc)
						}
					}).catch(function (error) {
						console.log(error);
				  	});
				}
			}
		}
	}
</script>
<style type="text/css">

	.icon-eye{
		position: absolute;
		top: 18px;
		right: 20px;
	    display: inline-block;
	    background-size: 82px 56px;                                                                                                                                                                                                                                                                                                
	    width: 16px;
	    height: 16px;
	    background-position: -61px -31px;
	}
	.icon-openeye{
		position: absolute;
		top: 18px;
		right: 20px;
		display: inline-block;
	    background-size: 82px 56px;
	    width: 16px;
	    height: 16px;
		background-position: -61px -5px;
	}
	.mint-popup{
		width: 100%;
	}
	input[type="button"]{
	    background: #fff;
    	text-align: left;
    	border: 0;
    	border-radius: 0;
	}
</style>