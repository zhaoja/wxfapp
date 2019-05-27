<template>
  <div id="app">
    <router-view class="centent"/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import "@/assets/scss/style.scss"; 

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.centent{
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	overflow: auto;
}
</style>
