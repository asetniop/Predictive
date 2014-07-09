var dictionaryoutsize = 5000; // total size of sorted output dictionary
var nextoutsize = 10;
var thirdoutsize = 5;
var prevoutsize = 5;
var penuloutsize = 2;

var fs = require('fs');
fs.readFile('en-corpus.txt', function(err, data) {
	wordspace = new Object();
    if(err) throw err;
    var array = data.toString().split("\n");
    for(i in array) {
		linestring = array[i]		


		linestring = linestring.replace('.','');
		
		//deal with apostrophes and contractions:
		linestring = linestring.replace("'s", "xxxxx");
		
		linestring = linestring.replace(/'/g, "");
		
		linestring = linestring.replace(/,/g, "");
		//how to deal with periods when in quotations?
		linestring = linestring.replace(/[0-9]/g, '');
		
		//replace all non-text characters
		linestring = linestring.replace('.','');
		linestring = linestring.replace('?','');
		linestring = linestring.replace('"','');
		linestring = linestring.replace('!','');
		linestring = linestring.replace(';','');
		linestring = linestring.replace(':','');
		linestring = linestring.replace('/','');
		linestring = linestring.replace('(','');
		linestring = linestring.replace(')','');
		linestring = linestring.replace('[','');
		linestring = linestring.replace(']','');
		linestring = linestring.replace('@','');
		linestring = linestring.replace('#','');
		linestring = linestring.replace('$','');
		linestring = linestring.replace('%','');
		linestring = linestring.replace('^','');
		linestring = linestring.replace('&','');
		linestring = linestring.replace('*','');
		linestring = linestring.replace('+','');
		linestring = linestring.replace('=','');
		linestring = linestring.replace('{','');
		linestring = linestring.replace('}','');
		linestring = linestring.replace('>','');
		linestring = linestring.replace('<','');
		linestring = linestring.replace('~','');
		linestring = linestring.replace('"','');
		linestring = linestring.replace('\r','');
		linestring = linestring.replace('\n','');
		
		//don't want to eliminate hyphenated words
		linestring = linestring.replace(' -',' ');
		linestring = linestring.replace('- ',' ');
		
		linestring = linestring.replace("xxxxx", "'s");
		
		//looped to eliminate repeated space; up to 10 spaces in a row
		for(k = 0; k < 10; k++){
			linestring = linestring.replace('  ',' '); // eliminates all double spaces
		}
		linestring = linestring.trim()
		
		array[i] = linestring;
		//console.log(array[i]);
		
		linestring = linestring.toLowerCase();
		
		//count individual words
		linearray = linestring.split(" ");
		wordsinline = linearray.length;
		for(j = 0; j < wordsinline; j++) {
			activeword = linearray[j];
			if(checkword(activeword)){ //blank words still seem to show up...
				if(wordspace[activeword]){
					wordspace[activeword].x = wordspace[activeword].x + 1;
				}
				else{
					if(activeword.length > 0){ //eliminates issue of blank keys
						wordspace[activeword] = new Object();
						wordspace[activeword].x = 1;
						wordspace[activeword].b = new Object();
						wordspace[activeword].z = new Object();
					}
				}
				
				if(j > 1){
					prevword = linearray[j-1];
					if(checkword(prevword)){
						if(wordspace[activeword].z[prevword]){
							wordspace[activeword].z[prevword].x = wordspace[activeword].z[prevword].x + 1;
						}
						else{
							wordspace[activeword].z[prevword] = new Object();
							wordspace[activeword].z[prevword].x = 1;
							wordspace[activeword].z[prevword].y = new Object();
						}
						//third word in trigram
						if(j > 2){
							penulword = linearray[j-2];
							if(checkword(penulword)){
								if(wordspace[activeword].z[prevword].y[penulword]){
									wordspace[activeword].z[prevword].y[penulword].x = wordspace[activeword].z[prevword].y[penulword].x + 1;
								}
								else{
									wordspace[activeword].z[prevword].y[penulword] = new Object();
									wordspace[activeword].z[prevword].y[penulword].x = 1;
								}
							}
						}
					}
				}
				
				//next word
				if(j < wordsinline-1){
					nextword = linearray[j+1];
					if(checkword(nextword)){
						if(wordspace[activeword].b[nextword]){
							wordspace[activeword].b[nextword].x = wordspace[activeword].b[nextword].x + 1;
						}
						else{
							wordspace[activeword].b[nextword] = new Object();
							wordspace[activeword].b[nextword].x = 1;
							wordspace[activeword].b[nextword].c = new Object();
						}
						//third word in trigram
						if(j < wordsinline-2){
							thirdword = linearray[j+2];
							if(checkword(thirdword)){
								if(wordspace[activeword].b[nextword].c[thirdword]){
									wordspace[activeword].b[nextword].c[thirdword].x = wordspace[activeword].b[nextword].c[thirdword].x + 1;
								}
								else{
									wordspace[activeword].b[nextword].c[thirdword] = new Object();
									wordspace[activeword].b[nextword].c[thirdword].x = 1;
								}
							}
						}
					}
				}
			}
		}
		
		
    }
	//console.log(wordspace);
	
	sortedwordspace = countsorter(wordspace,dictionaryoutsize)
	sortedwordsarray = Object.keys(sortedwordspace)
	
	totalnumkeys = sortedwordsarray.length
	for(y = 0; y < totalnumkeys; y++){
		word = sortedwordsarray[y]
		
		nextobject = sortedwordspace[word].b
		thirdwordsarray = Object.keys(nextobject)
		thirdnumkeys = thirdwordsarray.length
			for(z = 0; z < thirdnumkeys; z++){
				thirdword = thirdwordsarray[z];
				thirdobject = nextobject[thirdword].c
				sortedthirdobject = countsorter(thirdobject, thirdoutsize)
				nextobject[thirdword].c = sortedthirdobject
			}
		
		sortednextobject = countsorter(nextobject,nextoutsize)
		sortedwordspace[word].b = sortednextobject
		
		prevobject = sortedwordspace[word].z
		penulwordsarray = Object.keys(prevobject)
		penulnumkeys = penulwordsarray.length
			for(z = 0; z < penulnumkeys; z++){
				penulword = penulwordsarray[z];
				penulobject = prevobject[penulword].y
				sortedpenulobject = countsorter(penulobject, penuloutsize)
				prevobject[penulword].y = sortedpenulobject
			}
		
		sortedprevobject = countsorter(prevobject,prevoutsize)
		sortedwordspace[word].z = sortedprevobject
	}
	
	
	//write to JSON file (using jsonfile)
	writeJSONfile(sortedwordspace, 'trigram')
	
	//write simple dictionary file with counts
	simplewordsarray = Object.keys(sortedwordspace)
	numkeys = simplewordsarray.length
	simplewordcountarray = new Array();
		
	arraytofile = new Array();
	jsontree = new Object();
	for(x = 0; x < numkeys; x++){
		simpleword = simplewordsarray[x];
		count = sortedwordspace[simpleword].x;
		arraytofile[x] = [simpleword,count];
		
		letterarray = simpleword.split("");
		numletters = letterarray.length;
		evalexpression = 'jsontree';
		for(y = 0; y < numletters; y++){
			evalexpression = evalexpression + '.' + letterarray[y];
			if(eval(evalexpression)){
				console.log("gotone")
			}
			else{
				eval(evalexpression + ' = new Object()');
				console.log("unfound")
				//break;
			}
		}
	}
	console.log(jsontree)
		
	writeJSONfile(jsontree, 'priority')
	
	var fs = require('fs');

	var file = fs.createWriteStream('en-dictionary.txt');
	file.on('error', function(err) { /* error handling */ });
	arraytofile.forEach(function(v) { file.write(v.join(', ') + '\n'); });
	file.end();
 
	
	
	
});

function writeJSONfile(jsonoutput, type){

var jf = require('jsonfile')

filename = 'en-'+type+'.json';

jf.writeFile(filename, jsonoutput, function(err) {
  console.log("error? " + err);
})

	



}


function countsorter(countedobject,subsize){ //sorts and trims entries in object based on count of sub-objects and returns sorted object; subsize is max number of subobjects

	countedwordsarray = Object.keys(countedobject)
	numkeys = countedwordsarray.length
	wordcountarray = new Array();
	
	for(x = 0; x < numkeys; x++){
		countedword = countedwordsarray[x];
		wordcountarray[x] = countedobject[countedword].x;
	}
	
	
	numtrimmed = Math.min(countedwordsarray.length,subsize)
	sortedcountedobject = new Object();
	for(x = 0; x < numtrimmed; x++){
		maxindex = wordcountarray.indexOf(Math.max.apply(Math, wordcountarray)); //gets index of max value
		//maxindex = wordcountarray.indexOf(Math.min.apply(Math, wordcountarray)); //for reverse order
		targetword = countedwordsarray[maxindex];
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
else if(word == 'enron'){
	return false
}
else{
	return true
}


}