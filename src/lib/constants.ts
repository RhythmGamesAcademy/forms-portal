// -- Character limits --

export const CHAR_LIMITS = {
  selfAppeal: 400,
  textDefault: 200,
  reference: 100,
} as const;

// -- List limits --

export const MAX_LIST_ITEMS = 5;

// -- Session count range --

export const SESSION_MIN = 3;
export const SESSION_MAX = 15;

// -- Placeholders --

export const PLACEHOLDERS = {
  instructor: {
    name: "例: 山田 太郎",
    age: "例: 25",
    discordId: "例: username",
    xId: "例: @username",
    field: "例: 音楽ゲームの歴史",
    fieldReason:
      "例: 音楽ゲームの歴史的発展を体系的に整理し、初学者にもわかりやすく伝えることで、ジャンル全体の理解を深める講義を開講したいと考えました。",
    achievement: "例: 某音楽ゲーム大会で優勝",
    selfAppeal:
      "例: 10年以上音楽ゲームに携わり、大会運営や攻略記事執筆の経験があります。初心者から上級者まで、幅広い層に向けた講義を展開できます。",
  },
  course: {
    subjectName: "例: 音楽ゲーム概論",
    instructorName: "例: 山田 太郎",
    sessionCount: "3~15",
    overview:
      "例: 音楽ゲームの基本的な概念と歴史を学び、各ジャンルの特徴を理解する入門講義です。",
    goal: "例: 主要な音楽ゲームの歴史的変遷を説明できるようになる",
    approach:
      "例: 各回テーマを設定し、動画資料を交えながらディスカッション形式で進めます。",
    references: "例: 参考サイトURL、書籍名など",
  },
} as const;
