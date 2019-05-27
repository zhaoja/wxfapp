<template>
	<div class="result" style="padding-top: 65px;">
		<div>
			<img :src="pic1"/>
			<h2>登记成功！</h2>
			<div class="note0" style="font-size: 14px;width: 320px;">
				尊敬的商户，您的自助登记已经完成。预计在24小时内审核完成，并短信通知您审核结果。
			</div>
			<router-link to="pensionCard">返回首页</router-link>
		</div>
	</div>
</template>

<script>
	import pic1 from '@/assets/images/mer/ss@2x.png'
	
	export default { 
		data() {  
			return {    // action sheet 选项内容
				pic1: pic1,
			  
			} 
		},
	}
</script>
 