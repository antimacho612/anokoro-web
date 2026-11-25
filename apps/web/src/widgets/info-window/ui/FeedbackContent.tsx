import {
  DISCUSSIONS_URL,
  newIssueUrl,
  type IssueTemplate,
  type Screen,
} from "../../../shared/config/index.ts";
import { useKit } from "../../../entities/kit-state/index.ts";

const ISSUE_KINDS: readonly { template: IssueTemplate; label: string; description: string }[] = [
  {
    template: "era-accuracy",
    label: "考証の指摘",
    description: "「この年にこれはなかった」「当時はこうだった」など、年代の再現の誤り。",
  },
  {
    template: "bug",
    label: "不具合の報告",
    description: "動かない、表示が崩れる、思った動きと違う、など。",
  },
  {
    template: "feature",
    label: "要望",
    description: "ほしい機能、パーツ、見本サイト、解説の題材など。",
  },
];

export function FeedbackContent({ screen }: { screen: Screen }) {
  const year = useKit((s) => s.year);
  return (
    <>
      <h3>ご意見・不具合報告</h3>
      <p>
        報告や要望は GitHub の Issue で受け付けています。投稿には GitHub
        のアカウントが要ります。リンク先には、いま選んでいる年（{year}
        年）と画面の名前だけを入れておきます。書いた HTML は送りません。
      </p>

      <h4>Issue を書く</h4>
      <ul>
        {ISSUE_KINDS.map((kind) => (
          <li key={kind.template}>
            <a
              href={newIssueUrl(kind.template, { year, screen })}
              target="_blank"
              rel="noopener noreferrer"
            >
              {kind.label}
            </a>
            ：{kind.description}
          </li>
        ))}
      </ul>

      <h4>みんなで話す</h4>
      <p>
        思い出話、質問、考証の相談は
        <a href={DISCUSSIONS_URL} target="_blank" rel="noopener noreferrer">
          ディスカッション
        </a>
        へどうぞ。
      </p>
    </>
  );
}
