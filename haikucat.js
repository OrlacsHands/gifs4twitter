console.log("I am your server. Use me as you please");

require('dotenv').config()

var Twit = require('twitter');

var NeoCities = require('neocities')
const nname = process.env.NEOCITIES_NAME;
const nkey= process.env.NEOCITIES_KEY;
var api = new NeoCities(nname, nkey)
//console.log("neocities ok!  " + nname);

var fs = require('fs');
var Jimp = require('jimp');

var ri = require("rita"); //// <---- :)
const version = ri.RiTa.VERSION;
console.log("rita= "+version);


var twtText;
var oldTwtText;
var allWords= [];
var haikuLines = [];
var twitData = [];

var date;
var loadIndex =1;
var saveIndex =0;

var gotTweet = false;
var makesNewId = false;
var imgMade;


var savePath = "data/catMeme.jpg";

var T = new Twit({

   consumer_key:           process.env.TWITTER_CONSUMER_KEY 
 , consumer_secret:        process.env.TWITTER_CONSUMER_SECRET
 , access_token_key:       process.env.TWITTER_ACCESS_TOKEN_KEY
 , access_token_secret:    process.env.TWITTER_ACCESS_TOKEN_SECRET

 });

console.log("twitta ok!?");
 
var nameToTweet;
//var id = "25073877";              //var id = "realDonaldTrump";
// var id = "15063486";            // @catoletters - test
//var id = "46623193";              // @sebastiankurz

 makeId();
        // <---=> getTimeline()=> makeHaiku()=> makePic()=> tweetIt() 


 setInterval(makeId, 35000000); //6 000 000 = 100min , 10 000 000 = 2,778 h

 function makeId(){
  pausecomp(10000);
  makesNewId = true;
  //var id = "46623193";              // @sebastiankurz
  //var id = "891658600757821442";    // @torquil_22
  //var id = "15063486";                // @catoletters
  //var id = "14587429";                // @shiffman
  var nid = Math.floor((Math.random()+1)*9999999);
  var nix = nid + 333333;
  nid = nid.toString();
  nix = nix.toString();
  //id = nid;
  
  //var vips = ["46623193", "25073877", nid, nix, "14587429"];
  var vips = ["25073877"];
  console.log(vips);
  var ni = Math.floor(Math.random()*vips.length);
  console.log("= new random Id set = " + ni);
  id = vips[ni];
  makesNewId = false;

  getTimeline()// <----
 }

  function pausecomp(duration){
    console.log("- pause init -");
    console.log("pause == "+duration);
    var date = new Date();
    var curDate = null;

    do { curDate = new Date(); }
    while(curDate-date < duration);
  }


