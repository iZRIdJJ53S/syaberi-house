

//画像ボックスfixed
$(function(){
	var contscrol_elm_imgbox = $('.thread_article_box_left');
	var distance_of_top_imgbox = contscrol_elm_imgbox.offset().top - 101;
	$(window).scroll(function(){
		if($(window).scrollTop() > distance_of_top_imgbox){
			contscrol_elm_imgbox.css({'position':'fixed','top':'101px'});
		}else{
			contscrol_elm_imgbox.css('position','static');
		}
	});
});

var contentbox_elm = $('#thread_comment_box');
var height_from_contentbox = "";
var howscroll = "";
var MovingFlag = 0;
/*
//コメントボックスfixed
function getEventOfscroll(){
	$(window).scroll(function(){
	
		$('#aaaaaa').text($(window).scrollTop());
		$('#bbbbbb').text(height_from_contentbox);
		$('#cccccc').text(howscroll);
		if($(window).scrollTop() > height_from_contentbox ){
			contentbox_elm.css('position','relative').removeClass('shasowing');
		}else{
			contentbox_elm.css({'position':'fixed','bottom':'0px'}).addClass('shasowing');
		}
	});
}*/

//スクロールダウン
function CommentBox_func(last_appned_id){
	
	howscroll = $('#'+last_appned_id).offset().top + $('#'+last_appned_id).height();
	
	$('html,body').stop().animate({scrollTop: howscroll}, 2100,function(){
		height_from_contentbox = contentbox_elm.offset().top - $(window).height() + 120;
		//getEventOfscroll();
	});
}

//スクロールアップ
$('#scrl_top a').click(function(){
	height_from_contentbox = contentbox_elm.offset().top - $(window).height() + 120;
	$('html,body').stop().animate({scrollTop: 0}, 900,function(){
		//getEventOfscroll();
	});
});

/*
//ウィンドウリサイズ
$(document).ready(function(){
	$(window).resize(function(){
		height_from_contentbox = contentbox_elm.offset().top - $(window).height() + 120;
	});
});
*/

