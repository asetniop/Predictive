//THIS PERFORMS BETTER.  FIND OUT WHY

var language = process.argv[2]
var sentencefile = language + '-testsentences.txt'

abcfactor = 100000
zabfactor = 2;
linkloopssetting = 6 //doesn't look too deeply into back catalogue for a-b connection
a_bfactor = 4;
a_b_cfactor = 4;
acfactor = 2;
a_cfactor = 2;

//SIMULATOR VARIABLES
prioritydic = {};
trigramdic = {};
rings = {};
ringassignments = {};
typedword = [];
evalword = "";
basechoicearray = [];
ABarray = [];
ABCarray = [];
finalchoicearray = [];
originalchoicearray = [];
potentialword = true;
penultimateword = "";
previousword = "";
numberofchoices = 5;


maxwordlength = 30;
wordpower = 1; // gives boost to shorter words - use 1 for no effect
wordlengthtrip = 1 //skips advanced processing for first letter of word; saves a lot of time for little effect on accuracy - set to 0 for no effect.

var predictivedictionary = require('./'+language+'-predictive-dictionary.json'); //skip synonym ring generation
var trigramdic = predictivedictionary.trigramdic
var prioritydic = predictivedictionary.prioritydic
var rings = predictivedictionary.rings
var ringassignments = {}

var initialdictionary = require('./'+language+'-initial.json'); //skip synonym ring generation
var firstpriority = initialdictionary.firstpriority
var dictionarystats = initialdictionary.dictionarystats
	dictionarystats.Achoice = 0;
	dictionarystats.ABchoice = 0;
	dictionarystats.ABCchoice = 0;
	dictionarystats.Atop = 0;
	dictionarystats.ABtop = 0;
	dictionarystats.ABCtop = 0;
	dictionarystats.superseded = 0;
	dictionarystats.unfound = 0;
