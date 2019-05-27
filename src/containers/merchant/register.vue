<template>
	<div class="capply">  
		<div class="chapter">
			<div class="orlack">信息填写</div>
			<ul>
				<li>
					<span><label>*</label>商户名称</span> 
					<input type="text" v-model="merchantInfo.merName" placeholder="请与门脸名称一致"/>
				</li>
				<li>
					<span class="lh18"><label>*</label>社会信用<br/>&nbsp;&nbsp;代码</span> 
					<input type="text" v-model="merchantInfo.licenceNo" placeholder="请按营业执照信用代码填写"/>
				</li>
				<li>
					<span><label>*</label>企业类型</span> 
					<select v-model="merchantInfo.enterpriseType">
						<option name="" value="">--请选择--</option>
						<option v-for="op in options_enterpriseTypes" :value="op.code">{{op.desc}}</option>
					</select>
				</li>
				<li>
					<span><label>*</label>商户类型</span> 
					<select v-model="merchantInfo.merType">
						<option name="" value="">--请选择--</option>
						<option v-for="op in options_merTypes" :value="op.code">{{op.desc}}</option>
					</select>
				</li>
				<li>
					<span><label>*</label>服务电话</span> 
					<input type="number" v-model="merchantInfo.servicePhone" placeholder="请填写手机号或座机号码"/>
				</li>
				<li>
					<span><label>*</label>联系人</span> 
					<input type="text" v-model="merchantInfo.contactName" placeholder="请填写联系人姓名"/>
				</li>
				<li>
					<span class="lh18"><label>*</label>联系人电<br/>&nbsp;&nbsp;话</span> 
					<input type="number" v-model="merchantInfo.contactPhone" placeholder="请填写手机号码"/>
				</li>
				<li>
					<span class="lh18"><label>*</label>售后对接<br/>&nbsp;&nbsp;人</span>
					<input type="text" v-model="merchantInfo.afterSaleName" placeholder="请填写售后对接人姓名"/> 
				</li>
				<li>
					<span><label>*</label>售后电话</span>
					<input type="number" v-model="merchantInfo.afterSalePhone" placeholder="请填写手机号码 "/> 
				</li>
				<li>
					<span class="lh18"><label>*</label>有效经营<br/>&nbsp;&nbsp;面积</span>
					<input type="number" v-model="merchantInfo.operatingArea" placeholder="请填写有效经营面积 "/>
					<label>m²</label>
				</li>
				
				<li>
					<span><label>*</label>营业地址</span>
					<select v-model="merchantInfo.city">
						<option>北京市</option>
					</select>
					<select v-model="merchantInfo.county">
						<option name="" value="">--请选择--</option>
						<option v-for="op in options_districts" :value="op">{{op}}</option>
					</select>
				</li>
				<li>
					<span> </span>
					<textarea rows="4" v-model="merchantInfo.address"></textarea>
				</li>
				<li>
					<span><label>*</label>选择位置</span>
					<input type="button" :value="tishi" @click="getpostion"/> 
				</li>
				
				<li>
					<span>特色服务</span>
					<mt-checklist 
					v-model="merchantInfo.characteristic"
					:options="options">
					</mt-checklist>
					<!--<mt-checklist :options="options"></mt-checklist>-->
				</li>
			</ul>
		</div>
		<div class="chapter">
			<div class="orlack">设置让利</div>
			<ul>
				<li>
					<span><label>*</label>让利比例</span>
					<input type="number" v-model="merchantInfo.pietyRate" placeholder="请填写让利比例 "/>
					<label>%</label>
				</li>
			</ul> 
		</div>		
		<div class="chapter">
			<div class="orlack">照片上传</div>
			<ul>
				<li>
					<span><label>*</label>营业执照</span>
					<div class="list-uploader">
						<uploader :src="src" tips="1"  v-on:childByImgurl="childByImgurl"></uploader>
					</div>
					<div class="upread">
						上传营业执照照片，请保证照片清晰完整
						<br /><button @click="big">查看大图</button>
					</div>
				</li>
				<li>
					<span>门脸照</span>
					<div class="list-uploader">
						<uploader :src="src" tips="2"  v-on:childByImgurll="childByImgurll"></uploader>
					</div>
					<div class="upread">
						一张真实美观的门脸照可以提升商户形象(建议图片尺寸为15:7)
					</div>
				</li>
				<li>
					<span>门店logo</span>
					<div class="list-uploader">
						<uploader :src="src" tips="3"  v-on:childByImgurlll="childByImgurlll"></uploader>
					</div>
					<div class="upread">
						上传与店铺匹配的logo，提升用户对商户的认可度(建议图片尺寸为1:1)
					</div>
				</li>
	   
	 		</ul>
	 	</div>	
 		<!--<label>{{alert}}</label>-->
		<div style="padding: 0 15px;">
			<button type="primary" @click="cardnext()">下一步</button>
		</div>
		
		<div class="big" v-if="show" @click="close">
			<img :src="merchantInfo.licenseImgUrl"/>
		</div>
	</div>
