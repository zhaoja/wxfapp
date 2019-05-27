<template>
	<div class="imgpage">
		<Header topName="page—404" />
		<div class="nofind1">
			<img src="../assets/images/404.jpg" alt="" class="img111">
			<div class="note11">猴急什么呀？</div>
			<div class="note22">还没有这个页面还没设计呢～</div>
		</div>
	</div>
</template>

<script>
	import Header from '@/components/Header1.vue'

	export default {
		data() {
			return {
				
			};
		},
		components: {
			Header 
		},
		methods:{
			reload(){
				window.location.reload()
			}
		}
	}
</script>

<style scoped="scoped">
.nofind1{
	padding-top: 30px !important;
}
.img111{
	width: 300px; 
	margin-top: 30px;
}
.note11{
	margin-top: 30px;
	font-size: 16px;
}
.note22{font-size: 14px;margin-top: 10px;}
</style>
