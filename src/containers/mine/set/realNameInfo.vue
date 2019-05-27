<template>
	<div class="mine" style="padding-top: 0;  padding-bottom: 0;">
		<div class="card">
			<div class="top" style="padding-top: 20px;">
				<Header :topName="$route.name"  style="top: 20px;"/>
				<div class="topSelf2" style="margin-top: 55px;">
					<img :src="userInfo.headUrl" alt="" />
					<!--<div>{{userInfo.username}}</div>-->
					<div class="hr">
						<span class="border-span blue-clor">{{userInfo.ifrealname}}</span>
					</div>
					<div class="bott">您已完成实名认证</div>
				</div>
			</div>
		</div>
		
		<div class="longLines">
		 	<ul class="line2">
				<li>
					<router-link to="">
						<label>证件类型</label>
						<span>身份证</span>
					</router-link>
				</li>
				<li>
					<router-link to="">
						<label>证件号码</label>
						<span>{{userInfo.IdcardNo|IdNoDesensitization}}</span>
					</router-link>
				</li>
			</ul>
		
	 	</div>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import Header from '@/components/Header2.vue'
	 
	export default {
		computed: {
			...mapState({
				userInfo: state => state.user.user.userInfo,
			}),
		},
		components:{
			Header
		},
		created(){
			// this.$store.dispatch('getUser');
		},
		data() {
			return {
			 	usertypeDic : {
					"COMMON":"普通用户",
					"PERSION_CARD":"养老助残卡用户"
				}
			}
		},
		mounted() {
		},
		methods:{
			 
		}
	}
</script>

<style>
</style>