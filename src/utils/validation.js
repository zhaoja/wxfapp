import { Toast } from 'mint-ui';

var validation = {
	//非空
	ifNull:(str, t)=>{
		if (str=="") {
			return "输入您的"+t;
		} else{
			return true;
		}
	},
	//密码
	ifPassword:(p, level)=>{
		var reg;
		if (level==="高") {
			//强：字母+数字+特殊字符
			reg = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;
		} else if(level==="中"){
			//中：字母+数字，字母+特殊字符，数字+特殊字符
			reg = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;
		}else if(level==="低"){
			//弱：纯数字，纯字母，纯特殊字符
			reg = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$/;
		}else {
			//全数字
		 	reg = /^[0-9]{1,20}$/;
		}
		if (!reg.test(p)) {
			return "密码格式不正确";
		}else{
			if (p.length<6&&p.length>20) {
				return "您输入密码的位数不符规则";
			} else{
				return true;
			}
		}
	},
	//姓名校验//中文汉字校验
	ifName:(name,t)=>{
		var reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,8}$/;//验证姓名正则
		if (!reg.test(name)) {
			return "请输入2~8位中文汉字";
		}else{
			return true;
		} 
	},
	// 身份证号正则
	isCardID: (sId) => {
		var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
		var iSum = 0;
		var info = "";
		if(!/^\d{17}(\d|x)$/i.test(sId)) return "你输入的身份证长度或格式错误";
		sId = sId.replace(/x$/i, "a");
		if(aCity[parseInt(sId.substr(0, 2))] == null) return "你的身份证地区非法";
		var sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
		var d = new Date(sBirthday.replace(/-/g, "/"));
		if(sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) return "身份证上的出生日期非法";
		for(var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
		if(iSum % 11 != 1) return "你输入的身份证号非法";
		//aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女");//此次还可以判断出输入的身份证号的人性别
		return true;
	},
	//输入几位数字
	ifNum:(num, t, n)=>{
		var reg = /^[0-9]*$/;
		if (!reg.test(num)) {
			return t + "请输入数字";
		}else{
			if (num.length!= n ) {
				return t + "请输入" + n + "位数字" ;
			} else{
				return true;
			}
		}
	},
	//银行卡号
	isCardBank:(bankno)=>{
		console.log(bankno)
		var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhn进行比较）
		var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
		var newArr = new Array();
		for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
		newArr.push(first15Num.substr(i, 1));
		}
		var arrJiShu = new Array(); //奇数位*2的积 <9
		var arrJiShu2 = new Array(); //奇数位*2的积 >9
		var arrOuShu = new Array(); //偶数位数组
		for (var j = 0; j < newArr.length; j++) {
		if ((j + 1) % 2 == 1) { //奇数位
		    if (parseInt(newArr[j]) * 2 < 9) arrJiShu.push(parseInt(newArr[j]) * 2);
		   else arrJiShu2.push(parseInt(newArr[j]) * 2);
		} else //偶数位
		    arrOuShu.push(newArr[j]);
		}
		
		var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
		var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
		for (var h = 0; h < arrJiShu2.length; h++) {
		    jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
		    jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
		}
		
		var sumJiShu = 0; //奇数位*2 < 9 的数组之和
		var sumOuShu = 0; //偶数位数组之和
		var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
		var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
		var sumTotal = 0;
		for (var m = 0; m < arrJiShu.length; m++) {
		    sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
		}
		
		for (var n = 0; n < arrOuShu.length; n++) {
		    sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
		}
		
		for (var p = 0; p < jishu_child1.length; p++) {
		    sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
		    sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
		}
		//计算总和
		sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);
		console.log(sumTotal,67876867)
		//计算luhn值
		var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
		var luhn = 10 - k;
		
		if (lastNum == luhn) {
		　return true;
	    } else {
	        return "请输入正确的银行卡号";
	        
	    }
	},
 
//	//养老卡号正则 
//	ifOddCard:(num)=>{
//		var reg = /^[0-9]*$/;
//		if (!reg.test(num)) {
//			return "请输入数字";
//		}else{
//			if (num.length!=12) {
//				return "请输入12位数字";
//			} else{
//				return true;
//			}
//		}
//	},
//	//手机号正则
//	ifPhone: (phone)=>{
//		if(!(/^1[23456789]\d{9}$/.test(phone))){ 
//	        return "手机号码有误，请重填"; 
//	    } else{
//			return true;
//		}
//	},

//	//发送手机验证码通用方法
//	getVerificationCode: (phoneNo)=> {
//		Http({url: '/api/getSendcode',data:{
//			"param": { 
//				"phoneNo": phoneNo
//		  	}
//		}})
//      .then(data => {
//        	if (data.code === 1) {	
//				Toast({ message: '验证码已发送到您的手机', position: 'bottom'});
//        	}else{
//        		Toast({ message: data.desc , position: 'bottom'});
//        	}
//      }).catch(function (error) {
//		    console.log(error);
//		});	
//	},
	
}
 
 
 
export default validation