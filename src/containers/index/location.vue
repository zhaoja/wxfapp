<template>
	<div class="location">
		<Header topName="商户位置"></Header>
	
		 
	<!-- 	<ul class="location-nav">
			<li v-for="(item,index) in btn" :class="{active:(indexs==index)}" @click="searchMap(index)" :key="index">{{item}}</li>
		</ul> -->
		<div id="container"><bmap @onSearchComplete="searchComplete" :lnglat="lnglat"></bmap></div>
		<div class="info">
			<p class="name">{{ locationinfo.name }}</p>
			<p class="address">{{ locationinfo.address }}</p>
			<p><a class="btn" @click="OpenApp">打开地图导航</a></p>
		</div>
 

	</div>
</template>
<script>
	import { mapState } from 'vuex'
	import { Http } from '@/server/index.js'
	import Header from "@/components/Header"
	import BMap from '@/components/BMap'
	import { isMobile } from "@/utils/browser"//判断是否在webview环境
	var mymap;
	export default {
		components:{
			Header,
			'bmap':BMap
		},
		data() {
			return {
				lnglat: [],
				poi:[],
				locationinfo:{name:"",address:""},
			}
		},
		created: function() {
			this.locationinfo.name=this.$route.query.name;
			this.locationinfo.address=this.$route.query.address;
			this.lnglat = [this.$route.query.lng,this.$route.query.lat];
			this.distance = this.$route.query.distance;
			this.poi=[sessionStorage.getItem("curPosition").split(",")[0],sessionStorage.getItem("curPosition").split(",")[1]];
		},
		methods: {
			//打开百度地图或百度地图app
			OpenApp() {
				let data = {
					code :0,
					message: "成功",
					data:{
						mypoiLat:this.poi[1]+"",
						mypoiLng:this.poi[0]+"",
						businesspoiLat:this.lnglat[1],
						businesspoiLng:this.lnglat[0],
						locationinfoName:this.locationinfo.name,
						locationinfoAddress:this.locationinfo.address
					}
				}
				if (isMobile) {
					dsBridge.call("openMap", data,function(res) {
						//成功
						if (res.code == "0") {
							//alert(res.data.data)
						} else {
							alert(res.message)
						}
					});
					return false;
				}
				let type = "";
				if(this.distance<1000){
					type = "walking";
				}else{
					type = "driving";
				}
				
				let url = "http://api.map.baidu.com/direction?origin=latlng:"+this.poi[1]+","+this.poi[0]+"|name:我的位置&destination="+this.lnglat[1]+","+this.lnglat[0]+"&mode="+type+"&region=北京&output=html&src=webapp.baidu.openAPIdemo";
				this.$router.push({path:"/linkpage",query:{url:url}});
				// window.location.href=url;
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