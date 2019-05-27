<template>
	<div class="map">
		<div id="mapcontainer"></div>
		<div class="Geo" @click="getGeolocation"><i class="icon icon-poi"></i></div>
	</div>
</template>

<script>
import busPoiIcon from '../assets/images/map/buspoi.png';
import myPoiIcon from '../assets/images/map/mypoi.png';
export default {
	props:["height","lnglat"],
	data(){
		return {
			map:null,
			marker:null,
			local:null
		}
	},
	mounted(){
		this.init();
		console.log(this.lnglat)
		//this.loadBMapScript();
		window['bMapInit'] = () => {
			this.init();
		};
		window['searchComplete'] = (data) => {
			this.searchOk(data);
		};
	},
	methods: {
		removeScript() {
			var scripts = document.body.getElementsByTagName("script");
			for (var i = 0; i < scripts.length; i++) {
				if (scripts[i] && scripts[i].src && scripts[i].src.indexOf(src) != -1) {
					scripts[i].parentNode.removeChild(scripts[i]);
				}
			}
		},
		loadBMapScript() {
			let script = document.createElement('script');
			script.src = 'http://api.map.baidu.com/api?v=3.0&ak=D9b45bc6f98deafc489e9ac1bc7f7612&callback=bMapInit';
			document.body.appendChild(script);
		},
		init() {
			let _this = this;
			this.map = new BMap.Map("mapcontainer",{enableMapClick:true});
			this.map.centerAndZoom(new BMap.Point(..._this.lnglat),20);  // 初始化地图,设置中心点坐标和地图级别
 	        let myIcon = new BMap.Icon(busPoiIcon,new BMap.Size(19,25));
			let markerSeller = new BMap.Marker(new BMap.Point(..._this.lnglat),{icon:myIcon});
			this.map.addOverlay(markerSeller);         
			this.map.panTo(new BMap.Point(..._this.lnglat));
			 
			//this.map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
			this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
			

			
			this.initGeolocation();
		},
		initGeolocation(){
			let _this = this;
			var geolocation = new BMap.Geolocation();
			geolocation.getCurrentPosition(function(r){
				if(this.getStatus() == BMAP_STATUS_SUCCESS){
					sessionStorage.setItem("curPosition", r.point.lng + "," + r.point.lat);
					_this.marker = new BMap.Marker(r.point);
					_this.map.addOverlay(_this.marker); 
					//_this.map.panTo(r.point)
				}
				else {
					 
				}        
			});
		},
		getGeolocation(){
			let _this = this;
			var geolocation = new BMap.Geolocation();
			geolocation.getCurrentPosition(function(r){
				if(this.getStatus() == BMAP_STATUS_SUCCESS){
					sessionStorage.setItem("curPosition", r.point.lng + "," + r.point.lat);
					_this.marker.setPosition(r.point);
					_this.map.panTo(r.point)
				}
				else {
					 
				}        
			});
		}
	},
	beforeDestroy(){
		this.map = null;
	}
}
</script>

<style>
.map{
	position: relative;
	width:100%;
	height:100%;
}
#mapcontainer{
	width:100%;
	height:100%;
}
.Geo{
	width: 35px;
	height: 35px;
	position: absolute;
	bottom: 40px;
	left: 20px;
	z-index: 9999;
	box-shadow: 0 0 4px 0 rgba(0,0,0,0.30);
	border-radius: 5px;
	background-color:#fff;
}
.Geo .icon{
	display: block;
	width: 20px;
	height: 20px;
	margin:7.5px;
	background-size: 198px 198px;
	background-position:-35px -173px;
}
.BMap_Marker BMap_noprint{
	background-size:contain;
}
.anchorBL{
	display:none;
}
</style>
