<template>
	<div class="result">
		<div v-if="$route.query.status==1">
			<img :src="pic1"/>
			<h2>关联成功！</h2>
			<div class="note0">您在合作商户消费的让利，将以积分的形式发放到关联的养老助残卡账户</div>
			<router-link to="pensionCard">确定</router-link>
		</div>
		<div v-if="$route.query.status==0">
			<img :src="pic2"/>
			<h2>关联失败！</h2>
			<div class="note0">失败原因：{{$route.query.mes}}</div>
			<router-link to="pensionCard">确定</router-link>
		</div>
	</div>
</template>

<script>
	import pic1 from '@/assets/images/oldcard/ss@2x.png'
	import pic2 from '@/assets/images/oldcard/mine3@2x.png'
	
	export default { 
		data() {  
			return {    // action sheet 选项内容
				pic1: pic1,
				pic2: pic2,
			  
			} 
		},
	}
</script>
 