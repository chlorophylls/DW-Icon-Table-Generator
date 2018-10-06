$(document).ready(function () {

	imageCountUpdate();

	// Clicking the Copy to clipboard button in the GET YOUR CODE section copies the text in the textarea (outputTextarea) to the clipboard.
	$('#copyButton').on('click', function () {
		copyToClipboard();
	})

	// Clicking the + Add link button on the side of the "Add images 1-by-1" input field adds the link to the 'Currently added images' list (currentImages) on the right. 
	$('#addLinkButton').on('click', function (e) {
		var link = $('#singleImageURL').val();
		addSingleLink(link);
		$('#singleImageURL').val(''); // Resets the input field.
	});

	// Clicking the + Add multiple links button (addMultiLinksButtons) on the side of the "Add multiple images" input field adds the links to the 'Currently added images' list (currentImages) on the right. 
	$('#addMultiLinksButton').on('click', function (e) {
		addMultiLinks();
		$('#multipleImageURLs').val(''); // Resets the input field.
	});

	// Pressing the enter/return key after typing in the input field singleImageURL essentially does the same thing as clicking the + Add link button
	$('#singleImageURL').keypress(function (e) {
		var link = $('#singleImageURL').val();

		var keycode = (event.keyCode ? event.keyCode : event.which);
		if (keycode == '13') { // keycode 13 is the enter key
			addSingleLink(link);
			updateTable(); // Updates table in preview section.

			$('#singleImageURL').val(''); // Resets the input field.
		}
	});

	// Clicking the remove button in the Manage images section removes the select(ed) options
	$('#removeButton').click(function (e) {
		$("#currentImages option:selected").remove();
		imageCountUpdate();
	});

	// Clicking the move up button (moveUpButton) moves the select(ed) option(s) upwards.
	$('#moveUpButton').click(function () {

		$('#currentImages option:selected:first-child').prop("selected", false);
		var before = $('#currentImages option:selected:first').prev();
		$('#currentImages option:selected').detach().insertBefore(before);
	});

	// Clicking the move down button (moveDownButton) moves the select(ed) option(s) downwards.
	$('#moveDownButton').click(function () {

		$('#currentImages option:selected:last-child').prop("selected", false);
		var after = $('#currentImages option:selected:last').next();
		$('#currentImages option:selected').detach().insertAfter(after);
	});

	// Clicking the + Add album button (addImgurButton) adds all the images in the album linked by the URL input (imgurAlbumURL) to currentImages.
	$('#addImgurButton').click(function () {
		var link = $('#imgurAlbumURL').val();
		if (link.includes("imgur.com/a/")) { // If the input field does not start with 'https://imgur.com/a/', then it's not an Imgur album...probably.
			requestAlbumImages(link);
			imageCountUpdate();
			updateTable(); // Updates table in preview section.

			$('#imgurAlbumURL').val(''); // Resets the input field. Might take out later? Ask for feedback.

		} else { // Else, it doesn't have "imgur.com/a/" in the URL and thus is probably not an album.
			alert("Not a valid Imgur album! ...Probably.");
		}
	});

	// Pressing the enter/return key after typing in the input field imgurAlbumURL essentially does the same thing as clicking the + Add album button
	$('#imgurAlbumURL').keypress(function (e) {
		var link = $('#imgurAlbumURL').val();

		var keycode = (event.keyCode ? event.keyCode : event.which);
		if (keycode == '13') { // keycode 13 is the enter key

			if (link.includes("imgur.com/a/")) { // If the input field starts with 'https://imgur.com/a/', then it's an Imgur album...probably.
				requestAlbumImages(link);
				imageCountUpdate();
				updateTable(); // Updates table in preview section.

				$('#imgurAlbumURL').val(''); // Resets the input field. Might take out later? Ask for feedback.

			} else { // Else, it doesn't have "imgur.com/a/" in the URL and thus is probably not an album.
				alert("Not a valid Imgur album! ...Probably.");
			}
		}
	});

	// Updates table (runs updateTable) on any radio button change.
	$(":radio").change(function () {
		updateTable();
	});

	// Updates table (runs updateTable) on any form input change.
	$(":input").change(function () {
		updateTable();
	});

	// Updates table (runs updateTable) on any button click.
	$(":button").click(function () {
		updateTable();
	});

	// Enables Bootstrap popovers.
	$('[data-toggle="popover"]').popover({
		placement: 'top',
		delay: {
			"show": 200,
			"hide": 200
		}
	});

	// Popover for copy to clipboard button automatically hides itself after 2 seconds.
	$('[data-toggle="popover"]').click(function () {
		setTimeout(function () {
			$('[data-toggle="popover"]').popover('hide');
		}, 2000);
	});

});

