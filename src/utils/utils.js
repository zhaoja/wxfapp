/*
* 小工具
* 赵佳
* 2019-03-13
*/
var myutils = {
	//获取几位随机数
	random: (n) => {
		if (n > 21) return null
		var re = new RegExp("(\\d{" + n + "})(\\.|$)")
		var num = (Array(n - 1).join(0) + Math.pow(10, n) * Math.random()).match(re)[1]
		return num
		// Array(n > num ? (n - ('' + num).length +1) : 0).join(0) + num 补位
	},
	//时间
	getTime: (n) => {
		//n=0获取时间戳
		if(n==0){
			return (new Date()).getTime();
		}
		//获取无分割符时间，如2019313122019
		else if(n==1){
			var tim = new Date((new Date()).getTime()); //直接用 new Date(时间戳) 格式转化获得当前时间
			var timestamp = tim.toLocaleDateString().replace(/\//g, "") + tim.toTimeString().substr(0, 2) +
				tim.toTimeString().substr(3, 2) + tim.toTimeString().substr(6, 2);
			return timestamp;
			
		}//获取无分割符时间，如2019313122019
		else if(n==2){
			var tim = new Date((new Date()).getTime()); //直接用 new Date(时间戳) 格式转化获得当前时间
			var timestamp = tim.toLocaleDateString().replace(/\//g, "-") + tim.toTimeString(" ").substr(0, 8);
			return timestamp;
		}
		
	},
	
};
//唯一标识
let guid = ()=> {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	return v.toString(16);
  });
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
// 	var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
// 	return v.toString(16);
//   });
}
myutils.guid = guid;
export { guid };
export default myutils;