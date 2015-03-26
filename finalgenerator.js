console.time('fullgenerator')

//GENERAL VARIABLES
var totalwordcount = 0;
var cleanarray = [] // for data after it has been cleaned and trimmed	
var language = process.argv[2]
var corpus = language + '-corpus.txt'

//SYNONYM GENERATOR VARIABLES

var maxarraylength = 1000;
var denomconstant = .0001;
var synonymconstant = 1000;
var synonymsmax = 50;
var synonymring = {};
var targetlines = 50000 //target number of lines to analyze per loop - included to help with memory issues - use 80k for spanish, 100k for everything else

//PRIORITY DICTIONARY VARIABLES
var prioritydictionaryoutsize = 200000; // total size of priority output dictionary -- maybe make this unlimited?
var firstprioritysize = 200; //number of 'first word in sentence' items returned/retained
var priorityminimum = 3; // words must appear more than this minimum amount of times to be included in output dictionary
var clipped = {};
var altminimum = 4; // words must appear more than this minimum amount of times to be included in output dictionary (removes true exotics, typos, etc)
var maxwordlength = 30; // won't process words longer that this
var prioritydic = {};
var trigramdic = {};
var sortedwordspace = {};
var capswordspace = {};
var capsthreshold = 0.8; //if proportion of caps version exceeds this threshold, shunted to another matrix
var truethreshold = 0.8; // if proportion of formatted version exceeds this threshold, listed as true (that's)
var altthreshold = 0.15; // if proportion of formatted version exceeds this threshold, listed as alternate (its vs. it's)

//RING GENERATOR VARIABLES
var ringlimit = 5;
var superringlimit = 15; //upper limit of allowable elements before things start getting shunted off into orphans

//TRIGRAM DICTIONARY VARIABLES
var trigramdictionaryoutsize = 10000; // total size of trigram output dictionary (also ring dictionary size)
var synonymfloor = 500; // minimum value above which words are not added to trigram dictionary if they have a synonym available 
var correlationthreshold = 5; //only uses words that have fairly high synonym value default ~15
var nextoutsize = 15;
var outpower = 0.2;
var nextzero = 10;
var slope = 0.03;
var prevoutsize = 3*nextoutsize;
var prevzero = nextzero;
var minnextout = 2;
var minprevout = minnextout;

var prevmin = 20/8944149
var nextmin = 20/8944149
var abcmin = 10/8944149
var xyzmin = 10/8944149

var maxtrim = 1000

// 20/10 is pretty good

//OTHER STUFF
var numberofchoices = 5 //objectively this would be set by active program, but set here to save space in trigramarray

