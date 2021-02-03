/*
	Filename: treasury.js
	Author: Gage Moeller
	Topic: JavaScript
	Description: Grab JSON objects and filter needed materials for treasury
*/

var url = "https://api.guildwars2.com/v2/guild/32525C62-CE73-EA11-81AC-95DFE50946EB/treasury?access_token=6C82128E-774C-714A-B5E5-0ED0ECD1660DC1A2435C-2735-45D8-9A54-B710D22AB313&v=latest";
var url_2 = "https://gwmoeller.github.io/probotafessor/json/item_list.json"
var url_3 = "https://gwmoeller.github.io/probotafessor/json/guild_upgrades_update.json";
var url_4 = "https://api.guildwars2.com/v2/guild/32525C62-CE73-EA11-81AC-95DFE50946EB?access_token=6C82128E-774C-714A-B5E5-0ED0ECD1660DC1A2435C-2735-45D8-9A54-B710D22AB313&v=latest"
var url_5 = "https://api.guildwars2.com/v2/guild/32525C62-CE73-EA11-81AC-95DFE50946EB/upgrades?access_token=6C82128E-774C-714A-B5E5-0ED0ECD1660DC1A2435C-2735-45D8-9A54-B710D22AB313&v=latest"

function start() {
	$.when(
		$.getJSON(url),
		$.getJSON(url_2),
		$.getJSON(url_3),
		$.getJSON(url_4),
		$.getJSON(url_5),
		).done(function(data1, data2, data3, data4, data5) {
			
			var element_class = document.getElementById("blocker");
			element_class.classList.remove("blocker");

			const guildLvl = data4[0].level;
			const guildFavor = data4[0].favor;
			const guildAeth = data4[0].aetherium; 

			var upgradeIds = [];
			var itemIds = [];

			var upgradeList = [];

			var upgradeStr = "";
			var noUpgradeStr = "";
			var treasuryStr = "";

			var guildStr = $('#guild-info').html("<strong>Guild Level: </strong>" + guildLvl + "\n<strong>Aetherium: </strong>" + guildAeth + "\n<strong>Guild Favor: </strong>" + guildFavor + "\n<strong>Motd: </strong><span style=\"display: inline-block; vertical-align: top\">" + data4[0].motd + "</span>");
			guildStr.html(guildStr.html().replace(/\n/g, '<br>'));

			/* Grabs guild upgrades that are applicable*/
			$.each(data3[0], function(index,element) {
				var check = true;
				
				if(element.costs[0] != undefined && data5[0].includes(element.id) == false && element.costs[0] != 0 && element.build_time == 0 && element.required_level <= guildLvl) {
					
					if(element.costs[0].name == "Guild Favor") {
						
						for(var i = 0; i < element.prerequisites.length; i++) {
							
							if(data5[0].includes(element.prerequisites[i]) && element.prerequisites[0] != 240) {
							}
							else {
								check = false;
							}
						}

						if(check == true) {
							upgradeIds.push(element.id)
							/* Creates a list of item ids requested by the filtered down guild upgrades*/
							for(var i = 0; i < element.costs.length; i++) {
								if (!(itemIds.includes(element.costs[i].item_id)) && element.costs[i].item_id != undefined && element.costs[i].item_id != 70701) {
									itemIds.push(element.costs[i].item_id);
								}
							}

							upgradeList.push(element);
						}
					}
				}
			})

			var wrongPull = [];
			var currTreasury = [];

			$.each(data1[0], function(index, element) {
				wrongPull.push(element.item_id);
			})

			$.each(data2[0], function(index, element) {
				var total = 0;

				if(itemIds.includes(element.item_id)) {
					var curr = wrongPull.indexOf(element.item_id)
					
					for(var i = 0; i < data1[0][curr].needed_by.length; i++) {
						
						if(upgradeIds.includes(data1[0][curr].needed_by[i].upgrade_id)) {

							total += data1[0][curr].needed_by[i].count;
						}
					}

					var need = total - data1[0][curr].count;
					
					currTreasury.push({"item_id": data1[0][curr].item_id, "name": element.name, "icon": element.icon, "count": data1[0][curr].count})
					
					if(need != 0) {
						treasuryStr += "<div class=\"card text-center bg-dark cust-card\" onclick=\"imageSearch('" + element.name + "')\"> <img src=\"" + element.icon + "\" class=\"card-img-top\" title=\"" + element.name + "\"> <div class=\"card-body\"><p class=\"card-text\">" + need + "</p></div></div>";
					}
				}
			})

			var indexList = [];
			var pointer = 0;
			var overFavor = 0;

			$.each(currTreasury, function(index, element) {
				indexList.push(element.item_id);
			})

			$.each(upgradeList, function(index, element) {
				var upgradeTemp = [];

				itemTemp = "";
				var ready = true;

				for(var i = 0; i < element.costs.length; i++) {

					pointer = indexList.indexOf(element.costs[i].item_id);

					if(currTreasury[pointer] != undefined) {
						if(currTreasury[pointer].count >= element.costs[i].count) {
							itemTemp += ("<div id=\"" + currTreasury[pointer].name + "\" class=\"card text-center bg-dark cust-card\" onclick=\"imageSearch('" + currTreasury[pointer].name + "')\"> <img src=\"" + currTreasury[pointer].icon + "\" class=\"card-img-top\" title=\"" + currTreasury[pointer].name + "\"> <div class=\"card-body\"><p class=\"card-text\">" + element.costs[i].count + "/" + element.costs[i].count + "</p></div></div>");
						}
						else {
							itemTemp += ("<div id=\"" + currTreasury[pointer].name + "\" class=\"card text-center bg-dark cust-card\" onclick=\"imageSearch('" + currTreasury[pointer].name + "')\"> <img src=\"" + currTreasury[pointer].icon + "\" class=\"card-img-top\" title=\"" + currTreasury[pointer].name + "\"> <div class=\"card-body\"><p class=\"card-text\">" + currTreasury[pointer].count + "/" + element.costs[i].count + "</p></div></div>");
							ready = false;
						}	
					}
					else if(element.costs[i].name == "Guild Favor") {
						
						if(guildFavor >= element.costs[i].count) {
							overFavor = element.costs[i].count;
						}
						else {
							overFavor = guildFavor;
							ready = false;
						}

						itemTemp += ("<div id=\"" + element.costs[i].name + "\" class=\"card text-center bg-dark cust-card\" onclick=\"imageSearch('" + element.costs[i].name + "')\"> <img src=\"https://render.guildwars2.com/file/F3612F4D754A3FFCDB3C7BF56ED8A009AC4FA7FD/543926.png\" class=\"card-img-top\" title=\"" + element.costs[i].name + "\"> <div class=\"card-body\"><p class=\"card-text\">" + overFavor + "/" + element.costs[i].count + "</p></div></div>");
					}
					else if(element.costs[i].name == "Aetherium") {

						if(guildAeth >= element.costs[i].count) {
							overAeth = element.costs[i].count;
						}
						else {
							overAeth = guildAeth;
							ready = false;
						}

						itemTemp += ("<div class=\"card text-center bg-dark cust-card\"> <img src=\"https://wiki.guildwars2.com/images/2/23/Aetherium.png\" class=\"card-img-top\" title=\"" + element.costs[i].name + "\"> <div class=\"card-body\"><p class=\"card-text\">" + overAeth + "/" + element.costs[i].count + "</p></div></div>");
					}
					else if(element.costs[i].type == "Coins") {
						itemTemp += ("<div class=\"card text-center bg-dark cust-card\"> <img src=\"https://wiki.guildwars2.com/images/d/d7/Gold_coin_%28highres%29.png\" class=\"card-img-top\" title=\"Gold\"> <div class=\"card-body\"><p class=\"card-text\">" + element.costs[i].count/10000 + "</p></div></div>");
					}
				}

				if(ready != false) {
					upgradeStr += "<div class=\"upgrade-block\"><h4 id=\"" + element.name + "\" class=\"upgrade-title-cust\"><img style=\"width: 70px\" class=\"ready\" src=\"" + element.icon + "\"><span id=\"space-head-cust\">" + element.name + "</span></h4>" + itemTemp + "</div>";	
				}
				else {
					noUpgradeStr += "<div class=\"upgrade-block\"><h4 id=\"" + element.name + "\" class=\"upgrade-title-cust\"><img style=\"width: 70px\" class=\"not-ready\" src=\"" + element.icon + "\"><span id=\"space-head-cust\">" + element.name + "</span></h4>" + itemTemp + "</div>";
				}
				
			})

			upgradeStr += noUpgradeStr;

			$('#treasury-list').html(treasuryStr);
			$('#upgrade-list').html(upgradeStr);

			buildLib();
		})
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

		if(($(document).height() - document.documentElement.scrollTop) <= 1050) {
			$('#btn-cust').css("bottom", 140 + (920 - ($(document).height() - document.documentElement.scrollTop)))
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
