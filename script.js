
var question,
    btn1,
    btn2,
    btn3,
    btn4,
    ourRequest,
    ourData,
    currentQuestion,
    randomQuestion,
    numberOfQuestions,
    gameOver = false,
    gameStart = false,
    score,
    time = 0,
    running = 0,
    QCrunning = 0,
    QCtime = 300;


window.onload = function(){
  btn1 = document.getElementById('btn1');
  btn2 = document.getElementById('btn2');
  btn3 = document.getElementById('btn3');
  btn4 = document.getElementById('btn4');
  question = document.getElementById('question');
  currentQuestion = 0;
  fetchData();
}

function fetchData(){
   ourRequest = new XMLHttpRequest();

    ourRequest.open('GET', 'https://api.myjson.com/bins/12ugtd');
    ourRequest.onload = function(){
    console.log(ourRequest.responseText);
    ourData = JSON.parse(ourRequest.responseText);
    //renderHTML(ourData);
  };
  ourRequest.send();
}

function startGame(numberOfQuestion){
  gameStart = true;
  gameOver = false;
  numberOfQuestions = numberOfQuestion;
  currentQuestion = 0;
  score = 0;
  document.getElementById('score').innerHTML = 'Score : 0/' + numberOfQuestions;
  document.getElementById('answer').innerHTML = 'start game';
  document.getElementById('alltime').innerHTML ="" ;
  document.getElementById('averagetime').innerHTML = "";
  resetClock();
  startStopClock();
  nextQuestion();
  resetQC();
  startQC();

}

function renderCurrentQuestion(){
  document.getElementById('currentQuestion').innerHTML  = 'Question : ' +parseInt(currentQuestion+1) +'/'+ numberOfQuestions;
}

function nextQuestion(){

  if ( currentQuestion >= numberOfQuestions ){ //game over not do anything
    gameOver = true;
    startStopClock();
    stopQC();

    updateTime();
    document.getElementById('answer').innerHTML = 'game over';
    document.getElementById('timer').innerHTML = '30.0';

  } else { //gane is not over render new question
    resetQC();
    startQC();
    renderCurrentQuestion();
    while ( true ){
      var x = randomNumber();
      if ( x == randomQuestion ){

      } else {
        randomQuestion = x;
        break;
      }
    }
    console.log(randomQuestion);
    renderQuestion(randomQuestion);
  }
}

function randomNumber(){
  return Math.floor(Math.random() * ourData.theQuestion.length);
}

function renderQuestion(i){ //display question and choices
      question.innerHTML = ourData.theQuestion[i].question;
      btn1.innerHTML = ourData.theQuestion[i].choices[0];
      btn2.innerHTML = ourData.theQuestion[i].choices[1];
      btn3.innerHTML = ourData.theQuestion[i].choices[2];
      btn4.innerHTML = ourData.theQuestion[i].choices[3];
}

function answer(i) {
      //console.log("answer click");
      if ( !gameOver && gameStart){ // the game is still on
        if ( i == 99 ){

        } else if ( ourData.theQuestion[randomQuestion].choices[i-1] == ourData.theQuestion[randomQuestion].answer){ //correct answer

          document.getElementById('answer').innerHTML = 'correct';
          document.getElementById('score').innerHTML = 'Score : ' + (score += 1) + '/' + numberOfQuestions ;

        } else { //incorrect answer
          console.log('incorrect');
          document.getElementById('answer').innerHTML = 'incorrect';
        }
        currentQuestion += 1;
        nextQuestion();
      }
       else { // the game is over
        //console.log('game over');
      }

}

function startStopClock(){
  if ( running == 0 ) {
    running = 1;//start
    console.log(running);
    increment();
  } else {
    running = 0;//stop
  }
}

function resetClock(){
  running = 0;
  time = 0;
}

function increment(){
  if ( running == 1 ){
    setTimeout(function(){
      time++;

      console.log(time);
      increment();
    },100);
  }
}

function updateTime(){
  var mins = Math.floor(time/10/60);
  var secs = Math.floor(time/10);
  var tenths = time % 10;
  document.getElementById('alltime').innerHTML ='Used time : ' + mins + ' : ' + secs + ' : ' + tenths ;
  document.getElementById('averagetime').innerHTML = 'Average time per question '  + (time/10/numberOfQuestions).toFixed(3) + ' seconds';
}

function startQC(){
  if ( QCrunning == 0 ){
    QCrunning = 1;
    QCdeduction();
  } else {
    QCrunning = 0;
  }
} // QC = question clock

function stopQC(){
  if ( QCrunning == 1 ){
    QCrunning = 0;
  }
}

function resetQC(){
  QCrunning = 0;
  QCtime = 300;
}

function QCdeduction(){
  if ( QCrunning == 1 ){
    setTimeout(function(){
      QCtime--;
      if (QCtime <= 0 ){
        answer(99);
      }
      var mins = Math.floor(QCtime/10/60);
      var secs = Math.floor(QCtime/10);
      var tenths = QCtime % 10;
      document.getElementById('timer').innerHTML = secs + " : " + tenths;

      QCdeduction();
    },100);
  }
}
