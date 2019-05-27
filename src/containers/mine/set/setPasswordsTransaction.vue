<template>
	<div class="mine set">
		<div class="longLines">
			<ul class="line0">
				<li> 	
					<router-link to="setPasswordsTransactionUpdate">
						<label>修改交易密码</label>
						<i class="icon icon-right"></i>
					</router-link>
				</li>
				<li> 	
					<router-link to="setPasswordsTransactionForget">
						<label>忘记交易密码</label>
						<i class="icon icon-right"></i>
					</router-link>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import { mapState } from "vuex";

	export default {
		computed: {
			...mapState({
				userInfo: state => state.user.user.userInfo,
			}),
		},
		created(){
			this.$store.dispatch('getUser');
		},
		data() {
			return {
			 
			}
		},
		mounted() {
		},
		methods:{
			 logout() {
				this.$router.push({
					path: '/login'
				})
			},
		}
	}
</script>

<style lang="scss">

</style>