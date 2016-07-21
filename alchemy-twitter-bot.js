var TwitterPackage = require('twitter');
var secret = require("./secret");
var Twitter = new TwitterPackage(secret);
var watson = require('watson-developer-cloud');
var jsonfile = require('jsonfile');
var watson_data = require('./data');
var file = 'data.json';
var alchemy_language = watson.alchemy_language({
api_key: '-----------------------'
});

var introArray = [
  'Per your request: ',
  'Current state of society is',
  'Current state at',
  'Here it is: ',
  'As of right now: ',
  'As requested: ',
  'Analysis in at: ',
  'Currently trending at: ',
  'It is: ',
  'The info you requested: ',
  'Currently reading at: '
]

var randomIndex = Math.round(Math.random() * introArray.length);

var params = {
  url: 'https://news.google.com',
  /*'https://cbsnews.com',
  'https://nbcnews.com/',
  'https://abcnews.go.com/',
  'https://foxnews.com/',
  'https://bbc.com/news',
  'https://cnn.com/'*/
};

Twitter.stream('statuses/filter', {track:'@botsight status'}, function(stream) {
  stream.on('data', function(tweet) {
    var tweetId = tweet.id;
  console.log(tweet.text);
  console.log(tweetId);

  alchemy_language.emotion(params, function (err, response) {
    var obj = response;
    if (err)
      console.log('error:', err);
    else
      jsonfile.writeFileSync(file, obj, {spaces: 1});
      //console.log(JSON.stringify(response, null, 2));
  });

  var emotionalStateAnger = watson_data.docEmotions.anger;
  var emotionalStateDisgust = watson_data.docEmotions.disgust;
  var emotionalStateFear = watson_data.docEmotions.fear;
  var emotionalStateJoy = watson_data.docEmotions.joy;
  var emotionalStateSadness = watson_data.docEmotions.sadness;
  var emotionalStates = emotionalStateAnger + emotionalStateDisgust + emotionalStateFear + emotionalStateJoy + emotionalStateSadness;
  console.log(emotionalStates);

  //in_reply_to_status_id: tweetId
  var statusObj = {status: ' @' + tweet.user.screen_name + ' ' + introArray[randomIndex] + 'Anger: ' + emotionalStateAnger + ' Disgust: ' + emotionalStateDisgust + ' Fear: ' + emotionalStateFear + ' Joy: ' + emotionalStateJoy + ' Sadness: ' + emotionalStateSadness}
  //call the post function to tweet something
  Twitter.post('statuses/update', statusObj,  function(error, tweetReply, response){
  //if we get an error print it out
  if(error){
    console.log(error);
  }
  //print the text of the tweet we sent out
  console.log(tweetReply.text);
});

});

  stream.on('error', function(error) {
  console.log(error);
  });
});