var totalbytes = 0;

	
//PROTOTYPE FUNCTIONS FOR CHANGING LATIN CHARACTERS INTO REGULAR CHARACTERS
var Latinise={};Latinise.latin_map={"Á":"A","Ă":"A","Ắ":"A","Ặ":"A","Ằ":"A","Ẳ":"A","Ẵ":"A","Ǎ":"A","Â":"A","Ấ":"A","Ậ":"A","Ầ":"A","Ẩ":"A","Ẫ":"A","Ä":"A","Ǟ":"A","Ȧ":"A","Ǡ":"A","Ạ":"A","Ȁ":"A","À":"A","Ả":"A","Ȃ":"A","Ā":"A","Ą":"A","Å":"A","Ǻ":"A","Ḁ":"A","Ⱥ":"A","Ã":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ḃ":"B","Ḅ":"B","Ɓ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ć":"C","Č":"C","Ç":"C","Ḉ":"C","Ĉ":"C","Ċ":"C","Ƈ":"C","Ȼ":"C","Ď":"D","Ḑ":"D","Ḓ":"D","Ḋ":"D","Ḍ":"D","Ɗ":"D","Ḏ":"D","ǲ":"D","ǅ":"D","Đ":"D","Ƌ":"D","Ǳ":"DZ","Ǆ":"DZ","É":"E","Ĕ":"E","Ě":"E","Ȩ":"E","Ḝ":"E","Ê":"E","Ế":"E","Ệ":"E","Ề":"E","Ể":"E","Ễ":"E","Ḙ":"E","Ë":"E","Ė":"E","Ẹ":"E","Ȅ":"E","È":"E","Ẻ":"E","Ȇ":"E","Ē":"E","Ḗ":"E","Ḕ":"E","Ę":"E","Ɇ":"E","Ẽ":"E","Ḛ":"E","Ꝫ":"ET","Ḟ":"F","Ƒ":"F","Ǵ":"G","Ğ":"G","Ǧ":"G","Ģ":"G","Ĝ":"G","Ġ":"G","Ɠ":"G","Ḡ":"G","Ǥ":"G","Ḫ":"H","Ȟ":"H","Ḩ":"H","Ĥ":"H","Ⱨ":"H","Ḧ":"H","Ḣ":"H","Ḥ":"H","Ħ":"H","Í":"I","Ĭ":"I","Ǐ":"I","Î":"I","Ï":"I","Ḯ":"I","İ":"I","Ị":"I","Ȉ":"I","Ì":"I","Ỉ":"I","Ȋ":"I","Ī":"I","Į":"I","Ɨ":"I","Ĩ":"I","Ḭ":"I","Ꝺ":"D","Ꝼ":"F","Ᵹ":"G","Ꞃ":"R","Ꞅ":"S","Ꞇ":"T","Ꝭ":"IS","Ĵ":"J","Ɉ":"J","Ḱ":"K","Ǩ":"K","Ķ":"K","Ⱪ":"K","Ꝃ":"K","Ḳ":"K","Ƙ":"K","Ḵ":"K","Ꝁ":"K","Ꝅ":"K","Ĺ":"L","Ƚ":"L","Ľ":"L","Ļ":"L","Ḽ":"L","Ḷ":"L","Ḹ":"L","Ⱡ":"L","Ꝉ":"L","Ḻ":"L","Ŀ":"L","Ɫ":"L","ǈ":"L","Ł":"L","Ǉ":"LJ","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ń":"N","Ň":"N","Ņ":"N","Ṋ":"N","Ṅ":"N","Ṇ":"N","Ǹ":"N","Ɲ":"N","Ṉ":"N","Ƞ":"N","ǋ":"N","Ñ":"N","Ǌ":"NJ","Ó":"O","Ŏ":"O","Ǒ":"O","Ô":"O","Ố":"O","Ộ":"O","Ồ":"O","Ổ":"O","Ỗ":"O","Ö":"O","Ȫ":"O","Ȯ":"O","Ȱ":"O","Ọ":"O","Ő":"O","Ȍ":"O","Ò":"O","Ỏ":"O","Ơ":"O","Ớ":"O","Ợ":"O","Ờ":"O","Ở":"O","Ỡ":"O","Ȏ":"O","Ꝋ":"O","Ꝍ":"O","Ō":"O","Ṓ":"O","Ṑ":"O","Ɵ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Õ":"O","Ṍ":"O","Ṏ":"O","Ȭ":"O","Ƣ":"OI","Ꝏ":"OO","Ɛ":"E","Ɔ":"O","Ȣ":"OU","Ṕ":"P","Ṗ":"P","Ꝓ":"P","Ƥ":"P","Ꝕ":"P","Ᵽ":"P","Ꝑ":"P","Ꝙ":"Q","Ꝗ":"Q","Ŕ":"R","Ř":"R","Ŗ":"R","Ṙ":"R","Ṛ":"R","Ṝ":"R","Ȑ":"R","Ȓ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꜿ":"C","Ǝ":"E","Ś":"S","Ṥ":"S","Š":"S","Ṧ":"S","Ş":"S","Ŝ":"S","Ș":"S","Ṡ":"S","Ṣ":"S","Ṩ":"S","Ť":"T","Ţ":"T","Ṱ":"T","Ț":"T","Ⱦ":"T","Ṫ":"T","Ṭ":"T","Ƭ":"T","Ṯ":"T","Ʈ":"T","Ŧ":"T","Ɐ":"A","Ꞁ":"L","Ɯ":"M","Ʌ":"V","Ꜩ":"TZ","Ú":"U","Ŭ":"U","Ǔ":"U","Û":"U","Ṷ":"U","Ü":"U","Ǘ":"U","Ǚ":"U","Ǜ":"U","Ǖ":"U","Ṳ":"U","Ụ":"U","Ű":"U","Ȕ":"U","Ù":"U","Ủ":"U","Ư":"U","Ứ":"U","Ự":"U","Ừ":"U","Ử":"U","Ữ":"U","Ȗ":"U","Ū":"U","Ṻ":"U","Ų":"U","Ů":"U","Ũ":"U","Ṹ":"U","Ṵ":"U","Ꝟ":"V","Ṿ":"V","Ʋ":"V","Ṽ":"V","Ꝡ":"VY","Ẃ":"W","Ŵ":"W","Ẅ":"W","Ẇ":"W","Ẉ":"W","Ẁ":"W","Ⱳ":"W","Ẍ":"X","Ẋ":"X","Ý":"Y","Ŷ":"Y","Ÿ":"Y","Ẏ":"Y","Ỵ":"Y","Ỳ":"Y","Ƴ":"Y","Ỷ":"Y","Ỿ":"Y","Ȳ":"Y","Ɏ":"Y","Ỹ":"Y","Ź":"Z","Ž":"Z","Ẑ":"Z","Ⱬ":"Z","Ż":"Z","Ẓ":"Z","Ȥ":"Z","Ẕ":"Z","Ƶ":"Z","Ĳ":"IJ","Œ":"OE","ᴀ":"A","ᴁ":"AE","ʙ":"B","ᴃ":"B","ᴄ":"C","ᴅ":"D","ᴇ":"E","ꜰ":"F","ɢ":"G","ʛ":"G","ʜ":"H","ɪ":"I","ʁ":"R","ᴊ":"J","ᴋ":"K","ʟ":"L","ᴌ":"L","ᴍ":"M","ɴ":"N","ᴏ":"O","ɶ":"OE","ᴐ":"O","ᴕ":"OU","ᴘ":"P","ʀ":"R","ᴎ":"N","ᴙ":"R","ꜱ":"S","ᴛ":"T","ⱻ":"E","ᴚ":"R","ᴜ":"U","ᴠ":"V","ᴡ":"W","ʏ":"Y","ᴢ":"Z","á":"a","ă":"a","ắ":"a","ặ":"a","ằ":"a","ẳ":"a","ẵ":"a","ǎ":"a","â":"a","ấ":"a","ậ":"a","ầ":"a","ẩ":"a","ẫ":"a","ä":"a","ǟ":"a","ȧ":"a","ǡ":"a","ạ":"a","ȁ":"a","à":"a","ả":"a","ȃ":"a","ā":"a","ą":"a","ᶏ":"a","ẚ":"a","å":"a","ǻ":"a","ḁ":"a","ⱥ":"a","ã":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ḃ":"b","ḅ":"b","ɓ":"b","ḇ":"b","ᵬ":"b","ᶀ":"b","ƀ":"b","ƃ":"b","ɵ":"o","ć":"c","č":"c","ç":"c","ḉ":"c","ĉ":"c","ɕ":"c","ċ":"c","ƈ":"c","ȼ":"c","ď":"d","ḑ":"d","ḓ":"d","ȡ":"d","ḋ":"d","ḍ":"d","ɗ":"d","ᶑ":"d","ḏ":"d","ᵭ":"d","ᶁ":"d","đ":"d","ɖ":"d","ƌ":"d","ı":"i","ȷ":"j","ɟ":"j","ʄ":"j","ǳ":"dz","ǆ":"dz","é":"e","ĕ":"e","ě":"e","ȩ":"e","ḝ":"e","ê":"e","ế":"e","ệ":"e","ề":"e","ể":"e","ễ":"e","ḙ":"e","ë":"e","ė":"e","ẹ":"e","ȅ":"e","è":"e","ẻ":"e","ȇ":"e","ē":"e","ḗ":"e","ḕ":"e","ⱸ":"e","ę":"e","ᶒ":"e","ɇ":"e","ẽ":"e","ḛ":"e","ꝫ":"et","ḟ":"f","ƒ":"f","ᵮ":"f","ᶂ":"f","ǵ":"g","ğ":"g","ǧ":"g","ģ":"g","ĝ":"g","ġ":"g","ɠ":"g","ḡ":"g","ᶃ":"g","ǥ":"g","ḫ":"h","ȟ":"h","ḩ":"h","ĥ":"h","ⱨ":"h","ḧ":"h","ḣ":"h","ḥ":"h","ɦ":"h","ẖ":"h","ħ":"h","ƕ":"hv","í":"i","ĭ":"i","ǐ":"i","î":"i","ï":"i","ḯ":"i","ị":"i","ȉ":"i","ì":"i","ỉ":"i","ȋ":"i","ī":"i","į":"i","ᶖ":"i","ɨ":"i","ĩ":"i","ḭ":"i","ꝺ":"d","ꝼ":"f","ᵹ":"g","ꞃ":"r","ꞅ":"s","ꞇ":"t","ꝭ":"is","ǰ":"j","ĵ":"j","ʝ":"j","ɉ":"j","ḱ":"k","ǩ":"k","ķ":"k","ⱪ":"k","ꝃ":"k","ḳ":"k","ƙ":"k","ḵ":"k","ᶄ":"k","ꝁ":"k","ꝅ":"k","ĺ":"l","ƚ":"l","ɬ":"l","ľ":"l","ļ":"l","ḽ":"l","ȴ":"l","ḷ":"l","ḹ":"l","ⱡ":"l","ꝉ":"l","ḻ":"l","ŀ":"l","ɫ":"l","ᶅ":"l","ɭ":"l","ł":"l","ǉ":"lj","ſ":"s","ẜ":"s","ẛ":"s","ẝ":"s","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ᵯ":"m","ᶆ":"m","ń":"n","ň":"n","ņ":"n","ṋ":"n","ȵ":"n","ṅ":"n","ṇ":"n","ǹ":"n","ɲ":"n","ṉ":"n","ƞ":"n","ᵰ":"n","ᶇ":"n","ɳ":"n","ñ":"n","ǌ":"nj","ó":"o","ŏ":"o","ǒ":"o","ô":"o","ố":"o","ộ":"o","ồ":"o","ổ":"o","ỗ":"o","ö":"o","ȫ":"o","ȯ":"o","ȱ":"o","ọ":"o","ő":"o","ȍ":"o","ò":"o","ỏ":"o","ơ":"o","ớ":"o","ợ":"o","ờ":"o","ở":"o","ỡ":"o","ȏ":"o","ꝋ":"o","ꝍ":"o","ⱺ":"o","ō":"o","ṓ":"o","ṑ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","õ":"o","ṍ":"o","ṏ":"o","ȭ":"o","ƣ":"oi","ꝏ":"oo","ɛ":"e","ᶓ":"e","ɔ":"o","ᶗ":"o","ȣ":"ou","ṕ":"p","ṗ":"p","ꝓ":"p","ƥ":"p","ᵱ":"p","ᶈ":"p","ꝕ":"p","ᵽ":"p","ꝑ":"p","ꝙ":"q","ʠ":"q","ɋ":"q","ꝗ":"q","ŕ":"r","ř":"r","ŗ":"r","ṙ":"r","ṛ":"r","ṝ":"r","ȑ":"r","ɾ":"r","ᵳ":"r","ȓ":"r","ṟ":"r","ɼ":"r","ᵲ":"r","ᶉ":"r","ɍ":"r","ɽ":"r","ↄ":"c","ꜿ":"c","ɘ":"e","ɿ":"r","ś":"s","ṥ":"s","š":"s","ṧ":"s","ş":"s","ŝ":"s","ș":"s","ṡ":"s","ṣ":"s","ṩ":"s","ʂ":"s","ᵴ":"s","ᶊ":"s","ȿ":"s","ɡ":"g","ᴑ":"o","ᴓ":"o","ᴝ":"u","ť":"t","ţ":"t","ṱ":"t","ț":"t","ȶ":"t","ẗ":"t","ⱦ":"t","ṫ":"t","ṭ":"t","ƭ":"t","ṯ":"t","ᵵ":"t","ƫ":"t","ʈ":"t","ŧ":"t","ᵺ":"th","ɐ":"a","ᴂ":"ae","ǝ":"e","ᵷ":"g","ɥ":"h","ʮ":"h","ʯ":"h","ᴉ":"i","ʞ":"k","ꞁ":"l","ɯ":"m","ɰ":"m","ᴔ":"oe","ɹ":"r","ɻ":"r","ɺ":"r","ⱹ":"r","ʇ":"t","ʌ":"v","ʍ":"w","ʎ":"y","ꜩ":"tz","ú":"u","ŭ":"u","ǔ":"u","û":"u","ṷ":"u","ü":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǖ":"u","ṳ":"u","ụ":"u","ű":"u","ȕ":"u","ù":"u","ủ":"u","ư":"u","ứ":"u","ự":"u","ừ":"u","ử":"u","ữ":"u","ȗ":"u","ū":"u","ṻ":"u","ų":"u","ᶙ":"u","ů":"u","ũ":"u","ṹ":"u","ṵ":"u","ᵫ":"ue","ꝸ":"um","ⱴ":"v","ꝟ":"v","ṿ":"v","ʋ":"v","ᶌ":"v","ⱱ":"v","ṽ":"v","ꝡ":"vy","ẃ":"w","ŵ":"w","ẅ":"w","ẇ":"w","ẉ":"w","ẁ":"w","ⱳ":"w","ẘ":"w","ẍ":"x","ẋ":"x","ᶍ":"x","ý":"y","ŷ":"y","ÿ":"y","ẏ":"y","ỵ":"y","ỳ":"y","ƴ":"y","ỷ":"y","ỿ":"y","ȳ":"y","ẙ":"y","ɏ":"y","ỹ":"y","ź":"z","ž":"z","ẑ":"z","ʑ":"z","ⱬ":"z","ż":"z","ẓ":"z","ȥ":"z","ẕ":"z","ᵶ":"z","ᶎ":"z","ʐ":"z","ƶ":"z","ɀ":"z","ﬀ":"ff","ﬃ":"ffi","ﬄ":"ffl","ﬁ":"fi","ﬂ":"fl","ĳ":"ij","œ":"oe","ﬆ":"st","ₐ":"a","ₑ":"e","ᵢ":"i","ⱼ":"j","ₒ":"o","ᵣ":"r","ᵤ":"u","ᵥ":"v","ₓ":"x"};
String.prototype.latinise=function(){return this.replace(/[^A-Za-z0-9\[\] ]/g,function(a){return Latinise.latin_map[a]||a})};
String.prototype.latinize=String.prototype.latinise;
String.prototype.isLatin=function(){return this==this.latinise()}
	
init()

	
// SIMULATION OF USER INPUT

function init(){
//set up initial parameters; initialchoicearray and ring assignments

	keys = Object.keys(rings)
	for(var i = 0; i < keys.length; i++){
		activering = rings[keys[i]].r
		for(var j = 0; j < activering.length; j++){
			activeword = activering[j]
			ringassignments[activeword] = keys[i]
		}
	}
	
	initkeys = Object.keys(trigramdic)
	for(var i = 0; i < numberofchoices; i++){
		originalchoicearray.push([initkeys[i],trigramdic[initkeys[i]]['n']]) 
	}
	initkeys = []
	predictNext();
	simulateinput()

}

//function to clear (normally used after a space key)
function clearInput(){
	penultimateword = previousword;
	penultimateword = wordcheck(penultimateword,'zzzzz')
	previousword = typedword.join("");
	previousword = wordcheck(previousword,'yyyyy')
	typedword = [];
	evalword = "";
	basechoicearray = [];
	ABarray = [];
	ABCarray = [];
	finalchoicearray = [];
	potentialword = true;
	predictNext();
}  


function simulateinput(){

	var fs = require('fs');
	fs.readFile(sentencefile, function(err, data) {
	console.time('simulate')
		totalkeycounter = 0;
		totalchoicekeycounter = 0;
		lettercounter = 0;
		perfect = 0;
		oneperfect = 0;
		twoperfect = 0;
		threeperfect = 0;
		perfectchoice = 0;
		onechoice = 0;
		twochoice = 0;
		threechoice = 0;
		totalwords = 0;
		var sentencearray = data.toString().split("\n");
		
		initialreturned = []
		keys = Object.keys(firstpriority)
		for(var i = 0; i < numberofchoices; i++){
			word = keys[i]
			initialreturned.push([word,firstpriority[word],'n'])
		}
		
		for(var h = 0; h < sentencearray.length; h++) {
			clearInput()
			previousword = ''
			penultimateword = ''
		
			sentence = sentencearray[h]
		
			sentence = sentence.trim() //trim trailing and following whitespace

			sentence = sentence.toLowerCase();
			
			//sentence = sentence.replace(/[0-9¿¡@#$%^&*•()½©{}+=:;"<>,\.\?\/!”»«“~`‘…\[\]]/g, ' ?') //removes all other punctuation except apostrophe and hyphen
			
			sentence = sentence.replace(/\s{2,}/g, ' '); //trims multiple spaces into singles
			
			returned = initialreturned
			
			keycounter = 0;
			choicekeycounter = 0;
			xwordarray = sentence.split(" ");
			//truewordarray = truesentence.split(" ");
			for(var i = 0; i < xwordarray.length; i++){
				totalwords += 1;
				done = 0;
				choicedone = 0;
				punctuationswitch = 0;
				xword = xwordarray[i]
				//origword = xword; //contains original punctuation
				xword = xword.replace(/[0-9¿¡@#$%^&*•()½©{}+=:;"<>,\.\?\/!”»«“~`‘…\[\]]/g, '') //removes all other punctuation except apostrophe and hyphen
			
				xtrueword = xword
				
				xword = xword.latinise()
				xword = xword.replace(/-/g, '_') //removes dashes and replaces with underscores
				xword = xword.replace(/'/g, '_') //removes dashes and replaces with underscores
					
				checkxword = xword.replace(/[^A-Za-z]/g, '') //removes EVERYTHING except letters and spaces
				if(checkxword.length > 0){//word must contain something other than just punctuation
					
					if(returned[0][0] == xtrueword){ //if it matches without having to type any letters
						perfect += 1;
						wordstatscounter(returned[0][2], 'top')
						done = 1;
					}
					for(var j = 0; j < returned.length; j++){
						if(returned[j][0] == xtrueword){
							perfectchoice += 1;
							wordstatscounter(returned[j][2], 'choice')
							choicedone = 1;
						}
					}
					
					xletterarray = xword.split("");
					for(var j = 0; j < xletterarray.length; j++){
						lettercounter += 1;
						returned = keypress(xletterarray[j])
						if(done == 0){
							keycounter += 1;
							if(returned[0][0] == xtrueword){
								wordstatscounter(returned[0][2], 'top')
								done = 1;
								if(j == 0){
									oneperfect += 1;
								}
								else if(j == 1){
									twoperfect += 1;
								}
								else if(j == 2){
									threeperfect += 1;
								}
							}
						}
						if(choicedone == 0){
							choicekeycounter += 1;
							for(var k = 0; k < returned.length; k++){
								if(returned[k][0] == xtrueword){
									wordstatscounter(returned[k][2], 'choice')
									choicedone = 1;
									if(j == 0){
										onechoice += 1;
									}
									else if(j == 1){
										twochoice += 1;
									}
									else if(j == 2){
										threechoice += 1;
									}
								}
							}
						}
					}
					if(choicedone == 1 && done == 0){ // if word never makes it into the top spot
						console.log('--------------------')
						console.log('superseded - ' + penultimateword + '-' + previousword + '-' + xtrueword)
						console.log(returned)
						dictionarystats.superseded += 1;
					}
					if(choicedone == 0){
						dictionarystats.unfound += 1;
						console.log('--------------------')
						console.log(dictionarystats.unfound + 'unfound - ' + penultimateword + '-' + previousword + '-' + xtrueword)
						console.log(returned)
					}
					returned = keypress(" ")
					/* //RESET FOR PUNCTUATION - ACTUALLY AFFECTS PERFORMANCE NEGATIVELY
					if(origword != xword){ //contains punctuation - clear arrays and starts fresh
						clearInput()
						previousword = ''
						penultimateword = ''
					}
					*/
				
				}
			}
			//console.log("keypresses = " + keycounter)
			totalkeycounter += keycounter
			totalchoicekeycounter += choicekeycounter
		}
		dictionarystats.choicekeypresses = totalchoicekeycounter
		dictionarystats.keypresses = totalkeycounter
		dictionarystats.letters = lettercounter
		dictionarystats.perfect = Math.round((perfect)/totalwords*1000)/10 + "%"
		dictionarystats.oneperfect = Math.round((perfect + oneperfect)/totalwords*1000)/10 + "%"
		dictionarystats.twoperfect = Math.round((perfect + oneperfect + twoperfect)/totalwords*1000)/10 + "%"
		dictionarystats.threeperfect = Math.round((perfect + oneperfect + twoperfect+threeperfect)/totalwords*1000)/10 + "%"
		dictionarystats.perfectchoice = Math.round((perfectchoice)/totalwords*1000)/10 + "%"
		dictionarystats.onechoice = Math.round((perfectchoice + onechoice)/totalwords*1000)/10 + "%"
		dictionarystats.twochoice = Math.round((perfectchoice + onechoice + twochoice)/totalwords*1000)/10 + "%"
		dictionarystats.threechoice = Math.round((perfectchoice + onechoice + twochoice + threechoice)/totalwords*1000)/10 + "%"
		dictionarystats.words = totalwords
		
		var fs = require("fs"); //Load the filesystem module
		var stats = fs.statSync(language+'-predictive-dictionary.json')
		totalbytes = stats["size"]
		dictionarystats.dictionaryfilesize = totalbytes
		
		console.log(dictionarystats)			
		//console.log(dictionarystats.choicekeypresses + '-' + dictionarystats.keypresses + '-' + testC + '-' + testD)

		appendJSONfile(dictionarystats, 'simulationstats') // simulation report
	console.timeEnd('simulate')
	});
}

			
function keypress(e) {

	runningword = "";
	basechoicearray = [];
	//nextB,BC,C arrays are not recalculated;
	Y_Aarray = [];
	
	tier0array = [];
	tier1array = [];
	tier2array = [];
	tier3array = [];
	
	potentialwords = {};
	subpotentialwords = [];
	
	//maybe move these inside loop so they remain when things go off-script
	displayedchoices = [];
	displayedwords = [];
	 
	//revert back to letter
	//xxx c = String.fromCharCode(e.which);
	c = e;
	c = c.latinise()
	c = c.toLowerCase();

	if(c == " "){
		clearInput();
	}
	else if(c == "?"){ // if something other than letters/numbers is typed
		return finalchoicearray
	}
	else{
		finalchoicearray = [];
		
		typedword.push(c)
		runningword = typedword.join("")
		runningwordlength = runningword.length
		if(potentialword){
			if(typedword.length == 1){
				evalword = "prioritydic." + typedword[0];
			}
			else{
				evalword = "prioritydic"
				for(var i = 0; i < typedword.length; i++){
					evalword += "." + typedword[i];
				}
			}

			activeobject = eval(evalword);
			potentialwords = {};
			subpotentialwords = [];

			keys = [];
			if(activeobject){
			
				
				if(penultimateword.length == 0 && previousword.length == 0){	
					keys = Object.keys(firstpriority)
					for(i in keys){
						if(keys[i].search(runningword) == 0){
							tier0array.push([keys[i],firstpriority[keys[i]],'f'])
						}
					}
				} 
				tier0array = tier0array.sort(function(x,y) { return y[1] - x[1] });
			
				finalchoiceUpdate(tier0array)  //add to finalchoice array
			
				if(finalchoicearray.length < numberofchoices){ //only processes if more choices needed
					//determine base suggestions based on pure priority
					purePriority(activeobject)
					basechoicearray = basechoicearray.sort(function(x,y) { return y[1] - x[1] });
					
					synpenultimateword = penultimateword
					if(ringassignments[penultimateword]){
						synpenultimateword = ringassignments[penultimateword]
					}
						
					synpreviousword = previousword
					if(ringassignments[previousword]){
						synpreviousword = ringassignments[previousword]
					}
					
					
					//----------------------------------TRUE TRIGRAMS (ABC and YZA)----------------------------------
					//determine most likely suggestions based on potential 'next' trigrams
					for(i in ABCarray){
						//check to see if input letters match potential 'next' words, if not ignore
						if(ABCarray[i][0].search(runningword) == 0){
							tier1array.push([ABCarray[i][3],ABCarray[i][1],'abc']);
						}					
					}
					//determine most likely suggestions based on potential 'previous' trigrams
					for(i in basechoicearray){
						baseword = basechoicearray[i][0]
						synbaseword = baseword
						trueword = basechoicearray[i][3]
						if(ringassignments[baseword]){
							synbaseword = ringassignments[baseword]
						}
						if (trigramdic[synbaseword] && trigramdic[synbaseword]['z'] && trigramdic[synbaseword]['z'][synpreviousword]){
							if (trigramdic[synbaseword]['z'][synpreviousword]['y'] && trigramdic[synbaseword]['z'][synpreviousword]['y'][synpenultimateword]){ // if yza elements exist put into tier 1
							
								ff1 = trigramdic[synbaseword]['z'][synpreviousword]['y'][synpenultimateword]['n']
								arraytotal = 0;
								returnarray = trueWord(synbaseword)
								for(k in returnarray){
									arraytotal += returnarray[k][1]
								}
								ff1 = ff1*(basechoicearray[i][1]/arraytotal)
							
								if(baseword == synbaseword){
									frequencyfactor = ff1
								}
								else{
									ff2 = wordcount(baseword)
									ff3 = rings[synbaseword].n
									frequencyfactor = ff1*ff2/ff3
								}
								tier1array.push([trueword,frequencyfactor*abcfactor,'yza']) 
							}
							else{ //otherwise put into tier 2 as basic bigrams
								ff1 = trigramdic[synbaseword]['z'][synpreviousword]['n']
								arraytotal = 0;
								returnarray = trueWord(synbaseword)
								for(k in returnarray){
									arraytotal += returnarray[k][1]
								}
								ff1 = ff1*(basechoicearray[i][1]/arraytotal)
								
								if(baseword == synbaseword){
									frequencyfactor = ff1
								}
								else{
									ff2 = wordcount(baseword)
									ff3 = rings[synbaseword].n
									frequencyfactor = ff1*ff2/ff3
								}
								tier2array.push([trueword,frequencyfactor,'za']) 
							}
						}
					}
					tier1array = tier1array.sort(function(x,y) { return y[1] - x[1] });
					
					finalchoiceUpdate(tier1array)  //add to finalchoice array
				}
				
				
				//----------------------------------TRUE BIGRAMS----------------------------------
				if(finalchoicearray.length < numberofchoices){ //only processes if more choices needed
					//determine most likely suggestions based on potential 'next' bigrams - SECOND TIER
					for(i in ABarray){
						//check to see if input letters match potential 'next' words, if not ignore
						if(ABarray[i][0].search(runningword) == 0){
							tier2array.push([ABarray[i][3],ABarray[i][1],'ab']);
						}					
					}
					tier2array = tier2array.sort(function(x,y) { return y[1] - x[1] });
					finalchoiceUpdate(tier2array) 
				}
				
				
				if(finalchoicearray.length < numberofchoices){
					for(i in basechoicearray){
						baseword = basechoicearray[i][0]
						trueword = basechoicearray[i][3];
						synbaseword = baseword
						if(ringassignments[baseword]){
							synbaseword = ringassignments[baseword]
						}
						
						firstextrafactor = 1;
						tag = 'a'
						
						linkboost = 1;
						linksobject = {}
						acboost = 1;
						a_cboost = 1;
						//additional treatments to enhance performance
						
						
						if(runningwordlength > wordlengthtrip){ // only processes if wordlength is over certain level; to save time
							if(trigramdic[synbaseword] && trigramdic[synbaseword]['z']){
								linksarray = Object.keys(trigramdic[synbaseword]['z'])
								for(j in linksarray){
									linkword = linksarray[j]
									if(trigramdic[linkword] && trigramdic[linkword]['b']){
										sublinksarray = Object.keys(trigramdic[linkword]['b'])
										linkloops = Math.min(linksarray.length,linkloopssetting)
										for (var j = 0; j < linkloops; j++){
											sublinkword = sublinksarray[j] 
											if(trigramdic[sublinkword] && trigramdic[sublinkword]['z'] && trigramdic[sublinkword]['z'][synpreviousword]){
												linkboost = a_bfactor
												if(trigramdic[sublinkword]['z'][synpreviousword]['y'] && trigramdic[sublinkword]['z'][synpreviousword]['y'][synpenultimateword]){
													linkboost*=a_b_cfactor
												break
												}
												tag = 'g' // includes a_b and a_b_c connections
											}
										}
									}
								}
							}
								
							
							if(trigramdic[synbaseword] && trigramdic[synbaseword]['z'] && trigramdic[synbaseword]['z'][synpenultimateword]){
								acboost = acfactor;
								tag = 'h' // includes ac boost
							}
							else if(trigramdic[synpenultimateword] && trigramdic[synpenultimateword]['b'] && trigramdic[synpenultimateword]['z'][synbaseword]){
								acboost = acfactor;
								tag = 'h' // includes ac boost
							}
							
							if(trigramdic[synbaseword] && trigramdic[synbaseword]['z']){
								zobject = trigramdic[synbaseword]['z']
								zarray = Object.keys(zobject)
								for(j in zarray){
									if(zobject[zarray[j]] && zobject[zarray[j]].y && zobject[zarray[j]].y[synpenultimateword]){
										a_cboost = a_cfactor;
										tag = 'i' // includes a_c boost
										break
									}
								}
							}
							if(trigramdic[synpenultimateword] && trigramdic[synpenultimateword]['b']){
								bobject = trigramdic[synpenultimateword]['b']
								barray = Object.keys(bobject)
								for(j in barray){
									if(bobject[barray[j]] && bobject[barray[j]].c && bobject[barray[j]].c[synbaseword]){
										a_cboost = a_cfactor;
										tag = 'i' // includes a_c boost
										break
									}
								}
							}
						}
						
						//end of additional treatments
						
						wordlengthfactor = Math.pow(wordpower,(maxwordlength - baseword.length))
						frequencyfactor = wordlengthfactor*firstextrafactor*linkboost*a_cboost*acboost
						tier3array.push([trueword,(basechoicearray[i][1])*frequencyfactor,tag])
					}
					tier3array = tier3array.sort(function(x,y) { return y[1] - x[1] });
				}
				
				finalchoiceUpdate(tier3array)  
								
			}
			else{
				potentialword = false; //deactivates if no potential solutions are found
				//ADD ADDITIONAL TREATMENTS TO REMOVE CHOICES MATRIX, ETC
			}
		}
	}
	if(finalchoicearray.length > 0){
		return finalchoicearray.slice(0,numberofchoices)
	}
	else{
		finalchoicearray = [runningword,0,'a']
		return finalchoicearray
	}
}  


//function to pull potential word from priority dictionary; independent of context
function purePriority(object) {
    for (var property in object) {
        if (object.hasOwnProperty(property)) {
            if (typeof object[property] == "object"){
				if(property != 'aa'){
					runningword += property;
					purePriority(object[property]);
					runningword = runningword.substring(0,runningword.length-1); //back up and erase new addition from running word
				}
				else{
					//include original suggestion
					alternatearray = object['aa']
					for (var j = 0; j < alternatearray.length; j++){
						basechoicearray.push([runningword,alternatearray[j][1],'a',alternatearray[j][0]]);
					}
				}
            }else if(property == 'nn'){
                //found a property which is not an object - push base word and check for pure form later
				if(object.pp){
					basechoicearray.push([runningword,object['nn'],'a',object['pp']]);
				}
				else{
					basechoicearray.push([runningword,object['nn'],'a',runningword]);
				}
            }
        }
    }
}


function predictNext(){

	potentialwords = {};
	subpotentialwords = [];
	predictNextfinalarray = [];
	
	//if first word in sentence
	if(penultimateword.length == 0 && previousword.length == 0){	
		keys = Object.keys(firstpriority)
		for(var i = 0; i < numberofchoices; i++){
			word = keys[i]
			if(!potentialwords[word]){
				finalchoicearray.push([word,firstpriority[word],'f'])
				potentialwords[word] = true;
			}
		}
	} 
	//original options that aren't connected to anything for midsentence words
	else{  
		
		synpenultimateword = penultimateword
		if(ringassignments[penultimateword]){
			synpenultimateword = ringassignments[penultimateword]
		}
			
		synpreviousword = previousword
		if(ringassignments[previousword]){
			synpreviousword = ringassignments[previousword]
		}
		
		//check for trigrams
		if (trigramdic[synpenultimateword] && trigramdic[synpenultimateword]['b'] && trigramdic[synpenultimateword]['b'][synpreviousword] && trigramdic[synpenultimateword]['b'][synpreviousword]['c']){
			ABCwordobject = trigramdic[synpenultimateword]['b'][synpreviousword]['c'];
			keys = Object.keys(ABCwordobject)
			for(i in keys){
				ff1 = ABCwordobject[keys[i]]['n']*abcfactor
				arraytotal = 0;
				if(rings[keys[i]]){ //synonyms exist
					synonymringarray = rings[keys[i]].r
					for(j in synonymringarray){
						returnarray = trueWord(synonymringarray[j])
						for(k in returnarray){
							arraytotal += returnarray[k][1]
						}
						for(k in returnarray){
							ABCarray.push([synonymringarray[j],ff1*(returnarray[k][1]/arraytotal)*(returnarray[k][1]/rings[keys[i]].n),'abc',returnarray[k][0]])
						}
					}
				}
				else{ //no synonyms
					returnarray = trueWord(keys[i])
					for(k in returnarray){
						arraytotal += returnarray[k][1]
					}
					for(k in returnarray){
						ABCarray.push([keys[i],ff1*returnarray[k][1]/arraytotal,'abc',returnarray[k][0]])
					}
				}
			}
			//sort based on priority...
			ABCarray = ABCarray.sort(function(x,y) { return y[1] - x[1] });
		}
		
		
		//edit out duplicates and add to active choices
		for(i in ABCarray){
			if(!potentialwords[ABCarray[i][3]]){
				finalchoicearray.push(ABCarray[i])
				potentialwords[ABCarray[i][3]] = true;
			}
		}
		
		//check for bigrams
		if (trigramdic[synpreviousword] && trigramdic[synpreviousword]['b']){
			ABwordobject = trigramdic[synpreviousword]['b'];
			keys = Object.keys(ABwordobject)
			boost= 1
			if(trigramdic[synpreviousword]['z'] && trigramdic[synpreviousword]['z'][synpenultimateword]){
				boost = zabfactor
			}
			for(i in keys){
				ff1 = ABwordobject[keys[i]]['n']*boost
				arraytotal = 0;
				if(rings[keys[i]]){ //synonyms exist
					synonymringarray = rings[keys[i]].r
					for(j in synonymringarray){
						returnarray = trueWord(synonymringarray[j])
						for(k in returnarray){
							arraytotal += returnarray[k][1]
						}
						for(k in returnarray){
							ABarray.push([synonymringarray[j],ff1*(returnarray[k][1]/arraytotal)*(returnarray[k][1]/rings[keys[i]].n),'ab',returnarray[k][0]])
						}
					}
				}
				else{ //no synonyms
					returnarray = trueWord(keys[i])
					for(k in returnarray){
						arraytotal += returnarray[k][1]
					}
					for(k in returnarray){
						ABarray.push([keys[i],ff1*returnarray[k][1]/arraytotal,'ab',returnarray[k][0]])
					}
				}
			}
			//sort based on priority;
			ABarray = ABarray.sort(function(x,y) { return y[1] - x[1] });	
		}
		
		for(i in ABarray){
			if(!potentialwords[ABarray[i][3]]){
				finalchoicearray.push([ABarray[i][3],ABarray[i][1],'ab'])
				potentialwords[ABarray[i][3]] = true;
			}
		}
		
		finalchoicearray = finalchoicearray.sort(function(x,y) { return y[1] - x[1] });
		
	
		for(i in originalchoicearray){ 
			if(!potentialwords[originalchoicearray[i][0]]){
				predictNextfinalarray.push([originalchoicearray[i][0],originalchoicearray[i][1],'a'])
				potentialwords[originalchoicearray[i][0]] = true;
			}
		}
		predictNextfinalarray = predictNextfinalarray.sort(function(x,y) { return y[1] - x[1] });
		for(i in predictNextfinalarray){ 
			finalchoicearray.push(predictNextfinalarray[i])
		}
	}
	
}


function finalchoiceUpdate(array){
	numloops = Math.min(basechoicearray.length, 2*numberofchoices) //limit number of loops to save time
	for(var i = 0; i < array.length; i++){
		if(!potentialwords[array[i][0]]){
			finalchoicearray.push([array[i][0],array[i][1],array[i][2]]);
			potentialwords[array[i][0]] = true;
		}
	}
}

//turns a two-dimensional [word][count] array into an object
function objectify(array){
	outobject = {}
	for(var i = 0; i < array.length; i++){
		outobject[array[i][0]] = array[i][1]
	}
	return outobject;
}

//pulls count from prioritydic structure
function wordcount(word){
	//console.log(word)
	letterarray = word.split("");
	numletters = letterarray.length;
	evalexpression = 'prioritydic';
	for(y = 0; y < numletters+1; y++){
		if(y == numletters){
			evalexpression = evalexpression + ".nn"
		}
		else{
			evalexpression = evalexpression + '.' + letterarray[y];
		}
	}
	count = eval(evalexpression)
	return count
}

function wordcheck(word,replacement){ //check if word exists in dictionary matrix, send back replacement if not
	letterarray = word.split("");
	numletters = letterarray.length;
	evalexpression = 'prioritydic';
	for(y = 0; y < numletters; y++){
		evalexpression = evalexpression + '.' + letterarray[y];
		if(!eval(evalexpression)){
			break
		}
	}
	if(eval(evalexpression)){
		return(word);
	}
	else{
		if(ringassignments[word]){ //send synonym - unlikely
			return ringassignments[word];
		}
		else{ //send dead word
			return replacement;
		}
	}
}

//sort synonymn arrays to establish priorities
function synonymsort(array){
	var tmp = {}, out = []; sorted = [];
	for(var i = 0; i < array.length; i++)
	{
		if(!tmp[array[i][0]]) {
			tmp[array[i][0]] = array[i][1];
			out.push(array[i][0]); 
		}
		else{
			tmp[array[i][0]] = tmp[array[i][0]] + array[i][1];
		}
	}
	for(var i = 0, n = out.length; i < n; ++i)
	{
		sorted[i] = [out[i],tmp[out[i]]]
	}
	sorted = sorted.sort(function(x,y) { return y[1] - x[1] });
	return sorted;
}

function wordstatscounter(input,family){
	wild = '';
	if(input.indexOf('*') > -1){
		wild = 'wild';
	}
	
	if(input.length == 1){
		eval('dictionarystats.A'+family+wild+' += 1')
	}
	else if(input.length == 2){
		eval('dictionarystats.AB'+family+wild+' += 1')
	}
	else if(input.length == 3){
		eval('dictionarystats.ABC'+family+wild+' += 1')
	}

}


function appendJSONfile(jsonoutput, type){ //appends currentstats to existing stats file

	var fs = require('fs');
	var log = fs.createWriteStream(language+'-outputstats.txt', {'flags': 'a'});
	keysarray = Object.keys(jsonoutput)
	for(var i = 0; i < keysarray.length; i++){
		if(keysarray[i] == 'totalwordcount'){
			result = Math.round(dictionarystats.totalwordcount/1000) + 'k';
		}
		if(keysarray[i] == 'dictionaryfilesize'){
			result = Math.round(totalbytes/10000)/100 + ' Mb';
		}
		else{
			result = jsonoutput[keysarray[i]]
		}
		
		log.write(keysarray[i] + ": " + result + "\n");
	}
	log.write("\n--------------------\n\n");

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