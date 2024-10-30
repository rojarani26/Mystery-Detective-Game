let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 60;

fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;  
    })
    .catch(error => console.error('Error loading questions:', error));

// Function to start the game
function startGame() {
    document.querySelector("header").style.display = "none";
    document.querySelector(".welcome-box").style.display = "none";
    document.querySelector(".game-rules").style.display = "none";
    document.querySelector(".start-button").style.display = "none";
    
    displayQuestion();
    startTimer();
}

// Function to display question and options
function displayQuestion() {
    const container = document.querySelector(".container");
    container.innerHTML = `
        <div class="question-box">
            <h2>Question ${currentQuestionIndex + 1}/10</h2>
            <img src="${questions[currentQuestionIndex].image}" alt="Question Image" class="question-image">
            <p>${questions[currentQuestionIndex].question}</p>
            <ul>
                ${questions[currentQuestionIndex].options.map((option, index) => 
                    `<li onclick="selectOption(this)" data-answer="${option}">${option}</li>`).join("")}
            </ul>
            <button onclick="submitAnswer()">Submit Answer</button>
            <button onclick="nextQuestion()" disabled id="next-btn">Next Question</button>
            <div id="timer">Time left: 60s</div>
        </div>
    `;
    timeLeft = 60;
}


// Function to handle option selection
function selectOption(element) {
    document.querySelectorAll("li").forEach(li => li.classList.remove("selected"));
    element.classList.add("selected");
}

function submitAnswer() {
    const selectedOption = document.querySelector("li.selected");

    if (!selectedOption) {
        alert("Please select an answer!");
        return;
    }

    const answer = selectedOption.getAttribute("data-answer");
    const correctAnswer = questions[currentQuestionIndex].answer;
    
    document.querySelectorAll(".question-box li").forEach(option => {
        option.classList.remove("correct", "wrong");
        if (option.querySelector(".feedback-icon")) {
            option.removeChild(option.querySelector(".feedback-icon"));
        }
    });

    const icon = document.createElement("span");
    icon.classList.add("feedback-icon");

    if (answer === correctAnswer) {
        score += 10;
        selectedOption.classList.add("correct"); 
        icon.textContent = "✅";  
        icon.style.color = "cyan";
    } else {
        selectedOption.classList.add("wrong"); 
        icon.textContent = "❌"; 
        icon.style.color = "red";

        
        document.querySelectorAll("li").forEach(option => {
            if (option.getAttribute("data-answer") === correctAnswer) {
                const correctIcon = document.createElement("span");
                correctIcon.classList.add("feedback-icon");
                correctIcon.textContent = "✅"; 
                correctIcon.style.color = "green";
                option.appendChild(correctIcon);
                option.classList.add("correct");
            }
        });
    }

    selectedOption.appendChild(icon);
    document.getElementById("next-btn").disabled = false;
    stopTimer();
}

// Function to proceed to the next question
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
        startTimer();
    } else {
        displayScore();
    }
}

// Function to start the timer
function startTimer() {
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Time's up! Moving to the next question.");
            nextQuestion();
        } else {
            document.getElementById("timer").textContent = `Time left: ${timeLeft--}s`;
        }
    }, 1000);
}

// Function to stop the timer
function stopTimer() {
    clearInterval(timer);
}

// Function to display the final score and rating
function displayScore() {
    document.querySelector(".container").innerHTML = `
        <div class="score-box">
            <h2>Game Over!</h2>
            <p>Your Score: ${score}/100</p>
            <p>${getIntelligenceRating(score)}</p>
            <button class="try-again-button" onclick="tryAgain()">Try Again</button>
        </div>
    `;
}

// Function to get intelligence rating based on score
function getIntelligenceRating(score) {
    if (score === 100) return "Genius Detective! 🎉";
    if (score >= 80) return "Excellent Detective! 🌟";
    if (score >= 60) return "Good Detective! 👍";
    if (score >= 40) return "Fair Detective! 🤔";
    return "Keep Practicing! 🕵️‍♂️";
}

function tryAgain() {
    window.location.reload();
}