</template>

<script>
	
	import { mapState } from 'vuex'
	import uploader from '@/components/uploader/components/uploader.vue'
	import { Toast } from 'mint-ui'
	import { get, post } from '@/server/index.js'
	import validation from '@/utils/validation.js' //validation.dd()

	export default {
		components: {
			uploader
		}, 
		data() {
			return {
				tishi:"点击选择地图的位置>",
				src: "http://47.94.193.144:8081/app/api/v1/merchants/image/upload",
				show: false,
				alert: '',
				bjhouse: '',
				optionsValue:"停车位",
				options: [
				  {
				    label: '停车位',
				    value: '停车位',
				  },
				  {
				    label: 'WiFi',
				    value: 'WiFi',
				  },
				  {
				    label: '24h营业',
				    value: '24h营业'
				  },
				  {
				    label: '提供外送',
				    value: '提供外送'
				  },
				  {
				    label: '代收快递',
				    value: '代收快递'
				  }
				],
				options_enterpriseTypes: null,
				options_merTypes: null,
				options_districts: null,
				form: {	
					merName:"" ,//商户名称
			        licenceNo:"" ,//社会信用代码
			        merType:"" ,//商户类型
			        enterpriseType:"" ,//企业类型
			        servicePhone:"" ,//服务电话
			        contactName:"" ,//商户联系人姓名
			        contactPhone:"" ,//商户联系人手机号
			        afterSaleName:"" ,//售后联系人
			        afterSalePhone:"" ,//售后联系人电话
			        city:"北京市" ,//市
			        county:"" ,//区县
			        street:"" ,//街道
			        community:"" ,//社区
			        address:"" ,//地址
			        addressLat: this.$route.query.lat||"" ,// 纬度
			        addressLng: this.$route.query.lng||"" ,// 经度
			        operatingArea:"" ,//经营面积
			        pietyRate:"" ,//敬老让利
			        characteristic:[] ,//商户特色
			        licenseImgUrl:"" ,// 企业营业执照图片地址
			        thumbnailImgUrl:"" ,//展示图
			        showImgUrl:"" ,//缩略图
			  	}
			}
		},
		computed: {
			...mapState({
				merchantInfo: state => state.merchant.merchant.merchantInfo
			})
		},
		created(){
			this.getMerchantsTypes()
		},
		mounted() {
			if(this.$route.query.tishi){
				this.tishi = this.$route.query.tishi
			}
		},
		components: {
			uploader
		},
		watch:{

		},
		methods: {
			big(){
				this.show = true;
			},
			close(){
				this.show = false;
			},
			pietyRateData1(value){
				console.log(value)
			},
//			pietyRateData(value) {
//				console.log(value)
//				if(value>100){
//					this.merchantInfo.pietyRateData = value.slice(0,1);
//				}
//			},
			childByImgurl(childValue) {
		       this.merchantInfo.licenseImgUrl = childValue;
	      	}, 
			childByImgurll(childValue) {
		       this.merchantInfo.thumbnailImgUrl = childValue;
	      	},
	      	childByImgurlll(childValue) {
		       this.merchantInfo.showImgUrl = childValue;
	      	},
			getMerchantsTypes(){
				let _this = this;
				get({ url: '/app/api/v1/merchants/types'}).then(data => {
					if (data.code === "000000") {
						_this.options_enterpriseTypes = data.data.enterpriseTypes;
						_this.options_merTypes = data.data.merTypes;
						_this.options_districts = data.data.districts;
					}else{
						Toast(data.desc)
					}
				}).catch(function (error) {
					console.log(error);
			  	});
			},
			getpostion() {
				if(this.merchantInfo.county==""||this.merchantInfo.address==""){ 
					Toast("未输入地址，不可以点击标记地图位置")
				}else{
					this.$router.push("/merchantPosition?id=4&name="+ this.merchantInfo.merName+"&address="+ this.merchantInfo.city + this.merchantInfo.county + this.merchantInfo.address )
				}
			},
			cardnext() {
				let _this = this;
// 				this.merchantInfo.pietyRate = this.merchantInfo.pietyRate.toFixed(2);
 				this.merchantInfo.addressLat = this.$route.query.lat; 
		        this.merchantInfo.addressLng = this.$route.query.lng; 
 				console.log(this.merchantInfo,1111111111 )
				if(this.merchantInfo.merName==""||this.merchantInfo.merName.length>20){
					Toast("请输入20字以内的商户名称")
					return false
				}else if(this.merchantInfo.licenceNo==""){
					Toast("请输入社会信用代码")
					return false
				}else if(this.merchantInfo.enterpriseType==""){
					Toast("请输入企业类型")
					return false
				}else if(this.merchantInfo.merType==""){
					Toast("请输入商户类型")
					return false
				}else if(this.merchantInfo.servicePhone==""){
					Toast("请输入服务电话")
					return false
				}else if(this.merchantInfo.contactName==""){ //到这里
					Toast("请输入售后对接人")
					return false
				}else if(this.merchantInfo.afterSaleName==""){
					Toast("请输入售后联系人")
					return false
				}else if(this.merchantInfo.contactPhone==""){
					Toast("请输入售后联系人电话")
					return false
				}else if(this.merchantInfo.afterSalePhone==""){
					Toast("请输入商户名称")
					return false
				}else if(this.merchantInfo.county==""){
					Toast("请选择区县")
					return false
				}else if(this.merchantInfo.address==""){
					Toast("请输入地址")
					return false
				}else if(this.merchantInfo.addressLat==""){
					Toast("请输入商户纬度")
					return false
				}else if(this.merchantInfo.addressLng==""){
					Toast("请输入商户经度")
					return false
				}else if(this.merchantInfo.operatingArea==""){
					Toast("请输入经营面积")
					return false
				}else if(this.merchantInfo.pietyRate==""){
					Toast("请输入让利比例")
					return false
				}else if(this.merchantInfo.pietyRate<0||this.merchantInfo.pietyRate>100){
					Toast("让利比例为0至100的数字，保留两位小数")
					return false
				}
				else if(this.merchantInfo.licenseImgUrl==""){
					Toast("请上传营业执照")
					return false
				}else {
					post({url: '/app/api/v1/merchants/regist', data: this.merchantInfo }).then(data => {
						if (data.code === "000000") {
	//						_this.getCard(_this.userInfo)
							this.$router.push("/merchantSuccess")
						}else{
							Toast(data.desc)
						}
					}).catch(function (error) {
						console.log(error);
				  	});
				}

			}
		}
	}
</script>

<style lang="scss">
	
	.list-uploader {
		/*flex: 1;*/
	    width: 80px;
	    height: 80px;
	    border: 1px solid #e5e5e5;
		.vue-uploader {
			height: 80px;
			width: 80px;
		}
	}
	.mint-checklist{
	    flex: 1;
		.mint-checklist-title {display: none;}
		.mint-checklist-label {
			padding: 0;
			margin: 0;
			width: 0;
		}
		.mint-cell{
		    width: 50%;
		    overflow: hidden;
		    display: inline-flex;
		    .mint-checkbox-core{
		    	position: absolute;
		    	top: 10px;
		    }
		    .mint-checkbox-label {
			    position: absolute;
			    left: 40px;
		        top: 3px;
		    }
     	}
		.mint-checkbox {
			font-size: 0;  
	     	margin-left: 0; 
	    	 margin-right: 0; 
 		} 
 		.mint-checkbox-core{
 			width: 20px !important;
 			height: 20px !important;
 			border-radius: 0;
 		}
	} 
</style>