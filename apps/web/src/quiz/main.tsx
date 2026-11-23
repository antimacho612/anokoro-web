import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../ui/themes.css";
import "../ui/base.css";
import { persistNewsSeen, restoreNewsSeen } from "../kit/info/news-seen.ts";
import type { StorageAccess } from "../kit/notepad/draft-storage.ts";
import { kitStore } from "../kit/store.ts";
import { syncUiTheme } from "../kit/ui-theme/ui-theme-sync.ts";
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
