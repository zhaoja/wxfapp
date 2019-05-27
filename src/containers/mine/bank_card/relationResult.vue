<template>
	<div>
		 
		<div v-if="$route.query.status">
			成功！
		</div>
		<div v-if="!$route.query.status">
			失败
		</div>
	</div>
</template>

<script>
</script>

<style>
</style>