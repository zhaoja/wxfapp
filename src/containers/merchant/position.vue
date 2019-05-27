<template>
	<div class="location">
		<div id="container"><bmap @onSearchComplete="searchComplete" :value="value"  v-on:childlntValue="childlntValue"></bmap></div>
		<div class="info">
			<p class="name">{{ locationinfo.name }}</p>
			<p class="address">{{ locationinfo.address }}</p>
			<p><a class="btn" @click="sure">确认定位</a></p>
		</div>
	</div>
</template>
<script>
	import { Http } from '@/server/index.js'
	import Header from "@/components/Header"
	import BMap from '@/components/BMap2'
	import { isMobile } from "@/utils/browser"//判断是否在webview环境
	var mymap;
	export default {
		components:{
			Header, 'bmap':BMap
		},
		data() {
			return {
				value:"",
				locationinfo:{name:"",address:""},
				postion: []
			}
		},
		created: function() {
			this.locationinfo.name=this.$route.query.name;
			this.locationinfo.address=this.$route.query.address;
			this.value = this.$route.query.name+this.$route.query.address;
		},
		methods: {
			//打开百度地图或百度地图app
			childlntValue(lnt) {
				this.postion = lnt 
				console.log(this.postion)
			},
			sure() {
 				this.$router.push("/merchantRegister?lng=" + this.postion[0] + "&&lat=" + this.postion[1]+ "&&tishi=已选择地图坐标")
			},
			searchComplete(data){
				console.log(data);
			}
		}

	}
</script>

<style lang="scss">
	#dragImg {
	    background: whitesmoke;
	    text-align: center;
	    border-top: 0.026667rem solid #d9d9d9;
	    border-bottom: 0.026667rem solid #d9d9d9;
	    padding: 0.16rem 0;
	    /*position: fixed;
	    width: 100%;
	    z-index: 100;*/
	}
	.noteMgs{
		color: #cccccc;
	    text-align: center;
	    line-height: 40px;
	    font-size: 18px;
	}
	.amap-controls {
		margin-top: 80px;
	}
	
	.amap-copyright,
	.amap-call,
	.amap-logo,
	.amap-zoomcontrol {
		display: none !important;
	}
	
	.amap-info-close {
		right: -2px !important;
		top: -7px;
		background: #fff;
		display: inline-block;
		width: 22px;
		height: 22px;
		border-radius: 22px;
		font-size: 18px !important;
		text-align: center;
		line-height: 19px;
		box-shadow: 2px -1px 9px #928e8e;
	}
	
	.location {
		height: 100%;
		position: absolute;
		width: 100%;
		overflow: hidden;
	}
	
	.is-top {
		transition: top 0.5s;
		top: 65px;
		height: 100%;
	}
	
	.is-middle {
		transition: top 0.5s;
		top: 80%;
		height: 100%;
	}
	
	.is-bottom {
		transition: top 0.5s;
		top: 100%;
		height: 100%;
	}
	#panel {
		/*列表*/
	     .plan {
	         padding: 0 15px;
	     }
	     .amap-lib-transfer span.line .beforespan {
	         left: -24px !important;
	     }
	     .amap-lib-transfer span.subwayline {
	         margin-left: 20px !important;
	     }
	     .amap-lib-transfer span.busline {
	         margin-left: 22px;
	     }
	     /*路线*/
	    .amap-lib-transfer .planTitle h3,.amap-lib-transfer .planTitle p{
	    	padding-left: 15px;
	    }
	    .amap-lib-transfer span.subwayline,.amap-lib-transfer span.busline{
	    	margin-right:20px;
	    }
	    .amap-lib-transfer .planTitle h3 span .afterspan{
	    	right: -12px;
	    }
	    .amap-lib-walking, .amap-lib-transfer{
	    	border: 0;
	    }
	 }
	/*.amap-controls{
 		.amap-touch-toolbar .amap-geo{
			width: 51px !important;
		    height: 52px !important;
		    border: 1px solid #ccc !important;
		    border-radius: 3px !important;
		    right: 4px !important;
		    left: 5px !important;
		    top: 0px !important;
		    background-size: 100% !important;	
		}
		.amap-toolbar-geo-secc{
			background:#fff url('src/assets/images/map/clear2.png') no-repeat !important;
	
		}
		.amap-locate-loading{
		    background:#fff url('src/assets/images/map/clear1.png') no-repeat !important;
		    background-size: 100% !important;
		}
		.amap-touch-toolbar .amap-geo {
		    background:#fff url('src/assets/images/map/clear3.png')no-repeat;
		}
 	}*/
</style>