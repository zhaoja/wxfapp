import JSEncrypt from 'jsencrypt';

//rsa加密方法
let setRsa = '';

let publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCgOAOQEG9wDwhIBIE8Ymtj0cN1D9r/AX7PPHTLKaACh2mHe7TQQJRcuzoIW95TE7O9ybbYa6vB8bv1pxyIpaqVV/gBEMeG0urSCq1zfmQ6f1VFZriij3UYpwuTvDJ3Bz6lAnjysN6FGUbwX1M4MFxG1PSKXNhehWO8pWImvqgrVwIDAQAB"
let privateKey = "MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAKA4A5AQb3APCEgEgTxia2PRw3UP2v8Bfs88dMspoAKHaYd7tNBAlFy7Oghb3lMTs73Jtthrq8Hxu/WnHIilqpVX+AEQx4bS6tIKrXN+ZDp/VUVmuKKPdRinC5O8MncHPqUCePKw3oUZRvBfUzgwXEbU9Ipc2F6FY7ylYia+qCtXAgMBAAECgYA2dfPYE44dtC5ndIiNgxLn8lSTRRl21wZI4U7+BB8s3OSlNgqnQ1xrDQVT9A5lhOvzFk79z9OpcEco4G4VkOKjpj7xHmud/ldr6C+9ysvifkSgyyYrGz7z+4OWy1fQkbylQliS8w2upoei5NhWPxPVDzOlPsdG00yqujz+BVFUeQJBAPuDGIRZ5v6QflENtWGVu3M1cDfxfRyqaGoiGI5FzgpcuVwf4N7J9uw1ALZAE/zzq7njAUr5Y++xWPzRaVcvY60CQQCjE+Q5OFUrJ/qrTERxqjPGb/yIY/J9VDTnaEy7F7htIXVATcUYUlaH64DOZaaLzTmzsVtCVj51ni/GTx6S/4uTAkEAuxee8j0qLu1veX3YEjpe0WnMC2FxLxS4TVMFrzfP+DdXj2cLUM8uBjG7UNdDxyO/96wctxfjNldXmeFxGfDflQJBAJFA+HlXCdVkyMunJRexKGjJ+r9pduXXCUBNEHtdB3J86LkcDEA7psNuKs6skAnaBFlf0g9mTj/pZFhYxLzeTW0CQFRwX37bEaUXEJq7GhriYZvK1exIpX3RdjRhh2DJRhPpZ5OF83qcht2zeCwd4S8Cg5SeTQuKYgJXCYjRv5MbPhw="

setRsa = (setData) => {
	console.log(setData,888)
	var JsEncrypt = new JSEncrypt();
	JsEncrypt.setPublicKey(publicKey);
	var data = JsEncrypt.encryptLong(setData);

//	JsEncrypt.setPrivateKey(privateKey);
//	var letdecryptStr = JsEncrypt.decryptLong(data) // 解密
//	console.log("解密字符串:", letdecryptStr);
 
	return data;
}
export default setRsa;
 


 