<template>
	<div class="home-search">
		<div class="search-header">
			<img src="@/assets/images/leftx2.png" class="icon icon-back" alt=""  @click="back">
			<input v-model.trim="searchValue" placeholder="请输入关键字" type="search" maxlength="20" autofocus="autofocus" @focus="onFocus" @search="search"/>
			<button @click="search()">搜索</button>
		</div>
		<div class="history" v-if="history.length>0 && !loading && !isRequestComplete">
			<p class="title"><span>历史记录</span> <span class="icon icon-delete" @click="remove">删除</span></p>
			<ul><li v-for="item in history" @click="research(item)">{{ item }}</li></ul>
		</div>
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
				<p v-if="loading && !isRequestComplete" class="loading-tip">
				  <mt-spinner color="rgba(0,0,0,0.5)" type="fading-circle"></mt-spinner>
				</p>
				<p class="loading-tip" v-if="!loading && nomore && isRequestComplete && merlist.length>10">已经到底了~</p>
			</div>
		</section>
		<div class="no" v-if="merlist.length == 0 && isRequestComplete">
			<img src="../../assets/images/search-404.png" alt="" class="img-no">
			<p>没有找到您想要的结果~</p>
		</div>
	</div>
</template>

<script>
	import Vue from "vue";
	import {post, get} from '@/server/index.js';
	import myutils,{guid} from '@/utils/utils.js';
	import { Toast,InfiniteScroll } from 'mint-ui';
	Vue.use(InfiniteScroll);
	export default{
		data(){
			return {
				searchValue:"",
				isRequestComplete:false,//是否请求完成
				isClick:false,//是否点击搜索
				loading:false,//是否加载
				nomore:false,//没有更多
				searchRule:{
					pageNum:0,
					pageSize:10,
					sortRule:"DISTANCE"
				},
				merlist:[],
				history:[]
			}
		},
		created(){
			let data = localStorage.getItem("searchdata");
			if(data != null){
				this.history = data.split(",").slice(0,15);
			}else{
				this.history = [];
			}
		
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
		methods:{
			search(){
				let _this = this;
				if(_this.searchValue!=""){
					_this.history.map((item,index)=>{
						if(item == _this.searchValue){
							_this.history.splice(index,1);
						}
					})
					_this.history.unshift(_this.searchValue);
					_this.isClick = true;
					localStorage.setItem("searchdata",_this.history.join());
					_this.getMerchants();
					
				}else{
					Toast("搜索内容不能为空");
				}
			},
			research(item){
				this.searchValue = item;
				this.search();
			},
			onInput(){
				let _this = this;
				if(_this.searchValue!=""){
					_this.getMerchants();
				}
			},
			loadMore(){
				this.getMerchants();
			},
			getMerchants(){
				if(!this.isClick){
					return false;
				}
				this.loading = true;
				this.searchRule.pageNum++;
				
				let _this = this;
				let param = {
					merchantType :"",
					keyword :_this.searchValue,
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
								_this.loading = false;
								_this.isClick = false;
							}else{
								_this.merlist = _this.merlist.concat(data.data.list);
								_this.loading = true;
								_this.isClick = true;
							}
							if(data.data.list.length == 0){
								_this.nomore = false;
							}
							_this.isRequestComplete = true;
							console.log(data)
						}else{
							Toast(data.desc)
						}
					}).catch(function (error) {
						console.log(error,"请求失败");
					});
				},1500)
			},
			onFocus(){
				this.isRequestComplete = false;
				this.merlist = [];
			},
			remove(){
				this.history = [];
				localStorage.setItem("searchdata","null");
			},
			back(){
// 				this.searchValue = "";
// 				this.isRequest = false;
// 				this.$emit("onBack",null)
				this.$router.push("/index")
			}
		}
	}
</script>

<style lang="scss" scoped>>
	.home .recommendlist ul li:last-child{
		border:0!important;
	}
</style>
