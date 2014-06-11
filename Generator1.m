
function testout = Generator1(language)
    
tic    
    
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

wordcounter = 1;
wordcell{1} = 'xxx';
wordstruct.xxx = 0;

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
                wordstruct.(word) = wordstruct.(word) + 1;
            else
                wordstruct.(word) = 1;
                wordcounter = wordcounter + 1;
                wordcell{wordcounter,1} = word;
            end
            
        end
    end
end
 
outputlength = size(wordcell,1);
wordcountarray = 0;

for x = 1:outputlength
    word = wordcell{x,1};
    wordcountarray(x,1) = wordstruct.(word);
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
    workingwordcountarray(maxloc) = [];
    workingwordcell(maxloc) = [];
end

%write dictionary file with all punctuation removed

dicfilename = [language,'-dic.csv'];
dicfile = [pwd,'/',dicfilename]

writedicfile = fopen(dicfile,'w');
for x = 1:outputlength
    printout = [sortedwordcell{x},',',num2str(sortedwordcountarray(x))];
    fprintf(writedicfile,'%s\n',printout);
end
fclose(writedicfile)

testout = consolidated;

%get number of lines in file
matrix = dlmread(inputfile);
numlines = size(matrix,1)

readfile = fopen(inputfile,'r');

foundwords = 0;
unfoundwords = 0;
previousword = '';
nextword = '';

for x = 1:numlines
     %uses zz as catchall to indicate language separation (end of sentence, etc.)
     currentline = fgetline(readfile);
     printout = [' ',currentline];
     printout = strrep(printout,'.',' zzz ');
     printout = strrep(printout,',','');
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
     
     currentline = printout
     spacelocations = regexp(currentline,' ');
     numwords = size(spacelocations,2)-1;
    
     if(numwords > 0) %skip blank lines
         for y = 1:numwords-1
             word1 = lower(currentline(spacelocations(y)+1:spacelocations(y+1)-1))
             word2 = lower(currentline(spacelocations(y+1)+1:spacelocations(y+2)-1))
             
             %wordfield = ['wordstruct.',word]
             %wordtest = exist(wordfield, 'var') % doesn't work
             %but this does...
             try
                 test = wordstruct.(word1);
                 wordtest1 = 1;
             catch
                 wordtest1 = 0;
             end
             
             try
                 test = wordstruct.(word2);
                 wordtest2 = 1;
             catch
                 wordtest2 = 0;
             end
             
            
             if wordtest1 > 0 && wordtest2 > 0 %both are valid words
                 following = word2
             else
                 following = 'word not found'
                 unfoundwords = unfoundwords + 1;
             end
            
        end
    end
end

unfoundwords = unfoundwords
 
 








outputfilename = ['pred-',language,'.json'];

outputfile = [pwd,'/',outputfilename]

toc