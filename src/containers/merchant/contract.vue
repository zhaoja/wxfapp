<template>
	<div class="qresult">
		<div class="detail">
 			<ul>
 				<li><span>商户名称 </span><span>{{form.name}}</span> </li>
				<li><span>社会信用代码 </span><span>{{form.name}} </span>  </li>
			</ul>
			<div class="pdf">
	 			<img :src="pdf"/>
	 			<strong>《微孝付商户服务合同》</strong>
	 			<button @click="showPDf">预览</button>
	 		</div>
		</div> 
	 	<div class="note0">
	 		<strong>说明：</strong><br />
	 		1.请您下载合同，并在合同生效日前加盖公司公章，交给业务人员，或者邮寄到如下地址：北京市朝阳区某某路**号某某地<br />
			2.如有任何疑问，请联系客服电话:010-40085678
 		</div>
 		<div style="padding: 0 15px;">
			<button class="submitBtn" type="primary" @click="downloadPDf()">
				<a :href="Url" download=""  title="下载"  mce_href="#">下载电子合同</a>
			</button>
		</div>
	</div> 
</template>

<script>
	import pdf from '@/assets/images/mer/pdf@2x.png'
	import axios from 'axios'

	  
	export default {
		 
		data() {
			return {
				pdf, 
				Url:'http://192.168.2.125:8086/static/pdf/test.pdf',
				form: {
					name: '666',
				}
			}
		},
		mounted(){
			
		},
		methods: {
		 
			showPDf() {
		 		this.$showPDF(this.Url) 

		   	},
			downloadPDf(){
				var myFrame= document.createElement("iframe"); 
				myFrame.src = this.Url; 
				myFrame.style.display = "none"; 
				document.body.appendChild(myFrame);
				
  //		        axios.get('http://192.168.2.125:8086/static/pdf/test.pdf', {
//		          responseType: 'blob', //重要
//		        }).then(response => {
//		          const url = window.URL.createObjectURL(new Blob([response.data]));
//		          const link = document.createElement('a');
//		          let fname = 'report.pdf';
//		          link.href = url;
//		          link.setAttribute('download', fname);
//		          document.body.appendChild(link)
//		          link.click();
//		        })
			}
		}
	}
</script>

<style lang="less">
	
</style>