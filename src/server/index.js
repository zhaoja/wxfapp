import request from './axios.js'
import setRsa from '@/utils/RSA.js';
import myutils from '@/utils/utils.js'
import { isMobile } from "@/utils/browser";
import dsBridge from "dsbridge"

var systemCode = "H5V1.0.0";

if(isMobile){
	//console.log("isMobile")
	dsBridge.call("getChannel", function(res) {
		
		//成功
		if (res.code == "0") {
			systemCode = res.data.data;
		} else { 
			alert("获取设备失败")
		}
		
	});
	
}
 //else{
	//console.log("isH5")
//	systemCode = "H5V1.0.0";
//}
 

//post方法
let post = function (axiosData) {
	let rsaData = setRsa(JSON.stringify({
		...axiosData.data,
		"systemCode": systemCode,
		"reqNo": "IEQ" +  myutils.getTime(1) + myutils.random(4), //请求编号 IEQ+年月日时分秒+五位随机数
	}))
	var data = {
		method: 'post',
		data: rsaData
	}
	//加密
	data.url = axiosData.url + "?t=" + myutils.getTime(0);
	return request(data)
}
//get方法
let get = function (axiosData) {
	let rsaData = setRsa(JSON.stringify({
		...axiosData.data,
		"systemCode": systemCode,
		"reqNo": "IEQ" +  myutils.getTime(1) + myutils.random(4), //请求编号 IEQ+年月日时分秒+五位随机数
	}))
	var data = {
		method: 'get',
		params: {
			requestBody: rsaData
		}
	}
	//加密
	data.url = axiosData.url + "?t=" + myutils.getTime(0);
	return request(data)
}
export {post, get};
 