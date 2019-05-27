<template>
	<div class="personcard bg_white">
		<mt-spinner type="fading-circle" class="all-loding" v-if="loading"></mt-spinner>
		<div class="bankcard">
			<button @click="addCard(userInfo)" class="add_btn">添加</button>
			<div class="result"  v-if="bCard.length==0">
				<img :src="pic0" style="width: 120px;margin-bottom: 15px;"/>
				<div class="note0">还没有绑定银行卡哦～</div>
			</div>
		 	<ul class="card" v-if="bCard.length>0">
		 		<li v-for="card in bCard">
		 			<img :src="pic1" class="pic_bg"/>
		 			<div class="card">
		 				<img :src="pic_1" class="pic_logo"/>
		 				<div class="inner">
		 					<button @click="actionSheet(card)">解除绑定</button>
							<div>{{card.bankName}} </div>
							<div>{{bankCardTypeDic[card.bankCardType]}}  </div>
	 					 	<div>{{card.bankCardNo|bankNoDesensitization}}</div>
		 				</div>
		 			</div>
		 		</li>
		 	</ul>
		</div>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { get, post } from '@/server/index.js'
	import pic0 from '@/assets/images/no1@2x.png'
	
	import pic1 from '@/assets/images/cardbj2x.png'
	import pic_1 from '@/assets/images/cardlogo2x.png'
	import { MessageBox } from 'mint-ui';
  	import { Toast } from 'mint-ui'
 
	export default { 
		name: 'hello',
		 data() {  
			return {  
				loading: true,
				bCard: {},
				bankCardTypeDic: {
					"X":"信用卡",
					"J":"借记卡"
				},
				pic0,
				pic1,
				pic_1,
 			} 
		},
		computed: {
			...mapState({
				userInfo: state => state.user.user.userInfo
			}),
		},
		created(){
			this.getCard(this.userInfo)
		},
		watch: {
			userInfo: function(val, oldVa) {
				if(val.operatorId) {
					this.getCard(this.userInfo);
				}
			}
		},
		 methods: { 
			//解绑 
			actionSheet: function(p) {  

				MessageBox({
					message: '银行卡解除绑定后，此卡支付将不可用',
					confirmButtonText:"继续解绑",
					showCancelButton: true,
					cancelButtonClass:"cancel",
					confirmButtonClass:"confirm"
					}
				).then( action => {
					if(action ==="confirm"){
				  		this.$router.push({name:"解绑银行卡", params: {id:p.id , name:p.bankName, type:p.bankCardType , no:p.bankCardNo }})
					}else{
						return
					}
				});
			},
			//获取卡列表
			getCard(userInfo){
			 	let _this = this;
				var permission = localStorage.getItem("operatorId")
				var phoneNo = localStorage.getItem("phoneNo")
				
				let data = {
					operatorId: permission,
					mobile: phoneNo
				} 
				if (data.operatorId||data.mobile) {
				
					get({url: '/app/api/v1/bankcard/banks', data: data}).then(data => {
						if (data.code === "000000") {
							_this.bCard = data.data;
							_this.loading = false;
							_this.userInfo.bankcardNum = data.data.length;
						}else{
							Toast(data.desc)
						}
					}).catch(function (error) {
						console.log(error);
					});
				}
			},
			//添加卡
			addCard(userInfo) {
				this.$router.push("relationBankCard")
			} 
		}
	}
</script>
<style lang="scss"> 

</style>