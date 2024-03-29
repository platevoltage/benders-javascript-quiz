const startTime = 90; //sets timer (seconds)

const gameBoard = document.getElementById("game-board");
const questionBox = document.getElementById("question");
const startBox = document.getElementById("game-start");
const restartBox = document.getElementById("game-restart");
const highScore = document.getElementById("high-score");
const correctAnswers = document.getElementById("correct-answers");
const incorrectAnswers = document.getElementById("incorrect-answers");
const endgameDialog = document.getElementById("endgame-dialog");
const quote = document.getElementById("bender-quote");
const timerDisplay = document.getElementById("time-clock");
const timeWarning = document.getElementById("time-warning");
const bender = document.getElementById("bender");
const initials = document.getElementById("textbox");
const choiceA = document.getElementById(0);
const choiceB = document.getElementById(1);
const choiceC = document.getElementById(2);
const choiceD = document.getElementById(3);
var correct = 0;
var incorrect = 0;
var currentQuestion = 0;
var timeLeft = 0;
var highScoreArray = [];
var gameOver = true;

const benderQuotes = [ //quotes worst to best
    "Aaaand we're boned!",
    "No! My cheating unit Malfunctioned!",
    "Another job well done.",
    "Hey, this guy's alright!",
    "Eh, great is OK, but amazing would be great.",  
    "Yep, everything worked out great thanks to good old Bender."
];

const questions = [{

    q: "Which is NOT a data type?",
    choices: ["string","boolean","alert","number"],
    correctAnswer: 2
},{   
    q: "How do I declare a Variable in Javascript?",
    choices: ["int myVariable = ...;","$myVariable = ...;","uint_8 myVariable = ...;","var myVariable = ...;"],
    correctAnswer: 3
},{
    q: "Javascript is used for...",
    choices: ["it's a dead language","writing operating systems","developing dynamic web pages","programming Microcontrollers"],
    correctAnswer: 2
},{
    q: "The condition in an if/else statement is enclosed within ...",
    choices: ["curly braces {}","square brackets []","quotation marks \"\"","parentheses ()"],
    correctAnswer: 3
},{
    q: "in Javascript, the escape character is ...",
    choices: ["Back Slash \\","Forward Slash /","Ampersand &","Double Dash --"],
    correctAnswer: 0
},{
    q: "in Javascript we can increment a variable by ...",
    choices: ["myVariable = 1;","myVariable++;","myVariable + 1;","myVariable+=myVariable;"],
    correctAnswer: 1
},{
    q: "when being assigned to variables, string values must be enclosed within ...",
    choices: ["tildes ~~","astrisks **","parentheses ()","quotation marks \"\""],
    correctAnswer: 3
},{
    q: "in javascript, to print to the debug console, this is used.",
    choices: ["echo","printf()","console.log()","Serial.println()"],
    correctAnswer: 2
},{
    q: "javascript files have this file extention.",
    choices: [".js",".sh",".jar",".cpp"],
    correctAnswer: 0   
},{
    q: "you can easily comment out lines of code using this...",
    choices: ["/* */","&lt;!-- --&gt;","//","#"],
    correctAnswer: 2   
}
];
function retrieveScoreBoard() {
    var array = [];
    for (var i = 0; i < 6; i++) {
        var x = window.localStorage.getItem("highscore"+i);
        if (x)  {
            array[i] = x.split(":"); //splits : separated string into array
            array[i][0] = parseInt(array[i][0]);
            array[i].push(false);
            }
        else array[i] = [0,'empty',false]; //fills array with "empty" if no high score
    }
    return array;
}
function begin() {
    gameOver = false;
    highScoreArray = retrieveScoreBoard();

    currentQuestion = 0;
    correct = 0;
    incorrect = 0;
    clearScreen();
    startBox.style.display = "flex";
    correctAnswers.innerHTML = correct;
    incorrectAnswers.innerHTML = incorrect;

    // create and destroy event handler for enter key and mouse click
    document.addEventListener('keydown', enterKey);
    document.addEventListener('click', enterKey);
    function enterKey(e) {
        if (e.key == "Enter" || e.type == "click") {
            document.removeEventListener('keydown', enterKey);
            document.removeEventListener('click', enterKey);
            askQuestion(0);
        
        }
    }

}

function startCountdown() {
    timeLeft = startTime;
    clearInterval(timer);
    timerDisplay.innerHTML = formatTime();
    var timer = setInterval(function() {
        timeLeft--;
        timerDisplay.innerHTML = formatTime();
        if (timeLeft <= 0) {
            timeLeft = 0;
            clearInterval(timer);
            if (!gameOver) showScore();
        }
        
    },1000);

    function formatTime() {
        var seconds = timeLeft%60;   // uses modulous to get extra seconds
        var minutes = "<span class='futurama-font'>" + Math.floor(timeLeft/60) + "</span>" + "<span class='futurama-font' id='colon'>:</span>"; // gets minutes
      
        if (seconds < 10) minutes += "<span class='futurama-font'>0" + seconds + "</span>";
        else  minutes += "<span class='futurama-font'>" + seconds + "</span>";
        if (seconds%2) timerDisplay.children[0].style.color = "#00000000";
        else timerDisplay.children[0].style.color = "#000000ff";
        console.log(minutes);
        // document.getElementById("colon").style.color = "#00000000";
        return minutes;

    }
}