function getTimeline(){
  
  console.log("1st load txt file for catCount");
  var txtfilename =  'data/catCount.txt';     //'https://cpb.neocities.org/img/catCount.txt';   //
  fs.readFile(txtfilename, 'utf8', function(err, data) {
    if (err){
      console.log("did not save data =" + err);
    }
   console.log("loaded data =" + data);
    var fst = data.replace("catCount=","");   
    var catCount = Number(fst);
    
    saveIndex= catCount;
  });

  console.log("allWords =" + allWords.length);
  allWords= []; // empty global array
  console.log("allWords after empty ="  + allWords.length);

  var params = {user_id: id, count : 70};
  T.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      console.log("last tweet = " + tweets[0].text); 
        
            //_______________________________________________
      
            console.log("twitData.length: " + twitData.length);
            twitData = [];     
            console.log("twitData.length after : "+ twitData.length);
            nameToTweet = tweets[0].user.screen_name;
            //twtson = twitData;
            
            twtText = tweets[0].text;                  
            date = tweets[0].created_at; 


            if(oldTwtText === twtText){
              gotTweet = false;
              
            }else{ 
              gotTweet = true;
              oldTwtText = tweets[0].text;
            }

      
            twitData += "<screen_name>"+ nameToTweet + "</screen_name> ";
            twitData += "<twtText>"+ twtText + "</twtText> ";
            twitData += "<created_at>"+ date + "</created_at> ";
            twitData += "<user.id_str>"+ tweets[0].user.id_str + "</user.id_str> ";
            twitData += "<time_zone>"+tweets[0].user.time_zone + "</time_zone> ";
            twitData += "<user.place>"+ tweets[0].user.place + "</user.place> ";
            twitData += "<coordinates>"+ tweets[0].coordinates + "</coordinates> ";
            twitData += "<followers_count>"+tweets[0].user.followers_count + "</followers_count> ";
            twitData += "<friends_count>"+tweets[0].user.friends_count + "</friends_count> ";
            twitData += "<statuses_count>"+tweets[0].user.statuses_count + "</statuses_count> ";
            twitData += "<background_color>"+ tweets[0].user.profile_background_color + "</background_color> ";
            twitData += "<background_image_url>"+ tweets[0].user.profile_background_image_url + "</background_image_url> ";
            twitData += "<image_url>"+ tweets[0].user.profile_image_url + "</image_url> ";
      
            console.log("gotTweet= " + gotTweet);
            console.log(twitData);
            console.log(twtText);
            console.log(date);
            console.log(tweets[0].user.screen_name);
                                                    
            if(gotTweet){
              fs.writeFile('data/twitData.txt',
                twitData, function (err) {
                if (!err){ 
                  console.log('twitdata saved.');
                
               }else console.log("didnt you save tweet-data?? ="+err);    
              });
            }

      for (var i = 0; i < tweets.length; i++) {
        var token1 = [];
        
        token1 = ri.RiTa.tokenize(tweets[i].text,/\b\s(?!$)/);
        //token1 = ri.RiTa.tokenize(tweets[i].text,/\w+|\/[^\/\\]*(?:\\.[^\/\\]*)*\/gi);
             
        for (var j = 0; j < token1.length ; j++) {
            var token = token1[j].replace( ",", '');           
            token = token.replace( ";", '');
            token = token.replace( "(", '');
            token = token.replace( ")", '');
            token = token.replace( "'", '');
            token = token.replace( "&amp", nameToTweet);
       
          if(allWords.indexOf(token) < 0 && token.length > 3 && token.length < 15){
                  
            allWords.push( token );        
          }
        };
         //console.log("--allWords== "+ allWords);        
      }; 
      
      console.log("allWords afta tokenize == "+ allWords.length); 
      console.log("1st exmpl Words = "+ allWords[allWords.length-1] +" + "+ allWords[10] +" + "+ allWords[1]);

      if(gotTweet){
        makeHaiku(); // <-----
      }
    }else {
      console.log("something went badly with timeline" + error)
      console.log(error)
      makeId(); // <--
    }
  });
}

