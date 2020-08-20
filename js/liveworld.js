/*
	Filename: test.js
	Author: Gage Moeller
	Topic: JavaScript
	Description: Create and update WvW map objects in intervals for html file.

	https://api.guildwars2.com/v2/wvw/matches?world=1002 --> borlis pass world match
*/

url = "http://api.guildwars2.com/v2/wvw/objectives";
url2 = "http://api.guildwars2.com/v2/wvw/matches?world=1002"
var built = false;
var count = 0;

function liveFunction() {

	$.when(
		$.getJSON(url),
		$.getJSON(url2),
	).done(function(data1, data2)  {

		$.each(data2[0].maps, function(index, element) {
			if(element.type == "Center") {
				if(built == false) {
					mapBuilder(element);
				}
				else {
					mapDivider(element);
				}
			}
		})

		// Sorts through data given and sends elements to getObjective()
		function mapDivider(map) {

			$.each(map.objectives, function(index, element) {
				if(element.type == "Castle") {
					getObjective(element.id, element.owner, "https://render.guildwars2.com/file/F0F1DA1C807444F4DF53090343F43BED02E50523/102608.png", element.last_flipped, element.claimed_by);
				}
				else if(element.type == "Keep") {
					getObjective(element.id, element.owner, "https://render.guildwars2.com/file/DB580419C8AD9449309A96C8E7C3D61631020EBB/102535.png", element.last_flipped, element.claimed_by);
				}
				else if(element.type == "Tower") {
					getObjective(element.id, element.owner, "https://render.guildwars2.com/file/ABEC80C79576A103EA33EC66FCB99B77291A2F0D/102531.png", element.last_flipped, element.claimed_by,);
				}
				else if(element.type == "Camp") {
					getObjective(element.id, element.owner, "https://render.guildwars2.com/file/015D365A08AAE105287A100AAE04529FDAE14155/102532.png", element.last_flipped, element.claimed_by);
				}
				else if(element.type == "Mercenary") {
					getObjective(element.id, element.owner, "https://wiki.guildwars2.com/images/thumb/4/40/Event_poleaxes.png/20px-Event_poleaxes.png", element.last_flipped);
				}
				else if(element.type == "Ruins") {
					getObjective(element.id, element.owner, "https://render.guildwars2.com/file/52B43242E55961770D78B80ED77BC764F0E57BF2/1635237.png", element.last_flipped);
				}
				else {
					getObjective(element.id, element.owner, "https://wiki.guildwars2.com/images/thumb/d/d2/Waypoint_%28map_icon%29.png/32px-Waypoint_%28map_icon%29.png", element.last_flipped);
				}
			});
		}	
	});
}

// Sorts data, and creates desired string to be printed
// local time = (utc - 7) - 12;
function getObjective(objective_id, color, picture, last_flipped, guild_id,) {

 	var time = last_flipped.match(/\d/g);

 	var date = (time.splice(4,2)).join("") + "-" + (time.splice(4,2)).join("") + "-" + (time.splice(0,4)).join("")
 	var timeStr = ":" + (time.splice(2,2)).join("") + ":" + (time.splice(2,2)).join("");


 	var hour = (time.splice(0,2)).join("") - 7;

 	if (hour < 0) {
 		hour = 24 + hour - 12
 		var curTime = hour + timeStr + "pm"
 	}
 	else if(hour > 12) {
 		hour = hour - 12
 		var curTime = hour + timeStr + "pm"
 	}
 	else {
 		var curTime = hour + timeStr + "am"
 	}

 	if(guild_id == undefined || guild_id == null) {
 		var string = "<img style='width: 20px' class='" + color + "' src='" + picture + "'> <p id=\"info\">" + "</p>";
 		printString(objective_id, string)
 	}
 	else {
 		$.getJSON(("http://api.guildwars2.com/v2/guild/" + guild_id), function(data2) {
 			var string = "<img style='width: 20px' class='" + color + "' src='" + picture + "'> <p id=\"info\">" + " [" + data2.tag + "] " + "</p>";
 			printString(objective_id, string);
 		});
 	}
}

//Prints the string to given id field
function printString(id, string) {
	$('#' + id).html(string);
}

// Responsible for building all divs needed for the live map. Seperating the building outside of interval function ensures the refresh wont look jumpy.
function mapBuilder(map) {

	var ebgStr = "";
	var redStr = "";
	var blueStr = "";
	var greenStr = "";

	var idStr = "";

	$.each(map.objectives, function(index, element) {
		if(map.type == "Center") {
			$.getJSON(url + "/" + element.id ,function(data) {
				ebgStr += ("<div class=\"" +  data.name + "\" id='" + element.id + "'></div>");
				$('#ebg-cust').html(ebgStr);
			});
		}
	});

	if(count < 1) {
		count += 1;
		liveFunction();
	}
	else {
		built = true;
		liveFunction();
	}
}

window.onload=liveFunction();
setInterval(liveFunction,10000);