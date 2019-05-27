<template>
	<div class="bg_white1">
		<div class="personcard">
			<mt-spinner type="fading-circle" class="all-loding" v-if="loading"></mt-spinner>

			<mt-tabbar v-model="selected" v-if="userInfo.usertype=='PENSION_CARD'" style="position: fixed;">
				<mt-tab-item id="tab1" :style="{color: tabStyle.tab1Color}">
					<img slot="icon" :src="tabStyle.tab1Img">
					我关联的
				</mt-tab-item>
				<mt-tab-item id="tab2" :style="{color: tabStyle.tab2Color}">
					<img slot="icon" :src="tabStyle.tab2Img">
					关联我的
				</mt-tab-item>
			</mt-tabbar>

			<div class="pensioncard">
				<button @click="addCard(userInfo)" class="add_btn" v-if="selected==='tab1'">添加</button>
				<mt-tab-container v-model="selected">
					<mt-tab-container-item id="tab1">
						<ul class="card">
							<li v-if="bCard.length<=0">
								<router-link to="relationPensionCard">
									<img :src="pic0" class="pic_bg" />
								</router-link>
							</li>
							<li v-for="card in bCard">
								<img :src="pic1" class="pic_bg" />
								<div class="card">
									<img :src="pic_1" class="pic_logo" />
									<div class="inner">
										<button @click="actionSheet(card)" v-show="card.isDefault!='Y'||bCard.length<=1"><img :src="pic_more" /></button>
										<div>{{card.userName|nameDesensitization}} <label v-if="card.isDefault=='Y'"> 默认 </label></div>
									</div>
									<div class="bottom">养老助残卡号： {{card.pensionCardNo|pensionNoDesensitization}}</div>
								</div>
							</li>
						</ul>
						<div class="note0" v-if="bCard.length<=0">
							<strong>温馨提示：</strong>
							<span>您在平台合作商户进行消费的让利，将以积分的形式发放至关联的默认养老助残卡用户积分账户</span>
						</div>
						<div class="note0" v-if="bCard.length>0">
							<strong>温馨提示：</strong>
							<span>您在平台合作商户进行消费的让利，将以积分的形式发放至关联的默认养老助残卡用户积分账户；<br />
								关联您自己本人的养老助残卡并设为默认，您本人消费自己可获得相应的积分
							</span>
						</div>
					</mt-tab-container-item>
					<mt-tab-container-item id="tab2">
						<ul class="card">
							<li v-for="card in mCard">
								<img :src="pic2" class="pic_bg" />
								<div class="card">
									<img :src="pic_2" class="pic_logo" />
									<div class="inner">
										<button></button>
										<div>{{card.userName|nameDesensitization}} <span> {{card.bankCardType}}</span></div>
									</div>
									<div class="bottom">累计为您获得10000积分 </div>
								</div>
							</li>
						</ul>
					</mt-tab-container-item>
				</mt-tab-container>

				<mt-actionsheet :actions="popdata" v-model="sheetVisible">
				</mt-actionsheet>

			</div>
		</div>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { get, post } from '@/server/index.js'
	import { Tabbar, TabItem } from 'mint-ui';
	import { MessageBox } from 'mint-ui';
	import { Toast } from 'mint-ui'
	
	import pic_tab_1 from '@/assets/images/oldcard/pic3@2x.png'
	import pic_tab_2 from '@/assets/images/oldcard/pic4@2x.png'
	import pic_tab_3 from '@/assets/images/oldcard/mine@2x.png'
	import pic_tab_4 from '@/assets/images/oldcard/mine2@2x.png'

	import pic_more from '@/assets/images/oldcard/more@2x.png'
	
	import pic0 from '@/assets/images/oldcard/banner@2x.png'
	import pic1 from '@/assets/images/oldcard/bj1@2x.png'
	import pic_1 from '@/assets/images/oldcard/pic@2x.png'
	import pic2 from '@/assets/images/oldcard/bj2@2x.png'
	import pic_2 from '@/assets/images/oldcard/pic2@2x.png'

	export default { 
		name: 'hello',
		 data() {  
			return {  
				loading: true,
				selected:"tab1",
				pic_more: pic_more,
				pic0,
				pic1,
				pic_1,
				pic2,
				pic_2,
				pic_tab_1:pic_tab_1,
				pic_tab_2:pic_tab_2,
				pic_tab_3:pic_tab_3,
				pic_tab_4:pic_tab_4,
				bCard: {},
				mCard: {},
				tabStyle: {
					tabimg1: "",
					tabimg2: "",
					tab1Color: "#fa5f3b",
					tab2Color: "#b5b5b5"
				},
				popdata: [{    
					name: '解除关联',
					param: {},
				    method: this.noRelation  
				}],
			    // action sheet 默认不显示，为false。操作sheetVisible可以控制显示与隐藏
			   sheetVisible: false  
			} 
		},
		computed: {
			...mapState({
				userInfo: state => state.user.user.userInfo
			}),
		},  
		created(){
			this.getCard(this.userInfo);
			this.tabStyle.tab1Img = this.pic_tab_1;
			this.tabStyle.tab2Img = this.pic_tab_4;
		},
		watch: {
		    selected: function (val, oldVal) {
		        if(val==="tab1"){
		        	this.tabStyle.tab1Img = this.pic_tab_1;
		        	this.tabStyle.tab2Img = this.pic_tab_4;
		        	this.tabStyle.tab1Color = "#fa5f3b";
		        	this.tabStyle.tab2Color = "#b5b5b5";
		        }else {
		        	this.tabStyle.tab1Img = this.pic_tab_2;
		        	this.tabStyle.tab2Img = this.pic_tab_3;
		        	this.tabStyle.tab1Color = "#b5b5b5";
		        	this.tabStyle.tab2Color = "#fa5f3b";
		        }
		    },
				userInfo: function(val, oldVa) {
					if(val.operatorId) {
						this.getCard(this.userInfo);
					}
				}
		},
		methods: { 
			//获取卡列表
			getCard(userInfo){
				  
			 	let _this = this;

				let data = {
					operatorId: userInfo.operatorId,
					mobile: userInfo.phoneNo
				}
				
				if (data.operatorId||data.mobile) {
				
					//我关联的
					get({url: '/app/api/v1/pension/cards/myRelation', data: data}).then(data => {
						
						if (data.code === "000000") {
							let arr = data.data;
							for(let i=0;i<arr.length;i++){
								if(arr[i].isDefault==="Y"){
									var arrY = arr[i];
									arr.splice(i, 1);
									arr.unshift(arrY);
								};
							} 						
							_this.bCard = data.data;
							_this.loading = false;
						}else{
							Toast(data.desc)
						}
						
					}).catch(function (error) {
						console.log(error);
						});
						//关联我的
						get({url: '/app/api/v1/pension/cards/connectMe', data: data}).then(data => {
						if (data.code === "000000") {
							_this.mCard = data.data;
							_this.loading = false;
						}else{
							Toast(data.desc)
						}
					}).catch(function (error) {
						console.log(error);
					});
					 
				}	
			},
			//底部弹出 
			actionSheet: function(p) {
				if(p.isDefault==='Y'){
					if(this.bCard.length>1){
						this.popdata = [];
					}else {
						this.popdata=[{    
							name: '解除关联',
							param: {},
						    method: this.noRelation  
						}];
					}
					this.popdata[0].param = p ;

				}else {
					this.popdata=[{    
						name: '解除关联',
						param: {},
					    method: this.noRelation  
					},{    
						name: '设为默认养老助残卡',
						param: {},
					    method: this.makeItDefault // 调用methods中的函数
					}]
					this.popdata[0].param = p ;
					this.popdata[1].param = p ;
				};
				this.sheetVisible = true;
			},
			noRelation: function(a) {   
				if(this.bCard.length>1){
					this.$router.push({name: "解除关联", params: a.param})
				}else{
					MessageBox({
						message: '这是你关联的最后一张卡，确定解除关联？',
						confirmButtonText:"确定",
						showCancelButton: true,
						cancelButtonClass:"cancel",
						confirmButtonClass:"confirm"
						}
					).then( action => {
						if(action ==="confirm"){
					  		this.$router.push({name: "解除关联", params: a.param})
						}else{
							return
						}
					});
				}
			},
			
			//设置默认养老卡
			makeItDefault: function(a) {  
				let _this = this;
				let data = {
					pensionCardId : a.param.id,
					operatorId: _this.userInfo.operatorId,
					mobile: _this.userInfo.phoneNo
				}
				//设为默认
				post({url: '/app/api/v1/pension/cards/setupDefault', data:data}).then(data => {
					if (data.code === "000000") {
						_this.getCard(_this.userInfo)
					}else{
							Toast(data.desc)
						}
				}).catch(function (error) {
					console.log(error);
			  	});
			},
			
			//添加卡
			addCard(userInfo) {
				this.$router.push("relationPensionCard")
			}
		}
	}
</script>
<style type="text/css" lang="scss">
	 .mint-tabbar>.mint-tab-item.is-selected {
            background-color: #fff !important;
            color: #26a2ff;
        }
    
        .mint-tabbar {
            position: fixed !important;
            background-color: #fff !important;
            z-index: 10;
            border-top: 1px solid #f5f5f5;
            bottom: 0;
        }
</style>
 