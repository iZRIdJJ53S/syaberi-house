

var contentbox_elm = $('#thread_comment_box');
var height_from_contentbox = "";
var howscroll = "";
var MovingFlag = 0;

//スクロールダウン
function CommentBox_func(last_appned_id){
	
	//howscroll = $('#'+last_appned_id).offset().top + $('#'+last_appned_id).height();
	
	//$('html,body').stop().animate({scrollTop: howscroll}, 2100,function(){
	//	height_from_contentbox = contentbox_elm.offset().top - $(window).height() + 120;
	//});
}

//スクロールアップ
$('#scrl_top a').click(function(){
	height_from_contentbox = contentbox_elm.offset().top - $(window).height() + 120;
	$('html,body').stop().animate({scrollTop: 0}, 900,function(){
	});
});


