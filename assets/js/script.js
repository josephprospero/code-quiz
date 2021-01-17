///////////////// Query Selectors ////////////////////
var quizEl = document.querySelector("#quiz");
var completedQuiz = document.querySelector("#final-score-page");
var startBtnEl = document.querySelector("#startBtn");
var questionsEl = document.querySelector('#question');
var solutionsEl = document.querySelector('#answers')
var timeSpanEl = document.querySelector("#timer");
var introEl = document.querySelector("#intro");
var resultsEl = document.querySelector("#results");
var highScores = document.querySelector("#highScores");
var clearHighscoresBtn = document.querySelector("#clearHighscoresBtn");
var highScoresList = document.querySelector("#highScoresList");
var submitScore = document.querySelector("#submit")
var finalScore = document.querySelector("#finalScore")
///////////////// End Query Selectors //////////////////

///////////////////// Script Declarations ////////////////////
var questionTracker = 0;
var timeTotal = 180;
var timeLeft = timeTotal
var timePassed = 0;
var timePenalty = 0;
var correctAnswers = 0;
var choiceRegistered = false;
var highScoreArray = [];
var time = setInterval(timer, 1000);
var highScoresArray = [];
////////////////// End Script Declarations ////////////////

///////////////////// Questions Array//////////////////////
var questionObjArr = [
{
    question: "Inside which HTML element do we put the JavaScript?", 
    choices: ["<script>", "<js>", "<javascript>", "<scripting>"],
    solution: 0
},
{
    question: "What is the correct Javascript syntax to write 'Hello World'?", 
    choices: ["document.write('Hello World')", "response.write('Hello World')", "'Hello World'", "('Hello World')"],
    solution: 0
},
{
    question: "Where is the correct place to insert a JavaScript?", 
    choices: ["Both the <head> section and the <body> section are correct", "The <body> section", "The <head> section", "The .css file"],
    solution: 0
},
{
    question: "What is the correct syntax for referring to an external script called 'jjj.js'?", 
    choices: ["<script src = 'jjj.js'", "<script name = 'jjj.js'", "<script href = 'jjj.js'", "<script value = 'jjj.js'",],
    solution: 0
},
{
    question: "An external JavaScript must contain the _____ tag.", 
    choices: ["<script>", "<link>", "<style>", "<class>"],
    solution: 0
},
{
    question: "How do you write 'Hello World' in an alert box?", 
    choices: ["alert('Hello World')", "msgBox('Hello World')", "alertBox = 'Hello World'", "alertBox = ('Hello World')"],
    solution: 0
},
{
    question: "How do you create a function?", 
    choices: ["var function = myFunction()", "function:myFunction", "var myFunction():function", "my.function.:function"],
    solution: 0
},
{
    question: "How do you write a conditional statement for executing some statements only if 'i' is equal to 5?", 
    choices: ["if (i == 5)", "if i == 5", "if i = 5 then", "if i = 5"],
    solution: 0
},
{
    question: "How do you write a conidional statement for executing some statements only if 'i' is NOT equal to 5?", 
    choices: ["if (i! = 5)", "if (i! = 4)", "if (i! = 3)", "if (i! = 2)"],
    solution: 0
},
{
    question: "What is the proper tag for a JavaScript file?", 
    choices: [".js", ".jpeg", ".gif", ".java"],
    solution: 0
}];
//////////////////// End of Questions Array ////////////////////////

/////////////////////// Quiz Functions ////////////////////////////
function init() {
    timeSpanEl.textContent = timeLeft;
    quizEl.style.display = "none";
    completedQuiz.style.display = "none";

    introEl.style.display = "block";
    startBtnEl.style.display = "block";

    questionTracker = 0;
    timeTotal = 180;
    timeLeft = timeTotal;
    timePassed = 0;
    timePenalty = 0;
  
    correctAnswers = 0;

    choiceRegistered = false;
    timeSpanEl.textContent = timeLeft;

    if (localStorage.getItem("highscore")) {
        highscoreArray = localStorage.getItem("highscore").split(",");
    }
    clearInterval(time);

    completedQuiz.firstElementChild.setAttribute("class", "alert alert-info mt-0 mb-0");
    submit.setAttribute("class", "btn btn-info");
};

