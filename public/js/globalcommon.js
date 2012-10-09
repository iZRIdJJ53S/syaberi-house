// JavaScript Document

//alert("globalcommom");

//****************  global変数  *****************************//

var syaberi_login_flag = false; 	//ログインフラグ

//var fb_appId = "351823408214501";	//facebookアプリID(テスト)
var fb_appId = "152355228231572";	//facebookアプリID

//var bit_user = "arucu";					//bitly　arucuアカウント名
//var bit_key = "R_bdaef05a2100054e3e082c5943925e4e";		//bitly　キー
var bit_user = "syaberihouse";					//bitly　アカウント名
var bit_key = "R_f017232dab9dbfc9d37392c40c4f7c85";		//bitly　キー

var mixi_friend_url_api = "http://api.syaberi-house.com/mixi_api/friend.php"; //mixi友達招待api
var mixi_voice_url_api = "http://api.syaberi-house.com/mixi_api/voice.php"; //mixiつぶやきapi

//****************  global変数  *****************************//

//facebook メールチェック
function fb_callback(val,flag){
	if(flag != "1"){
		if(val != ""){
			set_cookie("mail",val);
		}
		location.href = "/firstset";
	}else{
		location.reload(true);
	}
}

//mixi メールチェック
function mixi_callback(val,flag){
	if(flag != "1"){
		if(val != ""){
			set_cookie("mail",val);
		}
		location.href = "/firstset";
	}else{
		location.href = "/";
	}
}

<!-- syaberi login check -->
function createHttpRequest(){
	if(window.ActiveXObject){
		try {
			return new ActiveXObject("Msxml2.XMLHTTP")
		} catch (e) {
			try {
				return new ActiveXObject("Microsoft.XMLHTTP")
			} catch (e2) {
				return null
			}
		}
	} else if(window.XMLHttpRequest){
		return new XMLHttpRequest()
	} else {
		return null
	}
}

(function(){
	var tim = new Date();
	var parameters = "tim=" + tim.getSeconds()+tim.getMilliseconds();
	var request = "/get-is-login?"+parameters;
//	alert(request);
	var httpoj = createHttpRequest()
	httpoj.open( "GET" , request , true )
	httpoj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8'); 
	httpoj.onreadystatechange = function(){ 
		if ((httpoj.readyState==4) && (httpoj.status == 200)){
			var args = {};
			var arr = httpoj.responseText;
			args = eval("(" + arr + ")");
/*			
			alert(args["login_flg"]);
			if(args["login_flg"]){
				alert(args["user_id"]);
				alert(args["user_image"]);
				alert(args["user_name"]);
			}
*/
			syaberi_login_flag = args["login_flg"];

		}
	}
	httpoj.send();
})();
<!-- /syaberi login check -->


<!-- syaberi bitly短縮URL取得 -->
var getShortUrl = "";
function setShortURL(val){

	var longUrl = "";

	//valが空の場合今いるページのURLを対象
	if((typeof(val) == "undefined") || (val == null) || (val == "")){
		//alert("undefined");
		longUrl = location.href;
	}else{
		longUrl = val;
	}

	$.ajax({
	    type: "GET",
	    url: "http://api.bitly.com/v3/shorten?login="+bit_user+"&apiKey="+bit_key+"&longUrl="+encodeURIComponent(longUrl)+"&format=json",
	    //url: "http://api.bit.ly/shorten?version=2.0.1&longUrl=" + encodeURIComponent(longUrl) + "&login=" + LOGIN + "&apiKey=" + API_KEY,
	    dataType: "jsonp",
	    success: function(res) {
	        if ( res["status_code"] == 200 && res["status_txt"] == "OK" ) {
	            //alert(res["data"]["url"]);
	           getShortUrl = res["data"]["url"];
	        } else {
	            //alert("No shortUrl");
	            //return "";
	        }
	    }
	});
}

<!-- /syaberi bitly短縮URL取得 -->


//クエリのパース
function parseArgs(val) {
	var args = {};
	var a = val;
	var ar = a.split("&");
	for(var j=0; j<ar.length; j++) {
		var pair = ar[j].split("=");
		if(pair[0]){
			args[pair[0]] = decodeURIComponent(pair[1]);
		}
	}
	return args;
}


//クッキーの呼び出し
function ReadCookie(src) {

	var strCookie = document.cookie;
	var cookies = strCookie.split(';');
	var isTRUE = 0;
	for(var i = 0; i < cookies.length; i++) {
		var datas = cookies[i].split('=');
		datas[0] = datas[0].replace(' ', '');
		if(datas[0] == src) {
			return decodeURIComponent(datas[1]);
			isTRUE = 1;
		}
	}
	if(isTRUE == 0){
		return "";
	}
}

//クッキーのセット
function set_cookie(Cname,Cvalue){
/*
	day0 = new Date();
	var setday = 180; 	//日数
	day0.setTime(day0.getTime()+60*60*24*1000*setday);
	endday = day0.toGMTString();
*/
	document.cookie = Cname + "=" + Cvalue +";expires=;path=/;";
}

//クッキーの削除
function del_cookie(Cname,Cvalue){
/*
	day0 = new Date();
	var setday = -1; 	//日数
	day0.setTime(day0.getTime()+60*60*24*1000*setday);
	endday = day0.toGMTString();
*/
	document.cookie = Cname + "=" + Cvalue +";expires=;path=/;";
}

//ログアウト
function logout( url ){
	
	set_cookie( 'TW_FRIEND_FLAG' , '0' );
	set_cookie( 'MIXI_FRIEND_FLAG' , '0' );
	set_cookie( 'name' , '' );
	set_cookie( 'thumb' , '' );
	
	location.replace( url );

}