function makeHaiku(){
    var w1 = [];
    var index1 = 0;
    var w2 = [];
    var index2 = 0;
    var w3 = [];
    var index3 = 0;
    var w4 = [];
    var index4 = 0;
    var w5 = [];
    var index5 = 0;
 
    for (var i =0  ; i < allWords.length; i++) {
      
     //var word = allWords[i];
     var st = ri.RiTa.getStresses(allWords[i]); 
     var silbenAnz = st.split("/");

     // if(word.length>=3){ //<----- check max length
        if (silbenAnz.length <= 1 && silbenAnz.length > 0 && index1 < 40) {
          w1[index1] = allWords[i];
          index1++;
          }
        if (silbenAnz.length > 1 && silbenAnz.length <  3 && index2 < 30) {
          w2[index2] = allWords[i];
          index2++;
        }
        if (silbenAnz.length > 2 && silbenAnz.length < 4 && index3 < 20) {
          w3[index3] = allWords[i];
          index3++;
        }
        if (silbenAnz.length > 3 && silbenAnz.length < 5 && index4 <10) {
          w4[index4] = allWords[i];
          index4++;
        }
        if (silbenAnz.length >= 5 && index5 < 10) {
          w5[index5] = allWords[i];
          index5++;
        }
      //}
    };
    
  rg = new ri.RiGrammar(); 
  //rg.loadFrom("data/haikuUpdate.yaml");  // <---- LOAD YAML
  rg.addRule("<start>", "<5-line> % <7-line> % <5-line>");  
  rg.addRule("<5-line>", "<1> <4> |<1> <3> <1> |<1> <1> <3> | <1> <2> <2> | <1> <2> <1> <1> | <4> <1> | <2> <1> <2> | <2> <3> | <2> <2> <1> | <2> <1> <2> | <2> <1> <1> <1> | <3> <2> | <3> <1> <1> | <4> <1> | <5>");
  rg.addRule("<7-line>", "<2> <1> <4> | <2> <5> | <1> <1> <5> | <1> <4> <1> <1> | <5> <1> <1> | <5> <2> | <2> <5> | <1> <5> <1> | <4> <1> <2>"); 
  
  rg.addRule("<1>",  w1[0] +" | "+ w1[1] +" | "+ w1[2] +" | "+ w1[3] +" | "+ w1[4] +" | "+ w1[5] +" | "+ w1[6] +" | "+ w1[38] +" | "+ w1[8] +" | "+ w1[9] +" | "+ w1[10] +" | "+ w1[11] +" | "+ w1[12] +" | "+ w1[13] +" | "+ w1[14] +" | "+ w1[15] +" | "+ w1[16] +" | "+ w1[17] +" | "+ w1[18] +" | "+ w1[19] +" | "+ w1[20] +" | "+ w1[21] +" | "+ w1[22] +" | "+ w1[23] +" | "+ w1[24] +" | "+ w1[25] +" | "+ w1[26] +" | "+ w1[27] +" | "+ w1[28] +" | "+ w1[29] +" | "+ w1[30] +" | "+ w1[31] +" | "+ w1[32] +" | "+ w1[33] +" | "+ w1[34] +" | "+ w1[35] +" | "+ w1[36] +" | "+ w1[37] );
  rg.addRule("<2>",  w2[0] +" | "+ w2[1] +" | "+ w2[2] +" | "+ w2[3] +" | "+ w2[4] +" | "+ w2[5] +" | "+ w2[6] +" | "+ w2[7] +" | "+ w2[8] +" | "+ w2[9] +" | "+ w2[10] +" | "+ w2[11] +" | "+ w2[12] +" | "+ w2[13] +" | "+ w2[14] +" | "+ w2[15] +" | "+ w2[16] +" | "+ w2[17] +" | "+ w2[18] +" | "+ w2[19] +" | "+ w2[20] +" | "+ w2[21] );
  rg.addRule("<3>",  w3[0] +" | "+ w3[1] +" | "+ w3[2] +" | "+ w3[3] +" | "+ w3[4] +" | "+ w3[5] +" | "+ w3[6] +" | "+ w3[7] +" | "+ w3[8] +" | "+ w3[9] +" | "+ w3[10] );
  rg.addRule("<4>",  w4[0] +" | "+ w4[1] +" | "+ w4[2] +" | "+ w4[3] +" | "+ w4[4] +" | "+ w4[5] );
  rg.addRule("<5>",  w5[0] +" | "+ w5[1] +" | "+ w5[2] +" | "+ w5[3] +" | "+ w5[4] +" | "+ w5[5] );
  /*
  rg.addRule("<1>", "the | thank | so | now | it | not | who | me | state | news | just | he | from | by | … | out | more | fake | your | was | should | s | one | no | if | do | been | where | u | trump | they | there | thanks | tax | soon | safe | my | men");
  rg.addRule("<2>", "people | going | after | ever | working | women | rescue | phoenix | media | many | doing | country | closely | border | being | yuma | watching | today | senate | safety | over | local");
  rg.addRule("<3>", "hurricane | arizona | tomorrow | louisiana | government | every | mexico | federal | fantastic | wonderful | virginia");
  rg.addRule("<4>", "america | monitoring | incredible | americans | american | republican");
  rg.addRule("<5>", "coordination | unprecedented | university | renegotiation | photosfromthefield | nationality");
  //rg.print();
  */
  //console.log("w5  = " + w5[1] +"_"+ w5[2] +"_"+ w5[3] +"_"+ w4[4]);
  if(rg.ready() === true){
    var result = rg.expand();
    var haiku = [];
  
    haiku = result.split("%");
    console.log("haiku= " + haiku[0] + " - " + haiku[1] + " - " + haiku[2]);
    haikuLines = haiku;

    saveIndex++;
   //var si = ''+saveIndex+'';
  fs.writeFile('data/wotohai.txt',
    date+"<from>"+nameToTweet+"<text>"+twtText+'<haiku>'+haikuLines+ 
    '<words>'+w1+w2+w3+w4+w5+"<allWords>"+allWords , function (err) {
     if (!err){ 
     console.log('wotohai data saved.');
      
    }else console.log(err) ;    
 });


    writeFiles();
    makePic();   // <-----   

  }
}

