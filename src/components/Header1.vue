<template>
	<div class="header1">
		<div @click="goto()">
		<!-- <i class="icon icon-back"></i> -->
		<img src="@/assets/images/leftx2.png" class="icon icon-back" alt="">
		</div>
		{{topName}}
	</div>
</template>

<script>
	import { mapState } from "vuex";

	export default {
		props:['topName'],
		 
		computed: {
			...mapState({
				userInfo: state => state.user.user.userInfo
			}),
		},
		methods:{
			goto(){
				let routerPath = this.$route.path;
				
				switch(routerPath)
				{
					case "/setuser":
					case "/setpasswords":  
					case "/pensionCard":
					case "/bankCard":
					case "/setorderMes":
					case "/setorderMes":
						this.$router.push("/mine");
						break;
						
					case "/sethead":  //头像
					case "/realnameInfo":
						this.$router.push("/setuser");
						break;	
						
					case "/setPasswordsLogin":	//设置
					case "/setPasswordsTransaction":	
					case "/setRelatedAgreements":
						this.$router.push("/setpasswords");
						break;
						
					case "/setPasswordsTransactionUpdate":	 
					case "/setPasswordsTransactionForget":	 
						this.$router.push("/setPasswordsTransaction");
						break;
						
					case "/setPasswordsTransactionForgetUpdate":	 
						this.$router.push("/setPasswordsTransactionForget");
						break;
					
					case "/relationPensionCard":	//养老卡 
					case "/relievingRelation": 
					case "/relationResult": 
						this.$router.push("/pensionCard");
						break;	
						
//					case "/relationBankCard":	//银行卡  
					case "/relievingRelationBankCard":	
					case "/relationResultBankCard":	
						this.$router.push("/bankCard");
						break;	
				
					default:
						this.$router.back(-1);
				} 
				if(this.userInfo.ifrealname=="已实名" && routerPath=="/relationBankCard" ){
					this.$router.push("/bankCard")
				}  
			}
		}
	}
</script>