/*
 * 全局过滤器
 * by zhaojia
 */

//姓名托敏
let nameDesensitization = value => {
	if (value) {
		return "*" + value.slice(1)
	} else{
		return ""
	}
	
}
//电话号码脱敏
let phoneNoDesensitization = value => {
	if(value){
		return value.slice(0,3) + "****" + value.slice(value.length-4,value.length);
	}else {
		return ""
	}
}

//身份证号脱敏
let IdNoDesensitization = value => {
	if(value){
		return value.slice(0,5) + "*********" + value.slice(value.length-3,value.length);
	}else {
		return ""
	}
}

//银行卡号脱敏
let bankNoDesensitization = value => {
	if(value){
		return  "**** " +  "**** " +  "**** " + value.slice(value.length-4,value.length);
	}else{
		return  ""
	}
}

//养老卡号脱敏
let pensionNoDesensitization = value => {
	if(value){
		return  value.slice(0,4) + "****" + value.slice(value.length-4,value.length);
	}else{
		return  ""
	}
}

export { phoneNoDesensitization, nameDesensitization, bankNoDesensitization, IdNoDesensitization, pensionNoDesensitization }