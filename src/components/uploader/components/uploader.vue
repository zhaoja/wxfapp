<template>
	<div class="vue-uploader">
		<div class="file-list">
			<section v-for="(file, index) of files" class="file-item draggable-item">
				<img :src="file.src" alt="" ondragstart="return false;">
				<p class="file-name">{{file.name}}</p>
				<i class="icon icon-close" @click="remove(index)"></i>
				<div class="add1"><span></span></div>
			</section>
			<section v-if="status == 'ready'" class="file-item">
				<div @click="add" class="add">
					<span>
						<div>+</div>
						<div>添加照片</div>
					</span>
				</div>
			</section>
		</div>
		<!-- <section v-if="files.length != 0" class="upload-func">
            <div class="progress-bar">
                <section v-if="uploading" :width="(percent * 100) + '%'">{{(percent * 100) + '%'}}</section>
            </div>
            <div class="operation-box">
                <button v-if="status == 'ready'" @click="submit">上传</button>
                <button v-if="status == 'finished'" @click="finished">完成</button>
            </div>
        </section> -->
		<input type="file" accept="image/*" @change="fileChanged" ref="file" multiple="multiple">
	</div>
</template>
<script>
	import { Toast } from 'mint-ui'

	export default {
//		props: [{
//			src: {
//				type: String,
//				required: true
//			}
//		}, "tips"],
		props: ["src","tips"],
		data() {
			return {
				status: 'ready',
				files: [],
				point: {},
				uploading: false,
				percent: 0,

			}
		},
	
		methods: {
			add() {
				this.$refs.file.click()
			},
			submit() {
				let _this = this;
				if(this.files.length === 0) {
					console.warn('no file!');
					return
				}
				const formData = new FormData()
				this.files.forEach((item) => {
					formData.append("imageFile", item.file)
				})
				const xhr = new XMLHttpRequest()
				xhr.upload.addEventListener('progress', this.uploadProgress, false)
				xhr.open('POST', this.src, true)
				this.uploading = true
				xhr.send(formData)
				 
				xhr.onload = () => {
					this.uploading = false
					if(xhr.status === 200 || xhr.status === 304) {
						this.status = 'finished'
						let response = JSON.parse(xhr.response);
						if(response.retCode == "000000"){
							if(_this.tips==1){
								_this.$emit('childByImgurl', response.result);
							}else if(_this.tips==2){
								_this.$emit('childByImgurll', response.result);
							}else{
								_this.$emit('childByImgurlll', response.result);
							}
							console.log('upload success!')
						}else{
							Toast(response.retMessage)
						}
						
					} else {
						console.log(`error：error code ${xhr.status}`)
					}
				}
			},
			finished() {
				this.files = []
				this.status = 'ready'
			},
			remove(index) {
				this.files.splice(index, 1)
				this.status = 'ready'
			},
			fileChanged() {
				const list = this.$refs.file.files
				for(let i = 0; i < list.length; i++) {
					if(!this.isContain(list[i])) {
						const item = {
							name: list[i].name,
							size: list[i].size,
							file: list[i]
						}

						this.html5Reader(list[i], item)
						this.files.push(item)
						this.status = "unready"
						this.submit()

					}
				}
				this.$refs.file.value = ''
			},
			// 将图片文件转成BASE64格式
			html5Reader(file, item) {
				const reader = new FileReader()
				reader.onload = (e) => {
					this.$set(item, 'src', e.target.result)
				}
				reader.readAsDataURL(file)
			},
			isContain(file) {
				return this.files.find((item) => item.name === file.name && item.size === file.size)
			},
			uploadProgress(evt) {
				const component = this
				if(evt.lengthComputable) {
					const percentComplete = Math.round((evt.loaded * 100) / evt.total)
					component.percent = percentComplete / 100
				} else {
					console.warn('upload progress unable to compute')
				}
			}
		}
	}
</script>
<style>
	
	.file-list,
	.file-item,
	.vue-uploader .add {
		height: 100%; 
	}
	
	.file-item {
		position: relative;
		/*margin: 0 10px;*/
	}
	
	.file-item img {
		height: 100%;
		width: 100%;
	}
	
	.file-name {
		display: none;
	}
	
	.vue-uploader>input[type="file"] {
		display: none;
	}
	
	.list-uploader .vue-uploader:nth-child(1) .file-list {
		/*margin: 0 7px 0 22px;*/
	}
	
	.list-uploader .vue-uploader:nth-child(2) .file-list {
		/*margin: 0 22px 0 7px;*/
	}
	.icon-close{
	    height: 18px;
	    width: 18px;
	    border-radius: 18px;
	    display: inline-block; 
   	    background-size: 280px;
	    background-position-y: -75px;
	    background-position-x: -103px;
	}
	.file-list .icon-close {
		position: absolute;
		right: -10px;
		top: -10px;
		/*display: none;*/
	}
	
	.add span, .add1 span {
		display: inline-block;
		text-align: center;
		width: 100%;
		margin-left: 0 !important;
		position: absolute;
		/*bottom: -45px;*/
		font-size: 14px;
		color: #666666;
	
	}
	.add span div:nth-child(1){
		font-size: 40px;
		color: #cccccc;
		margin-top: 7px;
	}
	.add span div:nth-child(2){
		font-size: 12px;
		color: #999999;
	}
</style>