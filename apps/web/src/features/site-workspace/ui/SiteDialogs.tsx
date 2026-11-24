import {
  SITE_KINDS,
  SITE_KIND_IDS,
  YEARS,
  isYear,
  type SiteKindId,
  type Year,
} from "@anokoro/era-data";
import {
  MAX_SITE_NAME_LENGTH,
  SITE_CATEGORIES,
  SITE_CATEGORY_IDS,
  isSiteCategoryId,
  type SiteCategoryId,
} from "@anokoro/shared";
import { useId, useState, type FormEvent } from "react";
import { BLANK, INDEX_PAGE } from "../../../entities/site/index.ts";
import { loadTemplatePages } from "../../../entities/sample/index.ts";
import { Dialog, dialogClass } from "../../../shared/ui/dialog/index.ts";
import type { NewSite, SiteInfo } from "../model/workspace.ts";
import styles from "./SiteDialogs.module.css";

/** その年に、まだその種類のサイトがない */
export function kindNotYet(kind: SiteKindId, year: Year): boolean {
  return year < SITE_KINDS[kind].availableFrom;
}

type KindFieldProps = {
  year: Year;
  value: SiteKindId;
  onChange: (kind: SiteKindId) => void;
  isExistingSite: boolean;
};

function KindField({ year, value, onChange, isExistingSite }: KindFieldProps) {
  const name = useId();
  return (
    <fieldset className={styles.kinds}>
      <legend>サイトの種類</legend>
      {SITE_KIND_IDS.map((kind) => {
        const notYet = !isExistingSite && kindNotYet(kind, year);
        return (
          <label key={kind} className={notYet ? styles.kindNotYet : undefined}>
            <input
              type="radio"
              name={name}
              value={kind}
              checked={value === kind}
              disabled={notYet}
              onChange={() => onChange(kind)}
            />
            {SITE_KINDS[kind].label}
            {notYet && <small>（{SITE_KINDS[kind].availableFrom} 年から）</small>}
          </label>
        );
      })}
    </fieldset>
  );
}

function CategoryField({
  value,
  onChange,
}: {
  value: SiteCategoryId;
  onChange: (category: SiteCategoryId) => void;
}) {
  const id = useId();
  return (
    <div className={dialogClass.field}>
      <label htmlFor={id}>カテゴリ</label>
      <select
        id={id}
        value={value}
        onChange={(e) => {
          const next = e.currentTarget.value;
          if (isSiteCategoryId(next)) onChange(next);
        }}
      >
        {SITE_CATEGORY_IDS.map((c) => (
          <option key={c} value={c}>
            {SITE_CATEGORIES[c]}
          </option>
        ))}
      </select>
    </div>
  );
}

function NameField({ value, onChange }: { value: string; onChange: (name: string) => void }) {
  const id = useId();
  return (
    <div className={dialogClass.field}>
      <label htmlFor={id}>サイト名</label>
      <input
        id={id}
        type="text"
        className="sunken"
        value={value}
        maxLength={MAX_SITE_NAME_LENGTH}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    </div>
  );
}

type NewSiteDialogProps = {
  initialYear: Year;
  onCreate: (site: NewSite) => void;
  onCancel: () => void;
};

