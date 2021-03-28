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


			//Establishment of variables used for script. Ideally alot of these would be moved to a server, but I'm cheap and dont want to pay a couple of extra bucks.
			var guildArena = ["PvP mission", "PvP Reward", "Walls", "Weakness", "Strike", "Green", "Team-Color", "Vortex", "Fear", "Barrier", "Knockback", "Fan", "Chill", "Poison", "Flame Turrets", "Cripple", "Heal", "Lava", "Free-for-All", "Purple", "Invulnerable Fighters", "White"];
			var guildInitiative = ["General Merchant", "Repair Anvil", "Stash", "Guild Portal", "Further Exploration"];
			var guildMarket = ["Mission Slot: PvE", "Decorations Merchant 1", "Trader 1", "Trader 2", "Armorer 1", "Weaponsmith 1", "Magic Find", "Miniature Merchant 1", "Treasure Trove", "Decorations Merchant 2", "Decorations Merchant 3", "Monuments", "Trader 3", "Trader 4", "Trader 5", "Miniature Merchant 2", "Miniature Merchant 3", "Armorer 2", "Vault Transport", "Deep Cave", "Weaponsmith 2"];
			var guildMine = ["Excavation 1", "Excavation 2", "Excavation 3", "Capacity 1", "Capacity 2", "Rate 1", "Rate 2", "Capacity 3", "Capacity 4", "Capacity 5", "Rate 3", "Rate 4", "Capacity 6", "Rate 5", "Rate 6"];
			var guildTavern = ["City Themes", "Swiftness +11%", "Waypoint 5%", "XP", "Karma", "Gathering Bonus", "Karma", "XP", "MF", "Guild Road Marker", "Gold", "Anthem", "SAB Anthem", "SAB Music", "Swiftness +22%", "Swiftness +33%", "Waypoint 10%", "Waypoint 15%", "Guild Banquet", "Karma and XP", "Gold and MF", "Gathering and Swiftness", "Heroes", "World Events"];
			var guildWorkshop = ["Ore Synthesizer 1", "Ore Synthesizer 2", "Lumber Synthesizer 1", "Lumber Synthesizer 2", "Plant Synthesizer 1", "Leather Synthesizer 1", "Leather Synthesizer 2", "Cloth Synthesizer 1", "Cloth Synthesizer 2", "Synthesis 1", "Synthesis 2", "Critical Harvesting", "Critical Crafting", "Map Bonus", "Ore Synthesizer 3", "Ore Synthesizer 4", "Ore Synthesizer 5", "Ore Synthesizer 6", "Lumber Synthesizer 3", "Lumber Synthesizer 4", "Lumber Synthesizer 5", "Plant Synthesizer 2", "Plant Synthesizer 3", "Leather Synthesizer 3", "Leather Synthesizer 4", "Leather Synthesizer 5", "Cloth Synthesizer 3", "Cloth Synthesizer 4", "Cloth Synthesizer 5", "Synthesis 3", "Synthesis 4"];
			var guildWarRoom = ["Mission Slot: WvW", "Claim Camps", "Claim Towers", "Aura 1 Supply", "Aura 2 XP", "Aura 3 Speed", "Reward Tracks", "WvW Experience", "Minor Supply Drop", "Sabotage Depot", "Chilling Fog", "Armored Dolyaks", "Arrow Cart", "Invincible Dolyak", "Ballista", "Speedy Dolyaks", "Iron Guards", "Turtle Banner", "Catapult", "Claimed Keeps", "Stonemist Castle", "Aura 4 Power", "Aura 5 Precision", "Aura 6 Toughness", "Aura 7 Vitality", "Aura 8 MF", "Assault Roller", "Hardened Gates", "Hardened Siege", "Centaur Banner", "Packed Dolyaks", "Flame Ram", "Dragon Banner", "Invulnerable Fort", "Trebuchet", "Emergency Waypoint", "Turret Gates", "Golem", "Watchtower", "Presence of the Keep", "Shield Generator", "Cloaking Waters", "Airship Defense"];
			
			var merchStr = ["arena-upg", "initiative-upg", "market-upg", "mine-upg", "tavern-upg", "workshop-upg", "warroom-upg"]
			var merch = [guildArena, guildInitiative, guildMarket, guildMine, guildTavern, guildWorkshop, guildWarRoom];

			var [arenaStr, initiativeStr, marketStr, mineStr, tavernStr, workshopStr, warroomStr] = ["", "", "", "", "", "", ""];

			const guildLvl = data4[0].level;
			const guildFavor = data4[0].favor;
			const guildAeth = data4[0].aetherium; 

			var upgradeIds = [];
			var itemIds = [];

			var upgradeList = [];
			var treasuryStr = "";

			var element_class = document.getElementById("blocker");
			element_class.classList.remove("blocker");

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
							itemTemp += ("<div id=\"" + currTreasury[pointer].name + "\" class=\"card text-center bg-dark cust-card\" onclick=\"imageSearch('" + currTreasury[pointer].name + "')\"> <img src=\"" + currTreasury[pointer].icon + "\" class=\"card-img-top\" title=\"" + currTreasury[pointer].name + "\"> <div class=\"card-body\"><p class=\"card-text\">" + Math.round((element.costs[i].count/element.costs[i].count) * 100) + "%</p></div></div>");
						}
						else {
							itemTemp += ("<div id=\"" + currTreasury[pointer].name + "\" class=\"card text-center bg-dark cust-card\" onclick=\"imageSearch('" + currTreasury[pointer].name + "')\"><div><img src=\"" + currTreasury[pointer].icon + "\" class=\"card-img-top\" title=\"" + currTreasury[pointer].name + "\"><p class=\"remainder\">" + (element.costs[i].count - currTreasury[pointer].count) + "</p></div> <div class=\"card-body\"><p class=\"card-text\">" + Math.round((currTreasury[pointer].count/element.costs[i].count) * 100) + "%</p></div></div>");
							ready = false;
						}	
					}
					else if(element.costs[i].name == "Guild Favor") {
						
						if(guildFavor >= element.costs[i].count) {
							overFavor = element.costs[i].count;
							itemTemp += ("<div id=\"" + element.costs[i].name + "\" class=\"card text-center bg-dark cust-card\" onclick=\"imageSearch('" + element.costs[i].name + "')\"> <img src=\"https://render.guildwars2.com/file/F3612F4D754A3FFCDB3C7BF56ED8A009AC4FA7FD/543926.png\" class=\"card-img-top\" title=\"" + element.costs[i].name + "\"> <div class=\"card-body\"><p class=\"card-text\">" + Math.round((overFavor/element.costs[i].count) * 100) + "%</p></div></div>");
						}
						else {
							overFavor = guildFavor;
							itemTemp += ("<div id=\"" + element.costs[i].name + "\" class=\"card text-center bg-dark cust-card\" onclick=\"imageSearch('" + element.costs[i].name + "')\"> <div><img src=\"https://render.guildwars2.com/file/F3612F4D754A3FFCDB3C7BF56ED8A009AC4FA7FD/543926.png\" class=\"card-img-top\" title=\"" + element.costs[i].name + "\"> <p class=\"remainder\">" + (element.costs[i].count - overFavor) + "</p></div> <div class=\"card-body\"><p class=\"card-text\">" + Math.round((overFavor/element.costs[i].count) * 100) + "%</p></div></div>");
							ready = false;
						}

						
					}
					else if(element.costs[i].name == "Aetherium") {

						if(guildAeth >= element.costs[i].count) {
							overAeth = element.costs[i].count;
							itemTemp += ("<div class=\"card text-center bg-dark cust-card\"> <img src=\"https://wiki.guildwars2.com/images/2/23/Aetherium.png\" class=\"card-img-top\" title=\"" + element.costs[i].name + "\"> <div class=\"card-body\"><p class=\"card-text\">" +  Math.round((overAeth/element.costs[i].count) * 100) + "%</p></div></div>");
						}
						else {
							overAeth = guildAeth;
							itemTemp += ("<div class=\"card text-center bg-dark cust-card\"> <div><img src=\"https://wiki.guildwars2.com/images/2/23/Aetherium.png\" class=\"card-img-top\" title=\"" + element.costs[i].name + "\"><p class=\"remainder\">" + (element.costs[i].count - overAeth) + "</p></div><div class=\"card-body\"><p class=\"card-text\">" +  Math.round((overAeth/element.costs[i].count) * 100) + "%</p></div></div>");
							ready = false;
						}
					}
					else if(element.costs[i].type == "Coins") {
						itemTemp += ("<div class=\"card text-center bg-dark cust-card\"> <img src=\"https://wiki.guildwars2.com/images/d/d7/Gold_coin_%28highres%29.png\" class=\"card-img-top\" title=\"Gold\"> <div class=\"card-body\"><p class=\"card-text\">" + element.costs[i].count/10000 + "</p></div></div>");
					}
				}

				// Divides upgrades into their respective merchant
				for(var i=0; i <= merch.length -1; i++) {
					for(var y=0; y <= merch[i].length - 1; y++) {
						if(element.name.includes(merch[i][y])) {
							switch(merchStr[i]) {
								case "arena-upg":
									arenaStr = buildUpgStr(merchStr[i], ready, element, itemTemp, arenaStr);		
									break;
								case "tavern-upg":
									tavernStr = buildUpgStr(merchStr[i], ready, element, itemTemp, tavernStr);
									break;
								case "market-upg":
									marketStr = buildUpgStr(merchStr[i], ready, element, itemTemp, marketStr);
									break;
								case "initiative-upg":
									initiativeStr = buildUpgStr(merchStr[i], ready, element, itemTemp, initiativeStr);
									break;	
								case "mine-upg":
									mineStr = buildUpgStr(merchStr[i], ready, element, itemTemp, mineStr);
									break;
								case "workshop-upg":
									workshopStr = buildUpgStr(merchStr[i], ready, element, itemTemp, workshopStr);
									break;
								case "warroom-upg":
									warroomStr = buildUpgStr(merchStr[i], ready, element, itemTemp, warroomStr);
							}
						}
					}
				}		
			})

			// Builds Strings to be later posted once division of upgrade has finished looping.
			function buildUpgStr(merchant, ready, upgrade, items, string) {
				var readyStr = "";
				var notReadyStr = "";

				// If upgrade is ready to be added to guild it is prepended to the string, otherwise placed at the bottom
				if(ready == true) {
					readyStr = "<div class=\"upgrade-block\" id=\"" + upgrade.name + "\"><h5 id=\"" + upgrade.name + " ready\" class=\"upgrade-title-cust\"><img style=\"width: 70px\" class=\"ready\" src=\"" + upgrade.icon + "\"><span id=\"space-head-cust\">" + upgrade.name + "</span></h5>" + itemTemp + "</div>";
					temp = string.replace(/^/, readyStr);
					return temp;
				}
				else {
					notReadyStr = "<div class=\"upgrade-block\" id=\"" + upgrade.name + "\"><h5 id=\"" + upgrade.name + "\" class=\"upgrade-title-cust\"><img style=\"width: 70px\" class=\"not-ready\" src=\"" + upgrade.icon + "\"><span id=\"space-head-cust\">" + upgrade.name + "</span></h5>" + itemTemp + "</div>";
					temp = string + notReadyStr;
					return temp;
				}
			}


			// Mass post of strings to their respective spot on html page
			$('#treasury-list').html(treasuryStr);
			$('#arena-upg').html(arenaStr);
			$('#initiative-upg').html(initiativeStr);
			$('#market-upg').html(marketStr);
			$('#mine-upg').html(mineStr);
			$('#tavern-upg').html(tavernStr);
			$('#workshop-upg').html(workshopStr);
			$('#warroom-upg').html(warroomStr);

			removeEmpty();
			buildLib();
		})
}


