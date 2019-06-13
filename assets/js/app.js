console.log("connected");

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyB8h2LtNcYxgRabGCZgAunkFMBU7MNGhis",
  authDomain: "june-project-f5e77.firebaseapp.com",
  databaseURL: "https://june-project-f5e77.firebaseio.com",
  projectId: "june-project-f5e77",
  storageBucket: "june-project-f5e77.appspot.com",
  messagingSenderId: "602603736335",
  appId: "1:602603736335:web:97d6df5206a83eac"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var trainName = "";
var destination = "";
var firstTime = "";
var frequency = "";
var minAway = '';

function militaryToSec(str) {
  var arr = str.split('');
  var minutes = arr.splice(2).join('');
  var hours = arr.join('');
  console.log("hours:"+ hours);
  console.log("minutes:"+ minutes);
  var totalSec = Number(hours)*60*60 + Number(minutes)*60;
  return totalSec;
}

$("#submit").on("click", function(event) {
  console.log("eventfired");
  // Prevent the page from refreshing
  event.preventDefault();

  // Get inputs
  trainName = $("#train-name").val().trim();
  destination = $("#destination").val().trim();
  firstTime = $("#first-time").val().trim();
  frequency = $("#frequency").val().trim();

  // Change what is saved in firebase
  database.ref().set({
    name: trainName,
    dest: destination,
    time: firstTime,
    freq: frequency
  });
});

database.ref().on("value", function(snapshot) {

  // Print the initial data to the console.
  console.log(snapshot.val());

  // Log the value of the various properties
  console.log(snapshot.val().name);
  console.log(snapshot.val().dest);
  console.log(snapshot.val().time);
  console.log(snapshot.val().freq);

  var timeNow = moment().format("HHmm");

  console.log("time now:" + timeNow);

  //if colon was used to input military time
  if(snapshot.val().time.indexOf(":") >= 0){
  
    var newStr =  snapshot.val().time.split('');
    var splicedStr = newStr.splice(newStr.indexOf(":"), 1);
    var joinedStr =  newStr.join('');

    firstTime = joinedStr;
  }
  console.log("first time: " + firstTime + "timenow: " + timeNow);

  var timeNowSec = militaryToSec(timeNow);
  var firstTimeSec = militaryToSec(firstTime);
  var freqSec = snapshot.val().freq*60;

  console.log("timeNowSec:" + timeNowSec);
  console.log("firstTimeSec:" + firstTimeSec);

  if(timeNowSec > firstTimeSec) {
    var x = firstTimeSec;
    var y = timeNowSec;
    while(x <= y) {
      x += freqSec;
      minAway =  (x - y)/60;
      hrAway = Math.floor(minAway/60) 

      var nextArrivalHr = moment().hour()+hrAway;
      var nextArrivalMin = moment().minute()+minAway%60;

      if(nextArrivalMin >= 60) {
        nextArrivalHr += 1;
        nextArrivalMin = nextArrivalMin - 60;
      }

      if(nextArrivalHr >= 24) {
        nextArrival = snapshot.val().time;
        var dailySec =militaryToSec('2400');
        var secToMidnight = dailySec - timeNowSec;
        minAway = (secToMidnight+firstTimeSec)/60
        
      } else {
        nextArrival = String(nextArrivalHr) + String(nextArrivalMin); 
      }
      
     
    }
  } else {
    // var dailySec =militaryToSec('2400');
    // var x = firstTimeSec;
    // var y = timeNowSec;
    // var secToMidnight = dailySec - y;
    minAway = (firstTimeSec - timeNowSec)/60;
    nextArrival = snapshot.val().time;
  }

  console.log("minaway: "+ minAway);
  // if(timeNowSec > firstTimeSec) {
  //   
  //   
  //   minAway = (secToMidnight + firstTimeSec)/60;
  // }else {
  //   minAway = (timeNowSec - firstTimeSec) / 60;
  // }






 
  // Change the HTML
  var newRow = $("<tr> <td>"+ snapshot.val().name+ "</td><td>"  + snapshot.val().dest + "</td><td>" + snapshot.val().freq + "</td><td>" + nextArrival + "</td><td>" + minAway + "</td></tr>");
  console.log(newRow);
  $("#train-table").append(newRow);

  // If any errors are experienced, log them to console.
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

