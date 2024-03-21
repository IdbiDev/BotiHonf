for (let name of ["bulvar", "csillagaszat", "egyeb", "elovilag", "etelekiltalok", "filmszinhaz", "foldrajz", "irodalom", "kepzomuveszet", "kozlekedesjarmuvek", "sport", "szolasokkozmondasok", "tortenelem", "tvsorozatok", "unnepek", "zene"]) {
    fetch('./themes/question_generated/'+name+"_generated.json")
        .then((response) => response.json())
        .then((json) => onJsonLoad(json));
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}


class Theme {
    constructor(name) {
        this.name = name
        this.questions = []
    }

    getRandomQuestion() {
        return this.questions[Math.floor(Math.random() * this.questions.length)];
    }
}

class Question {
    constructor(theme, question, answers, correctAnswer) {
        this.theme = theme;
        this.question = question;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
    }
}


function onJsonLoad(json) {
    let theme = new Theme(json["theme"])

    for (let i = 0; i < json.questions.length; i++) {
        let obj = json.questions[i];
        shuffleArray(obj.answers)
        let question = new Question(theme, obj.question, obj.answers, obj.correct_answer);
        theme.questions.push(question);
    }
    themes.push(theme);
}

let themes = []
var secondLeft = 10
const replayAnimations = () => {
    document.getAnimations().forEach((anim) => {
        anim.cancel();
        anim.play();
    });
};
let isNext = true
var currentTheme = undefined
var currentQuestion = undefined

function getIndexOfCorrectAnswer(question) {
    return question.answers.findIndex((element) => element === question.correctAnswer); // indexet várunk vissza
}
function sendMSGToServer(msg){
    var xhr = new XMLHttpRequest();

    // Set up the request
    xhr.open("POST", "http://localhost:8000", true); // Modify the URL as needed

    // Set the content type for the request
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");


    // Convert the data to JSON format and send it
    xhr.send(JSON.stringify(msg));
}

let questionCount = 0
function nextQuestion() {
    if (isNext) {
        if(currentQuestion !== undefined){
            document.getElementById("as_test" + (getIndexOfCorrectAnswer(currentQuestion) + 1)).className = "as_test" + (getIndexOfCorrectAnswer(currentQuestion) + 1)

        }
        secondLeft = 10;
        replayAnimations();
        currentTheme = getRandomTheme();
        currentQuestion = currentTheme.getRandomQuestion();
        document.getElementById("container").style.display = "block"
        document.getElementById("question").textContent = currentQuestion.question;
        document.getElementById("A").innerText = "A, " + currentQuestion.answers[0];
        document.getElementById("B").innerText = "B, " + currentQuestion.answers[1];
        document.getElementById("C").innerText = "C, " + currentQuestion.answers[2];
        questionCount++;

        document.getElementById("countdown").innerHTML = secondLeft + "";
        document.getElementById("next_button").style.display = "none";

        sendMSGToServer({"count": questionCount, "theme": currentTheme.name, "question": currentQuestion.question, "correct_answer": currentQuestion.correctAnswer, "index": getIndexOfCorrectAnswer(currentQuestion)})

        var timer = window.setInterval(function () {
            document.getElementById("countdown").innerHTML = secondLeft + "";
            if (secondLeft <= 0) {
                // mental breakdown
                clearInterval(timer);
                document.getElementById("next_button").innerHTML = "Megoldás";
                document.getElementById("next_button").style.display = "block";
                document.getElementById("container").style.display = "none"
                isNext = false
            }
            secondLeft--;
        }, 1000);
    } else {

        document.getElementById("next_button").innerHTML = "Következő";
        ///document.getElementById("countdown").innerHTML = currentQuestion.correctAnswer
        document.getElementById("container").style.display = "block"
        document.getElementById("as_test" + (getIndexOfCorrectAnswer(currentQuestion) + 1)).className = "correct_answer"
        isNext = true
    }
}

function getRandomTheme() {
    return themes[Math.floor(Math.random() * themes.length)];
}