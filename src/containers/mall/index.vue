<template>
	<mt-loadmore :top-method="loadTop" @top-status-change="onTopStatusChange" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" topPullText="下拉重新定位" ref="loadmore">
	<div class="mall">

		<!--<a href='doScan' style='margin:10px;   
		 position: absolute;
    z-index: 10;
    right: 0;
    top: 20px;'>扫一扫</a>-->
		<div id="result" style=" "></div>
		
		<section class="broadcast">
			<div :class="isBgClass?'home-header bg-white':'home-header'" ref="homeheader">
				<div class="search-box">
					<i class="icon icon-search"></i>
					<input type="search" placeholder="请输入商品名称" class="search-control" @focus="toSearch">
				</div>
			</div>

			<mt-swipe :auto="4000" :showIndicators="swipeList.length>1">
				<mt-swipe-item v-for="(sl,index) in swipeList" :key="index">
					<a @click="openUrl(sl.toUrl)">
						<div class="mt-swipe-item-img" :style="{backgroundImage:'url('+sl.imageUrl+')'}"></div>
					</a>
				</mt-swipe-item>
			</mt-swipe>
		</section>
		<section class="recommendlist">
			<div class="title">精选推荐</div>
			<div class="module">
				<ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
					<li v-for="li in productlist" :key="li.icon" class="sellout">
						<router-link :to="{path:'/location',query:{id: li.id,name:li.merName,address:li.address,lat:li.addressLat,lng:li.addressLng,distance:parseInt(li.distance)}}">
							<p><img src="https://zw-quantum-pic.oss-cn-beijing.aliyuncs.com/online/html/1.png" alt=""></p>
							<p><span class="name">中粮集团 柴火大院 五常有机大米 5kg</span></p>
							<p><span class="new_price">￥120.00</span><span class="old_price">￥120.00</span></p>
						</router-link>
						<!--<router-link :to="{path:'linkPage',name: '外部链接', query: { url: li.url, name:li.name}}"><i class="icon-m" :class="li.icon"></i><span>{{li.name}}</span></router-link>-->
					</li>
				</ul>
				<p v-if="!nomore" class="loading-tip">
					<mt-spinner color="rgba(0,0,0,0.5)" type="fading-circle"></mt-spinner>
				</p>
				<p class="loading-tip" v-if="nomore">没有更多了哦~</p>
			</div>
		</section>
		
	</div>
	</mt-loadmore>
</template>