function showQuestion() {
    questionsEl.textContent = questionObjArr[questionTracker].question;
    var indexArray = [];
    for (i = 0; i < questionObjArr[questionTracker].choices.length; i++) {
    var questionBtn = document.createElement("button");
        questionBtn.setAttribute("type", "button");
        questionBtn.setAttribute("class", "list-group-item list-group-item-action list-group-item-info mt-1 answerButton");
        questionBtn.setAttribute("data-index", i);
        if (i === 0) {
            questionBtn.setAttribute("correct", "yes");
        } else {
            questionBtn.setAttribute("correct", "no");
        }
        questionBtn.textContent = questionObjArr[questionTracker].choices[i];
        solutionsEl.append(questionBtn);
        indexArray.push(i);
    }
  
    solutionsEl.childNodes.forEach(function (child) {
        var rndIndex = Math.floor(Math.random() * indexArray.length);
        solutionsEl.append(solutionsEl.children[rndIndex]);
        indexArray.splice(rndIndex, 1);
    });
};

function answersClicked(event) {
    if (event.target.matches("button")) {
        var index = parseInt(event.target.getAttribute("data-index"));
        var timeInterval = 1000;
        disableQuestions();
        if (event.target.getAttribute("correct") === "yes") {
            displayResult(true);
            correctAnswers++;
        } else {
            timePenalty += 5;
            clearInterval(time);
            time = setInterval(timer, 1000);
            displayResult(false);
        }
        questionTracker++;
  
        if (questionTracker === questionObjArr.length) {
            timeInterval = 5000;
            gameOver("questions_done");
        } else {
            setTimeout(removeQuestionsButtons, 1000);
            setTimeout(showQuestion, 1001);
        }
  
        setTimeout(function () {
            resultsEl.style.display = "none";
        }, timeInterval);
    }
};

function displayResult(solution) {
    if (solution) {
        resultsEl.setAttribute("class","alert alert-success mt-0 mb-0 pt-0 pb-0 text-center");
        resultsEl.innerHTML = "<strong>Correct!</strong> Nice job.";
        resultsEl.style.display = "block";
    } else {
        resultsEl.setAttribute("class","alert alert-danger mt-0 mb-0 pt-0 pb-0 text-center");
        resultsEl.innerHTML ="<strong>That was incorrect.</strong> It's alright, maybe you'll get the next one.";
        resultsEl.style.display = "block";
        timeSpanEl.style.color = "red";
        setTimeout(function () {
            timeSpanEl.style.color = "black";
        }, 1000);
    };
};

function removeQuestionsButtons() {
    questionsEl.textContent = "";
    var child = solutionsEl.lastElementChild;
    while (child) {
      solutionsEl.removeChild(child);
      child = solutionsEl.lastElementChild;
    }
};

function disableQuestions() {
    let questionsButton = document.querySelectorAll(".answerButton");
    questionsButton.forEach((element) => {
      element.setAttribute("class","list-group-item list-group-item-action list-group-item-danger mt-1 answerButton disabled");
      if (parseInt(element.getAttribute("data-index")) === questionObjArr[questionTracker].solution) {
        element.setAttribute("class", "list-group-item list-group-item-action list-group-item-success mt-1 answerButton disabled");
      }
    });
};

function timer() {
    timeLeft = timeTotal - timePassed - 1 - timePenalty;
    timeSpanEl.textContent = timeLeft;
    timePassed++;
    if (timeLeft <= 0) {
      clearInterval(time);
      disableQuestions();
      gameOver("time_out");
    }
};

function startQuiz() {
    introEl.style.display = "none";
    startBtnEl.style.display = "none";
    quiz.style.display = "block";
    time = setInterval(timer, 1000);  
    showQuestion();
};

function gameOver(cause) {
    if (cause === "questions_done") {
      console.log("QUESTIONS DONE");
      setTimeout(() => {
        resultsEl.setAttribute(
          "class",
          "alert alert-dark mt-0 mb-0 pt-0 pb-0 text-center"
        );
        resultsEl.innerHTML = "<strong>That's the last one.</strong> Let's see how you did.";
      }, 1500);
      clearInterval(time);
    } else if (cause === "time_out") {
      console.log("TIME OUT");
      disableQuestions();
      setTimeout(() => {
      }, 4000);
      resultsEl.setAttribute(
        "class",
        "alert alert-info mt-0 mb-0 pt-0 pb-0 text-center"
      );
      resultsEl.innerHTML = "<strong>Time finished</strong> Good luck!";
    } else {
      return false;
    }
    resultsEl.style.display = "block";

    setTimeout(function () {
      finalScore.textContent = correctAnswers;
      quiz.style.display = "none";
      completedQuiz.style.display = "block";
      resultsEl.style.display = "none";
      removeQuestionsButtons();
    }, 5000);
};
//////////////////// End Quiz Functions ////////////////////

////////////////// High Scores Functions //////////////////
function inputHighscores() {
    var highScoreEl = document.createElement("li");
    var highscoreStr = initials.value + " - " + correctAnswers;
    highScoresArray.push(highscoreStr);
    var highscoreArrayStr = highScoresArray.toString();
    highScoreEl.textContent = highscoreStr;
    highScoresList.append(highScoreEl);
    localStorage.setItem("highscore", highScoresArray);
    choiceRegistered = true;
    initials.value = "";
    // Modal
    $("#staticBackdrop").modal("show");
};