function removeEmpty() {
	var groups = document.getElementsByClassName("treasury-sub-header-cust");
	console.log(groups)

	for(var i=0; i < groups.length; i++) {
		if(groups[i].nextElementSibling.outerText == "") {
			groups[i].style.display = "none";
		}
	}
}

//
//
//		DEFINITLY NEED TO REWORK HOW THE SEARCH FUNCTION WORKS
//		THERE ARE TOO MANY INEFFICIENCIES PRESENT AND REPEATED PROCESSES
//		HONESTLY ITS KIND OF CONFUSING HOW THE LIB SECTION JUMPS AROUND
//		NEEDS TO BE STREAMLINED
//
//


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

			if(res != null && res != "" && !kstr.includes(upgradeLib[i][n])) {
				kstr.push(upgradeLib[i][n]);
			}
		}
	}

	return kstr;
}


let timeout = null;

/*
	Used to search through the upgrade-list and present only relevant information to user based on query.
	Also will not pass value until typing has ceased for 1 second.
*/
function searchLib(input) {
	clearTimeout(timeout);
	var pres = [];

	timeout = setTimeout(function() {

		if(input.value != "" && input.value != " ") {
			var x = inputCheck(input.value)
		}

		if(x != undefined) {
			for(var i = 0; i < upgradeLib.length; i++) {
				for(var n = 0; n < x.length; n++) {
					if((upgradeLib[i].indexOf(x[n]) > -1)) {
						pres.push(upgradeLib[i][1]);
						break;
					}
				}
			}
		}
		filteredView(pres, input.value);
	}, 1000);
}


