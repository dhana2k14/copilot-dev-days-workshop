// Core quiz logic.
// This file has NO browser (DOM) code so it can be tested with Node.js.

/**
 * Returns a new array with the items in random order.
 * The original array is not changed.
 */
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Formats the remaining time as a display string.
 */
function formatTimeLeft(seconds) {
  const safeSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
  return `⏱ ${safeSeconds}s`;
}

/**
 * Returns true when the selected option is the correct one.
 */
function isCorrect(question, selectedIndex) {
  return question.answer === selectedIndex;
}

/**
 * Converts a score into a whole-number percentage (0-100).
 */
function calculatePercentage(score, total) {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

/**
 * Turns a percentage into a grade.
 * A = 90% or more, B = 75% or more, C = 50% or more.
 */
function getGrade(percentage) {
  if (percentage >= 90) return "A";
  if (percentage >= 75) return "B";
  if (percentage >= 50) return "C";
  return "Keep practicing";
}

/**
 * Returns true when the current percentage beats the stored best score.
 * A null best counts as an initial best score.
 */
function isNewBestScore(current, best) {
  const numericCurrent = Number(current);
  const numericBest = best === null || best === undefined ? null : Number(best);

  if (!Number.isFinite(numericCurrent)) {
    return false;
  }

  if (numericBest === null || Number.isNaN(numericBest)) {
    return true;
  }

  return numericCurrent > numericBest;
}

// Returns an encouraging message for a grade: "A", "B", "C" or anything else
function getFeedbackMessage(grade) {
  switch (grade) {
    case "A":
      return "Excellent work! You're a quiz master!";
    case "B":
      return "Good job! Keep up the great work!";
    case "C":
      return "Not bad! Keep practicing and you'll get there!";
    default:
      return "Keep practicing and you'll improve!";
  }
}

/**
 * Creates the initial quiz state for a set of questions.
 * The original questions array is not changed.
 */
function createQuiz(questions) {
  const safeQuestions = Array.isArray(questions) ? questions : [];

  return {
    questions: shuffle(safeQuestions),
    current: 0,
    score: 0,
  };
}

/**
 * Answers the current question without mutating the input state.
 * Returns the next state and whether the selected answer was correct.
 */
function answerQuestion(state, selectedIndex) {
  const safeState = state && typeof state === "object" ? state : { questions: [], current: 0, score: 0 };
  const question = safeState.questions[safeState.current];
  const correct = question ? isCorrect(question, selectedIndex) : false;

  return {
    state: {
      ...safeState,
      score: correct ? safeState.score + 1 : safeState.score,
    },
    correct,
  };
}

/**
 * Returns true once the quiz has advanced past the last question.
 */
function isQuizFinished(state) {
  const safeState = state && typeof state === "object" ? state : { questions: [], current: 0, score: 0 };
  return safeState.current >= safeState.questions.length;
}

if (typeof globalThis !== "undefined") {
  globalThis.shuffle = shuffle;
  globalThis.isCorrect = isCorrect;
  globalThis.calculatePercentage = calculatePercentage;
  globalThis.getGrade = getGrade;
  globalThis.isNewBestScore = isNewBestScore;
  globalThis.getFeedbackMessage = getFeedbackMessage;
  globalThis.formatTimeLeft = formatTimeLeft;
  globalThis.createQuiz = createQuiz;
  globalThis.answerQuestion = answerQuestion;
  globalThis.isQuizFinished = isQuizFinished;
}

// Lets Node.js tests load this file. Browsers ignore this block.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    shuffle,
    isCorrect,
    calculatePercentage,
    getGrade,
    isNewBestScore,
    getFeedbackMessage,
    formatTimeLeft,
    createQuiz,
    answerQuestion,
    isQuizFinished,
  };
}
