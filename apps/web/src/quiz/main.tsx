import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../ui/themes.css";
import "../ui/base.css";
import { QuizApp } from "./QuizApp.tsx";
import { localDateOf, parseQuizRequest, quizUrl } from "./quiz-params.ts";
import { randomSeed, startQuiz } from "./quiz-start.ts";

const initial = startQuiz(parseQuizRequest(window.location.search), {
  randomSeed,
  today: localDateOf(new Date()),
});
if (initial.urlSeed !== null) {
  const url = quizUrl(import.meta.env.BASE_URL, { seed: initial.urlSeed, topic: initial.topic });
  window.history.replaceState(null, "", url);
}

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <QuizApp initial={initial} />
    </StrictMode>,
  );
}