function loadHighScores() {
    var temphighScoresArray = [];
    var tempHighscoresObject = {};
    var tempHighscoresObjectsArray = [];
    var tempLocalSCoreArray = [];
    while (highScoresList.hasChildNodes()) {
      highScoresList.removeChild(highScoresList.childNodes[0]);
    }
    var lastPos;
    var lastChar = "";
    var localScore = 0;
    var localStrScore = "";
    var tempHighscore = "";
    for (i = 0; i < highScoresArray.length; i++) {
      for (j = highScoresArray[i].length - 1; j >= 0; j--) {
        lastPos = highScoresArray[i].length - 1;
        lastChar = highScoresArray[i][lastPos - j];
        if (lastChar && lastChar >= 0 && lastChar <= 9) {
          localScore += lastChar;
        }
        if (j > 1) {
          if (j === 2 && lastChar === "1") {
          }
          localStrScore += lastChar;
        }
        localScore = parseInt(localScore);
      }
  
      tempHighscore = localScore + localStrScore;
      temphighScoresArray.push(tempHighscore);
      tempHighscoresObject.score = localScore;
      tempHighscoresObject.scoreStr = localStrScore;
  
      tempHighscoresObjectsArray.push(tempHighscoresObject);
      tempLocalSCoreArray.push(localScore);
      localScore = 0;
      localStrScore = "";
      tempHighscoresObject = {};
    }
    tempLocalSCoreArray.sort(function (a, b) {
      return b - a;
    });
    var sortedScoresCompleteArray = [];
    var flagged = [];
    tempLocalSCoreArray.forEach(function (element) {
      tempHighscoresObjectsArray.forEach(function (object, index) {
        if (element === object.score && !flagged.includes(index)) {
          flagged.push(index);
  
          var tempScoreString = object.scoreStr + " " + object.score;
          sortedScoresCompleteArray.push(tempScoreString);
        }
      });
    });
  for (i = 0; i < sortedScoresCompleteArray.length; i++) {
    var highScoreElement = document.createElement("li");
        highScoreElement.textContent = sortedScoresCompleteArray[i];
    for (j = sortedScoresCompleteArray[i].length - 1; j >= 0; j--) {
        lastPos = sortedScoresCompleteArray[i].length - 1;
        lastChar = sortedScoresCompleteArray[i][lastPos - j];
        if (lastChar && lastChar >= 0 && lastChar <= 9) {
            localScore += lastChar;
        }
        if (j > 1) {
            localStrScore += lastChar;
        }
        localScore = parseInt(localScore);
        };
        
        tempHighscore = localScore + localStrScore;
        
        if (localScore > 80 && localScore <= 100) {
            highScoreElement.setAttribute(
                "class",
                "list-group-item list-group-item-success"
            );
        } else if (localScore > 70 && localScore <= 80) {
            highScoreElement.setAttribute(
                "class",
                "list-group-item list-group-item-info"
            );
        } else if (localScore > 60 && localScore <= 70) {
            highScoreElement.setAttribute(
                "class",
                "list-group-item list-group-item-primary"
            );
        } else if (localScore > 50 && localScore <= 60) {
            highScoreElement.setAttribute(
                "class",
                "list-group-item list-group-item-warning"
            );
        } else if (localScore <= 50) {
            highScoreElement.setAttribute(
                "class",
                "list-group-item list-group-item-danger"
            );
        }
  
        highScoresList.append(highScoreElement);
        temphighScoresArray.push(tempHighscore);
        tempHighscoresObject.score = localScore;
        tempHighscoresObject.scoreStr = localStrScore;
        tempHighscoresObjectsArray.push(tempHighscoresObject);
        tempLocalSCoreArray.push(localScore);
        localScore = 0;
        localStrScore = "";
        tempHighscoresObject = {};
    }
};
  
function clearHighscores() {
    highScoresArray = [];
    localStorage.setItem("highscore", highScoresArray);
    loadHighScores();
};
//////////////////// End High Score Functions ////////////////////


////////////////////// Event Listeners /////////////////////
startBtnEl.addEventListener("click", startQuiz);
solutionsEl.addEventListener("click", answersClicked);
submitScore.addEventListener("click", inputHighscores);
clearHighscoresBtn.addEventListener("click", clearHighscores);
$("#staticBackdrop").on("shown.bs.modal", function (e) {
  loadHighScores();
});
$("#staticBackdrop").on("hidden.bs.modal", function (e) {
  if (choiceRegistered) {
    init();
  }
});
////////////////// End Event Listeners ////////////////////

init();
