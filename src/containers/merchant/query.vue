<template>
	<div class="capply">
		<div class="chapter new">
			<div class="nolack">商户自助登记审核进度查询</div>
			<ul>
				<li>
					<span>社会信用代码</span> 
					<input type="text" v-model="form.licenceNo" placeholder="请按营业执照信用代码填写"/>
				</li>
				<li>
					<span>联系人电话 </span> 
					<input type="text" v-model="form.contactPhone" placeholder="请填写登记的联系人电话"/>
				</li>
			</ul>
		</div>
		<div style="padding: 0 15px;">
			<button type="primary" @click="cardnext()">查询</button>
		</div>
	</div>
</template>

<script>
	import { mapMutations } from 'vuex'
	import { Toast } from 'mint-ui'
	import { get, post } from '@/server/index.js'
	
	export default {
		 
		data() {
			return {
				form: {
					licenceNo:"",
					contactPhone:""
				}
			} 
		},  
		methods: {
      		...mapMutations( [ 'getQuerySuccess' ] ),
      		
			cardnext() {
				let _this = this;

   				get({url: '/app/api/v1/merchants/query', data:_this.form}).then(data => {
					if (data.code === "000000") {
						console.log(data, 111111)
						_this.getQuerySuccess(data.data)
						_this.$router.push("/merchantQueryResult")
					}else{
						Toast(data.desc)
					}
				}).catch(function (error) {
					console.log(error);
			  	});
				// this.$store.dispatch('cardapplyNext',a);
			}
		}
	}
</script>

<style>
</style>