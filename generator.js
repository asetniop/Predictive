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
		linestring = linestring.replace('1','');
		linestring = linestring.replace('2','');
		linestring = linestring.replace('3','');
		linestring = linestring.replace('4','');
		linestring = linestring.replace('5','');
		linestring = linestring.replace('6','');
		linestring = linestring.replace('7','');
		linestring = linestring.replace('8','');
		linestring = linestring.replace('9','');
		linestring = linestring.replace('0','');
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
		
		
		array[i] = linestring;
		//console.log(array[i]);
		
		linestring = linestring.toLowerCase();
		
		//count individual words
		linearray = linestring.split(" ");
		wordsinline = linearray.length;
		for(j = 0; j < wordsinline; j++) {
			activeword = linearray[j];
			if(wordspace[activeword]){
				wordspace[activeword].count = wordspace[activeword].count + 1;
			}
			else{
				if(activeword.length > 0){ //eliminates issue of blank keys
					wordspace[activeword] = new Object();
					wordspace[activeword].count = 1;
					wordspace[activeword].next = new Object();
				}
			}
			
			if(j < wordsinline-1){
				nextword = linearray[j+1];
				if(wordspace[activeword].next[nextword]){
					wordspace[activeword].next[nextword].count = wordspace[activeword].next[nextword].count + 1;
				}
				else{
					wordspace[activeword].next[nextword] = new Object();
					wordspace[activeword].next[nextword].count = 1;
					wordspace[activeword].next[nextword].third = new Object();
				}
				if(j < wordsinline-2){
					thirdword = linearray[j+2];
					
					if(wordspace[activeword].next[nextword].third[thirdword]){
						wordspace[activeword].next[nextword].third[thirdword].count = wordspace[activeword].next[nextword].third[thirdword].count + 1;
					}
					else{
						wordspace[activeword].next[nextword].third[thirdword] = new Object();
						wordspace[activeword].next[nextword].third[thirdword].count = 1;
					}
			
					
				}
			}
			
		}
		
		
    }
	//console.log(wordspace);
	
	sortedwordspace = nextsorter(wordspace)
	console.log(sortedwordspace)
	console.log(sortedwordspace.i.next.am)
	
});

function nextsorter(wordspace){ //sorts entries in object and returns sorted object

	countedwordsarray = Object.keys(wordspace)
	numkeys = countedwordsarray.length
	wordcountarray = new Array();
	
	for(x = 0; x < numkeys; x++){
		countedword = countedwordsarray[x];
		wordcountarray[x] = wordspace[countedword].count;
	}
	
	
	sortedwordspace = new Object();
	for(x = 0; x < numkeys; x++){
		//maxindex = wordcountarray.indexOf(Math.max.apply(Math, wordcountarray)); //gets index of max value
		maxindex = wordcountarray.indexOf(Math.min.apply(Math, wordcountarray)); //gets index of max value
		targetword = countedwordsarray[maxindex];
		sortedwordspace[countedwordsarray[maxindex]] = wordspace[targetword];
		countedwordsarray.splice(maxindex, 1);
		wordcountarray.splice(maxindex, 1);
		
	}	

	return sortedwordspace
}