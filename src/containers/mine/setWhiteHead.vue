<template>
	<div>
		<Header :topName="$route.name" />
		<router-view/>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import Header from '../../components/Header1.vue'
	
	export default {
		components:{
			Header
		}
	}
</script>

<style lang="scss">

</style>
