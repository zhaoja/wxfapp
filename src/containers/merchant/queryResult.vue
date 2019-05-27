<template>
	<div class="qresult">
		<div class="detail">
	 		<div class="detail-title"><img :src="pic1" alt="" />商户信息</div>
 			<ul>
 				<li><span>商户名称 </span><span>{{merchantInfo.merName}}</span> </li>
				<li><span>社会信用代码 </span><span>{{merchantInfo.licenceNo}} </span>  </li>
				<li><span>企业类型 </span><span>{{merchantInfo.enterpriseType}} </span>  </li>
				<li><span>商户类型</span><span>{{merchantInfo.merType}} </span>   </li>  
				<li><span>服务电话</span><span>{{merchantInfo.servicePhone}}</span>    </li>
				
				<li><span>联系人</span><span>{{merchantInfo.contactName}} </span>   </li>
				<li><span>联系人电话</span><span>{{merchantInfo.contactPhone}}</span>    </li>
				
				<li><span>售后对接人</span><span>{{merchantInfo.afterSaleName}}</span>   </li>
				<li><span>售后电话</span><span>{{merchantInfo.afterSalePhone}}</span>   </li>
				<li><span>有效经营面积</span><span>{{merchantInfo.operatingArea}}</span>   </li>
				<li><span>营业地址</span><div>{{merchantInfo.city}} {{merchantInfo.county}} {{merchantInfo.address}}</div>   </li>
				<li><span>让利比例</span><span>{{merchantInfo.pietyRate }}</span> </li> 
 			</ul>
		</div> 
		<div class="detail">
		 	<div class="detail-inner">
		 		<div class="detail-title"><img :src="pic2" alt="" />审核结果</div>
		 		<div class="detail-container" style="padding-bottom: 25px;">
		 			<img :src="shz"/>
		 			<div :class="sh">
		 				{{merchantInfo.auditStatusName}}
		 			</div>
		 			<p>
		 				{{mes}}{{merchantInfo.flow}}
		 			</p>
		 			<button @click="action" v-if="btnMes">{{btnMes}}</button>
		 		</div>
		 	</div>
		</div> 
	</div> 
</template>

<script>
	import pic1 from '@/assets/images/mer/sh2@2x.png'
	import pic2 from '@/assets/images/mer/sh@2x.png'
	
	import shz1 from '@/assets/images/mer/shz1@2x.png'
	import shz2 from '@/assets/images/mer/shz2@2x.png'
	import shz3 from '@/assets/images/mer/shz3@2x.png'
	
	import { mapState } from 'vuex'

	export default {
		 
		data() {
			return {
				pic1,
				pic2,
				shz: "",
				sh: "",
				mes: "",
				btnMes:"",
			}
		},
	 	computed: {
			...mapState({
				merchantInfo: state => state.merchant.merchant.merchantInfo
			}),
		},
		mounted() {
			
			if(this.merchantInfo.auditStatus =="UNAUDIT"){
				//待审核
				this.sh = "sh1";
				this.shz = shz1;
				this.mes = "";
				this.btnMes = "";
			}else if(this.merchantInfo.auditStatus =="PASS"){
				//通过
				this.sh = "sh2";
				this.shz = shz2;
				this.mes = "";
				this.btnMes = "前往下载合同";
			}else if(this.merchantInfo.auditStatus =="REJECT"){
				//拒绝
				this.sh = "sh3";
				this.shz = shz3;
				this.mes = "";
				this.btnMes = "重新登记";
			}else {
				//删除 REMOVE
				this.sh = "sh3";
				this.shz = shz3;
				this.mes = "";
				this.btnMes = "";
			}
		},
		methods: {
			action(){
				this.$router.push("/merchantRegister");
			}
//			openWindow: function() {
//				this.addFormVisible = true;
//			},
//			//获取文档内容
//			getContent: function() {
//				let content = this.$refs.ueditor.getUEContent();
//				console.log(content);
//				alert(content);
//			}
		}
	}
</script>

<style lang="less">
	.phoneDetail {
		.btns {
			text-align: center;
			margin-top: 10px;
		}
	}
</style>