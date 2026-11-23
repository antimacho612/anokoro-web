export {
  ANSWER_ATTRIBUTE,
  assembleQuiz,
  listSlots,
  slotKindOf,
  slotsFor,
  type AssembleOptions,
  type AssembledQuiz,
  type Placement,
  type QuizSlot,
} from "./assemble.ts";
export { pageAvailableIn, trickAvailableIn, trickDisplayable } from "./eligibility.ts";
export {
  DISPLAYABLE_SHARE,
  LINE_QUESTION_SHARE,
  LINE_SPEEDUP_MIN,
  futureLinesFor,
  generateQuestion,
  quizTopics,
  type GenerateOptions,
  type GenerateResult,
  type LineQuestion,
  type Question,
  type TrickQuestion,
} from "./generate.ts";
export {
  INITIAL_PROGRESS,
  MAX_TRIES,
  answerFacts,
  judge,
  pickKey,
  remainingTries,
  type AnswerFacts,
  type JudgeOutcome,
  type JudgeResult,
  type QuizPick,
  type QuizProgress,
} from "./judge.ts";
export { QUIZ_PAGES } from "./pages.ts";
export { QUIZ_TRICKS } from "./tricks.ts";
export type { AttributeSlotTag, QuizPage, QuizTrick, SlotKind, TrickInsert } from "./types.ts";