export function NewSiteDialog({ initialYear, onCreate, onCancel }: NewSiteDialogProps) {
  const [name, setName] = useState("マイホームページ");
  const [year, setYear] = useState<Year>(initialYear);
  const [genre, setGenre] = useState<SiteKindId>("personal");
  const [category, setCategory] = useState<SiteCategoryId>("diary");
  const [content, setContent] = useState<"template" | "blank">("template");
  const [isCreating, setIsCreating] = useState(false);
  const yearId = useId();
  const contentName = useId();
  const trimmed = name.trim();

  const changeYear = (next: Year): void => {
    setYear(next);
    if (kindNotYet(genre, next)) setGenre("personal");
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (trimmed === "" || isCreating) return;
    setIsCreating(true);
    const pages =
      content === "template"
        ? loadTemplatePages(genre, year)
        : Promise.resolve([{ path: INDEX_PAGE, html: BLANK }]);
    void pages.then(
      (loaded) => onCreate({ name: trimmed, year, genre, category, pages: loaded }),
      () => setIsCreating(false),
    );
  };

  return (
    <Dialog title="新しいサイト" onClose={onCancel} size="wide">
      <form onSubmit={handleSubmit}>
        <div className={dialogClass.body}>
          <NameField value={name} onChange={setName} />
          <div className={dialogClass.field}>
            <label htmlFor={yearId}>年</label>
            <select
              id={yearId}
              value={year}
              onChange={(e) => {
                const next = Number(e.currentTarget.value);
                if (isYear(next)) changeYear(next);
              }}
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y} 年
                </option>
              ))}
            </select>
          </div>
          <KindField year={year} value={genre} onChange={setGenre} isExistingSite={false} />
          <CategoryField value={category} onChange={setCategory} />
          <fieldset className={styles.kinds}>
            <legend>中身</legend>
            <label>
              <input
                type="radio"
                name={contentName}
                checked={content === "template"}
                onChange={() => setContent("template")}
              />
              その種類と年らしいテンプレート
            </label>
            <label>
              <input
                type="radio"
                name={contentName}
                checked={content === "blank"}
                onChange={() => setContent("blank")}
              />
              白紙
            </label>
          </fieldset>
        </div>
        <div className={dialogClass.buttons}>
          <button type="submit" className="btn" disabled={trimmed === "" || isCreating}>
            作成
          </button>
          <button type="button" className="btn" onClick={onCancel}>
            キャンセル
          </button>
        </div>
      </form>
    </Dialog>
  );
}

type SiteInfoDialogProps = {
  info: SiteInfo;
  onSave: (info: Omit<SiteInfo, "year">) => void;
  onCancel: () => void;
};

/** サイトのプロパティ。年はタイムマシンで変える */
export function SiteInfoDialog({ info, onSave, onCancel }: SiteInfoDialogProps) {
  const [name, setName] = useState(info.name);
  const [genre, setGenre] = useState<SiteKindId>(info.genre);
  const [category, setCategory] = useState<SiteCategoryId>(info.category);
  const trimmed = name.trim();

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (trimmed !== "") onSave({ name: trimmed, genre, category });
  };

  return (
    <Dialog title={`${info.name} のプロパティ`} onClose={onCancel} size="wide">
      <form onSubmit={handleSubmit}>
        <div className={dialogClass.body}>
          <NameField value={name} onChange={setName} />
          <p className="hint">サイトの年（{info.year} 年）は、タイムマシンで変えられます。</p>
          <KindField year={info.year} value={genre} onChange={setGenre} isExistingSite />
          <CategoryField value={category} onChange={setCategory} />
        </div>
        <div className={dialogClass.buttons}>
          <button type="submit" className="btn" disabled={trimmed === ""}>
            OK
          </button>
          <button type="button" className="btn" onClick={onCancel}>
            キャンセル
          </button>
        </div>
      </form>
    </Dialog>
  );
}

type PageNameDialogProps = {
  title: string;
  initial: string;
  /** 使えない名前なら理由を返す */
  validate: (path: string) => string | null;
  normalize: (input: string) => string;
  onSubmit: (path: string) => void;
  onCancel: () => void;
};

export function PageNameDialog({
  title,
  initial,
  validate,
  normalize,
  onSubmit,
  onCancel,
}: PageNameDialogProps) {
  const [value, setValue] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const id = useId();

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    const path = normalize(value);
    const problem = validate(path);
    if (problem) setError(problem);
    else onSubmit(path);
  };

  return (
    <Dialog title={title} onClose={onCancel}>
      <form onSubmit={handleSubmit}>
        <div className={dialogClass.body}>
          <div className={dialogClass.field}>
            <label htmlFor={id}>ファイル名</label>
            <input
              id={id}
              type="text"
              className="sunken"
              value={value}
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => setValue(e.currentTarget.value)}
            />
          </div>
          {error && (
            <p className={dialogClass.error} role="alert">
              {error}
            </p>
          )}
        </div>
        <div className={dialogClass.buttons}>
          <button type="submit" className="btn">
            OK
          </button>
          <button type="button" className="btn" onClick={onCancel}>
            キャンセル
          </button>
        </div>
      </form>
    </Dialog>
  );
}
