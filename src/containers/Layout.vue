<template>
	<div>
		<router-view/>
		<Navigation></Navigation>  
	</div>
</template>

<script>
	import Navigation from '../components/Navigation.vue'
	
	export default {
		
		components: {
			Navigation
		}
	}
 
</script>

<style lang="scss">
	
</style>