<script>
	import Img from "@/assets/images/person.png"
	import wx from 'weixin-js-sdk'
	import dsBridge from "dsbridge"
	import Vue from "vue";
	import { mapState } from "vuex";
	import { post,get } from '@/server/index.js';
	import { isMobile } from "@/utils/browser";
	import { Toast, InfiniteScroll , Loadmore} from 'mint-ui';
	Vue.use(InfiniteScroll);

	export default {
		computed: {
			...mapState({
				userInfo: state => state.user.user.userInfo
			}),
		},
		components: {
			
		},
		data() {
			return {
				isBgClass: false,
				searchPanelVisible: false,
				swipeList: [],
				loading: false,
				nomore: false,
				searchRule: {
					pageNum: 0,
					pageSize: 10,
				},
				allLoaded:true,
				productlist: []
			};
		},
		filters: {
		},
		mounted() {
			document.getElementsByClassName("centent")[0].addEventListener('scroll', this.handleScroll);
		},
		created() {
			this.init();
// 			this.getPosition();
		},
		methods: {
			loadTop(){
				let _this = this;
				setTimeout(()=>{
					_this.$refs.homeheader.classList.add("bottom");
					var geolocation = new BMap.Geolocation();
					geolocation.getCurrentPosition(function(r) {
						if (this.getStatus() == BMAP_STATUS_SUCCESS) {
							Toast("当前城市为："+r.address.city);
							sessionStorage.setItem("curPosition", r.point.lng + "," + r.point.lat);
						} else {
							sessionStorage.setItem("curPosition", 0 + "," + 0);
							Toast("定位失败")
						}
						
						_this.$refs.loadmore.onTopLoaded();
						_this.searchRule.pageNum = 0;
						_this.productlist = [];
						_this.getMerchants();
					},{
						timeout : 3000,
						enableHighAccuracy : true,
						maximumAge : 0,
						SDKLocation:true
					});
				},1000)
				
			},
			onTopStatusChange(status){
				this.$refs.homeheader.classList.add("bottom");
			},
			loadBottom(){
			},
			getPosition() {
				
				let _this = this;
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(r) {
					if (this.getStatus() == BMAP_STATUS_SUCCESS) {
						sessionStorage.setItem("curPosition", r.point.lng + "," + r.point.lat);
						if (sessionStorage.getItem("curPosition") != null && sessionStorage.getItem("curPosition") != undefined) {
							return false;
						}
						Toast("当前城市为："+r.address.city);
					} else {
						sessionStorage.setItem("curPosition", 0 + "," + 0);
						if (sessionStorage.getItem("curPosition") != null && sessionStorage.getItem("curPosition") != undefined) {
							return false;
						}
						Toast("定位失败")
					}
					
				},function(error) {
					let error_msg = "";
					switch (error.code) {
						case error.PERMISSION_DENIED:
							error_msg = "没有定位权限"
							break;
						case error.POSITION_UNAVAILABLE:
							error_msg = "位置信息是不可用,"
							break;
						case error.TIMEOUT:
							error_msg = "请求定位超时，"
							break;
						case error.UNKNOWN_ERROR:
							error_msg = "未知错误，"
							break;
						default :
							break;
					}
				}, {
					timeout : 3000,
					enableHighAccuracy : true,
					maximumAge : 0,
					SDKLocation:true
				});
			},
			openUrl(u) {
				let url = u;
				if (url.indexOf("http://") == -1) {
					url = "http://" + url;
				}
				window.location.href = url;
			},
			init() {
				let _this = this;
				let param = {}
				get({
					url: '/app/api/v1/lamps',
					data: param
				}).then(data => {
					if (data.code == "000000") {
						_this.swipeList = _this.swipeList.concat(data.data);
					} else {
						Toast(data.desc);
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			loadMore() {
				if (sessionStorage.getItem("curPosition") != null && sessionStorage.getItem("curPosition") != undefined) {
					this.getMerchants();
				}
			},
			getMerchants() {
				let _this = this;
				_this.loading = true;
				_this.searchRule.pageNum++;
				let param = {
					range:5000,
					merchantType: "",
					keyword: "",
					pageNum: _this.searchRule.pageNum,
					pageSize: _this.searchRule.pageSize,
					sort: "BENEFIT",
					lng: "",
					lat: ""
				}
				if(sessionStorage.getItem("curPosition") != null && sessionStorage.getItem("curPosition") != undefined){
					param.lng = sessionStorage.getItem("curPosition").split(",")[0];
					param.lat = sessionStorage.getItem("curPosition").split(",")[1];
				}else{
					param.lng = 0;
					param.lat = 0;
				}
				get({
					url: '/app/api/v1/merchants',
					data: param
				}).then(data => {
					if (_this.searchRule.pageNum >= data.data.pages) {
						_this.productlist = _this.productlist.concat(data.data.list);
						_this.nomore = true;
						_this.loading = true;
					} else {
						_this.productlist = _this.productlist.concat(data.data.list);
						_this.loading = false;
					}
				}).catch(function(error) {
					console.log(error, "请求失败");
				});
			},
			handleScroll(e) {
				this.isBgClass = e.target.scrollTop > 45;
			},
			toSearch() {
				this.$router.push("/mallsearch");
				// this.searchPanelVisible = true;
			},
			distoryScroll() {
				document.getElementsByClassName("centent")[0].removeEventListener('scroll', () => {});
			}
		},
		beforeDestroy() {
			console.log(document)
			this.distoryScroll();

		}
	}
</script>
<style lang="scss" scoped>
.mall{
	
}
</style>
