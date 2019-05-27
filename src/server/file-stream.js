import axios from 'axios'
import setRsa from '@/utils/RSA.js';
import myutils,{guid} from '@/utils/utils.js'
import { isMobile } from "@/utils/browser";
import dsBridge from "dsbridge"

let systemCode = "";
if(isMobile){
	dsBridge.call("getChannel", function(res) {
		//成功
		if (res.code == "0") {
			systemCode = res.data.data;
		} else { 
			
		}
	});
}else{
	systemCode = "H5V1.0.0";
}
const request = axios.create({
	baseURL: 'http://47.94.193.144:8081', //测
  	timeout: 15000,
  	headers: {'Content-Type': 'application/json'},
})
//请求拦截
request.interceptors.response.use(
  function(response){
// 请求正常则返回,这里返回了所有的请求头和请求体信息
	var blob = response.data;//把二进制的码转化为blob类型
	var data = URL.createObjectURL(blob);
    return Promise.resolve(data)
  },
  function(error) {
    // 请求错误则向store commit这个状态变化
    const httpError = {
      alertFlag: true,
      errorStatus: error.response.status,
      msgg: error.response.statusText
    }
    this.$store.commit('SET_ALERT_FLAG', {state: false, type: 'ok'})
    return Promise.reject(error)
  }
)
let fileStream = function (axiosData) {
	let rsaData = setRsa(JSON.stringify({
		...axiosData.data,
		"systemCode": systemCode,
		"reqNo": "IEQ" +  myutils.getTime(1) + myutils.random(4), //请求编号 IEQ+年月日时分秒+五位随机数
	}))
	var data = {
		method: 'get',
		params: {requestBody: rsaData},
		responseType: 'blob'
	}
	data.url = axiosData.url + "?t=" + myutils.getTime(0);
	return request(data)
}

export { fileStream };

 
