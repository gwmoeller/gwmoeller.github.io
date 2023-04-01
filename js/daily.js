//api urls to be used in grab
dailyjson = "https://api.guildwars2.com/v2/achievements/daily"
achievejson = "https://api.guildwars2.com/v2/achievements?ids="

/*
	get the daily achievements	
*/
function getDaily() {
	//load first url
	$.when($.getJSON(dailyjson),).done(function(data1) {
			//iterate through json format
			$.each(data1, function(index,element) {
				//empty string created/reset every iteration
				temp = ""
				//grabs element ids to be used for lookup in secondary url
				$.each(element, function(i, e) {
					if(e.level.max == 80) {
						temp += e.id + ","
					}
				})

				//checks to make sure temp is not empty then concatenates the second url with the ids list in temp
				//after grab is put together send it to setDaily()
				if(temp != "") {
					$.getJSON(achievejson + temp).done(function(data) {
						setDaily(index, data);
					});
				}
			});
		});

	setPactAgent();
}

/*
	filters and sets the data onto html site
*/
function setDaily(type, array) {
	switch(type) {
		case "pve":
			$('.pve-content').html(stringifyDaily(type, array));
			break;
		case "fractals":
			$('.fractals-content').html(stringifyDaily(type, array));
			break;
		case "wvw":
			$('.wvw-content').html(stringifyDaily(type, array));
			break;
		case "pvp":
			$('.pvp-content').html(stringifyDaily(type, array));
			break;
		case "special":
			$('.special-content').html(stringifyDaily(type, array));
	}
}

function getPactAgent() {
	merchLoc = ""

	//declaration of const variables for pact merchants
	arrays = [
		wastes = ["[&BIcHAAA=]", "[&BH8HAAA=]", "[&BH4HAAA=]", "[&BKsHAAA=]", "[&BJQHAAA=]", "[&BH8HAAA=]", "[&BIkHAAA=]"],
		jungle = ["[&BEwDAAA=]", "[&BEgAAAA=]", "[&BMIBAAA=]", "[&BE8AAAA=]", "[&BMMCAAA=]", "[&BLkCAAA=]", "[&BDoBAAA=]" ],
		orr = ["[&BNIEAAA=]", "[&BKgCAAA=]", "[&BP0CAAA=]", "[&BP0DAAA=]", "[&BJsCAAA=]", "[&BBEDAAA=]", "[&BO4CAAA=]"],
		kryta = ["[&BKYBAAA=]", "[&BBkAAAA=]", "[&BKYAAAA=]", "[&BIMAAAA=]", "[&BNUGAAA=]", "[&BJIBAAA=]", "[&BC0AAAA=]"],
		shiverpeaks = ["[&BIMCAAA=]", "[&BGQCAAA=]", "[&BDgDAAA=]", "[&BF0GAAA=]", "[&BHsBAAA=]", "[&BEICAAA=]", "[&BIUCAAA=]"],
		ascalon = ["[&BA8CAAA=]", "[&BIMBAAA=]", "[&BPEBAAA=]", "[&BOcBAAA=]", "[&BNMAAAA=]", "[&BBABAAA=]", "[&BCECAAA=]"],
	];

	//grabs current day of the week
	var d = new Date();
	var n = d.getDay();
	
	if(n == 0) {
		n = 7;
	}

	$.each(arrays, function(index, element) {
		merchLoc += element[n-1] + " ";
	});

	return merchLoc;
}

function setPactAgent() {
	locales = getPactAgent();
	fmerch = "<h4>Pact Supply Network Agents</h4> <p id=\"locale\">" + locales;
	$('.pact-merchant').html(fmerch + "</p>");
}

// turns data into a string and passes it back to be implemented
function stringifyDaily(type, array) {
	string = "<h4>" + type + "</h4>"
	$.each(array, function(index, element) {
		//pve does not have an icon, hardcode asset
		if(type == "pve") {
			element.icon = "https://wiki.guildwars2.com/images/1/14/Daily_Achievement.png"
		}
		else if(type == "fractals" && (element.name.includes("Daily Tier 1 ") || element.name.includes("Daily Tier 2 ") || element.name.includes("Daily Tier 3 "))) {
			return;
		}

		string += "<p>" + "<img src=" + element.icon + ">" + element.name + "</p>"	
	});

	return string;
}

function copyFunction(string) {
	locales = getPactAgent();
	navigator.clipboard.writeText(locales);
	alert("Pact Network Supply Agent locations copied.");
}

window.onload = getDaily();
