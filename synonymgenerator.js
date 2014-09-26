//GENERAL VARIABLES
var totalwordcount = 0;
var cleanarray = [] // for data after it has been cleaned and trimmed	
var language = 'fr'
var corpus = language + '-corpus.txt'

//SYNONYM GENERATOR VARIABLES

var ringdic = {};
var ringdictionarysize = 10000; // total size of ring stats dictionary
var synonymfloor = 0; 

var maxarraylength = 5000;
var denomconstant = .0001;
var synonymsmax = 50;
var synonymcorpusfactor = 0.01; //denotes what proportion of full text corpus is used for synonym generation - make things go faster
var synonymring = {};

//PRIORITY DICTIONARY VARIABLES
var prioritydictionaryoutsize = 1000000; // total size of priority output dictionary
var priorityminimum = 3; // words must appear more than this minimum amount of times to be included in output dictionary

var prioritydic = {};
var trigramdic = {};
var sortedwordspace = {};
var capswordspace = {};
var capsthreshold = 0.8; //if proportion of caps version exceeds this threshold, shunted to another matrix

	
//PROTOTYPE FUNCTIONS FOR CHANGING LATIN CHARACTERS INTO REGULAR CHARACTERS
var Latinise={};Latinise.latin_map={"Á":"A","Ă":"A","Ắ":"A","Ặ":"A","Ằ":"A","Ẳ":"A","Ẵ":"A","Ǎ":"A","Â":"A","Ấ":"A","Ậ":"A","Ầ":"A","Ẩ":"A","Ẫ":"A","Ä":"A","Ǟ":"A","Ȧ":"A","Ǡ":"A","Ạ":"A","Ȁ":"A","À":"A","Ả":"A","Ȃ":"A","Ā":"A","Ą":"A","Å":"A","Ǻ":"A","Ḁ":"A","Ⱥ":"A","Ã":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ḃ":"B","Ḅ":"B","Ɓ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ć":"C","Č":"C","Ç":"C","Ḉ":"C","Ĉ":"C","Ċ":"C","Ƈ":"C","Ȼ":"C","Ď":"D","Ḑ":"D","Ḓ":"D","Ḋ":"D","Ḍ":"D","Ɗ":"D","Ḏ":"D","ǲ":"D","ǅ":"D","Đ":"D","Ƌ":"D","Ǳ":"DZ","Ǆ":"DZ","É":"E","Ĕ":"E","Ě":"E","Ȩ":"E","Ḝ":"E","Ê":"E","Ế":"E","Ệ":"E","Ề":"E","Ể":"E","Ễ":"E","Ḙ":"E","Ë":"E","Ė":"E","Ẹ":"E","Ȅ":"E","È":"E","Ẻ":"E","Ȇ":"E","Ē":"E","Ḗ":"E","Ḕ":"E","Ę":"E","Ɇ":"E","Ẽ":"E","Ḛ":"E","Ꝫ":"ET","Ḟ":"F","Ƒ":"F","Ǵ":"G","Ğ":"G","Ǧ":"G","Ģ":"G","Ĝ":"G","Ġ":"G","Ɠ":"G","Ḡ":"G","Ǥ":"G","Ḫ":"H","Ȟ":"H","Ḩ":"H","Ĥ":"H","Ⱨ":"H","Ḧ":"H","Ḣ":"H","Ḥ":"H","Ħ":"H","Í":"I","Ĭ":"I","Ǐ":"I","Î":"I","Ï":"I","Ḯ":"I","İ":"I","Ị":"I","Ȉ":"I","Ì":"I","Ỉ":"I","Ȋ":"I","Ī":"I","Į":"I","Ɨ":"I","Ĩ":"I","Ḭ":"I","Ꝺ":"D","Ꝼ":"F","Ᵹ":"G","Ꞃ":"R","Ꞅ":"S","Ꞇ":"T","Ꝭ":"IS","Ĵ":"J","Ɉ":"J","Ḱ":"K","Ǩ":"K","Ķ":"K","Ⱪ":"K","Ꝃ":"K","Ḳ":"K","Ƙ":"K","Ḵ":"K","Ꝁ":"K","Ꝅ":"K","Ĺ":"L","Ƚ":"L","Ľ":"L","Ļ":"L","Ḽ":"L","Ḷ":"L","Ḹ":"L","Ⱡ":"L","Ꝉ":"L","Ḻ":"L","Ŀ":"L","Ɫ":"L","ǈ":"L","Ł":"L","Ǉ":"LJ","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ń":"N","Ň":"N","Ņ":"N","Ṋ":"N","Ṅ":"N","Ṇ":"N","Ǹ":"N","Ɲ":"N","Ṉ":"N","Ƞ":"N","ǋ":"N","Ñ":"N","Ǌ":"NJ","Ó":"O","Ŏ":"O","Ǒ":"O","Ô":"O","Ố":"O","Ộ":"O","Ồ":"O","Ổ":"O","Ỗ":"O","Ö":"O","Ȫ":"O","Ȯ":"O","Ȱ":"O","Ọ":"O","Ő":"O","Ȍ":"O","Ò":"O","Ỏ":"O","Ơ":"O","Ớ":"O","Ợ":"O","Ờ":"O","Ở":"O","Ỡ":"O","Ȏ":"O","Ꝋ":"O","Ꝍ":"O","Ō":"O","Ṓ":"O","Ṑ":"O","Ɵ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Õ":"O","Ṍ":"O","Ṏ":"O","Ȭ":"O","Ƣ":"OI","Ꝏ":"OO","Ɛ":"E","Ɔ":"O","Ȣ":"OU","Ṕ":"P","Ṗ":"P","Ꝓ":"P","Ƥ":"P","Ꝕ":"P","Ᵽ":"P","Ꝑ":"P","Ꝙ":"Q","Ꝗ":"Q","Ŕ":"R","Ř":"R","Ŗ":"R","Ṙ":"R","Ṛ":"R","Ṝ":"R","Ȑ":"R","Ȓ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꜿ":"C","Ǝ":"E","Ś":"S","Ṥ":"S","Š":"S","Ṧ":"S","Ş":"S","Ŝ":"S","Ș":"S","Ṡ":"S","Ṣ":"S","Ṩ":"S","Ť":"T","Ţ":"T","Ṱ":"T","Ț":"T","Ⱦ":"T","Ṫ":"T","Ṭ":"T","Ƭ":"T","Ṯ":"T","Ʈ":"T","Ŧ":"T","Ɐ":"A","Ꞁ":"L","Ɯ":"M","Ʌ":"V","Ꜩ":"TZ","Ú":"U","Ŭ":"U","Ǔ":"U","Û":"U","Ṷ":"U","Ü":"U","Ǘ":"U","Ǚ":"U","Ǜ":"U","Ǖ":"U","Ṳ":"U","Ụ":"U","Ű":"U","Ȕ":"U","Ù":"U","Ủ":"U","Ư":"U","Ứ":"U","Ự":"U","Ừ":"U","Ử":"U","Ữ":"U","Ȗ":"U","Ū":"U","Ṻ":"U","Ų":"U","Ů":"U","Ũ":"U","Ṹ":"U","Ṵ":"U","Ꝟ":"V","Ṿ":"V","Ʋ":"V","Ṽ":"V","Ꝡ":"VY","Ẃ":"W","Ŵ":"W","Ẅ":"W","Ẇ":"W","Ẉ":"W","Ẁ":"W","Ⱳ":"W","Ẍ":"X","Ẋ":"X","Ý":"Y","Ŷ":"Y","Ÿ":"Y","Ẏ":"Y","Ỵ":"Y","Ỳ":"Y","Ƴ":"Y","Ỷ":"Y","Ỿ":"Y","Ȳ":"Y","Ɏ":"Y","Ỹ":"Y","Ź":"Z","Ž":"Z","Ẑ":"Z","Ⱬ":"Z","Ż":"Z","Ẓ":"Z","Ȥ":"Z","Ẕ":"Z","Ƶ":"Z","Ĳ":"IJ","Œ":"OE","ᴀ":"A","ᴁ":"AE","ʙ":"B","ᴃ":"B","ᴄ":"C","ᴅ":"D","ᴇ":"E","ꜰ":"F","ɢ":"G","ʛ":"G","ʜ":"H","ɪ":"I","ʁ":"R","ᴊ":"J","ᴋ":"K","ʟ":"L","ᴌ":"L","ᴍ":"M","ɴ":"N","ᴏ":"O","ɶ":"OE","ᴐ":"O","ᴕ":"OU","ᴘ":"P","ʀ":"R","ᴎ":"N","ᴙ":"R","ꜱ":"S","ᴛ":"T","ⱻ":"E","ᴚ":"R","ᴜ":"U","ᴠ":"V","ᴡ":"W","ʏ":"Y","ᴢ":"Z","á":"a","ă":"a","ắ":"a","ặ":"a","ằ":"a","ẳ":"a","ẵ":"a","ǎ":"a","â":"a","ấ":"a","ậ":"a","ầ":"a","ẩ":"a","ẫ":"a","ä":"a","ǟ":"a","ȧ":"a","ǡ":"a","ạ":"a","ȁ":"a","à":"a","ả":"a","ȃ":"a","ā":"a","ą":"a","ᶏ":"a","ẚ":"a","å":"a","ǻ":"a","ḁ":"a","ⱥ":"a","ã":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ḃ":"b","ḅ":"b","ɓ":"b","ḇ":"b","ᵬ":"b","ᶀ":"b","ƀ":"b","ƃ":"b","ɵ":"o","ć":"c","č":"c","ç":"c","ḉ":"c","ĉ":"c","ɕ":"c","ċ":"c","ƈ":"c","ȼ":"c","ď":"d","ḑ":"d","ḓ":"d","ȡ":"d","ḋ":"d","ḍ":"d","ɗ":"d","ᶑ":"d","ḏ":"d","ᵭ":"d","ᶁ":"d","đ":"d","ɖ":"d","ƌ":"d","ı":"i","ȷ":"j","ɟ":"j","ʄ":"j","ǳ":"dz","ǆ":"dz","é":"e","ĕ":"e","ě":"e","ȩ":"e","ḝ":"e","ê":"e","ế":"e","ệ":"e","ề":"e","ể":"e","ễ":"e","ḙ":"e","ë":"e","ė":"e","ẹ":"e","ȅ":"e","è":"e","ẻ":"e","ȇ":"e","ē":"e","ḗ":"e","ḕ":"e","ⱸ":"e","ę":"e","ᶒ":"e","ɇ":"e","ẽ":"e","ḛ":"e","ꝫ":"et","ḟ":"f","ƒ":"f","ᵮ":"f","ᶂ":"f","ǵ":"g","ğ":"g","ǧ":"g","ģ":"g","ĝ":"g","ġ":"g","ɠ":"g","ḡ":"g","ᶃ":"g","ǥ":"g","ḫ":"h","ȟ":"h","ḩ":"h","ĥ":"h","ⱨ":"h","ḧ":"h","ḣ":"h","ḥ":"h","ɦ":"h","ẖ":"h","ħ":"h","ƕ":"hv","í":"i","ĭ":"i","ǐ":"i","î":"i","ï":"i","ḯ":"i","ị":"i","ȉ":"i","ì":"i","ỉ":"i","ȋ":"i","ī":"i","į":"i","ᶖ":"i","ɨ":"i","ĩ":"i","ḭ":"i","ꝺ":"d","ꝼ":"f","ᵹ":"g","ꞃ":"r","ꞅ":"s","ꞇ":"t","ꝭ":"is","ǰ":"j","ĵ":"j","ʝ":"j","ɉ":"j","ḱ":"k","ǩ":"k","ķ":"k","ⱪ":"k","ꝃ":"k","ḳ":"k","ƙ":"k","ḵ":"k","ᶄ":"k","ꝁ":"k","ꝅ":"k","ĺ":"l","ƚ":"l","ɬ":"l","ľ":"l","ļ":"l","ḽ":"l","ȴ":"l","ḷ":"l","ḹ":"l","ⱡ":"l","ꝉ":"l","ḻ":"l","ŀ":"l","ɫ":"l","ᶅ":"l","ɭ":"l","ł":"l","ǉ":"lj","ſ":"s","ẜ":"s","ẛ":"s","ẝ":"s","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ᵯ":"m","ᶆ":"m","ń":"n","ň":"n","ņ":"n","ṋ":"n","ȵ":"n","ṅ":"n","ṇ":"n","ǹ":"n","ɲ":"n","ṉ":"n","ƞ":"n","ᵰ":"n","ᶇ":"n","ɳ":"n","ñ":"n","ǌ":"nj","ó":"o","ŏ":"o","ǒ":"o","ô":"o","ố":"o","ộ":"o","ồ":"o","ổ":"o","ỗ":"o","ö":"o","ȫ":"o","ȯ":"o","ȱ":"o","ọ":"o","ő":"o","ȍ":"o","ò":"o","ỏ":"o","ơ":"o","ớ":"o","ợ":"o","ờ":"o","ở":"o","ỡ":"o","ȏ":"o","ꝋ":"o","ꝍ":"o","ⱺ":"o","ō":"o","ṓ":"o","ṑ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","õ":"o","ṍ":"o","ṏ":"o","ȭ":"o","ƣ":"oi","ꝏ":"oo","ɛ":"e","ᶓ":"e","ɔ":"o","ᶗ":"o","ȣ":"ou","ṕ":"p","ṗ":"p","ꝓ":"p","ƥ":"p","ᵱ":"p","ᶈ":"p","ꝕ":"p","ᵽ":"p","ꝑ":"p","ꝙ":"q","ʠ":"q","ɋ":"q","ꝗ":"q","ŕ":"r","ř":"r","ŗ":"r","ṙ":"r","ṛ":"r","ṝ":"r","ȑ":"r","ɾ":"r","ᵳ":"r","ȓ":"r","ṟ":"r","ɼ":"r","ᵲ":"r","ᶉ":"r","ɍ":"r","ɽ":"r","ↄ":"c","ꜿ":"c","ɘ":"e","ɿ":"r","ś":"s","ṥ":"s","š":"s","ṧ":"s","ş":"s","ŝ":"s","ș":"s","ṡ":"s","ṣ":"s","ṩ":"s","ʂ":"s","ᵴ":"s","ᶊ":"s","ȿ":"s","ɡ":"g","ᴑ":"o","ᴓ":"o","ᴝ":"u","ť":"t","ţ":"t","ṱ":"t","ț":"t","ȶ":"t","ẗ":"t","ⱦ":"t","ṫ":"t","ṭ":"t","ƭ":"t","ṯ":"t","ᵵ":"t","ƫ":"t","ʈ":"t","ŧ":"t","ᵺ":"th","ɐ":"a","ᴂ":"ae","ǝ":"e","ᵷ":"g","ɥ":"h","ʮ":"h","ʯ":"h","ᴉ":"i","ʞ":"k","ꞁ":"l","ɯ":"m","ɰ":"m","ᴔ":"oe","ɹ":"r","ɻ":"r","ɺ":"r","ⱹ":"r","ʇ":"t","ʌ":"v","ʍ":"w","ʎ":"y","ꜩ":"tz","ú":"u","ŭ":"u","ǔ":"u","û":"u","ṷ":"u","ü":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǖ":"u","ṳ":"u","ụ":"u","ű":"u","ȕ":"u","ù":"u","ủ":"u","ư":"u","ứ":"u","ự":"u","ừ":"u","ử":"u","ữ":"u","ȗ":"u","ū":"u","ṻ":"u","ų":"u","ᶙ":"u","ů":"u","ũ":"u","ṹ":"u","ṵ":"u","ᵫ":"ue","ꝸ":"um","ⱴ":"v","ꝟ":"v","ṿ":"v","ʋ":"v","ᶌ":"v","ⱱ":"v","ṽ":"v","ꝡ":"vy","ẃ":"w","ŵ":"w","ẅ":"w","ẇ":"w","ẉ":"w","ẁ":"w","ⱳ":"w","ẘ":"w","ẍ":"x","ẋ":"x","ᶍ":"x","ý":"y","ŷ":"y","ÿ":"y","ẏ":"y","ỵ":"y","ỳ":"y","ƴ":"y","ỷ":"y","ỿ":"y","ȳ":"y","ẙ":"y","ɏ":"y","ỹ":"y","ź":"z","ž":"z","ẑ":"z","ʑ":"z","ⱬ":"z","ż":"z","ẓ":"z","ȥ":"z","ẕ":"z","ᵶ":"z","ᶎ":"z","ʐ":"z","ƶ":"z","ɀ":"z","ﬀ":"ff","ﬃ":"ffi","ﬄ":"ffl","ﬁ":"fi","ﬂ":"fl","ĳ":"ij","œ":"oe","ﬆ":"st","ₐ":"a","ₑ":"e","ᵢ":"i","ⱼ":"j","ₒ":"o","ᵣ":"r","ᵤ":"u","ᵥ":"v","ₓ":"x"};
String.prototype.latinise=function(){return this.replace(/[^A-Za-z0-9\[\] ]/g,function(a){return Latinise.latin_map[a]||a})};
String.prototype.latinize=String.prototype.latinise;
String.prototype.isLatin=function(){return this==this.latinise()}

	
//GENERATE PRIORITY AND SYNONYM DICTIONARIES
var fs = require('fs');
fs.readFile(corpus, function(err, data) {
	synwordspace = {};
	wordspace = {};
    if(err) throw err;
    var dataarray = data.toString().split("\n");
    for(i in dataarray) {
		if(Math.floor(i/10000) == i/10000){
			console.log(i)
		}
		linestring = dataarray[i]	

		linestring = linestring.trim() //trim trailing and following whitespace
		
		linestring = linestring.replace(/_/g, ' ') //removes underscores and replaces with spaces
		linestring = linestring.replace(/--/g, ' ') //removes dashes and replaces with spaces
		linestring = linestring.replace(/—/g, ' ') //removes SINGLE CHARACTER dashes and replaces with spaces
		linestring = linestring.replace(/’/g, "'") //removes unusual apostrophes and replaces with regular apostrophes
		
		linestring = linestring.replace(/-/g, '_') //removes dashes and replaces with underscores
		linestring = linestring.replace(/'/g, '_') //removes apostrophes and replaces with underscores
		
		linestring = linestring.latinise() //replace any accented characters with pure latin forms
		
		linestring = linestring.replace(/[^A-Za-z\s_]/g, '') //removes EVERYTHING except letters and spaces (and underscores)
		
		linestring = linestring.replace(/\s{2,}/g, ' '); //trims multiple spaces into singles
		
		capsstring = linestring;
		
		linestring = linestring.toLowerCase();
		
		cleanarray.push(linestring);
		
		//count individual words
		linearray = linestring.split(" ");
		capsarray = capsstring.split(" ");
		wordsinline = linearray.length;
		for(j = 0; j < wordsinline; j++) {
			capsword = capsarray[j];
			activeword = linearray[j];		
			
			if(checkword(activeword)){ 
				totalwordcount += 1; 
				if(wordspace[activeword]){
					wordspace[activeword].n = wordspace[activeword].n + 1;
				}
				else{
					if(activeword.length > 0){ //eliminates issue of blank keys
						wordspace[activeword] = new Object();
						wordspace[activeword].n = 1; // total instances
						wordspace[activeword].u = 0; // upper case instances
						wordspace[activeword].l = 0; // lower case instances
						wordspace[activeword].b = new Object();
						wordspace[activeword].z = new Object();
					}
				}
				
				
				
				if(synwordspace[activeword]){
					synwordspace[activeword].n = synwordspace[activeword].n + 1;
				}
				else{
					if(activeword.length > 0){ //eliminates issue of blank keys
						synwordspace[activeword] = new Object();
						synwordspace[activeword].n = 1; // total instances
						synwordspace[activeword].u = 0; // upper case instances
						synwordspace[activeword].l = 0; // lower case instances
					}
				}
				if(capsword == activeword){
					synwordspace[activeword].l = wordspace[activeword].l + 1;
				}
				else{
					synwordspace[activeword].u = wordspace[activeword].u + 1;
				}
				
			}
		}
    }
	
	//remove instances that are less than the required minimum
	keys = Object.keys(synwordspace)
	for(j = 0; j < keys.length; j++) {
		activeword = keys[j]
		//deletes them if they don't include the required number of instances - does this last because it messes up process if done first
		if(synwordspace[activeword].n >= priorityminimum){
			//does nothing
		}
		else{
			delete synwordspace[activeword];
		}
	}
	
	//countsorter tops out at around 100k words, so watch for that
	ringwordspace = countsorter(synwordspace,ringdictionarysize) 
	ringwordsarray = Object.keys(ringwordspace)
	
	trimmedringwordsarray = []
	trimmedringwordspace = {};
	//trim out words above threshold so they are not considered
	for(j = 0; j < ringwordsarray.length; j++) {
		if(j >= synonymfloor){
			trimmedringwordsarray.push(ringwordsarray[j])
			trimmedringwordspace[ringwordsarray[j]] = true;
		}
	}
	
	console.log('synonym dictionary complete')
	
	
	
	
//SYNONYM GENERATOR	
//build quad packages

quadpackage = []

synonymloops = Math.round(cleanarray.length*synonymcorpusfactor)
for(j = 0; j < synonymloops; j++) {
	if(Math.floor(j/10000) == j/10000){
		console.log(j)
	}
	linestring = cleanarray[j]	
	linearray = linestring.split(" ");
	wordsinline = linearray.length;

	for(k = 0; k < wordsinline; k++) {
		if(k + 3 < wordsinline){
			quadpackage.push([linearray[k],linearray[k+1],linearray[k+2],linearray[k+3]])
		}
	}
}
		
console.log('quadlength - ' + quadpackage.length)	


//build array for playword
activewordspace = trimmedringwordspace;
counterwordspace = ringwordspace;

//for(g = ringwordsarray.length-1; g > -1; g--){ //reverse order
for(g = 0; g < trimmedringwordsarray.length; g++){

	playword = trimmedringwordsarray[g]

	firstarray = []
	secondarray = []
	thirdarray = []
	fourtharray = []

	for(i = 0; i < quadpackage.length; i++) {
		//first position
		if(quadpackage[i][0] == playword){		
			foundphrase = quadpackage[i][1] +'q'+ quadpackage[i][2] +'q'+ quadpackage[i][3];
			firstarray.push(foundphrase)
		}
		if(quadpackage[i][1] == playword){		
			foundphrase = quadpackage[i][0] +'q'+ quadpackage[i][2] +'q'+ quadpackage[i][3];
			secondarray.push(foundphrase)
		}
		if(quadpackage[i][2] == playword){		
			foundphrase = quadpackage[i][0] +'q'+ quadpackage[i][1] +'q'+ quadpackage[i][3];
			thirdarray.push(foundphrase)
		}
		if(quadpackage[i][3] == playword){		
			foundphrase = quadpackage[i][0] +'q'+ quadpackage[i][1] +'q'+ quadpackage[i][2];
			fourtharray.push(foundphrase)
		}
	}

	//remove duplicates from array for faster processing
	Array.prototype.uniquesortedtrimmed = function()
	{
		var tmp = {}, out = []; counted = [];
		for(var i = 0, n = this.length; i < n; ++i)
		{
			if(!tmp[this[i]]) {
				tmp[this[i]] = 1; out.push(this[i]); 
			}
			else{
				tmp[this[i]] = tmp[this[i]] + 1;
			}
		}
		for(var i = 0, n = out.length; i < n; ++i)
		{
			counted[i] = [out[i],tmp[out[i]]]
		}
		counted = counted.sort(function(x,y) { return y[1] - x[1] });
		trimlength = Math.min(counted.length,maxarraylength)
		outobject = {}
		for(h = 0; h < trimlength; h++){
			outobject[counted[h][0]] = counted[h][1] //passes words and counts into object
		}
		return outobject;
	}

	firstobject = firstarray.uniquesortedtrimmed();
	firstarray = [] // clear first array
	secondobject = secondarray.uniquesortedtrimmed();
	secondarray = [] // clear second array
	thirdobject = thirdarray.uniquesortedtrimmed();
	thirdarray = [] // clear third array
	fourthobject = fourtharray.uniquesortedtrimmed();
	fourtharray = [] // clear fourth array

	correlationarray = []
	correlationobject = {}
	for(i = 0; i < quadpackage.length; i++) {	
		testphrase = quadpackage[i][1] +'q'+ quadpackage[i][2] +'q'+ quadpackage[i][3];
		testword = quadpackage[i][0];
		if(firstobject[testphrase]){
			if(activewordspace[testword] && testword != playword){
				if(correlationobject[testword]){
					correlationobject[testword] = correlationobject[testword] + firstobject[testphrase];
				}
				else{
					correlationobject[testword] = firstobject[testphrase];
				}
			}
		}
		testphrase = quadpackage[i][0] +'q'+ quadpackage[i][2] +'q'+ quadpackage[i][3];
		testword = quadpackage[i][1];
		if(secondobject[testphrase]){
			if(activewordspace[testword] && testword != playword){
				if(correlationobject[testword]){
					correlationobject[testword] = correlationobject[testword] + secondobject[testphrase];
				}
				else{
					correlationobject[testword] = secondobject[testphrase];
				}
			}
		}
		testphrase = quadpackage[i][0] +'q'+ quadpackage[i][1] +'q'+ quadpackage[i][3];
		testword = quadpackage[i][2];
		if(thirdobject[testphrase]){
			if(activewordspace[testword] && testword != playword){
				if(correlationobject[testword]){
					correlationobject[testword] = correlationobject[testword] + thirdobject[testphrase];
				}
				else{
					correlationobject[testword] = thirdobject[testphrase];
				}
			}
		}
		testphrase = quadpackage[i][0] +'q'+ quadpackage[i][1] +'q'+ quadpackage[i][2];
		testword = quadpackage[i][3];
		if(fourthobject[testphrase]){
			if(activewordspace[testword] && testword != playword){
				if(correlationobject[testword]){
					correlationobject[testword] = correlationobject[testword] + fourthobject[testphrase];
				}
				else{
					correlationobject[testword] = fourthobject[testphrase];
				}
			}
		}
	}
	
	//build correlation array
	correlationarray = objecttosortedarray(correlationobject)
	segregatedarray = []
	//determine match coefficient AND separate out caps vs. non-caps
	for(i = 0; i < correlationarray.length; i++){
		activeword = correlationarray[i][0]
		denominator = denomconstant*(counterwordspace[playword]['n'] + counterwordspace[activeword]['n'])
		//only adds to segregated array if both match as either CAPS or non-caps
		if(capswordspace[activeword] && capswordspace[playword]){
			segregatedarray.push([correlationarray[i][0],Math.round(correlationarray[i][1]/denominator)/10])
		}
		else if(!capswordspace[activeword] && !capswordspace[playword]){
			segregatedarray.push([correlationarray[i][0],Math.round(correlationarray[i][1]/denominator)/10])
		}
	}
	
	segregatedarray = segregatedarray.sort(function(x,y) { return y[1] - x[1] });
	
	//each word gets a limited number of synonyms;
	synonymsize = Math.min(segregatedarray.length,synonymsmax)
	synonymring[playword] = {}
	for(i = 0; i < synonymsize; i++) {
		word = segregatedarray[i][0]
		synonymring[playword][word] = segregatedarray[i][1];
	}
	
	console.log('synonym ' + (g+1) + ' of ' + trimmedringwordsarray.length + ' done - ' + playword)
}

longJSONfile(synonymring, 'synonym')

	
});





function longJSONfile(jsonoutput, type){ //just writes extended version
	//version with lots of whitespace; much more readable
	var jf = require('jsonfile')

	filename = language+'-'+type+'.json';

	jf.writeFile(filename, jsonoutput, function(err) {
		if(err){
			console.log("error? " + err);
		}
	})

}


function objecttosortedarray(inobject){
	keysarray = Object.keys(inobject)
	numkeys = keysarray.length
	outarray = [];
	for(x = 0; x < numkeys; x++){
		sortword = keysarray[x];
		outarray[x] = [sortword,inobject[sortword]];
	}
	outarray = outarray.sort(function(x,y) { return y[1] - x[1] });
	return outarray;
}

function countsorter(countedobject,subsize){ //sorts and trims entries in object based on count of sub-objects and returns sorted object; subsize is max number of subobjects - PUTS CAPS VERSIONS INTO SEPARATE MATRIX

	countedwordsarray = Object.keys(countedobject)
	numkeys = countedwordsarray.length
	wordcountarray = new Array();
	
	for(x = 0; x < numkeys; x++){
		countedword = countedwordsarray[x];
		wordcountarray[x] = countedobject[countedword].n;
	}
	console.log(x)
	numtrimmed = Math.min(countedwordsarray.length,subsize)
	sortedcountedobject = new Object();
	for(x = 0; x < numtrimmed; x++){
		maxindex = wordcountarray.indexOf(Math.max.apply(Math, wordcountarray)); //gets index of max value
		targetword = countedwordsarray[maxindex];
		if(countedobject[targetword].u || countedobject[targetword].l){ // if caps version might exist
			if(countedobject[targetword].u / (countedobject[targetword].u + countedobject[targetword].l) > capsthreshold){
				capswordspace[countedwordsarray[maxindex]] = countedobject[targetword].u / (countedobject[targetword].u + countedobject[targetword].l);
			}
			delete countedobject[targetword].l; 
			delete countedobject[targetword].u; 
		}
		//proceeds normally regardless
		sortedcountedobject[countedwordsarray[maxindex]] = countedobject[targetword];
		countedwordsarray.splice(maxindex, 1);
		wordcountarray.splice(maxindex, 1);
	}	
	return sortedcountedobject
}



function checkword(word){ // checks word against "forbidden" list
	if(word == ''){
		return false
	}
	else if(word == 'constructor'){ //causes problems with array construction
		return false
	}
	else{
		return true
	}
}