function writeFiles(){

  // save txt file
  fs.writeFile('data/catCount.txt', 'catCount='+saveIndex, function (err) {
    if (err) {
      console.log("didnt you save wotohai?? ="+err)
      console.log(err);
    }else console.log('catCount saved.');

    
  });

}

function makePic(){
  var iN = Math.floor((Math.random()*48)+1);
  var imgPath = "data/cat/cat ("+iN+").jpg";

  imgMade = false;
  if(!imgMade){
    Jimp.read(imgPath).then(function (image) {
      
      console.log("image loaded= "+ image);
      image.resize(500, 600 ); 
  
  
      var fn = Math.floor((Math.random()*18));
      //console.log("random number == " + fn);
      var fpath = "data/font/fnt/font"+ fn +".fnt"; // .fnt <---
      //var fpath =  Jimp.FONT_SANS_32_BLACK;
  
      Jimp.loadFont( fpath ).then(function (font) { // load font from .fnt file 
         // console.log("font=" + font);
          image.print(font, 30, 50, haikuLines[0], 550);
          image.print(font, 10, 400, haikuLines[1], 800);
          image.print(font, 20, 450, haikuLines[2], 600);
  
          image.write(savePath);

            console.log("haikuLines =" + haikuLines.length);
            haikuLines = [];
            console.log("haikuLines after empty - " + haikuLines.length); 

          
       });    
      }).catch(function (err) {
        console.log("something went wrong with imageLoading= " + err);
        console.log(err);
      });
    }
  
  console.log(" - tweet and send init - ");

  tweetIt();  // <------
  sendTO();   // <------
  console.log("img Made == " + imgMade);
}

function sendTO(){

  console.log(" - upload-init - ");
  var si = ''+saveIndex+'';

  imgMade = true;
  
  api.upload([ // <-------Upluad catCount file to webspace
    {name: 'img/catCount.txt', path: 'data/catCount.txt'}], function(resp) {

    console.log("cC uploaded= "+resp)
  });

      api.upload([  //save IMG as                     //get from
  {name: 'img/catMeme'+si+'.jpg', path: 'data/catMeme.jpg'}], function(resp) {
    console.log("img uploaded= "+resp)
    
    
  })

  api.upload([ // <-------Upluad wotohai file to webspace
    {name: 'img/wotohai'+si+'.txt', path: 'data/wotohai.txt'}], function(resp) {

      console.log("wotohai uploaded= "+resp)
    });


  api.upload([ // <-------Upluad tweetData file to webspace
  {name: 'img/twitData'+si+'.txt', path: 'data/twitData.txt'}], function(resp) {

    console.log("twitData uploaded= "+resp)
  });
}


function tweetIt(){
        ////_____________| send tweet to 
  console.log('tweet init');
  console.log('tweet name= '+nameToTweet);
  var filename = savePath;      // "data/catMeme.jpg";
  var params ={
    encoding : 'base64'
  }
  var b64content = fs.readFileSync(filename);

  //var atName = "meow I'm a bot. this Meme is for @"+nameToTweet+" <3<3<3 #sadcatsfor"+nameToTweet + " <3<3<3";      //@realDonaldTrump  +"nameToTweet"+
  var atName = "meow . this Meme is for "+nameToTweet+"<3<3<3 #sadcatsfor"+nameToTweet + " <3<3<3";      //@realDonaldTrump  +"nameToTweet"+
  
  //var sendTweetText = txt;
  var sendTweet = atName ;


  var isTweeting = false;
  console.log("is tweeting =" + isTweeting );
  console.log(saveIndex + " = index");
  isTweeting = true;
  console.log("is tweeting =" + isTweeting );
if(isTweeting){
   T.post('media/upload', { media : b64content}, uploaded);

   function uploaded(error, media, response){
     if(!error){
      console.log(media);
    
        var id = media.media_id_string;
        var status = {
         status: atName,
          media_ids: id
       }
        console.log("cat meme updloaded");

       T.post('statuses/update', status, tweeted);

     }else console.log(error);
    
     function tweeted(error, tweet, response){
        if(error){
          console.log("final tweet error");
          console.log(error);
        }
        if(response){
        console.log( response + "success.tweet.belive me " );
       
        isTweeting = false;       
        gotTweet = false;

       }
     }
   }
  }
} 



  