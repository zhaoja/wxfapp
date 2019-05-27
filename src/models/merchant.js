import {post, get} from '@/server/index.js'
import pic from '@/assets/images/person.png'
import dsBridge from "dsbridge"
import { isMobile } from "@/utils/browser";
//用户注册和登录
export default {
	state: {
		merchant:{
			merchantInfo:{
	 			merName:"" ,//商户名称
		        licenceNo:"" ,//社会信用代码
		        merType:"" ,//商户类型
		        enterpriseType:"" ,//企业类型
		        servicePhone:"" ,//服务电话
		        contactName:"" ,//商户联系人姓名
		        contactPhone:"" ,//商户联系人手机号
		        afterSaleName:"" ,//售后联系人
		        afterSalePhone:"" ,//售后联系人电话
		        city:"北京市" ,//市
		        county:"" ,//区县
		        street:"" ,//街道
		        community:"" ,//社区
		        address:"" ,//地址
		        addressLat:"" ,// 纬度
		        addressLng:"" ,// 经度
		        operatingArea:"" ,//经营面积
		        pietyRate:"" ,//敬老让利
		        characteristic:[] ,//商户特色
		        licenseImgUrl:"" ,// 企业营业执照图片地址
		        thumbnailImgUrl:"" ,//展示图
		        showImgUrl:"" ,//缩略图
		        flow:""
			}
		}
	},
	actions: {
 
		//获取用户基本信息
		getMerchant({ commit, state }, param){
			 
		}
	},
	mutations: {
		getQuerySuccess(state,data){
			state.merchant.merchantInfo = data;
 		} 
	}
	
}