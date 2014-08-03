var dictionaryoutsize = 10000; // total size of sorted output dictionary
var nextoutsize = 1000;
var thirdoutfactor = 2; 
var prevoutsize = 1000;
var penuloutfactor = 2;
var minnextout = 2;
var minprevout = 2;
var outpower = 0.85;

var totalwordcount = 0;

var test = 0;

var fs = require('fs');
fs.readFile('en-corpus.txt', function(err, data) {
	wordspace = new Object();
    if(err) throw err;
    var array = data.toString().split("\n");
    for(i in array) {
		if(Math.floor(i/10) == i/10){
		console.log(i)
		}
		linestring = array[i]	

		linestring = linestring.trim() //trim trailing and following whitespace
		
		linestring = linestring.toLowerCase();		

		linestring = linestring.replace(/\s/g,'A'); //swap out spaces for A's, put them back in later
		
		linestring = linestring.replace(/\W/g, '')
		
		linestring = linestring.replace(/\d/g, '')
		
		linestring = linestring.replace(/A/g,' '); // put spaces back in
		
		linestring = linestring.replace(/\s{2,}/g, ' ');
		
		//count individual words
		linearray = linestring.split(" ");
		wordsinline = linearray.length;
		for(j = 0; j < wordsinline; j++) {
			activeword = linearray[j];
			if(checkword(activeword)){ 
				totalwordcount += 1;
				if(wordspace[activeword]){
					wordspace[activeword].n = wordspace[activeword].n + 1;
				}
				else{
					if(activeword.length > 0){ //eliminates issue of blank keys
						wordspace[activeword] = new Object();
						wordspace[activeword].n = 1;
						wordspace[activeword].b = new Object();
						wordspace[activeword].z = new Object();
					}
				}
				
				if(j > 1){
					prevword = linearray[j-1];
					if(checkword(prevword)){
						if(wordspace[activeword].z[prevword]){
							wordspace[activeword].z[prevword].n = wordspace[activeword].z[prevword].n + 1;
						}
						else{
							wordspace[activeword].z[prevword] = new Object();
							wordspace[activeword].z[prevword].n = 1;
							wordspace[activeword].z[prevword].y = new Object();
						}
						//third word in trigram
						if(j > 2){
							penulword = linearray[j-2];
							if(checkword(penulword)){
								if(wordspace[activeword].z[prevword].y[penulword]){
									wordspace[activeword].z[prevword].y[penulword].n = wordspace[activeword].z[prevword].y[penulword].n + 1;
								}
								else{
									wordspace[activeword].z[prevword].y[penulword] = new Object();
									wordspace[activeword].z[prevword].y[penulword].n = 1;
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
							wordspace[activeword].b[nextword].n = wordspace[activeword].b[nextword].n + 1;
						}
						else{
							wordspace[activeword].b[nextword] = new Object();
							wordspace[activeword].b[nextword].n = 1;
							wordspace[activeword].b[nextword].c = new Object();
						}
						//third word in trigram
						if(j < wordsinline-2){
							thirdword = linearray[j+2];
							//console.log(activeword + " " + nextword + " " + thirdword)
							if(checkword(thirdword)){
								if(wordspace[activeword].b[nextword].c[thirdword]){
									wordspace[activeword].b[nextword].c[thirdword].n = wordspace[activeword].b[nextword].c[thirdword].n + 1;
								}
								else{
									wordspace[activeword].b[nextword].c[thirdword] = new Object();
									wordspace[activeword].b[nextword].c[thirdword].n = 1;
								}
							}
						}
					}
				}
			}
		}
		
		
    }
	console.log("totalwordcount = " + totalwordcount);
	
	sortedwordspace = countsorter(wordspace,dictionaryoutsize)
	sortedwordsarray = Object.keys(sortedwordspace)
	
	totalnumkeys = sortedwordsarray.length
	for(y = 0; y < totalnumkeys; y++){
		word = sortedwordsarray[y]
		nextnumoccur = sortedwordspace[word].n
		calcnextoutsize = Math.floor(nextoutsize/Math.pow((totalwordcount/nextnumoccur),outpower)) + minnextout;
		if(test == 0){
			console.log(calcnextoutsize)
			test = 1;
		}
		nextobject = sortedwordspace[word].b
		thirdwordsarray = Object.keys(nextobject)
		thirdnumkeys = thirdwordsarray.length
			for(z = 0; z < thirdnumkeys; z++){
				thirdword = thirdwordsarray[z];
				thirdnumoccur = nextobject[thirdword].n
				calcthirdoutsize = Math.ceil(calcnextoutsize/thirdoutfactor)
				thirdobject = nextobject[thirdword].c
				sortedthirdobject = countsorter(thirdobject, calcthirdoutsize)
				nextobject[thirdword].c = sortedthirdobject
			}
		
		sortednextobject = countsorter(nextobject,calcnextoutsize)
		sortedwordspace[word].b = sortednextobject
		
		prevnumoccur = sortedwordspace[word].n
		calcprevoutsize = Math.floor(prevoutsize/Math.pow((totalwordcount/prevnumoccur),outpower)) + minprevout;
		prevobject = sortedwordspace[word].z
		penulwordsarray = Object.keys(prevobject)
		penulnumkeys = penulwordsarray.length
			for(z = 0; z < penulnumkeys; z++){
				penulword = penulwordsarray[z];
				penulobject = prevobject[penulword].y
				penulnumoccur = prevobject[penulword].n
				calcpenuloutsize = Math.ceil(calcprevoutsize/penuloutfactor)
				sortedpenulobject = countsorter(penulobject, calcpenuloutsize)
				prevobject[penulword].y = sortedpenulobject
			}
		
		sortedprevobject = countsorter(prevobject,calcprevoutsize)
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
		count = sortedwordspace[simpleword].n;
		arraytofile[x] = [simpleword,count];
		
		letterarray = simpleword.split("");
		numletters = letterarray.length;
		evalexpression = 'jsontree';
		for(y = 0; y < numletters+1; y++){
			if(y == numletters){
				evalexpression = evalexpression + ".zz = " + count;
				eval(evalexpression);
			}
			else{
				evalexpression = evalexpression + '.' + letterarray[y];
				if(eval(evalexpression)){
					//console.log("gotone")
				}
				else{
					eval(evalexpression + ' = new Object()');
					//console.log("unfound")
					//break;
				}
			}
		}
	}
		
	writeJSONfile(jsontree, 'priority')
	
	var fs = require('fs');

	var file = fs.createWriteStream('en-dictionary.txt');
	file.on('error', function(err) { /* error handling */ });
	arraytofile.forEach(function(v) { file.write(v.join(',') + '\n'); });
	file.end();
 
	
	
	
});

function writeJSONfile(jsonoutput, type){

//version with lots of whitespace; much more readable
var jf = require('jsonfile')

filename = 'long-en-'+type+'.json';

jf.writeFile(filename, jsonoutput, function(err) {
  console.log("error? " + err);
})

//compressed version
var jf = require('fs')

filename = 'en-'+type+'.json';

jsonoutput = JSON.stringify(jsonoutput)

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
		wordcountarray[x] = countedobject[countedword].n;
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
else if(word == 'constructor'){ //causes problems with array construction
	return false
}
else{
	return true
}


}