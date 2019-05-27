<template>
	<div class="mine set">
		 <div class="longLines">
			<ul class="line2 mt-line">
				 <li v-for="item in form" >
				 	<!--<label>{{item.option}}</label>-->
					<input :type="item.type" :placeholder="item.value"  v-model.trim="item.param"  />
				</li>
			</ul>
		</div> 
		<div class="btn-div">
			<button class="submit2" @click="cardnext(userInfo,form)">确认</button>
		</div>
	</div>
  
</template>

<script>
	import { mapState } from 'vuex'
	import { guid } from '@/utils/utils.js'
	import { post } from '@/server/index.js'
	import validation from '@/utils/validation.js'
	import { MessageBox , Toast } from 'mint-ui';
	
	export default {
 
		computed: {
			...mapState({
				userInfo: state => state.user.user.userInfo
			})
		},
		data() {
			return {
				picnum:"",
				form :[]
			}
		},
		mounted() {
			this.form =[
				{option:'姓名',type:'input',value:'请输入被关联人姓名',param: "" },
				{option:'证件号',type:'input',value:'请输入被关联人证件号码',param: "" },
				{option:'养老助残卡号',type:'number',value:'请确被关联人养老助残卡号',param: "" }, 
			]
		},
		methods:{
			cardnext(user,params){
				let _this = this;
		 
				if (validation.ifName(params[0].param)!=true) {
					
					Toast(validation.ifName(params[0].param));
					
				} else if (validation.isCardID(params[1].param)!=true){
					
					Toast(validation.isCardID(params[1].param));
					
				}else if (validation.ifNum(params[2].param, "养老助残卡", 12)!=true){
					
					Toast(validation.ifNum(params[2].param, "养老助残卡", 12));
					
				}else {
					
					let data = {
						userName: params[0].param, 
						pensionIdCardNo: params[1].param, 
						pensionCardNo: params[2].param, 
						operatorId: user.operatorId,
						mobile: user.phoneNo
					};
					
					post({url: '/app/api/v1/pension/cards/bind', data: data}).then(data => {
						
						if (data.code === "000000") {
							
							_this.$router.push({path:"/relationResult",query:{status:1}})
	
						}else {
							
							_this.$router.push({path:"/relationResult",query:{status: 0, mes: data.desc}})
							
						}
					}).catch(function (error) {
						
						console.log(error);
						
				  	});
				}
			}
		}
	}
</script>

 