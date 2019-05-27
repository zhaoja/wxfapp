<template>
	<div class="imgpage">
		<Header topName="敬请期待" />
		<div class="nofind">
			<img :src="fofpage" alt="" class="img-no">
			<div class="note1">敬请期待～</div>
			<!--<div class="note2">还需确定需求</div>-->
			<!--<div><button @click="reload()">刷新</button></div>-->		
		</div>
		
	</div>
</template>

<script>
	import fofpage from "@/assets/images/404.png"
	import Header from '@/components/Header1.vue'
	export default {
		
		components: {
			Header 
		},
		data(){
			return {
				fofpage
			}
		},
		methods:{
			reload(){
				window.location.reload()
			}
		}
	}
</script>

<style lang="scss">

</style>
