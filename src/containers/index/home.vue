<template>
	<!--<mt-loadmore :top-method="loadTop" @top-status-change="onTopStatusChange" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" topPullText="下拉重新定位" ref="loadmore">-->
	<div class="home">

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
					<input type="search" placeholder="请输入商家名称或地点" class="search-control" @focus="toSearch">
				</div>
				<a class="qr-btn" @click="scancode"><i class="icon-code"></i></a>
			</div>

			<mt-swipe :auto="4000" :showIndicators="swipeList.length>1">
				<mt-swipe-item v-for="(sl,index) in swipeList" :key="index">
					<a @click="openUrl(sl.toUrl)">
						<div class="mt-swipe-item-img" :style="{backgroundImage:'url('+sl.imageUrl+')'}"></div>
					</a>
				</mt-swipe-item>
			</mt-swipe>
		</section>
		<section class="paragraph">
			<div class="module">
				<ul>
					<li v-for="li in serve1_list" :key="li.icon">
						<!-- <router-link v-if="li.icon!='icon-m7'&&li.icon!='icon-m8'" :to="{path:'linkPage',name: '外部链接', query: {id:li.id}}"><i class="icon-m" :class="li.icon"></i><span>{{li.name}}</span></router-link> -->

						<router-link :to="{path:'/business',query:{type:li.id}}"><i class="icon-m" :class="li.icon"></i><span>{{li.name}}</span></router-link>
					</li>

				</ul>
			</div>
		</section>

		<section class="recommendlist">
			<div class="title">附近推荐</div>
			<div class="module">
				<ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
					<li v-for="li in merlist" :key="li.icon">
						<router-link :to="{path:'/location',query:{id: li.id,name:li.merName,address:li.address,lat:li.addressLat,lng:li.addressLng,distance:parseInt(li.distance)}}">
							<p><span class="name">{{ li.merName }}</span> <span class="pull-right">{{ li.distance | distance }}</span></p>
							<p><span class="icon icon-location"></span><span class="text">{{ !li.address ? '暂无商户定位信息' : li.address }}</span></p>
							<p v-if="li.pietyRate!=null&&li.oldAgeCardRate!=null"><span class="icon icon-info"></span><span class="text"
								 v-if="li.pietyRate!=null">商户让利{{ li.pietyRate }}%；</span><span class="text" v-if="li.oldAgeCardRate!=null">积分消费{{ li.oldAgeCardRate }}折</span><span
								 class="color-icon icon-orange" v-if="li.oldAgeCardRate!=null"></span><span class="color-icon icon-blue" v-if="li.pietyRate!=null"></span></p>
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
				serve1_list: [{
						name: '餐饮',
						icon: 'icon-m1',
						id:"01",
					},
					{
						name: '商超',
						icon: 'icon-m2',
						id:"02",
					},
					{
						name: '食品',
						icon: 'icon-m3',
						id:"03",
					},{
						name: '购物',
						icon: 'icon-m4',
						id:"04",
					},{
						name: '住宿',
						icon: 'icon-m5',
						id:"05",
					},
					
					{
						name: '健康',
						icon: 'icon-m6',
						id:"06",
					},
					{
						name: '保健',
						icon: 'icon-m7',
						id:"07"
					},
					{
						name: '美容',
						icon: 'icon-m8',
						id:"08"
					},
				],
				merlist: []
			};
		},
		filters: {
			distance(val) {
				let str = "";
				if (parseInt(val) > 1000) {
					str = (parseInt(val) / 1000).toFixed(2) + "km"
				} else {
					str = parseInt(val) + "m";
				}
				return str;
			}
		},
		mounted() {
			document.getElementsByClassName("centent")[0].addEventListener('scroll', this.handleScroll);
		},
		created() {
			this.init();
//			this.getPosition();
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
						_this.merlist = [];
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
			scancode() {
				if(!this.userInfo.operatorId){
					this.$router.push("/login");
					return false;
				}
				if (isMobile) {
					dsBridge.call("getQRCode", function(res) {
						alert(JSON.stringify(res));
						//成功
						if (res.code == "0") {
							alert(res.data.data)
						} else {
							alert(res.message)
						}
					});
					return false;
				}
				console.log(111)
				let jsondata={
					model:{
						appId:"",
						timestamp:"",
						nonceStr:"",
						signature:""
					}
				}
				wx.config({
					// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					debug: false,
					// 必填，公众号的唯一标识
					appId: jsondata.model.appId,
					// 必填，生成签名的时间戳
					timestamp: "" + jsondata.model.timestamp,
					// 必填，生成签名的随机串
					nonceStr: jsondata.model.nonceStr,
					// 必填，签名
					signature: jsondata.model.signature,
					// 必填，需要使用的JS接口列表，所有JS接口列表
					jsApiList: ['checkJsApi', 'scanQRCode']
				});
				wx.error(function(res) {
					alert("出错了：" + res.errMsg); //这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
				});
				wx.ready(function() {
					wx.checkJsApi({
						jsApiList: ['scanQRCode'],
						success: function(res) {

						}
					});
					wx.scanQRCode({
						needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
						scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
						success: function(res) {
							var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
							alert("扫描结果：" + result);
							//window.location.href = result;//因为我这边是扫描后有个链接，然后跳转到该页面
						}
					});

				});
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
						_this.merlist = _this.merlist.concat(data.data.list);
						_this.nomore = true;
						_this.loading = true;
					} else {
						_this.merlist = _this.merlist.concat(data.data.list);
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
				this.$router.push("/search");
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

</style>