//Responsible for hiding and showing filterd information
function filteredView(results, input) {
	var tempUpgradeList = [];
	var filterPointer = [];

	

	$.each(upgradeLib, function(index, element) {
		if(element[1].includes("ready")) {
			var start = element[1].indexOf("ready") - 1;
			var end = element[1].length

			var result = element[1].replace(element[1].substring(start, end), "");

			tempUpgradeList.push(result);
		}

		tempUpgradeList.push(element[1]);
	})

	console.log(tempUpgradeList)

	if(results.length == 0 && input == "") {
		for(var i=0; i < tempUpgradeList.length; i++) {
			var r = document.getElementById(tempUpgradeList[i]);
			$(r).show();
		}
	}
	else {
		for(var i = 0; i < results.length; i++) {
			var remove = tempUpgradeList.indexOf(results[i]);
			
			if(input == "ready") {
				filterPointer.push(remove);
				remove = remove - 1;
			}
			
			filterPointer.push(remove);
		}

		for(var i = 0; i < tempUpgradeList.length; i++) {
			if(!filterPointer.includes(i)) {
				var r = document.getElementById(tempUpgradeList[i]);
				$(r).hide();
			}
			else {
				var r = document.getElementById(tempUpgradeList[i]);
				console.log(r);

				$(r).show();
			}
		}
	}
}

//
//	
//		END OF SECTION THAT NEEDS MAITENANCE
//		END OF SECTION THAT NEEDS MAITENANCE
//		END OF SECTION THAT NEEDS MAITENANCE
//		END OF SECTION THAT NEEDS MAITENANCE
//		END OF SECTION THAT NEEDS MAITENANCE
//
//

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