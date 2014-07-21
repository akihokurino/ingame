$(function(){
	var menu = $(".menu");

	menu.on("click", function(){
		$(".openMenu").slideToggle(200, function(){
		    $(this).queue([]);      // queueを空にする
	    	$(this).stop();         // アニメーション停止
		});
	});
});