function askQuestion(x) {

    if (x == 0) {  // first question exception
        drawQuestions();
        startCountdown();
    }
    else setTimeout(drawQuestions, 1000);   //waits 1 second to move on to next question unless its the 1st question.

    function drawQuestions() {
        
        clearScreen();
        questionBox.style.display = "flex";
        gameBoard.style.display = "flex";
        questionBox.innerHTML = questions[x].q;

        choiceA.innerHTML = "<span id='0'><span class='abcd futurama-font'>A:</span> " + questions[x].choices[0]+ "</span>";
        choiceB.innerHTML = "<span id='1'><span class='abcd futurama-font'>B:</span> " + questions[x].choices[1]+ "</span>";
        choiceC.innerHTML = "<span id='2'><span class='abcd futurama-font'>C:</span> " + questions[x].choices[2]+ "</span>";
        choiceD.innerHTML = "<span id='3'><span class='abcd futurama-font'>D:</span> " + questions[x].choices[3]+ "</span>";

        addMultiChoiceListeners();
    
        for (var i=0; i<4; i++) {
            document.getElementById(i).className = "choice frosted";
        }
    }
}


function select(input) {

    removeMultiChoiceListeners();
    if (input == questions[currentQuestion].correctAnswer) {
        correct++;
        correctAnswers.innerHTML = correct;
        document.getElementById(input).className += " green";
        document.getElementById(input).innerHTML += "<span class='correct-incorrect'>CORRECT</span>";

    } else {
        incorrect++;
        
        if (timeLeft >= 10) {     //time penalty mercy if 10 seconds on the clock
            timeLeft -= 5;      // creates a -5 animation when time is deducted      
            timeWarning.style.transition = "0s";
            timeWarning.style.color = "#990000ff";
            timeWarning.style.fontSize = "700px";
            setTimeout(function() {
                timeWarning.style.transition = "all 5s cubic-bezier(0, 1.1, 0.8, 1) ";
                timeWarning.style.color = "#99000000";
                timeWarning.style.fontSize = "10px";
            }, 100);
        }

        incorrectAnswers.innerHTML = incorrect;
        document.getElementById(input).className += " red";
        document.getElementById(input).innerHTML += "<span class='correct-incorrect'>WRONG!</span>";
        document.getElementById(questions[currentQuestion].correctAnswer).className += " green";
    }
    currentQuestion++;
    if (currentQuestion === questions.length) {
        
        setTimeout(showScore, 1000);
        
    } else {
        askQuestion(currentQuestion);
    }
    
}



function showScore() {
    //removes remaining time and sets gameOver
    timeLeft = 0;
    gameOver = true;
    //selects a bender quote according to your score.
    quote.textContent = benderQuotes[ Math.floor( (correct / questions.length)*(benderQuotes.length-1) ) ];    
    removeMultiChoiceListeners();

    correctAnswers.innerHTML = correct;
    incorrectAnswers.innerHTML = incorrect;
    endgameDialog.textContent = "You got " + correct + "/" + questions.length + " answers correct!";
    clearScreen();
    restartBox.style.display = "flex";
   
    document.addEventListener('keydown', typeLetter);
    
    function typeLetter(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.key == "Backspace") {   
            initials.value = initials.value.slice(0, -1);             
        }
        else if ( (e.key.match(/^[a-zA-Z]{1}$/) ) && (initials.value.length < 2)) {   //regex accepts a-z, A-Z, and filters out anything more than 1 character.
            initials.value += e.key.toUpperCase();
        }
        else if ((e.key == "Enter") && (initials.value.length >= 2)) {

            document.removeEventListener('keydown', typeLetter);
            addToHighScore(initials.value);
            initials.value = "";
            document.activeElement.blur();   //hide keyboard in iOS
        }
    }

}



