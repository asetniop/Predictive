
function testout = Generator1(language)
    
tic    


%limits to output
allwordsmax = 100000;
nextwordsmax = 10;
previouswordsmax = 10;



activefolder = pwd;

filename = [language,'-corpus.txt'];
inputfile = [pwd,'/',filename]

%get number of lines in file
matrix = dlmread(inputfile);
numlines = size(matrix,1)

%create file with all punctuation removed

cleanfilename = [language,'-clean.txt'];
cleanfile = [pwd,'/',cleanfilename]


%remove ALL punctuation

readfile = fopen(inputfile,'r');
writecleanfile = fopen(cleanfile,'w');

for x = 1:numlines
    currentline = fgetline(readfile);
    printout = currentline;
    printout = strrep(printout,'.','');
    printout = strrep(printout,',','');
    printout = strrep(printout,'?','');
    printout = strrep(printout,'"','');
    printout = strrep(printout,'!','');
    printout = strrep(printout,';','');
    printout = strrep(printout,':','');
    printout = strrep(printout,'/','');
    printout = strrep(printout,'(','');
    printout = strrep(printout,')','');
    printout = strrep(printout,'[','');
    printout = strrep(printout,']','');
    printout = strrep(printout,'1','');
    printout = strrep(printout,'2','');
    printout = strrep(printout,'3','');
    printout = strrep(printout,'4','');
    printout = strrep(printout,'5','');
    printout = strrep(printout,'6','');
    printout = strrep(printout,'7','');
    printout = strrep(printout,'8','');
    printout = strrep(printout,'9','');
    printout = strrep(printout,'0','');
    printout = strrep(printout,'@','');
    printout = strrep(printout,'#','');
    printout = strrep(printout,'$','');
    printout = strrep(printout,'%','');
    printout = strrep(printout,'^','');
    printout = strrep(printout,'&','');
    printout = strrep(printout,'*','');
    printout = strrep(printout,'+','');
    printout = strrep(printout,'=','');
    printout = strrep(printout,'{','');
    printout = strrep(printout,'}','');
    printout = strrep(printout,'~','');
    
    printout = strrep(printout,' -',' ');
    printout = strrep(printout,'- ',' ');
    printout = strrep(printout,'  ',' '); % eliminates all double spaces
    
    %deal with possessives & contractions - swap out with zzz
    printout = strrep(printout,'''s','zzz');
    printout = strrep(printout,'n''t','yyy');
    printout = strrep(printout,'I''m','xxx');
    printout = strrep(printout,'I''ll','www');
    
    printout = strrep(printout,'''','');
    
    printout = strrep(printout,'zzz','''s');
    printout = strrep(printout,'yyy','n''t');
    printout = strrep(printout,'xxx','I''m');
    printout = strrep(printout,'www','I''ll');
    
    
    
    
    printout = [' ',printout,' '];
    %inserts space in front of each line for easier processing later
    fprintf(writecleanfile,'%s\n',printout);
end
fclose(readfile)
fclose(writecleanfile)


%get number of lines in clean file
matrix = dlmread(cleanfile);
numlines = size(matrix,1);

readcleanfile = fopen(cleanfile,'r');

wordcounter = 0;
wordcell{1} = 'xxx';
details.count = 0;
details.next = '';
details.previous = '';
wordstruct.xxx = details;

for x = 1:numlines
    currentline = fgetline(readcleanfile);
    spacelocations = regexp(currentline,' ');
    numwords = size(spacelocations,2)-1;
    
    if(numwords > 0) %skip blank lines
        for y = 1:numwords
            word = lower(currentline(spacelocations(y)+1:spacelocations(y+1)-1));
            %wordfield = ['wordstruct.',word]
            %wordtest = exist(wordfield, 'var') % doesn't work
            %but this does...
            try
                test = wordstruct.(word);
                wordtest = 1;
            catch
                wordtest = 0;
            end
            
            if wordtest > 0
                details = wordstruct.(word);
                details.count = details.count + 1;
                wordstruct.(word) = details;
            else
                details.count = 1;
                wordstruct.(word) = details;
                wordcounter = wordcounter + 1;
                wordcell{wordcounter,1} = word;
            end
            
        end
    end
end

fclose(readcleanfile)
 
outputlength = size(wordcell,1);
wordcountarray = 0;

for x = 1:outputlength
    word = wordcell{x,1};
    details = wordstruct.(word);
    wordcountarray(x,1) = details.count;
end

%sort output arrays into finished cell array
workingwordcountarray = wordcountarray;
workingwordcell = wordcell;
outputcounter = 1;
consolidated = {'x',1};
sortedwordcell = {'x'};
sortedwordcountarray = 0;



for x = 1:outputlength
    [maxout,maxloc] = max(workingwordcountarray);
    consolidated{x,1} = workingwordcell{maxloc};
    consolidated{x,2} = workingwordcountarray(maxloc);
    sortedwordcell{x} = workingwordcell{maxloc};
    sortedwordcountarray(x) = workingwordcountarray(maxloc);
    
    details.count = workingwordcountarray(maxloc);
    details.next = '';
    details.previous = '';
    sortedwordstruct.(workingwordcell{maxloc}) = details;
    
    workingwordcountarray(maxloc) = [];
    workingwordcell(maxloc) = [];
    
end

%write dictionary file 

dicfilename = [language,'-dic.csv'];
dicfile = [pwd,'/',dicfilename]

writedicfile = fopen(dicfile,'w');
for x = 1:outputlength
    printout = [sortedwordcell{x},',',num2str(sortedwordcountarray(x))];
    fprintf(writedicfile,'%s\n',printout);
end
fclose(writedicfile)

testout = sortedwordstruct;

%get number of lines in file
matrix = dlmread(inputfile);
numlines = size(matrix,1)

readfile = fopen(inputfile,'r');

pairs = 0;
unfoundwords = 0;
previousword = '';
nextword = '';

for x = 1:numlines
     %uses zz as catchall to indicate language separation (end of sentence, etc.)
     currentline = fgetline(readfile);
     printout = [' ',currentline];
     printout = strrep(printout,'.',' zzz ');
     printout = strrep(printout,',','');
     printout = strrep(printout,'--',' ');
     printout = strrep(printout,' -',' ');
     printout = strrep(printout,'- ',' ');
     printout = strrep(printout,'  ',' ');
     printout = strrep(printout,'?',' zzz ');
     printout = strrep(printout,'"',' zzz ');
     printout = strrep(printout,'!',' zzz ');
     printout = strrep(printout,'(',' zzz ');
     printout = strrep(printout,')',' zzz ');
     printout = strrep(printout,''' ',' zzz ');
     printout = strrep(printout,' ''',' zzz ');
     
     currentline = printout;
     spacelocations = regexp(currentline,' ');
     numwords = size(spacelocations,2)-1;
    
     if(numwords > 0) %skip blank lines
         for y = 1:numwords
             
             %main word
             word1 = lower(currentline(spacelocations(y)+1:spacelocations(y+1)-1)); % active word
             
             %previous word
             if y ~= 1 
                 word0 = lower(currentline(spacelocations(y-1)+1:spacelocations(y)-1)); % previous word
             end
             
             %next word
             if y ~= numwords
                 word2 = lower(currentline(spacelocations(y+1)+1:spacelocations(y+2)-1)); % next word
             end
             
             
             try
                 test = sortedwordstruct.(word0);
                 wordtest0 = 1;
             catch
                 wordtest0 = 0;
             end
             
             try
                 test = sortedwordstruct.(word1);
                 wordtest1 = 1;
             catch
                 wordtest1 = 0;
             end
             
             try
                 test = sortedwordstruct.(word2);
                 wordtest2 = 1;
             catch
                 wordtest2 = 0;
             end
             
            
             if wordtest1 > 0 && wordtest2 > 0 %both are valid words
                 following = word2;
                 
                 details = sortedwordstruct.(word1);
                 next = details.next;
                 previous = details.previous;
                 try
                     test = next.(word2);
                     wordtestnext = 1;
                 catch
                     wordtestnext = 0;
                 end
                 
                 if wordtestnext > 0 %already an entry
                     details = sortedwordstruct.(word1);
                     count = next.(word2);
                     count = count + 1;
                     next.(word2) = count;
                     details.next = next;
                     sortedwordstruct.(word1) = details;
                     
                 else
                     details = sortedwordstruct.(word1);
                     next.(word2) = 1;
                     details.next = next;
                     sortedwordstruct.(word1) = details;
                 end
                 
                 
             else
                 following = 'word not found';
                 unfoundwords = unfoundwords + 1;
             end
             
             if wordtest1 > 0 && wordtest0 > 0 %both are valid words
                 following = word0;
                 
                 details = sortedwordstruct.(word1);
                 next = details.next;
                 previous = details.previous;
                 try
                     test = previous.(word0);
                     wordtestprevious = 1;
                 catch
                     wordtestprevious = 0;
                 end
                 
                 if wordtestprevious > 0 %already an entry
                     details = sortedwordstruct.(word1);
                     count = previous.(word0);
                     count = count + 1;
                     previous.(word0) = count;
                     details.previous = previous;
                     sortedwordstruct.(word1) = details;
                     
                 else
                     details = sortedwordstruct.(word1);
                     previous.(word0) = 1;
                     details.previous = previous;
                     sortedwordstruct.(word1) = details;
                 end
                 
                 
             else
                 following = 'word not found';
                 unfoundwords = unfoundwords + 1;
                 unfound = [word1,'-',word2];
             end
             
             
             %for phrases
             fullwordtest = wordtest0 + wordtest1 + wordtest2;
             if fullwordtest == 3
                 trigram = [word0,' ',word1,' ',word2];
             
                 try
                     test = trigramstruct.(trigram);
                     trigramtest = 1;
                 catch
                     trigramtest = 0;
                 end
                 
                 if trigramtest > 0 %trigram already exists
                     trigramstruct.(trigram) = trigramstruct.(trigram) + 1;
                 else
                     trigramstruct.(trigram) = 1;
                 end
             end
             
             
        clear word0 word1 word2 trigram   
            
        end
    end
end

pairs = pairs
unfoundwords = unfoundwords
testout = trigramstruct

%sort structure so words and counts are in descending order

allwords = fieldnames(sortedwordstruct);

allwordssize = size(allwords,1);

for x = 1:allwordssize
    checkedword = allwords{x};
    details = sortedwordstruct.(checkedword);
    count = details.count;
    nextfields = details.next;
    allnexts = fieldnames(nextfields);
    allnextsize = size(allnexts,1);
    previousfields = details.previous;
    
    nextcount = 0; 
    for y = 1:allnextsize
         nextword = allnexts{y};
         nextcount(y,1) = nextfields.(nextword);
    end
    
    %sort output arrays into finished cell array
    workingnextcount = nextcount;
    workingallnexts = allnexts;
    outputcounter = 1;
    
    if workingnextcount > 0
        for x = 1:allnextsize
            [maxout,maxloc] = max(workingnextcount);
            revised.(workingallnexts{maxloc}) = maxout;
            
            workingallnexts(maxloc) = [];
            workingnextcount(maxloc) = [];
        end
        clear details
        
        details.next = revised;
        details.count = count;
        details.previous = previousfields;
        sortedwordstruct.(checkedword) = details; 
        
        clear revised;
    end
    
    previousfields = details.previous;
    allprevious = fieldnames(previousfields);
    allprevioussize = size(allprevious,1);
    nextfields = details.next;
    
    previouscount = 0; 
    for y = 1:allprevioussize
         previousword = allprevious{y};
         previouscount(y,1) = previousfields.(previousword);
    end
    
    %sort output arrays into finished cell array
    workingpreviouscount = previouscount;
    workingallprevious = allprevious;
    outputcounter = 1;
    
    if workingpreviouscount > 0
        for x = 1:allprevioussize
            [maxout,maxloc] = max(workingpreviouscount);
            revised.(workingallprevious{maxloc}) = maxout;
            
            workingallprevious(maxloc) = [];
            workingpreviouscount(maxloc) = [];
        end
        clear details
        
        details.previous = revised;
        details.count = count;
        details.next = nextfields;
        sortedwordstruct.(checkedword) = details; 
        
        clear revised;
    end
    
    
end


%create file with all punctuation removed

jsonfilename = [language,'-predictive.json'];
jsonfile = [pwd,'/',jsonfilename]

writejsonfile = fopen(jsonfile,'w');


print = ['{'];
fprintf(writejsonfile,'%s\n',print);

%set limits at front of file

if allwordssize > allwordsmax
    allwordssize = allwordsmax;
end

for x = 1:allwordssize
    word = allwords{x};
    details = sortedwordstruct.(word);
    count = details.count;
    
    printword = ['"',word,'":{'];
    fprintf(writejsonfile,'%s\n',printword);
    
    printcount = ['   "count":',num2str(count),','];
    fprintf(writejsonfile,'%s\n',printcount);
    
    
    print = ['   "next":{'];
    fprintf(writejsonfile,'%s\n',print);
    print = ['      '];
    fprintf(writejsonfile,'%s',print);
    
    nextfields = details.next;
    allnexts = fieldnames(nextfields);
    allnextsize = size(allnexts,1);
    previousfields = details.previous;
    
    if allnextsize == 0 % closes with no action
         fprintf(writejsonfile,'%s\n','},');
    else
        if allnextsize > nextwordsmax
            allnextsize = nextwordsmax;
        end
        nextcount = 0; 
        for y = 1:allnextsize
             nextword = allnexts{y};
             nextcount = num2str(nextfields.(nextword));
             printnext = ['"',nextword,'":',nextcount];
             fprintf(writejsonfile,'%s',printnext);
             
             if y == allnextsize
                 fprintf(writejsonfile,'%s\n','');
                 fprintf(writejsonfile,'%s\n','      },'); %close with comma for next
             else
                 fprintf(writejsonfile,'%s',',');
             end
             
        end
    end
    
    
    print = ['   "previous":{'];
    fprintf(writejsonfile,'%s\n',print);
    print = ['      '];
    fprintf(writejsonfile,'%s',print);
    
    previousfields = details.previous;
    allprevious = fieldnames(previousfields);
    allprevioussize = size(allprevious,1);
    previousfields = details.previous;
    
    if allprevioussize == 0 % closes with no action
         fprintf(writejsonfile,'%s\n','}');
    else
        if allprevioussize > previouswordsmax
            allprevioussize = previouswordsmax;
        end
        previouscount = 0; 
        for y = 1:allprevioussize
             previousword = allprevious{y};
             previouscount = num2str(previousfields.(previousword));
             printprevious = ['"',previousword,'":',previouscount];
             fprintf(writejsonfile,'%s',printprevious);
             
             if y == allprevioussize
                 fprintf(writejsonfile,'%s\n','');
                 fprintf(writejsonfile,'%s\n','      }'); % no comma for previous
             else
                 fprintf(writejsonfile,'%s',',');
             end
             
        end
    end
    
    if x == allwordssize
        print = ['   }'];
    else
        print = ['   },'];
    end
    fprintf(writejsonfile,'%s\n',print);
    
    
end

print = ['}'];
fprintf(writejsonfile,'%s\n',print);


fclose(writejsonfile);
fclose(readfile);



toc