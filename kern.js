if (typeof jQuery == 'undefined') {
	var includejquery = document.createElement("script");
	includejquery.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.min.js";
	// var html_doc = document.getElementsByTagName('head').item(0);
	document.body.appendChild(includejquery);
}

jQuery.noConflict()(function() {
	var activeEl, unit, increment, kerning, adjustments, thePanel;
	kerning = 0;
	adjustments = {};
	thePanel =
		['<style>',
			'#kernjs_panel { height: 60px; width: 100%; margin: 0 auto; background: black }',
			'#kernjs_panel textarea { -moz-border-radius: 10px; -webkit-border-radius: 10px; border-radius: 10px; width: 280px; height: 30px; ',
		'</style>',

		'<div id="kernjs_panel">',
			'<form>',
				'<textarea>',
				'</textarea>',
			'</form>',
		'</div>'
	].join('\n');

	jQuery(document.body).prepend(thePanel);

	jQuery("h1, h2, h3, h4, h5, h6").click(function(event) { // Activate a word
		var el = event.target;
		jQuery(el).lettering(); // Call method from Lettering.js. This method splits up the clicked body of text into <span> elements containing single letters.
		jQuery(el).children().css('opacity', '.5');
		jQuery(el).children().mouseover(function() {
			jQuery(this).css('opacity', '1');
			jQuery(this).click(function(event) { // Listens for clicks on the newly created span objects.
				activeEl = event.target; // Set activeEl to represent the clicked letter.
				jQuery(activeEl).css('color', 'red');
			}); // end el click		
		});
		kerning = 0;
	});

	jQuery(document).keydown(function(event) {
		if(adjustments[jQuery(activeEl).attr("id")]) { // If there are current adjustments already made for this letter
			kerning = adjustments[jQuery(activeEl).attr("id")]; // Set the kerning variable to the previously made adjustments for this letter (stored inside the adjustments dictionary object)
		}
		if(event.which === 37) { // If left arrow key
			kerning--;
			jQuery(activeEl).css('margin-left', kerning);
			adjustments[jQuery(activeEl).attr("id")] = kerning; // add/modify the current letter's kerning information to the "adjustments" object.
//			jQuery("#kernjs_panel textarea").val(generateCSS(adjustments, unit, increment));
		}
		if(event.which === 39) { // If right arrow key
			kerning++;
			jQuery(activeEl).css('margin-left', kerning);
			adjustments[jQuery(activeEl).attr("id")] = kerning; // add/modify the current letter's kerning information to the "adjustments" object.
			generateCSS(adjustments, unit, increment);
//			jQuery("#kernjs_panel textarea").val(generateCSS(adjustments, unit, increment));
		}
	});
});

function generateCSS(adjustments, unit, increment) {
	var x, concatCSS, theCSS;
	theCSS = [];
	for(x in adjustments) {
		if(adjustments.hasOwnProperty(x)) {
			concatCSS = [
				"#" + x + " {",
				'\t' + 'margin-left: ' + adjustments[x] + 'px;',
				'}'
				].join('\n');
				theCSS = theCSS + '\n' + concatCSS;
				console.log(theCSS);
		}
	}
	return theCSS;
}