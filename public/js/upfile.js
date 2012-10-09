$(function(){
	if(navigator.userAgent.indexOf('Firefox')>-1){		// if Firefox
		$("#file").attr('size','65');
	}
	if(navigator.userAgent.indexOf('Opera')<0){		// if not Opera
		$("#file").addClass("changeImage");
		$(".fileToImage").append('<input id="dummy_text" type="text" readonly="readonly" value="" style="width:347px;" />');
		$(".fileToImage").append('<img src="/images/makecommunity_choose.gif" id="dummy_btn" height="40" width="107" alt="file" />').hover(
			function(){
				$("#dummy_btn").attr("src","/images/makecommunity_choose.gif");	// ロールオーバーも仕込んでみる
			},
			function(){
				$("#dummy_btn").attr("src","/images/makecommunity_choose.gif");
			}
		);
		
		$('.fileToImage input:text').attr('value',$('input:file').attr('value'));
		if(navigator.userAgent.indexOf('MSIE')>-1){	// if IE
			$('#file').css('display','none');
			$('#dummy_text,#dummy_btn').click(function(){$("#file").click();return false;});
		}
	}
});
function changeFile(){
	$('#dummy_text').attr('value',$('#file').attr('value'));
}