function addToHighScore(initials) {

    clearScreen();
    bender.style.display = "flex";
    highScore.style.display = "flex";


    highScoreArray.sort((a,b) => b[0] - a[0]); //sorts high scores highest first;
    for (i in highScoreArray) { //checks if score is the same as any highscore, then puts your score above it.
        if (correct == highScoreArray[i][0]) {
            highScoreArray.splice(i, 0, [correct, initials, true]); //"true" is just a temporary marker for the most recent score so that it can be highlighted
            break;
        }
    }
    if (highScoreArray.length === 6) { // if no tie score, inserts your score above next highest.
        highScoreArray.push([correct, initials, true]);
        highScoreArray.sort((a,b) => b[0] - a[0]);
    }
   

    highScoreArray.splice(6); //shortens array to 6
    console.log(highScoreArray);
    for (var i = 0; i < 6; i++) {
        if (highScoreArray[i][1] == "empty") {
            highScore.children[0].children[i].textContent = "highScore["+i+"] = null;";   //fake code
        } else {
            highScore.children[0].children[i].textContent = "player."+ highScoreArray[i][1] +".score = " + highScoreArray[i][0] + " / " + questions.length + ";";  
        }
        if (highScoreArray[i][2]) { // highlights your new score if you made the board.
            highScore.children[0].children[i].style.fontWeight = "900";
            highScore.children[0].children[i].style.backgroundColor = "#00ff00";
            highScore.children[0].children[i].style.color = "#161816ea";

        }
        else {
            highScore.children[0].children[i].style.fontWeight = "100";
            highScore.children[0].children[i].style.backgroundColor = "#00000000";
            highScore.children[0].children[i].style.color = "#00ff00";
        }
   
       var key = "highscore" + i;
       window.localStorage.setItem(key, (highScoreArray[i][0] + ":" + highScoreArray[i][1]));
    }

    // create and destroy event handler for enter key and mouse click
    document.addEventListener('keydown', enterKey);
    document.addEventListener('click', enterKey);
    function enterKey(e) {
        if (e.key == "Enter" || e.type == "click") {
            document.removeEventListener('keydown', enterKey);
            document.removeEventListener('click', enterKey);
            begin();       
        }
    }

}

//hides all panels of app.
function clearScreen() {
    gameBoard.style.display = "none";
    questionBox.style.display = "none";
    restartBox.style.display = "none";
    highScore.style.display = "none";
    startBox.style.display = "none";
    bender.style.display = "none";
}
//Event handler for clicking on buttons
function buttonPress(e) {
    select(e.srcElement.id); // gets ID of which choice was clicked in quiz
    removeMultiChoiceListeners();
}
// creates and destroys all events on multiple choice buttons
function removeMultiChoiceListeners() {
    choiceA.removeEventListener('click', buttonPress);
    choiceB.removeEventListener('click', buttonPress);
    choiceC.removeEventListener('click', buttonPress);
    choiceD.removeEventListener('click', buttonPress);
    document.removeEventListener('keydown', keyPress);
}
function addMultiChoiceListeners() {
    choiceA.addEventListener('click', buttonPress);
    choiceB.addEventListener('click', buttonPress);
    choiceC.addEventListener('click', buttonPress);
    choiceD.addEventListener('click', buttonPress);
    document.addEventListener('keydown', keyPress); 
}

//event handler for a,b,c, and d key for selecting answers
function keyPress(e) {  
    switch (e.key) {           
        case 'a': {
            select(0); 
            break;
        }
        case 'b': {
            select(1); 
            break;
        }
        case 'c': {
            select(2);
            break;
        }
        case 'd': {
            select(3); 
            break;
        }
    }
}


// var questions = [{

//     q: "What color is Fry's hair?",
//     choices: ["Black","Yellow","Orange","He's bald"],
//     correctAnswer: 2
// },{
//     q: "What species is Leela?",
//     choices: ["Alien","Omicronian","Decopodian","Human"],
//     correctAnswer: 3
// },{
//     q: "What planet do Lrrr and Ndnd reside when they aren't invading Earth?",
//     choices: ["Urectum","Decapod 10","Omicron Persei 8","Neutral Planet"],
//     correctAnswer: 2
// },{
//     q: "What did Fry's dad name him after?",
//     choices: ["a Defunct electronics Store","a British Comedian","Fast Food","a Screwdriver"],
//     correctAnswer: 3
// },{
//     q: "Which of these characters is not voiced by Billy West?",
//     choices: ["Hermes","Fry","Professor Farnsworth","a Zap Brannigan"],
//     correctAnswer: 0
// },{
//     q: "What is the name of the DonBot's Joe-Pesci-like henchman?",
//     choices: ["Bender","Clamps","Calculon","PreacherBot"],
//     correctAnswer: 1
// },{
//     q: "Who is the most prominent President of Earth?",
//     choices: ["Mayor Poopinmeyer","Trump's left foot","Ogden Wurnstrom","Richard Nixon's Head"],
//     correctAnswer: 3
// },{
//     q: "What is Fry's favorite somewhat addictive beverage?",
//     choices: ["Mountain Dew","LöBrau","Slurm","Maltese Liquor"],
//     correctAnswer: 2
// },{
//     q: "When Bender became God, who was his prophet?",
//     choices: ["Malakai","Ezekiel","Kif","L. Ron Hubbard"],
//     correctAnswer: 0   
// },{
//     q: "What was the problem with Popplers",
//     choices: ["They were very rare","They caused illness in humans","They were Omicronian babies","They were Hallucinogenic"],
//     correctAnswer: 2   
// },{
//     q: "Why does Mom want the last anchovies in existance?",
//     choices: ["They are great on Pizza","She knows Zoidberg likes them","She wants to resurrect the species","Their existance threatens her robot oil business"],
//     correctAnswer: 3   
// },{
//     q: "What is Elzar's spice of choice?",
//     choices: ["A blast from the Spice Weasel","Dash of Paprika","CBD oil","He prefered bland food"],
//     correctAnswer: 0   
// }
// ];