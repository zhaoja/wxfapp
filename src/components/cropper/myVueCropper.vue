<template>
	<div class="wrapper">
		<div class="model" v-show="model">
			<div class="model-show" @click="model = false">
				<img :src="modelSrc" alt="" @click="model = false">
			</div>
		</div>
		<div class="content">
			<div class="show-info">
				<div class="test">
					<vueCropper ref="cropper" :img="option.img" :outputSize="option.size" :outputType="option.outputType" :info="true"
					 :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox" :fixed="option.fixed" :fixedBox="option.fixedBox"
					 :original="option.original" :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth" :autoCropHeight="option.autoCropHeight"
					 :centerBox="option.centerBox" :high="option.high" :infoTrue="option.infoTrue" @realTime="realTime" @imgLoad="imgLoad"
					 @cropMoving="cropMoving" :enlarge="option.enlarge"></vueCropper>
				</div>
				<!--<div class="test-button">
					<button class="btn" @click="openCarcme()" v-if="ifAndroid">更换 </button>
					<label class="btn" for="uploads" v-if="!ifAndroid">更换</label>
					<input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/*" @change="uploadImg($event, 1)">
					<button @click="finish('base64')" class="btn" style="margin-right: 15px;">预览</button>
				</div>
				<div class="test-save">
					<input type="button" class="btnsave" value="上传头像" @click="finish()">
				</div>-->
				<div class="test-save">
					<input type="button" class="btnsave" value="取消" @click="goto()">
					<input type="button" class="btnsave" value="选取" @click="finish()">
				</div>
			</div>
		</div>
	</div>

</template>

<script>
	import VueCropper from "./vue-cropper/vue-cropper";

	import { mapState } from "vuex";
	import { Http } from '@/server/index.js'
	import { MessageBox,Toast } from 'mint-ui';
	import validation from '@/utils/validation.js';
	import { get, post } from '@/server/index.js'

	import { isMobile } from "@/utils/browser";
	import dsBridge from "dsbridge"

	import img from '@/../static/images/person.png'
	import codes from "./code";
	
	const URL = "http://47.94.193.144:8081"
	
	export default {
		components: {
			VueCropper,
			codes
		},
		computed: {
			...mapState({
				userInfo: state => state.user.user.userInfo
			})
		},
		created() {
//			this.$store.dispatch('getUser');
			this.changeImg();
		},
		data: function() {
			return {
				file: '',
				model: false,
				modelSrc: "",
				crap: false,
				previews: {},
				fileName:'',
				option: {
					img: "",
					size: 1,
					full: false,
					outputType: "png",
					canMove: false,
					//					fixedBox: false,
					original: false,
					canMoveBox: true,
					canScale: true,
					autoCrop: true,
					// 只有自动截图开启 宽度高度才生效
					autoCropWidth: 300,
					autoCropHeight: 300,
					//					真实的输出宽高
					//					infoTrue: true,
					fixed: true,
					fixedNumber: [1, 1],
					centerBox: true,
					high: true,
					cropData: {},
					enlarge: 1,
					fixed: true,
				},
				downImg: "#",
				previewStyle1: {},
				previewStyle2: {},
				ifAndroid: true
			};
		},
		methods: {
			goto(){
				this.$router.push('/setuser')
			},
			changeImg() {
				//console.log(this.userInfo.headUrl,111)
//				this.option.img = this.lists[~~(Math.random() * this.lists.length)].img;
				// this.option.img = this.userInfo.headUrl;
				if (this.option.img == "") {
					//document.getElementById("mytoken").innerText = '加载中...'
				} else{
					//document.getElementById("mytoken").innerText = ''
				}
			},
			openCarcme() {
				var _this = this;
				window.jsObj.goAppCamera();
				setTimeout(function(){
					window.cameraResult = function (data) {
						_this.option.img = data;
					}
				},1000)
				
			},
			rotateLeft() {
				this.$refs.cropper.rotateLeft();
			},
			rotateRight() {
				this.$refs.cropper.rotateRight();
			},
			
			//上传图片（点击上传按钮）
			finish(type) {
				let _this = this;
				let param = new FormData();
				// 输出 
				if (type === 'blob') {
					this.$refs.cropper.getCropBlob((data) => {
						let img = window.URL.createObjectURL(data)
						this.model = true;
						this.modelSrc = img;
						param.append("file", data, ".jpg");
						this.$http.post(URL + "/app/api/v1/users/image/upload/"+_this.userInfo.operatorId, formData, {
								contentType: false,
								processData: false,
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded'
								}
							})
						.then((response) => {
							
							if (response.status==200) {
								
								if (response.data.retCode == "000000") {
									//回显
									_this.option.img = response.data.body;
									
									_this.userInfo.headUrl = response.data.body;
									
									// _this.setUpdate(_this.userInfo)
									
									Toast(response.data.retMessage)
									
									_this.$router.push( "/setuser" )
									
									
								} else{
									
									Toast({ message: response.data.meta.desc , position: 'bottom'});
								}
							} else{
								Toast({ message: "请检查网络" , position: 'bottom'});
							}
							var res = response.data; 
						})
					})
				} else if(type === 'base64'){
					this.$refs.cropper.getCropData(data => {
						this.model = true;
						this.modelSrc = data;
					});
				}
				else {
					this.$refs.cropper.getCropData((data) => {
				
						var aa = this.dataURLtoFile(data,"headerimg")
   						var param1= new FormData();
						param1.append("fileImg", aa);
						
						this.$http.post(URL + "/app/api/v1/users/image/upload/"+  _this.userInfo.operatorId , param1, {
								contentType: false,
								processData: false,
								headers: {
									'Content-Type': 'multipart/form-data'
								}
							})
						.then((response) => {
							if (response.status==200) {
								if (response.data.retCode=="000000") {
									//回显 
									_this.option.img = response.data.body;
									_this.userInfo.headUrl = response.data.body; 
									//请求数据
									_this.$store.dispatch('getUser');
									//成功
									Toast(response.data.retMessage); 
									_this.$router.push("/setuser");
									
								} else{
									Toast({ message: response.data.meta.desc , position: 'bottom'});
								}
							} else{
								Toast({ message: "请检查网络" , position: 'bottom'});
							}
							var res = response.data; 
						})	 
					 
					})		
				}
			},
			//base64 转文件
			dataURLtoFile(dataurl, filename) { //将base64转换为文件
		        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
		            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
		        while(n--){
		            u8arr[n] = bstr.charCodeAt(n);
		        }
		        return new File([u8arr], filename, {type:mime});
		    },
			// 实时预览函数
			realTime(data) {
				var previews = data;
				var h = 0.5;
				var w = 0.2;

				this.previewStyle1 = {
					width: previews.w + "px",
					height: previews.h + "px",
					overflow: "hidden",
					margin: "0",
					zoom: h
				};

				this.previewStyle2 = {
					width: previews.w + "px",
					height: previews.h + "px",
					overflow: "hidden",
					margin: "0",
					zoom: w
				};
				this.previews = data;
			},

			finish2(type) {
				this.$refs.cropper2.getCropData(data => {
					this.model = true;
					this.modelSrc = data;
				});
			},
			finish3(type) {
				this.$refs.cropper3.getCropData(data => {
					this.model = true;
					this.modelSrc = data;
				});
			},
			down(type) {
				// event.preventDefault()
				// 输出
				if (type === "blob") {
					this.$refs.cropper.getCropBlob(data => {
						this.downImg = window.URL.createObjectURL(data);
						if (window.navigator.msSaveBlob) {
							var blobObject = new Blob([data]);
							window.navigator.msSaveBlob(blobObject, "demo.png");
						} else {
							this.$nextTick(() => {
								this.$refs.downloadDom.click();
							});
						}
					});
				} else {
					this.$refs.cropper.getCropData(data => {
						this.downImg = data;
						if (window.navigator.msSaveBlob) {
							var blobObject = new Blob([data]);
							window.navigator.msSaveBlob(blobObject, "demo.png");
						} else {
							this.$nextTick(() => {
								this.$refs.downloadDom.click();
							});
						}
					});
				}
			},

			uploadImg(e, num) {
				//上传图片
				// this.option.img
				var file = e.target.files[0];
				if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
					alert("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
					return false;
				}
				var reader = new FileReader();
				reader.onload = e => {
					let data;
					if (typeof e.target.result === "object") {
						// 把Array Buffer转化为blob 如果是base64不需要
						data = window.URL.createObjectURL(new Blob([e.target.result]));
					} else {
						data = e.target.result;
					}
					if (num === 1) {
						this.option.img = data;
					} else if (num === 2) {
						this.example2.img = data;
					}

				};
				// 转化为base64
				// reader.readAsDataURL(file)
				// 转化为blob
				reader.readAsArrayBuffer(file);

				this.file = event.target.files[0];
			},
			imgLoad(msg) {
				console.log(msg);
			},

			cropMoving(data) {
				this.option.cropData = data;
			}, 
			//更新数据
			setUpdate(param) {
				MessageBox.confirm('确定执行此操作？').then(confirmAction => {
					if (confirmAction === 'confirm') {
						Http({
								url: '/api/user/editUser',
								data: {
									"param": param
								}
							})
							.then(data => {
								if (data.code === 1) {
									MessageBox.alert('操作成功').then(alertAction => {
										if (alertAction === 'confirm') {
											this.$router.push({
												path: '/setuser'
											})
										}
									});
								} else {
									console.log(error);
								}
							}).catch(function(error) {
								console.log(error);
							});
					} else {
						return false
					}
				});
			}
		},

		mounted() {
			// hljs.configure({useBR: true})
			var list = [].slice.call(document.querySelectorAll("pre code"));
			list.forEach((val, index) => {
				hljs.highlightBlock(val);
			});
			
			if(window.android){
				this.ifAndroid = true;
			}else{
				this.ifAndroid = false;
			}
			/////////
			
			var file = this.$route.params.file;
			//console.log(this.$route.params.file,111111)
			var reader = new FileReader();
			reader.onload = e => {
				let data;
				if (typeof e.target.result === "object") {
					// 把Array Buffer转化为blob 如果是base64不需要
					data = window.URL.createObjectURL(new Blob([e.target.result]));
				} else {
					data = e.target.result;
				}
				this.option.img = data; 

			};
			// 转化为base64
			reader.readAsDataURL(file)
			// 转化为blob
			// reader.readAsArrayBuffer(file);

			// this.file = event.target.files[0];
// 			console.log(this.file,111111)
// 			
		}
	};
</script>
