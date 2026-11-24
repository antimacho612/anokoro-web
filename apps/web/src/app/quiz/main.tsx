import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../shared/styles/themes.css";
import "../../shared/styles/base.css";
import { persistNewsSeen, restoreNewsSeen } from "../../features/news/index.ts";
import type { StorageAccess } from "../../shared/lib/index.ts";
import { kitStore } from "../../entities/kit-state/index.ts";
import { syncUiTheme } from "../lib/ui-theme-sync.ts";
import { QuizApp } from "../../pages/quiz/index.ts";
import { localDateOf, parseQuizRequest, quizUrl } from "../../shared/routes/index.ts";
import { randomSeed, startQuiz } from "../../pages/quiz/index.ts";

const initial = startQuiz(parseQuizRequest(window.location.search), {
  randomSeed,
  today: localDateOf(new Date()),
});
if (initial.urlSeed !== null) {
  const url = quizUrl(import.meta.env.BASE_URL, { seed: initial.urlSeed, topic: initial.topic });
  window.history.replaceState(null, "", url);
}

const storage: StorageAccess = () => window.localStorage;
kitStore.getState().setYear(initial.question.year);
syncUiTheme(kitStore, document.documentElement);
restoreNewsSeen(kitStore, storage);
persistNewsSeen(kitStore, storage);

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <QuizApp initial={initial} />
    </StrictMode>,
  );
}