// Requests all images from an Imgur album by grabbing the link from the input field and then sending a XMLHttpRequest
// to the API's endpoint, using processRequest().
// Authorization: Client-ID YOUR_CLIENT_ID
function requestAlbumImages(albumURL) {
	var albumID = albumURL.substring(20); // Chops off the first 20 characters aka the 'https://imgur.com/a/' part.   
	var requestURL = "https://api.imgur.com/3/album/" + albumID + "/images";
	var clientID = "4e821e6278838b7";
	var request = new XMLHttpRequest();

	// If it successfully connected, the request is processed.
	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == 200) {
			processRequest(request.responseText);
		} else { // Else, print an error to the console.
			console.log("Error with Imgur Request. Status = " + request.status + " Ready state = " + request.readyState);
		}
	}

	// Send request for authorization, attach client ID.
	request.open("GET", requestURL, true); // true for asynchronous     
	request.setRequestHeader('Authorization', 'Client-ID ' + clientID);
	request.send();
}

// Processes the XMLHttpRequest from requestAlbumImages() above, which receives a JSON response in return.
function processRequest(response_text) {
	if (response_text == "Not found") {
		alert("Imgur album not found.");
	} else {
		var parsedJSON = JSON.parse(response_text).data;

		// For each item in the 'data' array in the JSON response, grab the 'link' and add it as an option in the currentImages list.
		for (var i in parsedJSON) {
			var directLink = parsedJSON[i].link;
			addSingleLink(directLink); // Adds the link to currentImages
		}
	}
}

// Adds multiple links from the multipleImageURLs input field to currentImages. Split up by semicolons (;) for the time being.
function addMultiLinks() {
	var input = $('#multipleImageURLs').val();
	var splitInput = input.split(";");

	for (var i in splitInput) { // For every item in the splitInput array, add the link to currentImages.
		var link = splitInput[i];
		addSingleLink(link);
		imageCountUpdate();
	}
}

// Adds 1 link (passed on from another function) to currentImages
function addSingleLink(link) {
	$('#currentImages').append(new Option(link, link, false, true));
	imageCountUpdate();
}

// Updates the imageCount whenever it's called. 
// It updates by basically checking the amount of things/options in currentImages and then setting count to that.
function imageCountUpdate() {
	var count = $('#currentImages').children('option').length;
	document.getElementById("imageCounter").innerHTML = count;
}

// Updates the entire table and basically recreates the whole thing whenever it's called.
function updateTable() {
	// Variables that pull input information from the fields associated with formatting the numbering.
	var numSize = $('#numberSizeField').val();
	var numColor = $('#numberColorField').val();
	var numPrefix = $('#optionalPrefixField').val();
	var numBGColor = $('#cellBGColorField').val();
	var numStart = $('#startNumberField').val();
	var numPosition = $('input[name=np_radios]:checked').val();
	var numPadding = $('#numberCellPaddingField').val();

	// Variables that pull input information from the fields associated with formatting the overall table.
	var tableColor = $('#tableBGColorField').val();
	//var tableAlign = $('input[name=tableAlignmentButtons]:checked').val();
	var tableCellSpacing = $('#cellSpacingField').val();
	var tableHeader = $('#tableHeader').val();

	// Variables that pull input information from the fields associated with the icon border style (table styling section).
	var iconBorderColor = $('#iconBorderColorField').val();
	var iconBorderSize = $('#iconBorderSizeField').val();

	// Which nth icon in the list the link is, starts from 0 (first icon). 
	// This is for users making multiple tables, who choose different starting numbers.
	// E.g. Table 1 is 1-15, table 2 is 16 - 20, table 3 is 21 - 30. 
	var nthIcon = 0;

	var numIcons = $('#currentImages').children('option').length;

	var output = "";

	// Calculates how many rows are needed for the table.
	var numColumns = $('#imagesPerRow').val();
	var numRows = Math.ceil(numIcons / numColumns);
	//alert("numrows = " + numRows + " and numcols = " + numColumns);

	var link = "";

	// For every row needed in the table, creates a row.
	// Includes handling the numbering row (whether it's above (before) or below (after)).
	for (var i = 0; i < numRows; i++) {

		// If the numbers are supposed to be above the row, create a row of numbers at this point, before the icon cells have been made.
		var numOutput = "\n<tr>"; // Starts the numbering row.

		for (var j = 0; j < numColumns; j++) {
			if (i * numColumns + j < numIcons) {
				numOutput += createNumberCell(numSize, numColor, numStart, numPrefix, numBGColor, numPadding);
			}

			numStart++; // Increment the numbering
		}
		numOutput += "\n</tr>"; // Ends the numbering row.


		// If the numbers are not above, create the icon cell(s) like normal.
		if (numPosition == "above") {
			output += numOutput;
		}

		output += "\n<tr>"; // Starts the icon row.

		// For each icon in the row, creates an icon cell.
		for (j = 0; j < numColumns; j++) {
			// The image URL is the nth (nthIcon) icon in the list of image links in currentImages.
			link = $('#currentImages option').eq(nthIcon).text();

			var itemOutput = "";
			if (nthIcon < numIcons) {
				itemOutput = createIconCell(link, iconBorderColor, iconBorderSize);
			}
			output += itemOutput;
			nthIcon++; // Increment the icon numbering
		}

		output += "\n</tr>"; // Ends the icon row.

		// If the numbers are under, append the row of numbers to "output" at this point, after the icon cells have been made.
		if (numPosition == "under") {
			output += numOutput;
		}
	}

	// If tableColor exists and is not undefined, insert this piece of code into the table start code.
	if (tableColor) {
		tableColor = "background-color: " + tableColor + "; ";
	}

	/* Was supposed to align the table, but float makes things wonky and <table> align doesn't work anymore in HTML5, so it's centered by default.
	if (tableAlign) {
        tableAlign = " align:" + tableAlign;
    }*/

	if (tableCellSpacing) {
		tableCellSpacing = "border-collapse: separate; border-spacing: " + tableCellSpacing + "px;"
	}

	if (tableHeader) {
		tableHeader = "\n<tr><th colspan=\"" + numColumns + "\">" + tableHeader + "</th></tr>";
	}

	// This is the end output. The two fields below are basically the same thing, just that one is the raw code and the other is the HTML code put into action.	

	var tableStart = "<center><table style='" + tableCellSpacing + tableColor + "'>"; // Table start code.
	var tableEnd = "\n</table>"; // Table end code.

	var fullOutput = tableStart + tableHeader + output + tableEnd + generateCreditCode() + "</center>"; // Puts everything together.

	document.getElementById("previewOutput").innerHTML = fullOutput; // This is what's outputted in the live preview section.
	document.getElementById("outputTextarea").value = fullOutput; // This is the code that's going to be copy and pasted from the textarea.
}


