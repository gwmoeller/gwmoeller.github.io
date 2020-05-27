/*
	Filename: treasury.js
	Author: Gage Moeller
	Topic: JavaScript
	Description: Grab JSON objects and filter needed materials for treasury
*/

//Declaration of address to fix github issues
var url = "https://api.guildwars2.com/v2/guild/32525C62-CE73-EA11-81AC-95DFE50946EB/treasury?access_token=6C82128E-774C-714A-B5E5-0ED0ECD1660DC1A2435C-2735-45D8-9A54-B710D22AB313";
var url_2 = "https://api.guildwars2.com/v2/items";
var url_3 = "https://api.guildwars2.com/v2/guild/32525C62-CE73-EA11-81AC-95DFE50946EB/upgrades?access_token=6C82128E-774C-714A-B5E5-0ED0ECD1660DC1A2435C-2735-45D8-9A54-B710D22AB313";
var url_4 = "https://api.guildwars2.com/v2/guild/upgrades";

$.when(
	$.getJSON(url),
	$.getJSON(url_3),
	$.getJSON(url_4),
).done(function(data1, data2, data3) {

	var obj = [];
	var count = [];
	var need = [];
	var rem = [];
	var string = [];

	$.each(data1[0], function(index, element) {
		obj.push(element.item_id);
	});

	$.each(data1[0], function(index, element) {
		count.push(element.count);
	});

	$.each(data1[0], function(index, element) {
		$.each(element.needed_by, function(v, g) {
			var num = need[index]
			if (v > 0) {
				num += parseInt(element.needed_by[v].count);
				need[index] = num;
			}
			else {
				need.push(parseInt(element.needed_by[v].count));
				var num = 0;
			}
		});
	});

	$.each(data1[0], function(index, element) {
		rem.push(need[index] - count[index]);
	});

	$.each(data1[0], function(index, element) {
		$.getJSON(url_2 + "/" + obj[index], function(item) {
			if(rem[index] != 0) {
				string.push("<div class='card text-center'> <img src='" + item.icon + "' class='card-img-top' title='" + item.name + "'> <div class='card-body'><p class='card-text'>" + rem[index]+ "</p></div></div>");
			}

			$('#treasury-list').html(string);
		})
	})
});
