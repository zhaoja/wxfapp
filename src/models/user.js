import {post, get} from '@/server/index.js'
import pic from '@/assets/images/person.png'
import dsBridge from "dsbridge"
import { isMobile } from "@/utils/browser";
//用户注册和登录
export default {
	state: {
		user:{
			topName:"设置",
			logStatus:1,
			userInfo:{
	 			headUrl: pic,
	 			username: "", //姓名
	 			ifrealname: "",
	 			usertype: "",
	 			userTypeName:"",
				phoneNo: "", //电话号
				oldercardNo: "", //养老卡号
				IdcardNo: "", //身份证号
				operatorId: null,
				bankcardNum: 0
			}
		}
	},
	actions: {
		//登录-获取用户信息
		setUserInfo({ commit, state },items){
			localStorage.setItem("operatorId", items.id)
			localStorage.setItem("phoneNo", items.phone)
			
			commit("getUserSuccess", items)
			
		},
		//获取用户基本信息
		getUser({ commit, state }, param){
		 					
			var permission = localStorage.getItem("operatorId")
			var phoneNo = localStorage.getItem("phoneNo")

			var ndata = {};
			
			if (isMobile) {
				dsBridge.call("getUserInfo", function(res) {
 					//成功
// 					alert(JSON.stringify(res))
					
					if (res.code == "0" && param == 0) {
						
						commit("getAppUserSuccess");
						
					}else {
						
						if(!permission){
							return false;
						}
						ndata = {
							operatorId: permission,
							mobile: phoneNo
						} 
						get({url: '/app/api/v1/users', data: ndata}).then(data => {
							if (data.code === "000000") {
								//通过webview判断终端  存储到APP端
								dsBridge.call("saveUserInfo", data ,function(res) {
									//成功
//									alert(JSON.stringify(res))
									if (res.code == "0") {
										commit("getAppUserSuccess");
									} else {
//										alert(res.message)
									}
								});
							}
						}).catch(function (error) {
							console.log(error);
					  	});
						//调取失败
//						alert(res.message)
					}
				});
			} else {
				//网页登录
				ndata = {
					operatorId: permission,
					mobile: phoneNo
				} 
				if(permission == "null"){
					return false;
				}
				get({url: '/app/api/v1/users', data: ndata}).then(data => {
					if (data.code === "000000") {
						//通过webview判断终端  存储到APP端
						if (isMobile) {
							
							dsBridge.call("saveUserInfo", data ,function(res) {
								//成功
								if (res.code == "0") {
									commit("getAppUserSuccess");
								} else {
//									alert(res.message)
								}
							});
						}else {
							commit("getUserSuccess", data.data)
						}
					}
				}).catch(function (error) {
					console.log(error);
			  	});
			}
		}
	},
	mutations: {
		getUserSuccess(state,data){
			 
			state.user.userInfo = {
				headUrl: data.userLogoUrl||state.user.userInfo.headUrl,
	 			username: data.userName,
	 			ifrealname: data.activateStatus=="Y"?"已实名":"未实名",
				phoneNo: data.phone,
				usertype: data.userType, 
				userTypeName: data.userTypeName,
				oldercardNo: data.pensionCardNo,
				IdcardNo: data.idCard,
				operatorId: data.id,
				
				bankcardNum: state.user.userInfo.bankcardNum
			};
 		},
		getAppUserSuccess(state){
			dsBridge.call("getUserInfo", function(res) {
				//alert("获取：gerUserInfo");
				//成功
				if (res.code == "0") {
					let ndata = res.data.userInfo.data;
					var userInfoDict = { 
						headUrl: ndata.userLogoUrl||state.user.userInfo.headUrl,
			 			username: ndata.userName,
			 			ifrealname: ndata.activateStatus=="Y"?"已实名":"未实名",
						phoneNo: ndata.phone,
						usertype: ndata.userType, 
						userTypeName: ndata.userTypeName,
						oldercardNo: ndata.pensionCardNo,
						IdcardNo: ndata.idCard,
						operatorId: ndata.id,
					};
//					alert(JSON.stringify(userInfoDict))
					state.user.userInfo = userInfoDict;
					state.user.userInfo.bankcardNum = state.user.userInfo.bankcardNum
					
				} else {
//					alert(res.message)
				}
			});
		}
	}
	
}