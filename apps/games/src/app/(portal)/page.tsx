type Game = {
  path: string;
  name: string;
  description: string;
};

// ゲームを足したらここにも足す。
const GAMES: readonly Game[] = [
  {
    path: "/klondike",
    name: "Klondike",
    description: "定番のソリティア。カードをドラッグして並べる",
  },
  {
    path: "/tetris",
    name: "Tetris",
    description: "落ちてくるブロックを揃えて消す",
  },
  {
    path: "/english-vocabulary-quiz",
    name: "English Vocabulary Quiz",
    description: "英文の意味に合う英単語を 4 択で答える。1 回 10 問",
  },
  {
    path: "/ball-bounce",
    name: "BounceLab",
    description: "摩擦や重力を変えながらボールを跳ねさせる物理シミュレーション",
  },
  {
    path: "/2048",
    name: "2048",
    description:
      "同じ数字のタイルをくっつけて 2048 を目指す。スワイプでも遊べる",
  },
  {
    path: "/minesweeper",
    name: "マインスイーパー",
    description: "数字を手がかりに地雷を避けてマスを開ける。長押しで旗",
  },
  {
    path: "/snake",
    name: "Snake",
    description: "餌を食べて伸びる蛇を、壁と自分にぶつけないように操る",
  },
];

export default function PortalPage() {
  return (
    <main>
      <header>
        <h1>a2ito games</h1>
        <p>ブラウザですぐ遊べる小さなゲーム集。ログインは要りません。</p>
      </header>

      <ul className="apps">
        {GAMES.map((game) => (
          <li key={game.path}>
            {/* ゲームごとに root layout が違い、どのみちフルリロードになるため <a> で遷移する */}
            <a href={game.path}>
              <span className="name">{game.name}</span>
              <span className="desc">{game.description}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
