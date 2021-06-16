	
var expander = document.getElementsByClassName("expander");
var navlink = document.getElementsByClassName("dropdown-toggle");

function expandDrop() {
	
	var check = (navlink[0].ariaExpanded);
	console.log(check)

	switch(check) {
		case "false":
			$(expander).css("height", "100px");
			break;
		case "true":
			$(expander).css("height", "0px");
	}
}

function closeDrop() {
	$(expander).css("height", "0px");
}

document.getElementById("navbarDropdown").addEventListener("click", expandDrop);
window.addEventListener("click", closeDrop)