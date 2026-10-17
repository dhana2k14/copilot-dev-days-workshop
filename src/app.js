// UI code: connects the quiz logic (quiz.js) to the page (index.html).

const QUESTION_TIME_LIMIT = 15;

const state = { questions: [], current: 0, score: 0, timeLeft: QUESTION_TIME_LIMIT, timerId: null, questionLocked: false };

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const progressText = document.getElementById("progress");
const timerText = document.getElementById("timer-text");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options");
const feedbackText = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");
const scoreText = document.getElementById("score-text");
const gradeText = document.getElementById("grade-text");

function showScreen(screenToShow) {
  [startScreen, quizScreen, resultScreen].forEach((screen) => {
    screen.hidden = screen !== screenToShow;
  });
}

function stopTimer() {
  if (state.timerId !== null) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function updateTimerDisplay() {
  timerText.textContent = formatTimeLeft(state.timeLeft);
  timerText.classList.toggle("timer-warning", state.timeLeft <= 5);
}

function startTimer() {
  stopTimer();
  state.timeLeft = QUESTION_TIME_LIMIT;
  state.questionLocked = false;
  updateTimerDisplay();

  state.timerId = setInterval(() => {
    state.timeLeft -= 1;

    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      updateTimerDisplay();
      stopTimer();
      handleTimeExpired();
      return;
    }

    updateTimerDisplay();
  }, 1000);
}

function handleTimeExpired() {
  if (state.questionLocked) {
    return;
  }

  state.questionLocked = true;
  const question = state.questions[state.current];
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));

  if (buttons[question.answer]) {
    buttons[question.answer].classList.add("correct");
  }

  feedbackText.textContent = "Time's up!";
  nextButton.hidden = false;
  nextButton.focus();
}

function startQuiz() {
  stopTimer();
  Object.assign(state, createQuiz(QUESTIONS));
  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  stopTimer();
  state.questionLocked = false;

  const question = state.questions[state.current];
  progressText.textContent = `Question ${state.current + 1} of ${state.questions.length}`;
  questionText.textContent = question.question;
  feedbackText.textContent = "";
  nextButton.hidden = true;
  optionsList.innerHTML = "";

  question.options.forEach((option, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(index, button));
    item.appendChild(button);
    optionsList.appendChild(item);
  });

  startTimer();
}

function selectAnswer(selectedIndex, selectedButton) {
  if (state.questionLocked) {
    return;
  }

  state.questionLocked = true;
  stopTimer();

  const question = state.questions[state.current];
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));

  const { state: nextState, correct } = answerQuestion(state, selectedIndex);
  Object.assign(state, nextState);

  if (correct) {
    selectedButton.classList.add("correct");
    feedbackText.textContent = "Correct!";
  } else {
    selectedButton.classList.add("wrong");
    if (buttons[question.answer]) {
      buttons[question.answer].classList.add("correct");
    }
    feedbackText.textContent = "Not quite. The correct answer is highlighted.";
  }

  nextButton.hidden = false;
  nextButton.focus();
}

function nextQuestion() {
  stopTimer();
  state.current += 1;
  if (!isQuizFinished(state)) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  stopTimer();
  const total = state.questions.length;
  const percentage = calculatePercentage(state.score, total);
  scoreText.textContent = `You scored ${state.score} out of ${total} (${percentage}%)`;
  gradeText.textContent = `Grade: ${getGrade(percentage)}`;
  document.getElementById("feedback-message").textContent = getFeedbackMessage(getGrade(percentage));
  showScreen(resultScreen);
}

document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("restart-btn").addEventListener("click", startQuiz);
nextButton.addEventListener("click", nextQuestion);
