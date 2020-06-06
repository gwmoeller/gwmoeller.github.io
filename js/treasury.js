/*
	Filename: treasury.js
	Author: Gage Moeller
	Topic: JavaScript
	Description: Grab JSON objects and filter needed materials for treasury
*/

var url = "https://api.guildwars2.com/v2/guild/32525C62-CE73-EA11-81AC-95DFE50946EB/treasury?access_token=6C82128E-774C-714A-B5E5-0ED0ECD1660DC1A2435C-2735-45D8-9A54-B710D22AB313";
var url_2 = "https://gwmoeller.github.io/probotafessor/json/item_list.json"
var url_3 = "https://api.guildwars2.com/v2/guild/32525C62-CE73-EA11-81AC-95DFE50946EB/upgrades?access_token=6C82128E-774C-714A-B5E5-0ED0ECD1660DC1A2435C-2735-45D8-9A54-B710D22AB313";
var url_4 = "https://gwmoeller.github.io/probotafessor/json/guild_upgrades.json";


$.when(
	$.getJSON(url),
	$.getJSON(url_2),
	$.getJSON(url_3),
	$.getJSON(url_4),
	).done(function(data1, data2, data3, data4) {

		// establish variables to be used throughout the script
		var obj = [];
		var count = [];
		var need = [];
		var rem = [];
		var treasury_string = [];
		var upgrade = [];
		var upgrade_string = [];
		var currency = [];
		var evaluation = [];
		var checker = [];
		var ready_list = [];
		var top = [];

		// stores item ids and amount turned in into arrays and checks for remainder. Also grabs upgrages available to guild
		$.each(data1[0], function(index, element) {
			obj.push(element.item_id);
			count.push(element.count);

			$.each(element.needed_by, function(v, g) {
				var num = need[index]
				if(v > 0) {
					num += parseInt(element.needed_by[v].count);
					need[index] = num;
				}
				else {
					need.push(parseInt(element.needed_by[v].count));
				}

				var temp = (element.needed_by[v].upgrade_id);
				if(upgrade.includes(temp) == false) {
					upgrade.push(temp)
				}
			});

			rem.push(need[index] - count[index]);
		});	

		// stores string of needed items
		$.each(obj, function(index, element) {
			var count_1 = 0;
			while(element != data2[0][count_1].item_id) {
				count_1 += 1
			}
			if (rem[index] != 0) {
				treasury_string.push("<div class='card text-center bg-dark cust-card' onclick=\"imageSearch('" + data2[0][count_1].name + "')\" >  <img src='" + data2[0][count_1].icon + "' class='card-img-top' title='" + data2[0][count_1].name + "'> <div class='card-body'><p class='card-text'>" + rem[index] + "</p></div></div>");
			}
		})

		// prints treasuyr_string(array) to html
		$('#treasury-list').html(treasury_string);

		// sorts upgrade for corrective data computation
		upgrade.sort(function(a, b){return a- b});	

		// establishment of additional iteration variables
		var count_2 = 0;
		var count_3 = 0;

		// responsible for pringting entirety of available upgrades checking and checking availability for upgrade
		$.each(data4[0], function(index, element) {
			var check = true
			var holder = 0;

			if(element.id == upgrade[count_2]) {
				upgrade_string.push("<br><img class='upgrade-icon' src='" + element.icon + "'><h2 class='upgrade-title-cust'>" + element.name + "<h2>");
				upgrade_string.push("placeholder");

				count_2 += 1;

				$.each(element.costs, function(v, g) {
					if(g.item_id == undefined || g.item_id == 70701) {
						currency.push("<div class='card text-center bg-dark'> <img src='https://wiki.guildwars2.com/images/2/23/Aetherium.png' class='card-img-top' title='" + g.name + "'> <div class='card-body'><p class='card-text'>" + g.count + "</p></div></div>");
						if(g.item_id == undefined && count_2 != upgrade.length) {
							upgrade_string.push("<br><br><hr class='break'>")

						}
					}
					else {
						$.each(data1[0], function(n, e) {
							if(g.item_id == e.item_id) {
								if(g.count <= e.count) {
									evaluation.push(g.count + " / " + g.count);
								}
								else {
									evaluation.push(e.count + " / " + g.count);
									check = false;
								}
							}
						});

						$.each(data2[0], function(a, z) {
							if(g.item_id == z.item_id) {
								upgrade_string.push("<div class='card text-center bg-dark cust-card' onclick=\"imageSearch('" + z.name + "')\"> <img src='" + z.icon + "' class='card-img-top' title='" + z.name + "'> <div class='card-body'><p class='card-text'>" + evaluation[count_3] + "</p></div>");
								count_3 += 1;
								holder += 1;
								
								if(holder == (element.costs.length - 2)) {
									if(check == true) {
										checker.push("<div class='card text-center bg-success cust-check'><div class='card-body cust-check'><p class='card-text cust-check'>" + "Ready to Upgrade" + "</p></div></div>")
										top.push(element.costs.length - 2);
									}
									else {
										checker.push("<div class='card text-center bg-danger cust-check'><div class='card-body cust-check'><p class='card-text cust-check'>" + "Not Ready to Upgrade" + "</p></div></div>")
									}
								}
							}
						});
					}
				});
			}
		});

		// establihsment of additional iteration variables and array
		var remap = 0;

		var count_4 = 0;
		var remove = [];
		
		// responsible for removing "placeholder" with correct upgrade block desginated in the previous block of code and storing ready upgrades to differnt array.
		$.each(upgrade_string, function(index, element) {
			if(element == "placeholder") {
				upgrade_string[index] = checker[remap]
				remap += 1;
			}

			if(upgrade_string[index].includes("Ready to Upgrade") && !upgrade_string[index].includes("Not Ready to Upgrade")) {
				ready_list.push(upgrade_string[index-1])
				//remove.push(index - 1)

				for(var i=index; i <=(index+top[count_4]); i++) {
					ready_list.push(upgrade_string[i])
				}

				ready_list.push(upgrade_string[i]);
				remove.push(i - index + 2);
				remove.push(index - 2 )	;
				count_4 +=1;
			}
		});	

		// removes ready upgrades from original array
		for(var i=0; i < count_4; i++) {
			upgrade_string.splice(remove.pop(), remove.pop());
		}
		
		// error check for hr parameter
		if (ready_list.pop() == undefined) {
			ready_list.push("<br><br><hr class='break'>")
		}

		$('#ready-list').html(ready_list);
		$('#upgrade-list').html(upgrade_string);
	});

	// click images will respond with wiki page
	function imageSearch(val) {
		window.open("https://wiki.guildwars2.com/wiki/?search=" + val);
	}
