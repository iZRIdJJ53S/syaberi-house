//show 'fukidashi' nortifications
var fukidashi_fukidashi = 0;
$(function(){
	$('#fukidashi').live('click', function(){
		if($('#fukidashi_notification_wrapp').css('display') == 'none'){
			$('#fukidashi_notification_wrapp').slideDown('fast');
			ovarrayfunc();
			fukidashi_fukidashi = 1;
		}else{
			$('#fukidashi_notification_wrapp').slideUp('fast');
			ovarrayfunc_del();
			fukidashi_fukidashi = 0;
		}
	});
});

//-------------------------------------------------------------------------------------(；´∀｀)

//show 'mypage' nortifications
var fukidashi_my = 0;
$(function(){
	$('#header_right').live('click', function(){
		if($('#mypage_notification_wrapp').css('display') == 'none'){
			$('#mypage_notification_wrapp').slideDown('fast');
			ovarrayfunc();
			fukidashi_my = 1;
		}else{
			$('#mypage_notification_wrapp').slideUp('fast');
			ovarrayfunc_del();
			fukidashi_my = 0;
		}
	});
});

//-------------------------------------------------------------------------------------(；´∀｀)

//show 'detail'
$(function(){
	$('#detailsetting').click(function(){
		$('#detail_box').fadeIn();
	});
});

//-------------------------------------------------------------------------------------(；´∀｀)

//hide 'detail'
$(function(){
	$('#detail_box_close').click(function(){
		$('#detail_box').fadeOut();
	});
});

//-------------------------------------------------------------------------------------(；´∀｀)

//change invitefriends tab
$(function(){
	$('#tab_ul li').click(function(){
		var pastId = $(this).attr('id');
		$('#tab_ul li').removeClass('bg_ov').removeClass('top1px');
		$(this).addClass('bg_ov').addClass('top1px');
		$('.tab_wrapp').addClass('none');
		$('#'+pastId+'_area').removeClass('none');
		$('#scrollbar1').tinyscrollbar();
	});
});

//-------------------------------------------------------------------------------------(；´∀｀)

//show 'pull'
$(function(){
	$('#pullpullpull').click(function(){
		$('#pullarea').slideToggle('fast');
	});
});

//-------------------------------------------------------------------------------------(；´∀｀)

//show 'emoji'
var fukidashi_emoji = 0;
$(function(){
	$('#emoji_butt').live('click', function(){
		if($('#emoji_wrapp').css('display') == 'none'){
			$('#emoji_wrapp').slideDown('fast');
			ovarrayfunc();
			fukidashi_emoji = 1;
		}else{
			$('#emoji_wrapp').slideUp('fast');
			ovarrayfunc_del();
			fukidashi_emoji = 0;
		}
	});
});

//-------------------------------------------------------------------------------------(；´∀｀)

//show 'community list'
$(function(){
	$('#community_list a').click(function(){
		var whichId = $(this).attr('id');
		$('#community_list a').removeClass('active_thing').removeClass('top1px');
		$('#'+whichId).addClass('active_thing').addClass('top1px');
		$('.shownot').addClass('none');
		$('#'+whichId+'_area').removeClass('none');
	});
});

//-------------------------------------------------------------------------------------(；´∀｀)

//remeove tag '102'
$(function(){
	$('.tag_right').live('click',function(){
		$(this).parent().fadeOut('fast',function() { 
			$(this).remove(); 
		}); 
	});
});

//-------------------------------------------------------------------------------------(；´∀｀)

//appned tag '102'
var tag_num = 0;
$(function(){
	$('#appned_Tag').click(function(){
		$(this).before('<ul class="tagboxes"><li class="tag_left"></li><li class="tag_cent"><input type="text" name="word_tag_'+tag_num+'" value=""></li><li class="tag_right"></li></ul>');
		$('#word_tag_num').val(tag_num);
		tag_num++;
	});
});
//-------------------------------------------------------------------------------------(；´∀｀)
//for close function
$(function(){
	$('#original_overray').live('click', function(){
		if(fukidashi_my == 1){
			$('#mypage_notification_wrapp').slideUp('fast');
			fukidashi_my = 0;
			ovarrayfunc_del();

		}else if(fukidashi_emoji == 1){
			$('#emoji_wrapp').slideUp('fast');
			fukidashi_emoji = 0;
			ovarrayfunc_del();

		}else if(fukidashi_fukidashi == 1){
			$('#fukidashi_notification_wrapp').slideUp('fast');
			fukidashi_fukidashi = 0;
			ovarrayfunc_del();
		}
	});
});
//for close element to appned
var doc_h;
function ovarrayfunc(){
	doc_h = $(document).height();
	$('body').append('<div id="original_overray" style="height:'+doc_h+'px;"></div>');
}
function ovarrayfunc_del(){
	$('#original_overray').remove();
}
$(document).ready(function(){
	$(window).scroll(function(){
		doc_h = $(document).height();
		$('#original_overray').css('height',doc_h);
	});
});