// Creates the HTML code neede for the numbering cell. This is called every time you need to make a numbered cell.
function createNumberCell(numSize, numColor, number, prefix, bgColor, numPadding) {

	// Inserts or changes the size tags for the numbering.
	var sizeStart = "";
	var sizeEnd = "";

	switch (numSize) {
		case "small":
			sizeStart = "<small>";
			sizeEnd = "</small>";
			break;
		case "big":
			sizeStart = "<big>";
			sizeEnd = "</big>";
			break;
		default: // Normal size, do nothing and don't put any formatting.
			break;
	}

	// If numColor (aka the color of the number) is not empty/undefined/etc and actually exists, insert the code for table style.
	if (numColor) {
		numColor = "color: " + numColor + "; ";
	}
	// If bgcolor (aka the color of the background of this numbering cell) is not empty/undefined/etc and actually exists, insert the code for the bg style.
	if (bgColor) {
		bgColor = "background-color: " + bgColor + "; ";
	}
	// If numPadding (aka the border size of this numbering cell) is not empty/undefined/etc and actually exists, insert the code for the style.
	if (numPadding) {
		numPadding = "padding: " + numPadding + "px; ";
	}

	// Total output.
	return ("\n<td style='" + numColor + bgColor + numPadding + "text-align: center;'>" + sizeStart + prefix + number + sizeEnd + "</td>");
}

// Creates the HTML code for the icon cell when receiving the icon/image link.
function createIconCell(imageLink, iconBorderColor, iconBorderSize) {
	// If iconBorderColor is not empty/undefined/etc and actually exists, insert the code.
	if (iconBorderColor) {
		iconBorderColor = "background: " + iconBorderColor + "; "
	}
	// If iconBorderSize is not empty/undefined/etc and actually exists, insert the code.
	if (iconBorderSize) {
		iconBorderSize = "padding: " + iconBorderSize + "px;";
	}

	return "\n<td style='" + iconBorderColor + iconBorderSize + "'><img src='" + imageLink + "'/></td>"
}

// Function for copying the text in the final output textarea (outputTextarea) to the user's clipboard.
function copyToClipboard() {
	// Get the textarea field
	var copyText = document.getElementById("outputTextarea");

	// Select the whole textarea field.
	copyText.select();

	// Copy the text inside the field to the clipboard.
	document.execCommand("Copy");
}

// Returns the HTML code for including the credit for the icon table generator. 
// If the check box "tableCredit" is checked, it is included. Else, it spits out nothing.
function generateCreditCode() {
	var generatorLink = "https://chlorophylls.github.io/Dreamwidth-Icon-Table-Generator/";
	var output = "";
	if ($('#tableCredit').is(":checked")) {
		output = "\nIcon table generated by <a href='" + generatorLink + "'>Chlor's Dreamwidth Icon Table Generator</a>.";
	}
	return output;
}
