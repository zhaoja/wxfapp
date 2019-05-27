<template>
	<div class="header header2">
		<div @click="goto()">
		<i class="icon icon-back"></i>
		</div>
		{{topName}}
	</div>
</template>

<script>
	export default {
		props:['topName'],
		data() {
			return {
				
			};
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
						
					case "/relationBankCard":	//银行卡 
					case "/relievingRelationBankCard":	
					case "/relationResultBankCard":	
						this.$router.push("/bankCard");
						break;	
				
					default:
						this.$router.back(-1);
				} 
				
			}
		}
	
	}
</script>

<style>

</style>
 