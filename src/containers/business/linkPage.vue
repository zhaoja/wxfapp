<template>
	<div class="location">
		<Header topName="地图导航"></Header>
		<div class="myiframe">
			<mt-spinner type="fading-circle" color="#fe4c40" :size="40" class="load" v-if="showspinner"></mt-spinner>
			<iframe :src="url" frameborder="0" width="100%" height="100%" @load="loadComplete"></iframe>
		</div>
	</div>
</template>
<script>
	import Header from "@/components/Header"
	var mymap;
	export default {
		components:{
			Header
		},
		data() {
			return {
				url:"",
				showspinner:true
			}
		},
		created: function() {
			this.url = this.$route.query.url;
		},
		methods: {
			loadComplete(){
				this.showspinner = false;
			}
		}

	}
</script>

<style lang="scss">
.myiframe{
	width: 100vw;
	height:calc(100% - 45px);
	margin-top:45px;
	iframe:{
		width:100%;
		height:100%;
	}
	.fis_elm_pager__qk_5{
		display: none;
	}
	.load{
		display: block;
		text-align: center;
		position:absolute;
		top:50%;
		left:50%;
		transform: translate(-50%,-50%);
		.mint-spinner-fading-circle{
			margin:0 auto;
		}
	}
}
</style>