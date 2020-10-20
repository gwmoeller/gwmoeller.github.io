/*
	Filename: treasury.js
	Author: Gage Moeller
	Topic: JavaScript
	Description: Grab JSON objects and filter needed materials for treasury
*/

var url = "https://api.guildwars2.com/v2/guild/32525C62-CE73-EA11-81AC-95DFE50946EB/treasury?access_token=6C82128E-774C-714A-B5E5-0ED0ECD1660DC1A2435C-2735-45D8-9A54-B710D22AB313&v=latest";
var url_2 = "https://gwmoeller.github.io/probotafessor/json/item_list.json"
var url_4 = "https://gwmoeller.github.io/probotafessor/json/guild_upgrades.json";
var url_5 = "https://api.guildwars2.com/v2/guild/32525C62-CE73-EA11-81AC-95DFE50946EB?access_token=6C82128E-774C-714A-B5E5-0ED0ECD1660DC1A2435C-2735-45D8-9A54-B710D22AB313&v=latest"

function start() {
	$.when(
		$.getJSON(url),
		$.getJSON(url_2),
		$.getJSON(url_4),
		$.getJSON(url_5),
		).done(function(data1, data2, data4, data5) {

			$.getJSON(url, function(data_check) {
				if (data1[0].length != data_check.length) {
					start();
				}
				else {
					var element_class = document.getElementById("blocker");
					element_class.classList.remove("blocker");
				}
			});
			
			/*
				Declaration of variables
			*/
			var shared_info = [];
			var key_list = [];

			var treasury_list = [];
			var treasury_string = "";

			var upgrade_key =[];
			var upgrade_list = [];
			var r_string = "";
			var n_string = "";
			var upgrade_string = "";

			var guildStr = $('#guild-info').html("<strong>Guild Level: </strong>" + data5[0].level + "\n<strong>Aetherium: </strong>" + data5[0].aetherium + "\n<strong>Guild Favor: </strong>" + data5[0].favor + "\n<strong>Motd: </strong><span style=\"display: inline-block; vertical-align: top\">" + data5[0].motd + "</span>");
			guildStr.html(guildStr.html().replace(/\n/g, '<br>'));
			//$('#guild-info').text(guildStr);

			/*
				creates array of item ids requested by the treasury
			*/
			$.each(data1[0], function(index, element) {
					treasury_list.push(element.item_id);
			});

			/*
				Compares array to json file and prints string for all items that have not been fulfilled,
				and finds upgrades that are available
			*/
			var count_a = 0;

			$.each(data2[0], function(index, element) {
				if(treasury_list.includes(element.item_id)) {

					var curr = (treasury_list.indexOf(element.item_id));
					var total = 0;

					for(var i=0; i < data1[0][curr].needed_by.length; i++) {
						total += data1[0][curr].needed_by[i].count;

						if(upgrade_list.includes(data1[0][curr].needed_by[i].upgrade_id) == false) {
							upgrade_list.push(data1[0][curr].needed_by[i].upgrade_id);	
						}
					}


					shared_info.push({"item_id":element.item_id, "icon":element.icon, "count":data1[0][curr].count, "total":total})

					need = total - data1[0][curr].count;

					if(need != 0) {
						treasury_string += "<div class=\"card text-center bg-dark cust-card\" onclick=\"imageSearch('" + element.name + "')\"> <img src=\"" + element.icon + "\" class=\"card-img-top\" title=\"" + element.name + "\"> <div class=\"card-body\"><p class=\"card-text\">" + need + "</p></div></div>";
					}

					count_a += 1;
				}
			});

			$.each(shared_info, function(index, element) {
				upgrade_key.push(element.item_id)
			});

			$.each(data4[0], function(index, element) {

				if(upgrade_list.includes(element.id)) {
					var ready = true
					var items = "";

					for(var i=0; i < element.costs.length; i++) {

						if(element.costs[i].item_id != undefined && element.costs[i].item_id != 70701) {
							var curr = (upgrade_key.indexOf(element.costs[i].item_id))

							if(shared_info[curr].count >= element.costs[i].count) {
								var cap = element.costs[i].count;
							}
							else {
								cap = shared_info[curr].count;
								ready = false;
							}

							items += ("<div id=\"" + element.costs[i].name + "\" class=\"card text-center bg-dark cust-card\" onclick=\"imageSearch('" + element.costs[i].name + "')\"> <img src=\"" + shared_info[curr].icon + "\" class=\"card-img-top\" title=\"" + element.costs[i].name + "\"> <div class=\"card-body\"><p class=\"card-text\">" + cap + "/" + element.costs[i].count + "</p></div></div>");
						}
						else if(element.costs[i].item_id == 70701) {
							items += ("<div class=\"card text-center bg-dark cust-card\"> <img src=\"https://render.guildwars2.com/file/F3612F4D754A3FFCDB3C7BF56ED8A009AC4FA7FD/543926.png\" class=\"card-img-top\" title=\"" + element.costs[i].name + "\"> <div class=\"card-body\"><p class=\"card-text\">" + element.costs[i].count + "</p></div></div>");
						}
						else{
							items += ("<div class=\"card text-center bg-dark cust-card\"> <img src=\"https://wiki.guildwars2.com/images/2/23/Aetherium.png\" class=\"card-img-top\" title=\"" + element.costs[i].name + "\"> <div class=\"card-body\"><p class=\"card-text\">" + element.costs[i].count + "</p></div></div>");
						}
					}

					if(ready == false) {
						n_string += "<div class=\"upgrade-block\"><h4 id=\"" + element.name + "\" class=\"upgrade-title-cust\"><img style=\"width: 70px\" class=\"not-ready\" src=\"" + element.icon + "\"><span id=\"space-head-cust\">" + element.name + "</span></h4>" + items + "</div>";
					}
					else {
						r_string += "<div class=\"upgrade-block\"><h4 id=\"" + element.name + "\" class=\"upgrade-title-cust\"><img style=\"width: 70px\" class=\"ready\" src=\"" + element.icon + "\"><span id=\"space-head-cust\">" + element.name + "</span></h4>" + items + "</div>";
					}
				}
			});

			upgrade_string = r_string + n_string;

			$('#treasury-list').html(treasury_string);
			$('#upgrade-list').html(upgrade_string);

			buildLib();
		});
}

