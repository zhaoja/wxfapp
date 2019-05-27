<template>
	<div class="business">
		<Header topName="商户列表" isselfback="true" @back="back"></Header>
		<section class="filter" ref="filter" @click="closeFilter($event)">
			<ul class="drop-down-menu" ref="dropdownmenu">
				<li @click="dropdown(0)">全部商户<i class="triangle"></i></li>
				<li @click="dropdown(1)">{{ searchRule.sortRule == 'DISTANCE' ? '距离优先' : searchRule.sortRule == 'DISCOUNT' ? '折扣优先' :'让利优先'}}<i class="triangle"></i></li>
			</ul>
			<div class="drop-down-list" ref="dropdownlist">
				<ul>
					<li :class="{active:type==''}" @click="changeType('')">全部商户</li>
					<li :class="{active:type=='01'}" @click="changeType('01')">餐饮</li>
					<li :class="{active:type=='02'}" @click="changeType('02')">商超</li>
					<li :class="{active:type=='03'}" @click="changeType('03')">食品</li>
					<li :class="{active:type=='04'}" @click="changeType('04')">购物</li>
					<li :class="{active:type=='05'}" @click="changeType('05')">住宿</li>
					<li :class="{active:type=='06'}" @click="changeType('06')">健康</li>
					<li :class="{active:type=='07'}" @click="changeType('07')">保健</li>
					<li :class="{active:type=='08'}" @click="changeType('08')">美容</li>
				</ul>
				<ul>
					<li @click="changeSort('DISTANCE')" :class="{active:searchRule.sortRule=='DISTANCE'}" >距离优先</li>
					<li @click="changeSort('DISCOUNT')" :class="{active:searchRule.sortRule=='DISCOUNT'}">折扣优先</li>
					<li @click="changeSort('BENEFIT')" :class="{active:searchRule.sortRule=='BENEFIT'}">让利优先</li>
				</ul>
			</div>
		</section>
		<section class="recommendlist">
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
				<p class="loading-tip" v-if="nomore && merlist.length>10">没有更多了~</p>
				<div class="no" v-if="merlist.length == 0 && nomore">
					<img src="../../assets/images/search-404.png" alt="" class="img-no">
					<p>没有找到您想要的结果~</p>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
	import Header from "@/components/Header";
	import Vue from "vue";
	import {post, get} from '@/server/index.js';
	import myutils,{guid} from '@/utils/utils.js';
	import { Toast,InfiniteScroll } from 'mint-ui';
	Vue.use(InfiniteScroll);
	export default {
	
		components: {
			Header
		},
		data() {
			return {
				type:"",
				loading:false,
				nomore:false,
				searchRule:{
					pageNum:0,
					pageSize:10,
					sortRule:"DISTANCE"
				},
				merlist:[]
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
		mounted(){
			this.type = this.$route.query.type;
			this.getMerchants();
		},
		methods:{
			back(){
				this.$router.push("/index");
			},
			loadMore(){
				this.getMerchants();
			},
			getMerchants(){
				this.loading = true;
				this.searchRule.pageNum++;
				let _this = this;
				let param = {
					merchantType :_this.type,
					keyword :"",
					pageNum :_this.searchRule.pageNum,
					pageSize :_this.searchRule.pageSize,
					sort :_this.searchRule.sortRule,
					lng :"",
					lat :""
				}
				console.log(param,"商户列表")
				param.lng = sessionStorage.getItem("curPosition").split(",")[0];
				param.lat = sessionStorage.getItem("curPosition").split(",")[1];
				setTimeout(function(){
					get({url: '/app/api/v1/merchants', data: param}).then(data => {
						if(data.code == "000000"){
							if(_this.searchRule.pageNum >= data.data.pages){
								_this.merlist = _this.merlist.concat(data.data.list);
								_this.nomore = true;
								_this.loading = true;
							}else{
								_this.merlist = _this.merlist.concat(data.data.list);
								_this.loading = false;
							}
							console.log(data)
						}else{
							Toast(data.desc)
						}
					}).catch(function (error) {
						console.log(error,"请求失败");
					});
				},1500)
			},
			changeType(t){
				this.type = t;
				
				this.$router.push({path:"/business",query:{type:t}});
				this.dropdown(0);
				this.merlist=[];
				this.searchRule.pageNum = 0;
				this.nomore = false;
				this.getMerchants();
			},
			changeSort(t){
				this.searchRule.sortRule = t;
				this.dropdown(1);
				this.merlist=[];
				this.nomore = false;
				this.searchRule.pageNum = 0;
				this.getMerchants();
			},
			closeFilter(e){
				let menus = this.$refs.dropdownmenu.children;
				let lists = this.$refs.dropdownlist.children;
				if(e.target == this.$refs.filter){
					this.$refs.filter.classList.remove("active");
					for(let i =0;i<menus.length;i++){
						menus[i].classList.remove("active");
					}
					for(let j =0;j<lists.length;j++){
						lists[j].classList.remove("active");
					}
					menus[0].classList.remove('active');
					lists[0].classList.remove('active');
					menus[1].classList.remove('active');
					lists[1].classList.remove('active');
				}
			},
			dropdown(type){ 
				let menus = this.$refs.dropdownmenu.children;
				let lists = this.$refs.dropdownlist.children;

				
				if(menus[type].classList.length>0){
					this.$refs.filter.classList.remove("active");
					for(let i =0;i<menus.length;i++){
						menus[i].classList.remove("active");
					}
					for(let j =0;j<lists.length;j++){
						lists[j].classList.remove("active");
					}
					menus[type].classList.remove('active');
					lists[type].classList.remove('active');
				}else{
					this.$refs.filter.classList.add("active");
					for(let i =0;i<menus.length;i++){
						menus[i].classList.remove("active");
					}
					for(let j =0;j<lists.length;j++){
						lists[j].classList.remove("active");
					}
					menus[type].classList.add('active');
					lists[type].classList.add('active');
				}
			}
		}
	}
</script>
