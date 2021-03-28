var url = "https://api.guildwars2.com/v2/guild/32525C62-CE73-EA11-81AC-95DFE50946EB/members?access_token=6C82128E-774C-714A-B5E5-0ED0ECD1660DC1A2435C-2735-45D8-9A54-B710D22AB313&v=latest";

function getMembers() {

	console.log("hello")
	$.when($.getJSON(url),
		).done(function(data1) {

			var memStr = "";

			$.each(data1, function(index, element) {
				if(element.rank != "") { //element.rank == "[role]" to filter what is pulled
					var fname = (element.name).split(".");
					memStr += "<div class=\"member-cust\" id=\"block-cust\" style=\"background-color: #000000;\"><h6>" + fname[0] + "</h6></div>";
				}
			});

			$('#member').html(memStr);
		})
}

var cName = document.getElementsByClassName("member-intro");
var arrow = document.getElementsByClassName("arrow");



function expandInfo(val) {
	if(cName[val - 1].className != "member-intro full-" + [val - 1]) {
		cName[val - 1].className = "member-intro full-" + [val - 1];
		arrow[val -1].className = "arrow up";
		$('.full-' + [val -1]).css({"height": cName[val - 1].scrollHeight});
		console.log(cName[val - 1].scrollHeight)
	}
	else if(cName[val -1].className == "member-intro full-" + [val - 1]){
		$('.full-' + [val -1]).css({"height":"50"});
		cName[val - 1].className = "member-intro";
		arrow[val -1].className = "arrow down";
	}
}

window.onload=getMembers();