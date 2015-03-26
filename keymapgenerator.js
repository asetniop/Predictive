console.time('fullgenerator')

//GENERAL VARIABLES
var totalwordcount = 0;
var cleanarray = [] // for data after it has been cleaned and trimmed	
var language = process.argv[2]
var corpus = language + '-corpus.txt'

//PRIORITY DICTIONARY VARIABLES
var prioritydictionaryoutsize = 200000; // total size of priority output dictionary -- maybe make this unlimited?
var priorityminimum = 3; // words must appear more than this minimum amount of times to be included in output dictionary
var clipped = {};
var altminimum = 4; // words must appear more than this minimum amount of times to be included in output dictionary (removes true exotics, typos, etc)
var maxwordlength = 30; // won't process words longer that this
var prioritydic = {};
var trigramdic = {};
var sortedwordspace = {};

//PROTOTYPE FUNCTIONS FOR CHANGING LATIN CHARACTERS INTO REGULAR CHARACTERS
var Latinise={};Latinise.latin_map={"Á":"A","Ă":"A","Ắ":"A","Ặ":"A","Ằ":"A","Ẳ":"A","Ẵ":"A","Ǎ":"A","Â":"A","Ấ":"A","Ậ":"A","Ầ":"A","Ẩ":"A","Ẫ":"A","Ä":"A","Ǟ":"A","Ȧ":"A","Ǡ":"A","Ạ":"A","Ȁ":"A","À":"A","Ả":"A","Ȃ":"A","Ā":"A","Ą":"A","Å":"A","Ǻ":"A","Ḁ":"A","Ⱥ":"A","Ã":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ḃ":"B","Ḅ":"B","Ɓ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ć":"C","Č":"C","Ç":"C","Ḉ":"C","Ĉ":"C","Ċ":"C","Ƈ":"C","Ȼ":"C","Ď":"D","Ḑ":"D","Ḓ":"D","Ḋ":"D","Ḍ":"D","Ɗ":"D","Ḏ":"D","ǲ":"D","ǅ":"D","Đ":"D","Ƌ":"D","Ǳ":"DZ","Ǆ":"DZ","É":"E","Ĕ":"E","Ě":"E","Ȩ":"E","Ḝ":"E","Ê":"E","Ế":"E","Ệ":"E","Ề":"E","Ể":"E","Ễ":"E","Ḙ":"E","Ë":"E","Ė":"E","Ẹ":"E","Ȅ":"E","È":"E","Ẻ":"E","Ȇ":"E","Ē":"E","Ḗ":"E","Ḕ":"E","Ę":"E","Ɇ":"E","Ẽ":"E","Ḛ":"E","Ꝫ":"ET","Ḟ":"F","Ƒ":"F","Ǵ":"G","Ğ":"G","Ǧ":"G","Ģ":"G","Ĝ":"G","Ġ":"G","Ɠ":"G","Ḡ":"G","Ǥ":"G","Ḫ":"H","Ȟ":"H","Ḩ":"H","Ĥ":"H","Ⱨ":"H","Ḧ":"H","Ḣ":"H","Ḥ":"H","Ħ":"H","Í":"I","Ĭ":"I","Ǐ":"I","Î":"I","Ï":"I","Ḯ":"I","İ":"I","Ị":"I","Ȉ":"I","Ì":"I","Ỉ":"I","Ȋ":"I","Ī":"I","Į":"I","Ɨ":"I","Ĩ":"I","Ḭ":"I","Ꝺ":"D","Ꝼ":"F","Ᵹ":"G","Ꞃ":"R","Ꞅ":"S","Ꞇ":"T","Ꝭ":"IS","Ĵ":"J","Ɉ":"J","Ḱ":"K","Ǩ":"K","Ķ":"K","Ⱪ":"K","Ꝃ":"K","Ḳ":"K","Ƙ":"K","Ḵ":"K","Ꝁ":"K","Ꝅ":"K","Ĺ":"L","Ƚ":"L","Ľ":"L","Ļ":"L","Ḽ":"L","Ḷ":"L","Ḹ":"L","Ⱡ":"L","Ꝉ":"L","Ḻ":"L","Ŀ":"L","Ɫ":"L","ǈ":"L","Ł":"L","Ǉ":"LJ","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ń":"N","Ň":"N","Ņ":"N","Ṋ":"N","Ṅ":"N","Ṇ":"N","Ǹ":"N","Ɲ":"N","Ṉ":"N","Ƞ":"N","ǋ":"N","Ñ":"N","Ǌ":"NJ","Ó":"O","Ŏ":"O","Ǒ":"O","Ô":"O","Ố":"O","Ộ":"O","Ồ":"O","Ổ":"O","Ỗ":"O","Ö":"O","Ȫ":"O","Ȯ":"O","Ȱ":"O","Ọ":"O","Ő":"O","Ȍ":"O","Ò":"O","Ỏ":"O","Ơ":"O","Ớ":"O","Ợ":"O","Ờ":"O","Ở":"O","Ỡ":"O","Ȏ":"O","Ꝋ":"O","Ꝍ":"O","Ō":"O","Ṓ":"O","Ṑ":"O","Ɵ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Õ":"O","Ṍ":"O","Ṏ":"O","Ȭ":"O","Ƣ":"OI","Ꝏ":"OO","Ɛ":"E","Ɔ":"O","Ȣ":"OU","Ṕ":"P","Ṗ":"P","Ꝓ":"P","Ƥ":"P","Ꝕ":"P","Ᵽ":"P","Ꝑ":"P","Ꝙ":"Q","Ꝗ":"Q","Ŕ":"R","Ř":"R","Ŗ":"R","Ṙ":"R","Ṛ":"R","Ṝ":"R","Ȑ":"R","Ȓ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꜿ":"C","Ǝ":"E","Ś":"S","Ṥ":"S","Š":"S","Ṧ":"S","Ş":"S","Ŝ":"S","Ș":"S","Ṡ":"S","Ṣ":"S","Ṩ":"S","Ť":"T","Ţ":"T","Ṱ":"T","Ț":"T","Ⱦ":"T","Ṫ":"T","Ṭ":"T","Ƭ":"T","Ṯ":"T","Ʈ":"T","Ŧ":"T","Ɐ":"A","Ꞁ":"L","Ɯ":"M","Ʌ":"V","Ꜩ":"TZ","Ú":"U","Ŭ":"U","Ǔ":"U","Û":"U","Ṷ":"U","Ü":"U","Ǘ":"U","Ǚ":"U","Ǜ":"U","Ǖ":"U","Ṳ":"U","Ụ":"U","Ű":"U","Ȕ":"U","Ù":"U","Ủ":"U","Ư":"U","Ứ":"U","Ự":"U","Ừ":"U","Ử":"U","Ữ":"U","Ȗ":"U","Ū":"U","Ṻ":"U","Ų":"U","Ů":"U","Ũ":"U","Ṹ":"U","Ṵ":"U","Ꝟ":"V","Ṿ":"V","Ʋ":"V","Ṽ":"V","Ꝡ":"VY","Ẃ":"W","Ŵ":"W","Ẅ":"W","Ẇ":"W","Ẉ":"W","Ẁ":"W","Ⱳ":"W","Ẍ":"X","Ẋ":"X","Ý":"Y","Ŷ":"Y","Ÿ":"Y","Ẏ":"Y","Ỵ":"Y","Ỳ":"Y","Ƴ":"Y","Ỷ":"Y","Ỿ":"Y","Ȳ":"Y","Ɏ":"Y","Ỹ":"Y","Ź":"Z","Ž":"Z","Ẑ":"Z","Ⱬ":"Z","Ż":"Z","Ẓ":"Z","Ȥ":"Z","Ẕ":"Z","Ƶ":"Z","Ĳ":"IJ","Œ":"OE","ᴀ":"A","ᴁ":"AE","ʙ":"B","ᴃ":"B","ᴄ":"C","ᴅ":"D","ᴇ":"E","ꜰ":"F","ɢ":"G","ʛ":"G","ʜ":"H","ɪ":"I","ʁ":"R","ᴊ":"J","ᴋ":"K","ʟ":"L","ᴌ":"L","ᴍ":"M","ɴ":"N","ᴏ":"O","ɶ":"OE","ᴐ":"O","ᴕ":"OU","ᴘ":"P","ʀ":"R","ᴎ":"N","ᴙ":"R","ꜱ":"S","ᴛ":"T","ⱻ":"E","ᴚ":"R","ᴜ":"U","ᴠ":"V","ᴡ":"W","ʏ":"Y","ᴢ":"Z","á":"a","ă":"a","ắ":"a","ặ":"a","ằ":"a","ẳ":"a","ẵ":"a","ǎ":"a","â":"a","ấ":"a","ậ":"a","ầ":"a","ẩ":"a","ẫ":"a","ä":"a","ǟ":"a","ȧ":"a","ǡ":"a","ạ":"a","ȁ":"a","à":"a","ả":"a","ȃ":"a","ā":"a","ą":"a","ᶏ":"a","ẚ":"a","å":"a","ǻ":"a","ḁ":"a","ⱥ":"a","ã":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ḃ":"b","ḅ":"b","ɓ":"b","ḇ":"b","ᵬ":"b","ᶀ":"b","ƀ":"b","ƃ":"b","ɵ":"o","ć":"c","č":"c","ç":"c","ḉ":"c","ĉ":"c","ɕ":"c","ċ":"c","ƈ":"c","ȼ":"c","ď":"d","ḑ":"d","ḓ":"d","ȡ":"d","ḋ":"d","ḍ":"d","ɗ":"d","ᶑ":"d","ḏ":"d","ᵭ":"d","ᶁ":"d","đ":"d","ɖ":"d","ƌ":"d","ı":"i","ȷ":"j","ɟ":"j","ʄ":"j","ǳ":"dz","ǆ":"dz","é":"e","ĕ":"e","ě":"e","ȩ":"e","ḝ":"e","ê":"e","ế":"e","ệ":"e","ề":"e","ể":"e","ễ":"e","ḙ":"e","ë":"e","ė":"e","ẹ":"e","ȅ":"e","è":"e","ẻ":"e","ȇ":"e","ē":"e","ḗ":"e","ḕ":"e","ⱸ":"e","ę":"e","ᶒ":"e","ɇ":"e","ẽ":"e","ḛ":"e","ꝫ":"et","ḟ":"f","ƒ":"f","ᵮ":"f","ᶂ":"f","ǵ":"g","ğ":"g","ǧ":"g","ģ":"g","ĝ":"g","ġ":"g","ɠ":"g","ḡ":"g","ᶃ":"g","ǥ":"g","ḫ":"h","ȟ":"h","ḩ":"h","ĥ":"h","ⱨ":"h","ḧ":"h","ḣ":"h","ḥ":"h","ɦ":"h","ẖ":"h","ħ":"h","ƕ":"hv","í":"i","ĭ":"i","ǐ":"i","î":"i","ï":"i","ḯ":"i","ị":"i","ȉ":"i","ì":"i","ỉ":"i","ȋ":"i","ī":"i","į":"i","ᶖ":"i","ɨ":"i","ĩ":"i","ḭ":"i","ꝺ":"d","ꝼ":"f","ᵹ":"g","ꞃ":"r","ꞅ":"s","ꞇ":"t","ꝭ":"is","ǰ":"j","ĵ":"j","ʝ":"j","ɉ":"j","ḱ":"k","ǩ":"k","ķ":"k","ⱪ":"k","ꝃ":"k","ḳ":"k","ƙ":"k","ḵ":"k","ᶄ":"k","ꝁ":"k","ꝅ":"k","ĺ":"l","ƚ":"l","ɬ":"l","ľ":"l","ļ":"l","ḽ":"l","ȴ":"l","ḷ":"l","ḹ":"l","ⱡ":"l","ꝉ":"l","ḻ":"l","ŀ":"l","ɫ":"l","ᶅ":"l","ɭ":"l","ł":"l","ǉ":"lj","ſ":"s","ẜ":"s","ẛ":"s","ẝ":"s","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ᵯ":"m","ᶆ":"m","ń":"n","ň":"n","ņ":"n","ṋ":"n","ȵ":"n","ṅ":"n","ṇ":"n","ǹ":"n","ɲ":"n","ṉ":"n","ƞ":"n","ᵰ":"n","ᶇ":"n","ɳ":"n","ñ":"n","ǌ":"nj","ó":"o","ŏ":"o","ǒ":"o","ô":"o","ố":"o","ộ":"o","ồ":"o","ổ":"o","ỗ":"o","ö":"o","ȫ":"o","ȯ":"o","ȱ":"o","ọ":"o","ő":"o","ȍ":"o","ò":"o","ỏ":"o","ơ":"o","ớ":"o","ợ":"o","ờ":"o","ở":"o","ỡ":"o","ȏ":"o","ꝋ":"o","ꝍ":"o","ⱺ":"o","ō":"o","ṓ":"o","ṑ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","õ":"o","ṍ":"o","ṏ":"o","ȭ":"o","ƣ":"oi","ꝏ":"oo","ɛ":"e","ᶓ":"e","ɔ":"o","ᶗ":"o","ȣ":"ou","ṕ":"p","ṗ":"p","ꝓ":"p","ƥ":"p","ᵱ":"p","ᶈ":"p","ꝕ":"p","ᵽ":"p","ꝑ":"p","ꝙ":"q","ʠ":"q","ɋ":"q","ꝗ":"q","ŕ":"r","ř":"r","ŗ":"r","ṙ":"r","ṛ":"r","ṝ":"r","ȑ":"r","ɾ":"r","ᵳ":"r","ȓ":"r","ṟ":"r","ɼ":"r","ᵲ":"r","ᶉ":"r","ɍ":"r","ɽ":"r","ↄ":"c","ꜿ":"c","ɘ":"e","ɿ":"r","ś":"s","ṥ":"s","š":"s","ṧ":"s","ş":"s","ŝ":"s","ș":"s","ṡ":"s","ṣ":"s","ṩ":"s","ʂ":"s","ᵴ":"s","ᶊ":"s","ȿ":"s","ɡ":"g","ᴑ":"o","ᴓ":"o","ᴝ":"u","ť":"t","ţ":"t","ṱ":"t","ț":"t","ȶ":"t","ẗ":"t","ⱦ":"t","ṫ":"t","ṭ":"t","ƭ":"t","ṯ":"t","ᵵ":"t","ƫ":"t","ʈ":"t","ŧ":"t","ᵺ":"th","ɐ":"a","ᴂ":"ae","ǝ":"e","ᵷ":"g","ɥ":"h","ʮ":"h","ʯ":"h","ᴉ":"i","ʞ":"k","ꞁ":"l","ɯ":"m","ɰ":"m","ᴔ":"oe","ɹ":"r","ɻ":"r","ɺ":"r","ⱹ":"r","ʇ":"t","ʌ":"v","ʍ":"w","ʎ":"y","ꜩ":"tz","ú":"u","ŭ":"u","ǔ":"u","û":"u","ṷ":"u","ü":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǖ":"u","ṳ":"u","ụ":"u","ű":"u","ȕ":"u","ù":"u","ủ":"u","ư":"u","ứ":"u","ự":"u","ừ":"u","ử":"u","ữ":"u","ȗ":"u","ū":"u","ṻ":"u","ų":"u","ᶙ":"u","ů":"u","ũ":"u","ṹ":"u","ṵ":"u","ᵫ":"ue","ꝸ":"um","ⱴ":"v","ꝟ":"v","ṿ":"v","ʋ":"v","ᶌ":"v","ⱱ":"v","ṽ":"v","ꝡ":"vy","ẃ":"w","ŵ":"w","ẅ":"w","ẇ":"w","ẉ":"w","ẁ":"w","ⱳ":"w","ẘ":"w","ẍ":"x","ẋ":"x","ᶍ":"x","ý":"y","ŷ":"y","ÿ":"y","ẏ":"y","ỵ":"y","ỳ":"y","ƴ":"y","ỷ":"y","ỿ":"y","ȳ":"y","ẙ":"y","ɏ":"y","ỹ":"y","ź":"z","ž":"z","ẑ":"z","ʑ":"z","ⱬ":"z","ż":"z","ẓ":"z","ȥ":"z","ẕ":"z","ᵶ":"z","ᶎ":"z","ʐ":"z","ƶ":"z","ɀ":"z","ﬀ":"ff","ﬃ":"ffi","ﬄ":"ffl","ﬁ":"fi","ﬂ":"fl","ĳ":"ij","œ":"oe","ﬆ":"st","ₐ":"a","ₑ":"e","ᵢ":"i","ⱼ":"j","ₒ":"o","ᵣ":"r","ᵤ":"u","ᵥ":"v","ₓ":"x"};
String.prototype.latinise=function(){return this.replace(/[^A-Za-z0-9\[\] ]/g,function(a){return Latinise.latin_map[a]||a})};
String.prototype.latinize=String.prototype.latinise;
String.prototype.isLatin=function(){return this==this.latinise()}

//ASETNIOP VARIABLES
getbasekey = ['-','a','s','e','t','n','i','o','p'];
lowercase = 'abcdefghijklmnopqrstuvwxyz`-=[]\\;\',./{}?1234567890!()´ˇ¸^°¨•~áéçşäëöüıßàèμåøñ'
uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ~_+{}|:"<>?[]/!@#$%^&*()![]´ˇ¸^°¨•~ÁÉÇŞÄËÖÜIẞÀÈΜÅØÑ'
var keymapoutsize = 10000; // total size of trigram output dictionary (also ring dictionary size)
var partiallimit = 20; //limit number of partials
var wordlimit = 10; //limit number of potential words
	
var minpartiallength = 2;
var maxpartiallength = 4;
var maxwordlength = 30;	
var maxinputkeys = 4; //maximum number of keys beyond which it is assumed partials are not intended
	
//GENERATE PRIORITY AND SYNONYM DICTIONARIES
var fs = require('fs');
fs.readFile(corpus, function(err, data) {
	
	allwordspace = {};
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
		
		//linestring = linestring.replace(/-/g, '_') //removes dashes and replaces with underscores
		//linestring = linestring.replace(/'/g, '_') //removes apostrophes and replaces with underscores
		
		linestring = linestring.latinise() //replace any accented characters with pure latin forms
		
		linestring = linestring.replace(/[^A-Za-z\s-']/g, ' ') //removes EVERYTHING except letters and spaces (and hyphens and apostrophes)
		
		linestring = linestring.replace(/\s{2,}/g, ' '); //trims multiple spaces into singles
		
		capsstring = linestring; //preserves capitalized version
		
		linestring = linestring.toLowerCase();
		
		cleanarray.push(linestring);
		
		//count individual words
		linearray = linestring.split(" ");
		wordsinline = linearray.length;
		for(j = 0; j < wordsinline; j++) {
			activeword = linearray[j];		
			if(checkword(activeword)){ 
				totalwordcount += 1; 
				
				if(allwordspace[activeword]){
					allwordspace[activeword].n = allwordspace[activeword].n + 1;
				}
				else{
					if(activeword.length > 0){ //eliminates issue of blank keys
						allwordspace[activeword] = new Object();
						allwordspace[activeword].n = 1; // total instances
					}
				}
				
			}
		}
    }
	
	//remove instances that are less than the required minimum
	keys = Object.keys(allwordspace)
	for(j = 0; j < keys.length; j++) {
		activeword = keys[j]
		//deletes them if they don't include the required number of instances - does this last because it messes up process if done first
		if(allwordspace[activeword].n >= priorityminimum){
			//does nothing
		}
		else{
			delete allwordspace[activeword];
		}
	}
	
	//countsorter tops out at around 100k words, so watch for that
	keymapwordspace = countsorter(allwordspace,keymapoutsize) 
	
		

overallmaster = []

//SET UP BASIC OVERALLMASTER OBJECT
for (k = 1; k <= 8; k++) { // normally 1 through 8
	permArr = [];
	usedChars = [];
	baseperms = permute([1, 2, 3, 4, 5, 6, 7, 8]);
	
	A = trimmute(baseperms, k);
	B = [];
	C = [];
	for (x = 0; x < A.length; x++) { 
		B[x] = [];
	}
	
	for (x = 0; x < A.length; x++) { 
		ywidth = A[0].length
		basekeys = '';
		for (y = 0; y < ywidth; y++) { 
			B[x][y] = Math.pow(2,(A[x][y]-1));
			basekeys += getbasekey[A[x][y]];
		}
		C[x] = B[x].reduce(function(pv, cv) { return pv + cv; }, 0);
		activeobject = {}
		activeobject.value = C[x]
		activeobject.input = A[x]
		activeobject.keys = basekeys
		character = ''
        activeobject.base = character;
        activeobject.baseshift = character;
        activeobject.tlp = {};
        activeobject.lp = {};
        activeobject.trp = {};
        activeobject.rp = {};
        activeobject.partials = {};
        activeobject.tlw = {};
        activeobject.lw = {};
        activeobject.trw = {};
        activeobject.rw = {};
        activeobject.words = {};
        activeobject.special = 'none';
		
		//DEAL WITH 1 AND 2 CHARACTER COMBINATIONS
        if(k == 1){
            character = basekeys;
            activeobject.base = character;
            activeobject.baseshift = shiftreplace(character);
		}
		else if (k == 2){
            character = binaryget(C[x]);
            activeobject.base = character;
            activeobject.baseshift = shiftreplace(character, lowercase, uppercase);
		}
			
		overallmaster.push(activeobject)
	}
	
}

//ADD BLANK START AS PLACEKEEPER
activeobject = {}
activeobject.value = 0;
notes = []
notes.push("Developer : Zack Dennis (zack@asetniop.com)")
notes.push("Date : 12/12/2014")
notes.push("All code (c) 2014 Pointesa, LLC all rights reserved")
notes.push("Abbreviations :    ")
notes.push("tlp = top left partial")
notes.push("lp = left partials")
notes.push("trp = top right partial")
notes.push("rp = right partials")
notes.push("tlw = top left word")
notes.push("lw = left words")
notes.push("trw = top right word")
notes.push("rw = right words")

activeobject.notes = notes

overallmaster.push(activeobject)

//SORT MASTER ARRAY BY VALUE
sortedmaster = overallmaster
sortedmaster.sort(function(a, b){
    var keyA = new Date(a.value),
    keyB = new Date(b.value);
    // Compare the 2 dates
    if(keyA < keyB) return -1;
    if(keyA > keyB) return 1;
    return 0;
});


//DETERMINE ALL VIABLE PARTIALS

counter = 1;
wordlength = 4; //maximum partial size
partialspace = {};

keymapwordsarray = Object.keys(keymapwordspace)
for (i = 0; i < keymapwordsarray.length; i++) { 
	for (j = 1; j <= maxwordlength; j++) { 
		word = keymapwordsarray[i]
		wordsize = word.length
		for (k = 0; k <= wordsize-j; k++) { 
			wordfragment = word.substring(k,k+j)
			if(partialspace[wordfragment]){
				partialspace[wordfragment] += keymapwordspace[word].n
			}
			else{
				partialspace[wordfragment] = keymapwordspace[word].n
			}
			
		}
	}
}
partialsarray = Object.keys(partialspace)
for (i = 0; i < partialsarray.length; i++) { 
	partial = partialsarray[i]
	partialsplit = partial.split('')
	reconstruct = '';
	for (j = 0; j < partialsplit.length; j++) { 
		code = binaryput(partialsplit[j])
		reconstruct += sortedmaster[code].keys
	}
	uniqueconstruct = uniquereduce(reconstruct)
	uniquearray = uniqueconstruct.split('')
	uniquesum = 0;
	for (j = 0; j < uniquearray.length; j++) { 
		uniquesum += binaryput(uniquearray[j])
	}
	if(partial.length >= minpartiallength && partial.length <= maxpartiallength && sortedmaster[uniquesum].keys.length <= maxinputkeys){ //skips partials that are too long or require too many input keys
		//add partials
		if(sortedmaster[uniquesum].partials[partial]){
			sortedmaster[uniquesum].partials[partial] += partialspace[partial]
		}
		else{
			sortedmaster[uniquesum].partials[partial] = partialspace[partial]
		}
	}
	//check if viable words, if so, add
	if(keymapwordspace[partial]){
		sortedmaster[uniquesum].words[partial] = keymapwordspace[partial].n
	}
}


//SORT AND TRIM PARTIALS AND WORDS, THEN ASSIGN EAST/WEST TO WORDS AND PARTIALS
for (i = 1; i < sortedmaster.length; i++) { //skip the first entry
	activeobject = sortedmaster[i]
	
	//sort and trim partials
	activepartials = activeobject.partials
	sortedpartials = partialsorter(activepartials, partiallimit)
	sortedmaster[i].partials = sortedpartials
	activepartials = sortedpartials
	
	//determine left/right partial assignments
	partialkeysarray = Object.keys(activepartials)
	topright = ['',0]
	topleft = ['',0]
	leftpartials = {}
	rightpartials = {}
	for (j = 0; j < partialkeysarray.length; j++) { 
		partial = partialkeysarray[j]
		firstletter = partial.substring(0,1)
		firsthand = eastwest(firstletter)
		if(firsthand == 'r'){
			rightpartials[partial] = activepartials[partial]
			if(activepartials[partial] > topright[1]){
				topright = [partial,activepartials[partial]]
			}
		}
		else if(firsthand == 'l'){
			leftpartials[partial] = activepartials[partial]
			if(activepartials[partial] > topleft[1]){
				topleft = [partial,activepartials[partial]]
			}
		}
	}
	//assign top partials
	if(topleft[1] > 0){
		sortedmaster[i].tlp[topleft[0]] = topleft[1] 
	}
	if(topright[1] > 0){
		sortedmaster[i].trp[topright[0]] = topright[1] 
	}
	//assign left and right partials
	sortedmaster[i].lp = leftpartials
	sortedmaster[i].rp = rightpartials
	//remove original partials object
	delete sortedmaster[i].partials
	
	//sort and trim words
	activewords = activeobject.words
	sortedwords = partialsorter(activewords, wordlimit)
	sortedmaster[i].words = sortedwords
	activewords = sortedwords
	
	//determine left/right word assignments
	wordkeysarray = Object.keys(activewords)
	topright = ['',0]
	topleft = ['',0]
	leftwords = {}
	rightwords = {}
	for (j = 0; j < wordkeysarray.length; j++) { 
		word = wordkeysarray[j]
		firstletter = word.substring(0,1)
		firsthand = eastwest(firstletter)
		if(firsthand == 'r'){
			rightwords[word] = activewords[word]
			if(activewords[word] > topright[1]){
				topright = [word,activewords[word]]
			}
		}
		else if(firsthand == 'l'){
			leftwords[word] = activewords[word]
			if(activewords[word] > topleft[1]){
				topleft = [word,activewords[word]]
			}
		}
	}
	//assign top words
	if(topleft[1] > 0){
		sortedmaster[i].tlw[topleft[0]] = topleft[1] 
	}
	if(topright[1] > 0){
		sortedmaster[i].trw[topright[0]] = topright[1] 
	}
	//assign left and right words
	sortedmaster[i].lw = leftwords
	sortedmaster[i].rw = rightwords
	//remove original words object
	delete sortedmaster[i].words
	
}

//write keymaps to JSON 
keymap = sortedmaster
longJSONfile(keymap, 'keymap')	
//JSONfile(keymap, 'keymap')	


//CUTS SIZE BY ABOUT 50%, NOT REALLY WORTH IT
for (i = 1; i < keymap.length; i++) { //trim stuff for minimized version
	delete keymap[i].lp
	delete keymap[i].rp
	delete keymap[i].lw
	delete keymap[i].rw
}
//write keymaps to JSON 
longJSONfile(keymap, 'min-keymap')
//JSONfile(keymap, 'min-keymap')
	
	
});





function eastwest(input){
	left = 'qazwsxedcrfvtgb'; // left hand combos
	right = 'yhnujmikolp\'-'; // right hand combos
	//assumes left hand, unless found in east matrix
	output = 'l'
	if(right.indexOf(input) > -1){
		output = 'r'
	}
	return output
}


function shiftreplace(input){
	output = uppercase[lowercase.indexOf(input,lowercase)]
	return output
}

function binaryget(code){ //converts characters to binary output

	//would be better to code this as an object, but it's already done so not gonna mess with it...
	codematrix =    [1, 24, 10, 6, 4, 9, 72, 48, 32, 18, 34, 96, 144, 16, 64, 128, 17, 12, 2, 8, 80, 40, 3, 5, 20, 33, 36, 66, 129, 160, 65, 130, 68, 132, 192];
	outputmatrix = 'abcdefghijklmnopqrstuvwxyz,.?!()-\';' ; //plus is equivalent to BKSP key

	location  = codematrix.indexOf(code);

	character = outputmatrix[location];

	return character
}

function binaryput(character){ //converts binary output to characters

	codematrix =    [1, 24, 10, 6, 4, 9, 72, 48, 32, 18, 34, 96, 144, 16, 64, 128, 17, 12, 2, 8, 80, 40, 3, 5, 20, 33, 36, 66, 129, 160, 65, 130, 68, 132, 192];
	outputmatrix = 'abcdefghijklmnopqrstuvwxyz,.?!()-\';' ; //plus is equivalent to BKSP key

	location  = outputmatrix.indexOf(character);

	code = codematrix[location];

	return code
}

//ORIGINAL FUNCTIONS BEFORE K-Z-! SWITCH
function Xbinaryget(code){ //converts characters to binary output

	//would be better to code this as an object, but it's already done so not gonna mess with it...
	codematrix =    [1, 24, 10, 6, 4, 9, 72, 48, 32, 18, 160, 96, 144, 16, 64, 128, 17, 12, 2, 8, 80, 40, 3, 5, 20, 34, 36, 66, 129, 33, 65, 130, 68, 132, 192];
	outputmatrix = 'abcdefghijklmnopqrstuvwxyz,.?!()-\';' ; //plus is equivalent to BKSP key

	location  = codematrix.indexOf(code);

	character = outputmatrix[location];

	return character
}

function Xbinaryput(character){ //converts binary output to characters

	codematrix =    [1, 24, 10, 6, 4, 9, 72, 48, 32, 18, 160, 96, 144, 16, 64, 128, 17, 12, 2, 8, 80, 40, 3, 5, 20, 34, 36, 66, 129, 33, 65, 130, 68, 132, 192];
	outputmatrix = 'abcdefghijklmnopqrstuvwxyz,.?!()-\';' ; //plus is equivalent to BKSP key

	location  = outputmatrix.indexOf(character);

	code = codematrix[location];

	return code
}

function uniquereduce(instring){ //reduces string to unique character components
	outstring = ''
	instringarray = instring.split('')
	used = {}
    for (var i = 0; i < instringarray.length; i++) {
		if(!used[instringarray[i]]){
			used[instringarray[i]] = true
			outstring += instringarray[i]
		}
	}
	return outstring
}


function permute(input) {
    var i, ch;
    for (i = 0; i < input.length; i++) {
        ch = input.splice(i, 1)[0];
        usedChars.push(ch);
        if (input.length == 0) {
            permArr.push(usedChars.slice());
        }
        permute(input);
        input.splice(i, 0, ch);
        usedChars.pop();
    }
    return permArr
};

function trimmute(input, numchars){
	used = {};
	output = [];
    for (i = 0; i < input.length; i++) {
		newarray = input[i]
		trimarray = newarray.splice(0,numchars)
		sortarray = trimarray.sort()
		trimsortstring = sortarray.join()
		if(!used[trimsortstring]){
			used[trimsortstring] = true;
			output.push(trimarray)
		}
	}
	return output

}


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
		sortedcountedobject[countedwordsarray[maxindex]] = countedobject[targetword];
		countedwordsarray.splice(maxindex, 1);
		wordcountarray.splice(maxindex, 1);
	}	
	return sortedcountedobject
}

function partialsorter(countedobject,subsize){ //sorts and trims entries in object based on count of sub-objects and returns sorted object; subsize is max number of subobjects 

	countedwordsarray = Object.keys(countedobject)
	numkeys = countedwordsarray.length
	wordcountarray = new Array();
	
	for(x = 0; x < numkeys; x++){
		countedword = countedwordsarray[x];
		wordcountarray[x] = countedobject[countedword];
	}
	numtrimmed = Math.min(countedwordsarray.length,subsize)
	sortedcountedobject = new Object();
	//console.log(wordcountarray.length)
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