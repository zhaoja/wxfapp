<template>
	<div class="mine set">
		<div class="longLines">
			<ul class="line2">
				<li class="bigli" @click="actionSheet()">
					<label>头像</label>
					<img :src="userInfo.headUrl" alt="">
					<i class="icon icon-right"></i> 
				</li>
				<li>
					<router-link to="">
						<label>手机号</label>
						<span>{{userInfo.phoneNo|phoneNoDesensitization}} </span>
					</router-link>
				</li>
				<li v-if="userInfo.ifrealname=='已实名'">
					<router-link :to="{path:'realnameInfo'}">
						<label>实名信息</label>
 						<i class="icon icon-right pull-right"></i>
						<span>
							{{userInfo.username|nameDesensitization}}
							<span class="border-span blue-clor" style="margin-left: 10px;"  v-if="userInfo.ifrealname=='已实名'">{{userInfo.ifrealname}}</span> 
							<span class="border-span orange-clor" style="margin-left: 10px;" v-if="userInfo.ifrealname!='已实名'">{{userInfo.ifrealname}}</span> 
						</span>
					</router-link>
				</li>
				<li v-if="userInfo.ifrealname!='已实名'">
					<router-link to="relationBankCard"> 
						<label>实名信息</label>
						<i class="icon icon-right pull-right"></i>
						<span class="border-span blue-clor" style="margin-left: 10px;"  v-if="userInfo.ifrealname=='已实名'">{{userInfo.ifrealname}}</span> 
						<span class="border-span orange-clor" style="margin-left: 10px;" v-if="userInfo.ifrealname!='已实名'">{{userInfo.ifrealname}}</span> 
					</router-link>
				</li>
			</ul>
			<ul class="line2" v-if="userInfo.ifrealname =='已实名'">
				<li>
					<router-link to="">
						<label>用户类型</label>
						<span>{{userInfo.userTypeName}}</span>
					</router-link>
				</li>
				<li v-if="userInfo.usertype=='PENSION_CARD'">
					<router-link to="">
						<label>养老助残卡号</label>
						<span>{{userInfo.oldercardNo|pensionNoDesensitization}}</span>
					</router-link>
				</li>
			</ul>
		</div>
		<div style="display: none;">
			<button class="btn" @click="openCarcme()" v-if="ifAndroid">更换</button>
			<input type="file" id="uploads" accept="image/*" @change="uploadImg($event, 1)" v-if="!ifAndroid">
		</div>
		<mt-actionsheet :actions="popdata" v-model="sheetVisible">
		</mt-actionsheet>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { isMobile } from "@/utils/browser";
	
	export default {
		computed: {
			...mapState({
				userInfo: state => state.user.user.userInfo,
			}),
		},
		data(){
			return {
				usertypeDic : {
					"COMMON":"普通用户",
					"PENSION_CARD":"养老助残卡用户"
				},
				popdata: [{    
					name: '打开相册',
					param: {},
				    method: this.open1  
				}],
				sheetVisible: false,
				
				ifAndroid: true
			}
		},
		created(){
			// this.$store.dispatch('getUser');
		},
		mounted() {
			if(window.android){
				this.ifAndroid = true;
			}else{
				this.ifAndroid = false;
			}
		},
		methods:{
			//底部弹出 
			actionSheet: function(p) { 
				this.sheetVisible = true;
			},
			open1: function(a) { 
				 
				if(window.android){
					alert(1)
					this.ifAndroid = true;
					this.openCarcme()  
					
				}else{
					document.getElementById("uploads").click()
				}
			
				// this.$router.push({name: "解除关联", params: a.param})
			},
			openCarcme() {
				var _this = this;
				window.jsObj.goAppCamera();
				setTimeout(function(){
					window.cameraResult = function (data) {
						this.$router.push({name: "修改头像", params: {file: data} })
					}
				},1000)
			},
			uploadImg(e, num) {
				//上传图片
				var file = e.target.files[0];
				if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
					alert("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
					return false;
				} 
				this.$router.push({name: "修改头像", params: {file: file} })
				
			},
		}
	}
</script>

<style lang="scss">
.border-span{
/*    display: contents;*/
}
</style>