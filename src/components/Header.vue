<template>
	<div class="header">
		<div @click="back" v-if="topName!='资讯'">
		<!-- <i class="icon icon-back"></i> -->
		<img src="@/assets/images/leftx2.png" class="icon icon-back" alt="">
		</div>
		{{topName}}
	</div>
</template>

<script>
	export default {
		props:['topName','isselfback'],
		data() {
			return {
				
			};
		},
		methods:{
			back(){
				if(this.isselfback){
					this.$emit("back",null);
				}
				else{
					this.$router.back(-1)
				}
			}
		}
	}
</script>

<style>

</style>
 