/*
	Filename: tp.js
	Author: Gage Moeller
	Topic: JavaScript
	Description: Function to complete simplisitic calculations 
*/

/* Declaration of gloabl variables needed in different functions  */
var currency = [];
var label = ['bgold', 'bsilver', 'bcopper', 'quantity1', 'sgold', 'ssilver', 'scopper', 'quantity2'];

/* Gets value from form and checks to make sure all inputs are valid to the scheme desired.
	Checks input to ensure whole number shows on user screen. If input fails, resets user screen  */
function getValue() {
	for(var i=0; i<label.length; i++) {
		/*	Checks input to ensure whole number shows on user screen. If input fails, resets user screen 
			to default value. More or less this if statemnt only exists for user "front-end" correction. */
		if (document.getElementById(label[i]).value % 1 != 0){
			document.getElementById(label[i]).value = "";

		}
		/*	Grabs input value and turns value into an integer, and places inside currency array 
			established in global values. */
		currency[i] = parseInt(document.getElementById(label[i]).value);
		/*	Checks values to ensure it is a number, upon failure the user current field is reset, and
			value is set to 0 for further computation. */
		if(isNaN(currency[i])) {
			if(i == 3 || i == 7) {
				document.getElementById(label[i]).value = 1;
				currency[i] = 1;
			}
			else {
				document.getElementById(label[i]).value = "";
				currency [i] = 0;
			}
		}
		/* Limits certain fields to match desired scheme. */		
		else if((i > 0 && i<3) || (i>4 && i<7)) {
			if(currency[i] > 99) {
				document.getElementById(label[i]).value = 99;
			}
		}
	}

	getConv();
}

/* Handles Conversion to desired scheme. */
function getConv() {
	/*	Establishment of different conversion numbers. */
	var conv = [10000, 100, 1, 1, 10000, 100, 1, 1];
	/*	Uses currency established in 'getValue()' converts to lowest currency available
		for further computation later on. */
	for(var i=0; i<conv.length; i++) {
		currency[i] = currency[i] * conv[i];
	}

	getTotal();
}

/* Handles mass computation of currency to desired format */
function getTotal() {
	/* Declaration of variables needed. */	
	var buying = 0;
	var selling = 0;
	var total = 0;

	/* Sums desired array length and stores inside declared variables. */
	for(var i=0; i<currency.length; i++) {
		if(i<3) {
			buying += currency[i];
		}
		else if(i>3 && i<7) {
			selling += currency[i];
		}
	}

	/* Declaration of needed variables to be used in further computation */
	var listing = (selling * .05);
	var tax = (selling * .1);
	var total= Math.round(((selling - listing - tax) * currency[7]) - (buying * currency[3]));

	/* Converts currency back to desired format. (i.e. gold, silver, and copper) */
	while( total != 0 ) {
		if(total >= 10000 || total <= -10000) {
			var gold = total / 10000;
			total = total % 10000;
		}
		else if(total >= 100 || total <= -100) {
			var silver = total / 100;
			total = total % 100;
		}
		else {
			var copper = total;
			total = 0;
		}
	}

	showOutput(gold, silver, copper);
}

/* Checks for any errors and then feeds output to form */
function showOutput() {

	var final = ['pgold', 'psilver', 'pcopper'];

	for(var i=0; i<arguments.length; i++) {
		if(isNaN(arguments[i])) {
			document.getElementById(final[i]).value = "";
		}
		else {
			document.getElementById(final[i]). value = Math.floor(arguments[i]);
		}
	}
}

/* event trigger */
$('.money').keyup(getValue); 
