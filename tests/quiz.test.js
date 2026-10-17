// Tests use Node's built-in test runner, so nothing needs to be installed.
// Run them with:  npm test
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  shuffle,
  isCorrect,
  calculatePercentage,
  getGrade,
  getFeedbackMessage,
  formatTimeLeft,
  createQuiz,
  answerQuestion,
  isQuizFinished,
} = require("../src/quiz.js");

test("isCorrect returns true for the right answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 2), true);
});

test("isCorrect returns false for a wrong answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 0), false);
});

test("calculatePercentage rounds to a whole number", () => {
  assert.equal(calculatePercentage(2, 3), 67);
});

test("calculatePercentage returns 0 when there are no questions", () => {
  assert.equal(calculatePercentage(0, 0), 0);
});

test("shuffle keeps every item and does not change the original array", () => {
  const original = [1, 2, 3, 4, 5];
  const result = shuffle(original);
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
});

test("formatTimeLeft formats remaining seconds with the timer icon", () => {
  assert.equal(formatTimeLeft(15), "⏱ 15s");
  assert.equal(formatTimeLeft(12), "⏱ 12s");
  assert.equal(formatTimeLeft(0), "⏱ 0s");
});

test("getFeedbackMessage returns the expected encouragement for each grade", () => {
  assert.equal(getFeedbackMessage("A"), "Excellent work! You're a quiz master!");
  assert.equal(getFeedbackMessage("B"), "Good job! Keep up the great work!");
  assert.equal(getFeedbackMessage("C"), "Not bad! Keep practicing and you'll get there!");
  assert.equal(getFeedbackMessage("Keep practicing"), "Keep practicing and you'll improve!");
});

test("getGrade gives an A for exactly 90%", () => {
  assert.equal(getGrade(90), "A");
});

test("getGrade gives a B for exactly 75%", () => {
  assert.equal(getGrade(75), "B");
});

test("getGrade gives a C for exactly 50%", () => {
  assert.equal(getGrade(50), "C");
});

test("createQuiz produces a fresh quiz state from the provided questions", () => {
  const questions = [{ question: "Q1", options: ["A", "B", "C", "D"], answer: 1 }, { question: "Q2", options: ["A", "B", "C", "D"], answer: 0 }];
  const original = questions.map((question) => ({ ...question }));

  const state = createQuiz(questions);

  assert.equal(state.current, 0);
  assert.equal(state.score, 0);
  assert.equal(state.questions.length, 2);
  assert.deepEqual(original, questions);
});

test("answerQuestion updates score without mutating the input state and reports whether the choice is correct", () => {
  const initialState = { questions: [{ question: "Q1", options: ["A", "B", "C", "D"], answer: 1 }], current: 0, score: 0 };

  const result = answerQuestion(initialState, 1);

  assert.equal(result.correct, true);
  assert.equal(result.state.score, 1);
  assert.equal(initialState.score, 0);
  assert.equal(initialState.current, 0);
});

test("isQuizFinished returns true only when all questions have been answered", () => {
  const state = { questions: [{ question: "Q1", options: ["A", "B", "C", "D"], answer: 1 }], current: 0, score: 0 };

  assert.equal(isQuizFinished(state), false);
  assert.equal(isQuizFinished({ ...state, current: 1 }), true);
});