//DICTIONARY STATS
var dictionarystats = {};
	dictionarystats.prioritysize = prioritydictionaryoutsize;
	dictionarystats.trigramsize = trigramdictionaryoutsize;
	dictionarystats.trigramwordcount = 0;
	dictionarystats.synonymfloor = synonymfloor
	dictionarystats.correlationthreshold = correlationthreshold
	dictionarystats.nextoutsize = nextoutsize
	dictionarystats.ringlimit = ringlimit
	dictionarystats.superringlimit = superringlimit
	
	
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
		
		//deal with various non-letter character issues
		linestring = linestring.replace(/_/g, ' ') //removes underscores and replaces with spaces
		linestring = linestring.replace(/--/g, ' ') //removes dashes and replaces with spaces
		linestring = linestring.replace(/—/g, ' ') //removes SINGLE CHARACTER dashes and replaces with spaces
		linestring = linestring.replace(/’/g, "'") //removes unusual apostrophes and replaces with regular apostrophes
		
		linestring = linestring.replace(/-/g, '_') //removes dashes and replaces with underscores
		linestring = linestring.replace(/'/g, '_') //removes apostrophes and replaces with underscores
		
		linestring = linestring.latinise() //replace any accented characters with pure latin forms
		
		linestring = linestring.replace(/[^A-Za-z\s_]/g, ' ') //removes EVERYTHING except letters and spaces (and underscores)
		
		linestring = linestring.replace(/\s{2,}/g, ' '); //trims multiple spaces into singles
		
		capsstring = linestring; //preserves capitalized version
		
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
	ringwordspace = countsorter(synwordspace,trigramdictionaryoutsize) 
	ringwordsarray = Object.keys(ringwordspace)
	
	synonymspace = {};
	//trim out words above threshold so they are not considered
	for(j = 0; j < ringwordsarray.length; j++) {
		if(j >= synonymfloor){
			synonymspace[ringwordsarray[j]] = {};
		}
	}
	
	console.log('synonym dictionary complete')
	
		
		
//SYNONYM GENERATOR	
//build quad packages
	
	quadpackageA = {}

	looparray = []
	corpusdivisor = Math.ceil(cleanarray.length/targetlines)
	for(j = 0; j < corpusdivisor; j++){
		loopstart = Math.floor(j*dataarray.length/corpusdivisor)
		loopend = Math.floor((j+1)*dataarray.length/corpusdivisor-1)
		looparray.push([loopstart,loopend])
	}
		

	for(i = 0; i < looparray.length; i++){
		loopstart = looparray[i][0]
		loopend = looparray[i][1]
		for(j = loopstart; j < loopend; j++) {
			if(Math.floor(j/10000) == j/10000){
				console.log(j)
			}
			linestring = cleanarray[j]	
			linearray = linestring.split(" ");
			wordsinline = linearray.length;

			for(k = 0; k < wordsinline; k++) {
				if(k + 3 < wordsinline){
					blankword = linearray[k]
					if(synonymspace[blankword]){
						quadline = linearray[k+1]+'_'+linearray[k+2]+'_'+linearray[k+3]
						quadpackageA = quadcheck(quadpackageA, quadline, blankword)
					}
				}
			}
		}
		synonymtally(quadpackageA)
		quadpackageA = {}
		console.log('loop completed A'+i)
		
		for(j = loopstart; j < loopend; j++) {
			if(Math.floor(j/10000) == j/10000){
				console.log(j)
			}
			linestring = cleanarray[j]	
			linearray = linestring.split(" ");
			wordsinline = linearray.length;

			for(k = 0; k < wordsinline; k++) {
				if(k > 0 && k + 2 < wordsinline){
					blankword = linearray[k+1]
					if(synonymspace[blankword]){
						quadline = linearray[k+0]+'_'+linearray[k+2]+'_'+linearray[k+3]
						quadpackageA = quadcheck(quadpackageA, quadline, blankword)
					}
				}
			}
		}
		synonymtally(quadpackageA)
		quadpackageA = {}
		console.log('loop completed B'+i)
		
		for(j = loopstart; j < loopend; j++) {
			if(Math.floor(j/10000) == j/10000){
				console.log(j)
			}
			linestring = cleanarray[j]	
			linearray = linestring.split(" ");
			wordsinline = linearray.length;

			for(k = 0; k < wordsinline; k++) {
				if(k > 1 && k + 1 < wordsinline){
					blankword = linearray[k+2]
					if(synonymspace[blankword]){
						quadline = linearray[k+0]+'_'+linearray[k+1]+'_'+linearray[k+3]
						quadpackageA = quadcheck(quadpackageA, quadline, blankword)
					}
				}
			}
		}
		synonymtally(quadpackageA)
		quadpackageA = {}
		console.log('loop completed C'+i)
		
		for(j = loopstart; j < loopend; j++) {
			if(Math.floor(j/10000) == j/10000){
				console.log(j)
			}
			linestring = cleanarray[j]	
			linearray = linestring.split(" ");
			wordsinline = linearray.length;

			for(k = 0; k < wordsinline; k++) {
				if(k > 2 && k < wordsinline){
					blankword = linearray[k+3]
					if(synonymspace[blankword]){
						quadline = linearray[k+0]+'_'+linearray[k+1]+'_'+linearray[k+2]
						quadpackageA = quadcheck(quadpackageA, quadline, blankword)
					}
				}
			}
		}
		synonymtally(quadpackageA)
		quadpackageA = {}
		console.log('loop completed D'+i)

		keys = Object.keys(synonymspace)
		for(j in keys){
			word = keys[j]
			synonymspace[word] = synonymsorter(synonymspace[word],maxarraylength)
		}
		
	}
	keys = Object.keys(synonymspace)
	for(i in keys){
		word = keys[i]
		subkeys = Object.keys(synonymspace[word])
		for(j in subkeys){
			subword = subkeys[j]
			if(ringwordspace[word] && ringwordspace[subword]){
				subcalc = synonymconstant*synonymspace[word][subword]/(ringwordspace[word].n + ringwordspace[subword].n)
				synonymspace[word][subword] = (Math.round(subcalc*100))/100
			}
			else{
				console.log(word + '-' + subword)
				console.log(subkeys)
			}
		}
		synonymspace[word] = synonymsorter(synonymspace[word],synonymsmax)
	}

	//longJSONfile(synonymspace, 'synonym')
	synonymring = synonymspace;
	cleanarray = []
	ringwordsarray = {}


	wordspace = {};
	formattedwords = {};
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
		linestring = linestring.replace(/\s{2,}/g, ' '); //trims multiple spaces into singles
		
		//clean strings for trigram generation
		cleanstring = linestring //includes hyphens and apostrophes and accented characters, etc.
		cleanstring = cleanstring.toLowerCase();
		cleanstring = cleanstring.replace(/[0-9¿¡@#$%^&*•()½©{}+=:;"<>,\.\?\/!”»«“~`‘…\[\]]/g, '') //removes all other punctuation except apostrophe and hyphen
		cleanstring = cleanstring.replace(/-/g, '_') //removes dashes and replaces with underscores
		cleanstring = cleanstring.replace(/'/g, '_') //removes apostrophes and replaces with underscores
		cleanstring = cleanstring.latinise()
		cleanstring = cleanstring.replace(/[^A-Za-z\s_]/g, '') //removes EVERYTHING except letters and spaces (and underscores)
		
		cleanarray.push(cleanstring);
		
		
		//count individual words
		linearray = linestring.split(" ");
		wordsinline = linearray.length;
		
		for(j = 0; j < wordsinline; j++) {
			activeword = linearray[j];
			capsword = activeword
			activeword = activeword.toLowerCase()
			
			extraword = activeword //includes hyphens and apostrophes and accented characters, etc.
			extraword = extraword.replace(/[0-9¿¡@#$%^&*•()½©{}+=:;"<>,\.\?\/!”»«“~`‘…\[\]]/g, '') //removes all other punctuation except apostrophe and hyphen
			
			activeword = activeword.replace(/-/g, '_') //removes dashes and replaces with underscores
			activeword = activeword.replace(/'/g, '_') //removes apostrophes and replaces with underscores
			
			activeword = activeword.latinise()
			activeword = activeword.replace(/[^A-Za-z_]/g, '') //removes EVERYTHING except letters and underscores
		
			capsword = capsword.replace(/-/g, '_') //removes dashes and replaces with underscores
			capsword = capsword.replace(/'/g, '_') //removes apostrophes and replaces with underscores
			
			capsword = capsword.latinise()
			capsword = capsword.replace(/[^A-Za-z_]/g, '') //removes EVERYTHING except letters and underscores
		
			if(checkword(activeword)){ 
				//identify unusually formatted words
				if(activeword != extraword){
					if(formattedwords[activeword]){
						pushcheck = formattedwords[activeword].t
						if(pushcheck.indexOf(extraword) < 0){
							formattedwords[activeword].t.push(extraword);
							formattedwords[activeword].c.push(1);
						}
						else{
							numcheck = formattedwords[activeword].c
							numcheck[pushcheck.indexOf(extraword)] += 1;
							formattedwords[activeword].c = numcheck
						}
					}
					else{
						formattedwords[activeword] = {};
						formattedwords[activeword].t = []
						formattedwords[activeword].t.push(extraword);
						formattedwords[activeword].c = []
						formattedwords[activeword].c.push(1);
					}
				}
				
				if(wordspace[activeword]){
					wordspace[activeword].n = wordspace[activeword].n + 1;
				}
				else{
					if(activeword.length > 0){ //eliminates issue of blank keys
						wordspace[activeword] = new Object();
						wordspace[activeword].n = 1; // total instances
						wordspace[activeword].u = 0; // upper case instances
						wordspace[activeword].l = 0; // lower case instances
						wordspace[activeword].f = 0; // first word instances
						wordspace[activeword].b = new Object();
						wordspace[activeword].z = new Object();
					}
				}
				
				//uppercase/lowercase
				capsarray = capsword.split("");
				activearray = activeword.split("");
				if(capsarray[0] == activearray[0]){
					wordspace[activeword].l = wordspace[activeword].l + 1;
				}
				else{
					wordspace[activeword].u = wordspace[activeword].u + 1;
				}
				//first word in sentence
				if(j == 0){
					wordspace[activeword].f = wordspace[activeword].f + 1;
				}
			}
		}
    }
	
	
	
	//remove instances that are less than the required minimum and set up capswordspace and alternates/pure versions
	keys = Object.keys(wordspace)
	for(j = 0; j < keys.length; j++) {
		activeword = keys[j]
		//deletes them if they don't include the required number of instances - does this last because it messes up process if done first
		if(wordspace[activeword].n >= priorityminimum){
			//deal with caps
			if(wordspace[activeword].u || wordspace[activeword].l){ // if caps version might exist
				if(wordspace[activeword].u / (wordspace[activeword].u + wordspace[activeword].l) > capsthreshold){
					capswordspace[activeword] = wordspace[activeword].u / (wordspace[activeword].u + wordspace[activeword].l);
				}
				delete wordspace[activeword].l; 
				delete wordspace[activeword].u; 
			}
			//deal with 'pure' and 'alternate' versions of words
			if(formattedwords[activeword]){
				counts = formattedwords[activeword].c
				words = formattedwords[activeword].t
				maxcount = Math.max.apply(Math, counts)
				maxindex = counts.indexOf(maxcount);
				maxword = words[maxindex];
				if(maxcount/wordspace[activeword].n > truethreshold){
					//console.log('pure ' + activeword + ' ' + maxcount + ' ' + maxword)
					wordspace[activeword].pure = maxword
				}
				else{
					countsum = 0;
					for(k = 0; k < counts.length; k++) {
						if(counts[k]/wordspace[activeword].n > altthreshold && counts[k] >= altminimum){
							console.log('alt ' + activeword + ' ' + counts[k] + ' ' + words[k])
							if(wordspace[activeword].alt){
								wordspace[activeword].alt.push([words[k],counts[k]])
								countsum += counts[k]
							}
							else{
								wordspace[activeword].alt = []
								wordspace[activeword].alt.push([words[k],counts[k]])
								countsum += counts[k]
							}
						}
					}
					wordspace[activeword].n = wordspace[activeword].n - countsum; //subtract out alternate counts from main version
				}
			}
		}
		else{
			clipped[activeword] = true;
			delete wordspace[activeword];
		}
	}
	prioritywordspace = countsorter(wordspace,prioritydictionaryoutsize) 
	
	sortedwordspace = countsorter(wordspace,trigramdictionaryoutsize)
	sortedwordsarray = Object.keys(sortedwordspace)
	
	
	//write simple dictionary file with counts
	simplewordsarray = Object.keys(prioritywordspace)
	numkeys = simplewordsarray.length
	simplewordcountarray = new Array();
		
	arraytofile = new Array();
	for(x = 0; x < numkeys; x++){
		simpleword = simplewordsarray[x];
		count = prioritywordspace[simpleword].n;
		arraytofile[x] = [simpleword,count];
		
		letterarray = simpleword.split("");
		numletters = letterarray.length;
		
		evalexpression = 'prioritydic';
		for(y = 0; y < numletters+1; y++){
			if(y == numletters){
				evalexpression1 = evalexpression + ".nn = " + count;
				eval(evalexpression1);
				if(capswordspace[simpleword]){
					evalexpression2 = evalexpression + ".cc = " + (Math.round(capswordspace[simpleword]*100))/100; //don't need all those sig figs
					eval(evalexpression2);
				}
				if(wordspace[simpleword].pure){
					evalexpression3 = evalexpression + ".pp = wordspace[simpleword].pure"
					eval(evalexpression3);
				}
				if(wordspace[simpleword].alt){
					evalexpression4 = evalexpression + ".aa = wordspace[simpleword].alt"
					eval(evalexpression4);
				}
				
			}
			else{
				evalexpression = evalexpression + '.' + letterarray[y];
				evalcheck = evalexpression.replace(/[^a-z\._]/g, '') //check
				if(evalcheck != evalexpression){
					console.log('-----------------------' + simpleword + evalexpression)
				}
				if(!eval(evalexpression)){
					eval(evalexpression + ' = new Object()');
				}
			}
		}
	}
	
	
	dictionarystats.prioritysize = Object.keys(wordspace).length
	dictionarystats.totalwordcount = totalwordcount;
	console.log("priority dictionary complete")
	

	
//GENERATE SYNONYM RINGS

	basewordsarray = Object.keys(synonymring)
	allwordsarray = []
	for(var i = 0; i < basewordsarray.length; i++){
		baseword = basewordsarray[i]
		subwordsarray = Object.keys(synonymring[baseword])
		for(var j = 0; j < subwordsarray.length; j++){
			subword = subwordsarray[j]
			if(wordspace[baseword] && wordspace[subword] && synonymring[baseword][subword] > correlationthreshold && sortedwordsarray.indexOf(baseword) >= synonymfloor){ //only passes on ones that are actually good matches and are above synonym floor threshold
				allwordsarray.push([baseword, subword, synonymring[baseword][subword]])
			}
		}
	}

	allwordsarray = allwordsarray.sort(function(x,y) { return y[2] - x[2] });

	assigned = {}
	rings = {}
	unassignedarray = [];
	for(var i = 0; i < allwordsarray.length; i++){
		word0 = allwordsarray[i][0]
		word1 = allwordsarray[i][1]
		corr = allwordsarray[i][2]
		if(assigned[word0] && assigned[word1]){
			//skip; does nothing
		}
		// ORIGINAL FORMULATION - FOR SOME REASON THIS PERFORMS SIGNIFICANTLY BETTER, EVEN THOUGH NOT STRICTLY PROPER
		else if(assigned[word0] || assigned[word1]){
			if(rings[word0]){
				if(rings[word0].length < ringlimit){
					rings[word0].push(word1);
					assigned[word1] = word0;
				}
				else{
					unassignedarray.push(allwordsarray[i])
				}
			}
			else if(rings[word1]){
				if(rings[word1].length < ringlimit){
					rings[word1].push(word0);
					assigned[word0] = word1;
				}
				else{
					unassignedarray.push(allwordsarray[i])
				}
			}
		}
		/* NEWER FORMULATION, TECHNICALLY CORRECT BUT PERFORMS WORSE
		else if(assigned[word0] || assigned[word1]){
			if(rings[assigned[word0]]){
				if(rings[assigned[word0]].length < ringlimit){
					rings[assigned[word0]].push(word1);
					assigned[word1] = assigned[word0];
				}
				else{
					unassignedarray.push(allwordsarray[i])
				}
			}
			else if(rings[assigned[word1]]){
				if(rings[assigned[word1]].length < ringlimit){
					rings[assigned[word1]].push(word0);
					assigned[word0] = assigned[word1];
				}
				else{
					unassignedarray.push(allwordsarray[i])
				}
			}
		}
		*/
		else{ //if neither is assigned, start a new ring
			assigned[word0] = word0;
			assigned[word1] = word0;
			rings[word0] = []
			rings[word0].push(word0);
			rings[word0].push(word1);
		}
		
	}

	//loops through leftovers and removes ones that have already been assigned
	orphanarray = []
	if(unassignedarray.length > 0){
		for(var i = 0; i < unassignedarray.length; i++){
			word0 = unassignedarray[i][0]
			word1 = unassignedarray[i][1]
			if(!(assigned[word0])){
				orphanarray.push(unassignedarray[i])
			}
			if(!(assigned[word1])){
				orphanarray.push(unassignedarray[i])
			}
			
		}
	}
	//assigns leftover orphans to their first choice, if they are under the appropriate limit, otherwise they fly solo

	if(orphanarray.length > 0){ //assign lead orphan name
		for(var i = 0; i < orphanarray.length; i++){
			word0 = orphanarray[i][0]
			word1 = orphanarray[i][1]
			corr = orphanarray[i][2]
			if(assigned[word0] && assigned[word1]){
				//skip; does nothing
			}
			//SAME AS ABOVE; IMPROPER FORMULATION PERFORMS BETTER
			else if(assigned[word0] || assigned[word1]){
				if(rings[word0]){
					if(rings[word0].length < superringlimit){
						rings[word0].push(word1);
						assigned[word1] = word0;
					}
				}
				else if(rings[word1]){
					if(rings[word1].length < superringlimit){
						rings[word1].push(word0);
						assigned[word0] = word1;
					}
				}
			}
			/*
			else if(assigned[word0] || assigned[word1]){
				if(rings[assigned[word0]]){
					if(rings[assigned[word0]].length < superringlimit){
						rings[assigned[word0]].push(word1);
						assigned[word1] = assigned[word0];
					}
				}
				else if(rings[assigned[word1]]){
					if(rings[assigned[word1]].length < superringlimit){
						rings[assigned[word1]].push(word0);
						assigned[word0] = assigned[word1];
					}
				}
			}
			*/
		}
	}
	console.log('----------done')
	//assemble rings using most common words as keys
	originalringsarray = Object.keys(rings)
	sortedrings = {}
	for(i = 0; i < originalringsarray.length; i++) {
		ringcontents = rings[originalringsarray[i]]
		target = 0;
		targetword = '';
		for(j = 0; j < ringcontents.length; j++) {
			newtarget = 0
			if(wordspace[ringcontents[j]]){
				newtarget = wordspace[ringcontents[j]].n
			}
			if(newtarget > target){ // higher priority
				target = newtarget;
				targetword = ringcontents[j];
			}
		}
		sortedrings[targetword] = ringcontents
	}

	rings = sortedrings

	ringexport = {}
	//add rings to priority file
	keys = Object.keys(rings)
	for(var i = 0; i < keys.length; i++){
		ringword = keys[i]
		
		//remove key word; not needed in array
		activering = rings[ringword];
		remove = activering.indexOf(ringword)
		activering.splice(remove, 1);
		
		ringexport[ringword] = activering
		
	}



	//FOR INTERNAL USE ONLY - NOT EXPORTED
	xringassignments = {};
	xassignmentkeys = Object.keys(rings)
	for(var i = 0; i < xassignmentkeys.length; i++){
		xringarray = rings[xassignmentkeys[i]]
		for(var j = 0; j < xringarray.length; j++){
			xringassignments[xringarray[j]] = xassignmentkeys[i]
		}	
	}


//GENERATE TRIGRAM SEQUENCES
//get "next" and "prev" objects
	for(i = 0; i < cleanarray.length; i++) {
		if(Math.floor(i/10000) == i/10000){
			console.log(i);
		}
		linestring = cleanarray[i]	
		
		//count individual words
		linearray = linestring.split(" ");
		wordsinline = linearray.length;
		for(j = 0; j < wordsinline; j++) {
			activeword = linearray[j];
			activeword = activeword.replace(/[^a-z_]/g, '') //removes EVERYTHING except letters and underscores
			//replace activeword with synonym
			if(xringassignments[activeword]){
				activeword = xringassignments[activeword]
			}
			if(trigramcheckword(activeword) && sortedwordspace[activeword]){ 
				if(j > 0){
					prevword = linearray[j-1];
					prevword = prevword.replace(/[^a-z_]/g, '') //removes EVERYTHING except letters and underscores
					//replace prevword with synonym
					if(xringassignments[prevword]){
						prevword = xringassignments[prevword]
					}
					if(trigramcheckword(prevword)){
						if(sortedwordspace[activeword].z[prevword]){
							sortedwordspace[activeword].z[prevword].n = sortedwordspace[activeword].z[prevword].n + 1;
						}
						else{
							sortedwordspace[activeword].z[prevword] = new Object();
							sortedwordspace[activeword].z[prevword].n = 1;
							sortedwordspace[activeword].z[prevword].y = new Object();
						}
					}
				}
				
				//next word
				if(j < wordsinline-1){
					nextword = linearray[j+1];
					nextword = nextword.replace(/[^a-z_]/g, '') //removes EVERYTHING except letters and underscores
					//replace nextword with synonym
					if(xringassignments[nextword]){
						nextword = xringassignments[nextword]
					}
					if(trigramcheckword(nextword)){
						if(sortedwordspace[activeword].b[nextword]){
							sortedwordspace[activeword].b[nextword].n = sortedwordspace[activeword].b[nextword].n + 1;
						}
						else{
							sortedwordspace[activeword].b[nextword] = new Object();
							sortedwordspace[activeword].b[nextword].n = 1;
							sortedwordspace[activeword].b[nextword].c = new Object();
						}
					}
				}
			}
		}
		
		
    }
	
	sortedwordspace = countsorter(sortedwordspace,trigramdictionaryoutsize)
	sortedwordsarray = Object.keys(sortedwordspace)
	
	totalnumkeys = sortedwordsarray.length
	for(y = 0; y < totalnumkeys; y++){
		word = sortedwordsarray[y]
		nextnumoccur = sortedwordspace[word].n
		calcnextoutsize = Math.max(Math.round((nextzero - slope*y) + (nextoutsize/Math.pow((totalwordcount/nextnumoccur),outpower))),minnextout);
		nextobject = sortedwordspace[word].b
		sortednextobject = countsorter(nextobject,calcnextoutsize)
		sortedwordspace[word].b = sortednextobject
		
		prevnumoccur = sortedwordspace[word].n
		calcprevoutsize = Math.max(Math.round((prevzero - slope*y) + (prevoutsize/Math.pow((totalwordcount/prevnumoccur),outpower))),minprevout);
		prevobject = sortedwordspace[word].z
		sortedprevobject = countsorter(prevobject,calcprevoutsize)
		sortedwordspace[word].z = sortedprevobject
	}
	console.log("trigrams - next and prev done")
	

//get "third" and "penultimate" objects
	for(i = 0; i < cleanarray.length; i++) {
		if(Math.floor(i/10000) == i/10000){
			console.log(i);
		}
		linestring = cleanarray[i]	
		
		//count individual words
		linearray = linestring.split(" ");
		wordsinline = linearray.length;
		for(j = 0; j < wordsinline; j++) {
			activeword = linearray[j];
			activeword = activeword.replace(/[^a-z_]/g, '') //removes EVERYTHING except letters and underscores
			
			//replace activeword with synonym
			if(xringassignments[activeword]){
				activeword = xringassignments[activeword]
			}
			if(trigramcheckword(activeword) && sortedwordspace[activeword]){ 
				
				if(j > 0){
					prevword = linearray[j-1];
					prevword = prevword.replace(/[^a-z_]/g, '') //removes EVERYTHING except letters and underscores
					//replace prevword with synonym
					if(xringassignments[prevword]){
						prevword = xringassignments[prevword]
					}
					if(trigramcheckword(prevword) && sortedwordspace[activeword].z[prevword]){
						//third word in trigram
						if(j > 1){
							penulword = linearray[j-2];
							penulword = penulword.replace(/[^a-z_]/g, '') //removes EVERYTHING except letters and underscores
							//replace penulword with synonym
							if(xringassignments[penulword]){
								penulword = xringassignments[penulword]
							}
							if(trigramcheckword(penulword)){
								if(sortedwordspace[activeword].z[prevword].y[penulword]){
									sortedwordspace[activeword].z[prevword].y[penulword].n = sortedwordspace[activeword].z[prevword].y[penulword].n + 1;
								}
								else{
									sortedwordspace[activeword].z[prevword].y[penulword] = new Object();
									sortedwordspace[activeword].z[prevword].y[penulword].n = 1;
								}
							}
						}
					}
				}
				
				//next word
				if(j < wordsinline-1){
					nextword = linearray[j+1];
					nextword = nextword.replace(/[^a-z_]/g, '') //removes EVERYTHING except letters and underscores
					//replace nextword with synonym
					if(xringassignments[nextword]){
						nextword = xringassignments[nextword]
					}
					if(trigramcheckword(nextword) && sortedwordspace[activeword].b[nextword]){
						//third word in trigram
						if(j < wordsinline-2){
							thirdword = linearray[j+2];
							thirdword = thirdword.replace(/[^a-z_]/g, '') //removes EVERYTHING except letters and underscores
							//replace thirdword with synonym
							if(xringassignments[thirdword]){
								thirdword = xringassignments[thirdword]
							}
							//console.log(activeword + " " + nextword + " " + thirdword)
							if(trigramcheckword(thirdword)){
								if(sortedwordspace[activeword].b[nextword].c[thirdword]){
									sortedwordspace[activeword].b[nextword].c[thirdword].n = sortedwordspace[activeword].b[nextword].c[thirdword].n + 1;
								}
								else{
									sortedwordspace[activeword].b[nextword].c[thirdword] = new Object();
									sortedwordspace[activeword].b[nextword].c[thirdword].n = 1;
								}
							}
						}
					}
				}
			}
		}
    }
	
	
	console.log("trigrams - third and penultimate done")
	console.log("totalwordcount = " + totalwordcount);
		
	synonymassigned = {};
	totalnumkeys = sortedwordsarray.length
	skippedwords = 0;
	trigramwordcount = 0;
	for(y = 0; y < totalnumkeys; y++){
		leader = 0;
		word = sortedwordsarray[y]
		
		
		if(!xringassignments[word]){ // solo word; no synonyms
			leader = 1;
		}
		else if(xringassignments[word] == word){
			leader = 1;
		}
		
		if(leader == 1){ // only processes if word is solo or ringleader
			if(y < synonymfloor || !synonymassigned[xringassignments[word]]){ // only produces output for words w/out synonyms
				trigramwordcount += 1
				trigramdic[word] = {};
				trigramdic[word].n = sortedwordspace[word].n;
				synonymassigned[word] = true;
				nextobject = sortedwordspace[word].b
				thirdwordsarray = Object.keys(nextobject)
				thirdnumkeys = thirdwordsarray.length
					for(z = 0; z < thirdnumkeys; z++){
						thirdword = thirdwordsarray[z];
						thirdnumoccur = nextobject[thirdword].n
						thirdobject = nextobject[thirdword].c
						mintrim = Math.max(priorityminimum, abcmin*totalwordcount)
						sortedthirdobject = trimcountsorter(thirdobject, maxtrim, mintrim)
						nextobject[thirdword].c = sortedthirdobject
					}
				
				mintrim = Math.max(priorityminimum, nextmin*totalwordcount)
				sortednextobject = trimcountsorter(nextobject,maxtrim,mintrim)
				trigramdic[word].b = sortednextobject
				
				prevobject = sortedwordspace[word].z
				penulwordsarray = Object.keys(prevobject)
				penulnumkeys = penulwordsarray.length
					for(z = 0; z < penulnumkeys; z++){
						penulword = penulwordsarray[z];
						penulobject = prevobject[penulword].y
						mintrim = Math.max(priorityminimum, xyzmin*totalwordcount)
						sortedpenulobject = abctrimcountsorter(word, penulword, penulobject, maxtrim, mintrim)
						prevobject[penulword].y = sortedpenulobject
					}
				
				mintrim = Math.max(priorityminimum, prevmin*totalwordcount)
				sortedprevobject = trimcountsorter(prevobject,maxtrim,mintrim)
				trigramdic[word].z = sortedprevobject
			}
			else{
				skippedwords += 1;
			}
		}
		else{
			skippedwords += 1;
		}
	}
	
	console.log('skippedwords = ' + skippedwords)
	dictionarystats.trigramwordcount = trigramwordcount
	
	//CLEAN UP TRIGRAMDIC OBJECT AND SET UP RINGS AND RING TOTALS
	keys = Object.keys(trigramdic)
	rings = {};
	for(var i = 0; i < keys.length; i++){
		activeword = keys[i]
		activecount = wordspace[activeword]['n']
		if(ringexport[activeword]){
			activering = ringexport[activeword]
			rings[activeword] = {}
			rings[activeword].n = activecount
			for(var j = 0; j < activering.length; j++){
				rings[activeword].n += wordspace[activering[j]]['n']
			}
			activering.push(activeword)
			rings[activeword].r = activering
		}
		trigramdic[activeword].n = activecount;
		
		//get rid of empty B and C and Z and Y level objects
		blevel = trigramdic[activeword].b
		bkeys = Object.keys(blevel)
		if(bkeys.length == 0){
			delete trigramdic[activeword].b
		}
		else{
			for(var k = 0; k < bkeys.length; k++){
				bword = bkeys[k]
				clevel = trigramdic[activeword].b[bword].c
				ckeys = Object.keys(clevel)
				if(ckeys.length == 0){
					delete trigramdic[activeword].b[bword].c
				}
			}
		}
		
		zlevel = trigramdic[activeword].z
		zkeys = Object.keys(zlevel)
		if(bkeys.length == 0){
			delete trigramdic[activeword].z
		}
		else{
			for(var k = 0; k < zkeys.length; k++){
				zword = zkeys[k]
				ylevel = trigramdic[activeword].z[zword].y
				ykeys = Object.keys(ylevel)
				if(ykeys.length == 0){
					delete trigramdic[activeword].z[zword].y
				}
			}
		}
		
		
		
	}
	
	
	//ISOLATE BATCH OF FIRST WORDS IN SENTENCE FOR EASIER ACCESS
	firstprioritywordspace = firstcountsorter(wordspace,firstprioritysize) 
	
	
	//write intial objects to JSON 
	initialoutput = {}
	initialoutput.dictionarystats = dictionarystats
	initialoutput.firstpriority = firstprioritywordspace
	longJSONfile(initialoutput, 'initial')
	
	
	//write dictionaries to JSON file (using jsonfile)
	fileoutput = {}
	//fileoutput.dictionarystats = dictionarystats
	//fileoutput.firstpriority = firstprioritywordspace
	fileoutput.prioritydic = prioritydic
	fileoutput.trigramdic = trigramdic
	fileoutput.rings = rings
	
	writeJSONfile(fileoutput, 'predictive-dictionary')
	
	console.timeEnd('fullgenerator')

	
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


function countsorter(countedobject,subsize){ //sorts and trims entries in object based on count of sub-objects and returns sorted object; subsize is max number of subobjects - PUTS CAPS VERSIONS INTO SEPARATE MATRIX

	countedwordsarray = Object.keys(countedobject)
	numkeys = countedwordsarray.length
	wordcountarray = new Array();
	
	for(x = 0; x < numkeys; x++){
		countedword = countedwordsarray[x];
		wordcountarray[x] = countedobject[countedword].n;
	}
	numtrimmed = Math.min(countedwordsarray.length,subsize)
	sortedcountedobject = new Object();
	//console.log(wordcountarray.length)
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


function synonymsorter(countedobject,subsize){ //sorts and trims entries in object based on count of sub-objects and returns sorted object; subsize is max number of subobjects - PUTS CAPS VERSIONS INTO SEPARATE MATRIX

	countedwordsarray = Object.keys(countedobject)
	numkeys = countedwordsarray.length
	wordcountarray = new Array();
	
	for(x = 0; x < numkeys; x++){
		countedword = countedwordsarray[x];
		wordcountarray[x] = countedobject[countedword];
	}
	numtrimmed = Math.min(countedwordsarray.length,subsize)
	sortedcountedobject = new Object();
	for(x = 0; x < numtrimmed; x++){
		maxindex = wordcountarray.indexOf(Math.max.apply(Math, wordcountarray)); //gets index of max value
		targetword = countedwordsarray[maxindex];
		sortedcountedobject[countedwordsarray[maxindex]] = countedobject[targetword];
		countedwordsarray.splice(maxindex, 1);
		wordcountarray.splice(maxindex, 1);
	}	
	return sortedcountedobject
}

function checkword(word){ // checks word against "forbidden" list
	if(word.length >= maxwordlength){
		return false
	}
	if(word.length <= 0){
		return false
	}
	else if(word == 'constructor'){ //causes problems with array construction
		return false
	}
	else{
		return true
	}
}

function quadcheck(object, line, word){
	if(!object[line]){
		object[line] = {}
		object[line][word] = 1
	}
	else{
		if(object[line][word]){
			object[line][word] += 1
		}
		else{
			object[line][word] = 1
		}
	}
	return object
}

function synonymtally(quadpackage){
	keys = Object.keys(quadpackage)
	for(m in keys){
		subpackage = quadpackage[keys[m]]
		subkeys = Object.keys(subpackage)
		n = subkeys.length
		if(n > 1){
			for(n in subkeys){
				word = subkeys[n]
				for(o in subkeys){
					if(subkeys[o] != word){
						if(synonymspace[word][subkeys[o]]){
							synonymspace[word][subkeys[o]] += 1
						}
						else{
							synonymspace[word][subkeys[o]] = 1
						}
					}
				}
			}
		}
	}
	
}


function trigramcheckword(word){ //check if word exists in dictionary matrix, send back replacement if not
	if(word == ''){
		return false
	}
	if(clipped[word]){ //removed for being below priorityminimum
		return false
	}
	return true
}

function trimcountsorter(countedobject,subsize, minimum){ //sorts and trims entries in object based on count of sub-objects and returns sorted object; subsize is max number of subobjects - PUTS CAPS VERSIONS INTO SEPARATE MATRIX

	countedwordsarray = Object.keys(countedobject)
	numkeys = countedwordsarray.length
	wordcountarray = new Array();
	
	for(x = 0; x < numkeys; x++){
		countedword = countedwordsarray[x];
		wordcountarray[x] = countedobject[countedword].n;
	}
	numtrimmed = Math.min(countedwordsarray.length,subsize)
	sortedcountedobject = new Object();
	//console.log(wordcountarray.length)
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
		if(countedobject[targetword].n >= minimum){
			sortedcountedobject[countedwordsarray[maxindex]] = countedobject[targetword];
		}
		countedwordsarray.splice(maxindex, 1);
		wordcountarray.splice(maxindex, 1);
	}	
	return sortedcountedobject
}

function abctrimcountsorter(word, penulword,countedobject,subsize,minimum){ //same as countsorter, but trims zya elements that exist as abc elements

	countedwordsarray = Object.keys(countedobject)
	numkeys = countedwordsarray.length
	wordcountarray = new Array();
	
	confirmedwordsarray = [];
	for(x = 0; x < numkeys; x++){
		countedword = countedwordsarray[x];
		if(sortedwordspace[countedword] && sortedwordspace[countedword]['b'][penulword] && sortedwordspace[countedword]['b'][penulword]['c'][word]){
			//skips it; already exists in abc form
		}
		else{
			confirmedwordsarray.push(countedword)
			wordcountarray.push(countedobject[countedword].n)
		};
	}
	
	numtrimmed = Math.min(confirmedwordsarray.length,subsize)
	sortedcountedobject = new Object();
	sortedcount = 0;
	for(x = 0; x < numtrimmed; x++){ //processes them all
		maxindex = wordcountarray.indexOf(Math.max.apply(Math, wordcountarray)); //gets index of max value
		targetword = confirmedwordsarray[maxindex];
		if(countedobject[targetword].u || countedobject[targetword].l){ // if caps version might exist
			if(countedobject[targetword].u / (countedobject[targetword].u + countedobject[targetword].l) > capsthreshold){
				capswordspace[confirmedwordsarray[maxindex]] = countedobject[targetword].u / (countedobject[targetword].u + countedobject[targetword].l);
			}
			delete countedobject[targetword].l; 
			delete countedobject[targetword].u; 
		}
		//proceeds normally regardless
		if(countedobject[targetword].n >= minimum){
			sortedcountedobject[countedwordsarray[maxindex]] = countedobject[targetword];
		}
		confirmedwordsarray.splice(maxindex, 1);
		wordcountarray.splice(maxindex, 1);
	}	
	return sortedcountedobject
}


function firstcountsorter(countedobject,subsize){ //sorts and trims entries based on first word in sentence

	countedwordsarray = Object.keys(countedobject)
	numkeys = countedwordsarray.length
	wordcountarray = new Array();
	
	for(x = 0; x < numkeys; x++){
		countedword = countedwordsarray[x];
		wordcountarray[x] = countedobject[countedword].f;
	}
	
	numtrimmed = Math.min(countedwordsarray.length,subsize)
	sortedcountedobject = new Object();
	for(x = 0; x < numtrimmed; x++){
		maxindex = wordcountarray.indexOf(Math.max.apply(Math, wordcountarray)); //gets index of max value
		targetword = countedwordsarray[maxindex];
		
		arraytotal = 0;
		returnarray = trueWord(targetword)
		for(k in returnarray){
			arraytotal += returnarray[k][1]
		}
		for(k in returnarray){
			trueword = returnarray[k][0]
			truecount = (Math.round(countedobject[targetword]['f']*(returnarray[k][1]/arraytotal)*100))/100
			sortedcountedobject[trueword] = truecount;		
		}
		
		countedwordsarray.splice(maxindex, 1);
		wordcountarray.splice(maxindex, 1);
	}	
	return sortedcountedobject
}



function trueWord(inword){
	if(inword.length == 1){
		evalword = "prioritydic." + inword[0];
	}
	else{
		evalword = "prioritydic"
		for(var i = 0; i < inword.length; i++){
			evalword += "." + inword[i];
		}
	}
	activeobject = eval(evalword);
	returnarray = []
	if(activeobject.aa){
		//include original suggestion
		returnarray.push([inword,activeobject['nn']])
		alternatearray = activeobject['aa']
		for (var j = 0; j < alternatearray.length; j++){
			returnarray.push(activeobject.aa[j]);
		}
	}
	else if(activeobject.pp){
		returnarray.push([activeobject['pp'],activeobject['nn']])
	}
	else{
		returnarray.push([inword,activeobject['nn']])
	}
	return returnarray
}	

function writeJSONfile(jsonoutput, type){

	//version with lots of whitespace; much more readable
	var jf = require('jsonfile')

	filename = 'long-'+language+'-'+type+'.json';

	jf.writeFile(filename, jsonoutput, function(err) {
		if(err){
			console.log("error? " + err);
		}
	})

	//compressed version
	var jf = require('fs')

	filename = language+'-'+type+'.json';

	jsonoutput = JSON.stringify(jsonoutput)

	jf.writeFile(filename, jsonoutput, function(err) {
		if(err){
			console.log("error? " + err);
		}
	})
	
}