/* 
	Use to build array from results found through api.
*/
var curr = 0;
var upgradeLib = [];

function buildLib() {
	var searchList = document.getElementsByClassName("upgrade-block");
	
	while(curr < searchList.length) {
		k_array= [];
		k_array.push(searchList[curr].innerHTML)

		for(var i=0; i <= searchList[curr].childElementCount - 2; i++) {
			k_array.push(searchList[curr].children[i].id)
		}
		
		upgradeLib.push(k_array);
		curr += 1;
	}
}

/*
	Used to compare user input  and correct search terms for comparison
*/
var searchStr = "";

function inputCheck(value) {
	searchStr = "";
	var kstr = [];

	var text = new RegExp(value, "gi");

	for(var i = 0; i < upgradeLib.length; i++) {
		for(var n = 1; n < upgradeLib[i].length; n++) {
			var res = upgradeLib[i][n].match(text);

			if(res != null && res != "" && ! kstr.includes(upgradeLib[i][n])) {
				kstr.push(upgradeLib[i][n]);
			}
		}
	}

	return kstr;
}

/*
	Used to search through the upgrade-list and present only relevant information to user based on query.
*/
function searchLib(input) {

	if(input.value != "" && input.value != " ") {
		var x = inputCheck(input.value)
	}

	if(input.value != "" && input.value != " ") {
		$('#upgrade-list').hide();
		$('#search-result').show();
	}
	else {
		$('#upgrade-list').show();
		$('#search-result').hide();
	}

	if(x != undefined) {
		for(var i = 0; i < upgradeLib.length; i++) {
			for(var n = 0; n < x.length; n++) {
				if((upgradeLib[i].indexOf(x[n]) > -1)) {
					searchStr += ("<div class=\"upgrade-block\">" + upgradeLib[i][0] + "</div>");
					break;
				}
			}
		}
	}

	$('#search-result').html(searchStr);
}


/*
	Presents user with go to top button, brings user to top when button is pressed
*/
function scrollFunction() {
	if(document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
		$('#btn-cust').show();
		$('#btn-cust').css("bottom", 10)

		if(($(document).height() - document.documentElement.scrollTop) <= 990) {
			$('#btn-cust').css("bottom", 100 + (920 - ($(document).height() - document.documentElement.scrollTop)))
		}
		else {
			$('#btn-cust').css("position", "fixed")
		}
	}
	else {
		$('#btn-cust').hide()
	}
}

function topFunction() {
	$('html, body').animate({ scrollTop: 0}, 'slow');
}

/*
	open wiki page for item
*/
function imageSearch(val) {
	window.open("https://wiki.guildwars2.com/wiki/?search=" + val);
}

window.onscroll= function() {scrollFunction()};
window.onload=start();