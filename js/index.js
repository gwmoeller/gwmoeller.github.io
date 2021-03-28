
function dropCust() {
	var show = document.getElementsByClassName("dropdown-menu show");
	console.log(show.length)
	
	if(show.length > 0) {
		$(".expander").css({"height": "0px", "transition": "1s"});
		$(".dropdown .dropdown-menu").css({"-webkit-transition": "all 0.3s"})
	}
	else {
		$(".expander").css({"height": "100px", "transition": "0.3s"});
		$(".dropdown .dropdown-menu").css({"-webkit-transition": "all 1s"})
	}
}