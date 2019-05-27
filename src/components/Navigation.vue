<template>
	<div class="navigation">
		<ul>
			<li>
				<router-link to="index" :class="{active: $route.path.match('index')}">
					<div><i class="icon icon-home"></i></div>
					首页
				</router-link>
			</li>
			<li>
				<router-link to="mall" :class="{active: $route.path.match('mall')}">
					<div><i class="icon icon-jifen"></i></div>
					积分商城
				</router-link>
			</li>
			<li @click="toMine()">
				<router-link to="mine" :class="{ active: $route.path.match('mine')}">
					<div>
						<i class="icon icon-mine"></i>
						<!--<i class="icon-alert" v-if="systemInfoRead"></i>-->
					</div>
					我的
				</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
	import { mapState } from 'vuex'

	export default {
		data() {
			return {
				...mapState({
					systemInfoRead: state => state.system.systemInfo.unread,
				})
			}
		},
		methods: {
			toMine() {
				this.systemInfoRead = 0
			}
		}
	}
</script>
