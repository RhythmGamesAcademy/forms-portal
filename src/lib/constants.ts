// -- Character limits --

export const CHAR_LIMITS = {
  // 講師登録申請
  name: 15,
  age: 3,
  discordId: 33,
  xId: 16,
  field: 30,
  fieldReason: 100,
  achievement: 30,
  selfAppeal: 150,
  subjectName: 30,
  instructorName: 15,
  overview: 150,
  goal: 30,
  approach: 100,
  reference: 100,
} as const;

// -- List limits --

export const MAX_LIST_ITEMS = 6;

// -- Session count range --

export const SESSION_MIN = 3;
export const SESSION_MAX = 15;

// -- Filename constants --

export const FILENAME_FALLBACK = "無題";

// -- Placeholders --

export const PLACEHOLDERS = {
  instructor: {
    name: "例: tzug",
    age: "例: 18",
    discordId: "例: #username",
    xId: "例: @username",
    field: "例: 情報工学，Arcaea",
    fieldReason:
      "例: 音楽ゲームに対して情報工学の技術を用いたり，音楽ゲームの内部構造を解き明かしたりする楽しみを教えたいため．また，Arcaeaを情報学的視点から見るため．",
    achievement: "例:「なし」，「基本情報技術者試験」，「Arcaea ポテンシャル12.71」",
    selfAppeal:
      "例: 工業系の学校で情報工学系の学科に所属しており現在3年生です．通算GPAが3.5，学科内順位が２位ですので相応の学力を有していると考えています．",
  },
  course: {
    subjectName: "例: 音ゲーマーのための画像処理入門",
    instructorName: "例: tzug",
    sessionCount: "3～15",
    overview:
      "例: PythonでOpenCVを用いた画像処理について学ぶ．行列の基本計算から線形変換までを一通り取り扱った後，OpenCVを用いた画像処理について実践形式で学んでいく（PC必須）．",
    goal: "例: 譜面研究において画像処理を活かすことが出来る",
    approach:
      "例: 各回テーマを設定し，毎週火曜日にそのテーマに沿った講義資料PDFをGitHubにアップロードします．また，毎回小テストを行い，受講者が前回の講義でどこで躓いていたかを把握し，それを補完する資料を同様に掲載します．",
    references: "例: 参考サイトURL、書籍名など",
  },
} as const;
