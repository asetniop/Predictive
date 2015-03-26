//originally was intended to trim json arrays to shorten words that don't have any other branches to compress file, but doesn't actually help.

var dic = require('./long-test-predictive-dictionary.json'); //skip synonym ring generation

prioritydic = dic.prioritydic


runningword = "";
basechoicearray = [];
typedword = ''


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

//get array of all word constructions
getallwords(activeobject)

trimtree = {}

finaljsontree = prioritydic
var finaljsontree = JSON.parse(JSON.stringify(prioritydic));

for(z = 0; z < basechoicearray.length; z++){
	
	jsontreetrim(basechoicearray[z])
}

dic.prioritydic = finaljsontree

writeJSONfile(dic)
longJSONfile(dic)

//function to pull potential word from priority dictionary; independent of context
function getallwords(object) {
    for (var property in object) {
        if (object.hasOwnProperty(property)) {
            if (typeof object[property] == "object"){
				if(property != 'aa'){
					runningword += property;
					getallwords(object[property]);
					runningword = runningword.substring(0,runningword.length-1); //back up and erase new addition from running word
				}
				else{
					//include original suggestion
					alternatearray = object['aa']
					for (var j = 0; j < alternatearray.length; j++){
						basechoicearray.push(runningword);
					}
				}
            }else if(property == 'nn'){
                //found a property which is not an object - push base word and check for pure form later
				if(object.pp){
					basechoicearray.push(runningword);
				}
				else if(object.ss){
					basechoicearray.push(runningword);
				}
				else{
					basechoicearray.push(runningword);
				}
            }
        }
    }
}

//pulls count from prioritydic structure
function jsontreetrim(word){
	letterarray = word.split("");
	numletters = letterarray.length;
	evalexpression = 'prioritydic';
	for(y = 0; y < numletters; y++){
		evalexpression = evalexpression + '.' + letterarray[y];
	}
	endobject = eval(evalexpression)
	branchobject = eval(evalexpression)
	trimword = word
	numlevels = 0
	for(y = 1; y < numletters; y++){
		checkexpression = evalexpression.substring(0,evalexpression.length-2*y);
		checkobject = eval(checkexpression)
		checkkeys = Object.keys(checkobject)
		trimword = trimword.substring(0,word.length-(y-1))
		if(checkkeys.length == 1){
			branchobject = checkobject
			numlevels += 1
		}
		else{
			if(numlevels > 1){
				endobject.ss = word
				buildtrimtree(trimword, endobject)
			}
			break
		}
	}
	
	
	//return count
}

function buildtrimtree(word, endobject){
	letterarray = word.split("");
	numletters = letterarray.length;
	evalexpression = 'finaljsontree';
	for(y = 0; y < numletters+1; y++){
		if(y == numletters){
			evalexpression = evalexpression + " = endobject"
			eval(evalexpression)
		}
		else{
			evalexpression = evalexpression + '.' + letterarray[y];
			if(eval(evalexpression)){
				//does nothing
			}
			else{
				eval(evalexpression + " = {}")
			}
		}
	}

}



function longJSONfile(jsonoutput){ //just writes extended version
	//version with lots of whitespace; much more readable
	var jf = require('jsonfile')

	filename = 'long-test-trimjson.json';

	jf.writeFile(filename, jsonoutput, function(err) {
		if(err){
			console.log("error? " + err);
		}
	})

}

function writeJSONfile(jsonoutput){

	//compressed version
	var jf = require('fs')

	filename = 'test-trimjson.json';

	jsonoutput = JSON.stringify(jsonoutput)

	jf.writeFile(filename, jsonoutput, function(err) {
		if(err){
			console.log("error? " + err);
		}
	})
	
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