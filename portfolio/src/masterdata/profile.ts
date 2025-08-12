// ================================================================
// Personal Profile Master Data
// ================================================================
// このファイルはサイトの表示順に整理されています
// 1. 型定義
// 2. 個人プロフィール情報 (personalInfo)
// 3. 各セクションのデータ (サイト表示順)
// 4. 各セクションのUIテキスト
// ================================================================

// ================================================================
// 型定義
// ================================================================
export interface Project {
  id: string;
  title: string;
  description: string;
  year: string;
  month?: number;
  tags: string[];
  github: string | null;
  demo?: string;
  image?: string;
  modalImage?: string;
  isOngoing?: boolean;
  program?: string;
  highlights?: string[];
  team?: number;
  detailedDescription?: string;
  features?: string[];
  challenges?: Array<{
    problem: string;
    solution: string;
  }>;
}

// ================================================================
// 個人プロフィール情報 (全セクション共通)
// ================================================================
export const personalInfo = {
  // 基本情報
  name: {
    ja: '品川朝陽',
    en: 'Shinagawa Asahi',
    nickname: 'RarkHopper',
  },
  birthDate: '2003-12-18',
  age: 21,
  university: '北海道情報大学',
  department: 'システム情報学科',
  grade: 3,
  location: '北海道',

  // 自己紹介
  bio: {
    short: '北海道のプログラマーを目指している大学生です。',
    long: '「なんとなく面白い」という感覚を大切にしており、ジャンルを問わず自分がピンときたアイディアをカタチにしていっています。',
  },

  // 連絡先
  contact: {
    github: 'https://github.com/RarkHopper',
    x: 'https://x.com/rRarkHopper',
    email: 'rarkhopper@gmail.com',
  },

  // 関連プログラム・活動
  programs: [
    {
      id: 'mitou',
      name: '未踏IT',
      year: '2025',
      logo: '/logo/mitouit.png',
      url: 'https://www.ipa.go.jp/jinzai/mitou/it/2025/gaiyou-ig-2.html',
    },
    {
      id: 'shinsetsu',
      name: '新雪プログラム',
      year: '2024',
      logo: '/logo/shinsetsu.png',
      url: 'https://shinsetsu.hokkaido.jp/koubo/2024_result',
    },
    {
      id: '100program',
      name: '100Program',
      role: 'アラムナイメンター',
      logo: '/logo/100program.png',
      url: 'https://100program.jp',
    },
    {
      id: 'hiu',
      name: '北海道情報大学',
      logo: '/logo/hiu.png',
      url: 'https://www.do-johodai.ac.jp/topics/9693689/',
    },
  ],
} as const;

// ================================================================
// セクション1: Hero (src/components/Hero.tsx)
// ================================================================
// HeroセクションはpersonalInfoのデータのみ使用

// ================================================================
// セクション1: Timeline (src/components/Timeline.tsx)
// ================================================================
export const timeline = [
  {
    year: '2020',
    month: 4,
    age: 16,
    title: 'プログラミング開始',
    description: 'MinecraftのPocketMine-MPでPHPを学ぶ',
  },
  {
    year: '2022',
    month: 4,
    age: 18,
    title: '北海道情報大学',
    description: '大学へ進学',
  },
  {
    year: '2024',
    month: 3,
    age: 20,
    title: '100Program',
    description: 'ファイナリスト・最多オーディエンス賞',
  },
  {
    year: '2024',
    month: 10,
    age: 20,
    title: '新雪プログラム',
    description: 'マチョプリ！プロジェクトで採択',
  },
  {
    year: '2025',
    month: 6,
    age: 21,
    title: '未踏IT採択',
    description: 'プログラミング教育支援システムで採択',
  },
] as const;

// ================================================================
// セクション4: Projects (src/components/Projects.tsx)
// ================================================================
export const projects: Project[] = [
  {
    id: 'mitou-education',
    title: 'プログラミング教育支援システム',
    description:
      '生徒の興味や理解度に合わせて教材をリアルタイムに生成・再構成するプログラミング教育支援システム。RAG構成とナレッジグラフで興味領域と学習内容を結びつける',
    year: '2025',
    month: 6,
    program: '未踏IT',
    isOngoing: true,
    tags: ['EdTech', 'FastAPI', 'Neo4j', 'Meilisearch', 'React', 'RAG'],
    highlights: ['未踏IT 2025年度 採択'],
    image: '/projects/mitoupj.png',
    github: null,
    team: 2,
    detailedDescription: `従来のプログラミング教育が抱える「画一的なカリキュラム」や「生徒の興味との乖離」という課題を解消するため、AIを活用して生徒ごとに学習体験を動的に最適化するシステム。
生徒の興味・理解度・進捗データをもとに、RAG構成で教材を生成し、ナレッジグラフで興味領域と技術領域の関連を明示化。これにより、初学者でも自分の興味とプログラミングの結びつきを実感しやすく、学びのモチベーションを継続できる。`,
    features: [
      'RAG構成による動的教材生成',
      '興味に基づいたプロジェクト生成',
      '習熟度に応じた適切な難易度調整',
    ],
    challenges: [
      {
        problem: '興味や趣味領域とITの接続の不透明性',
        solution: '習熟度と興味に基づいたPBLによる、紐づけを明示化する学習体験の実装',
      },
      {
        problem: '何が興味があるのかがわからない初学者',
        solution: '段階的にプロジェクトを経験することによる感性の蓄積',
      },
    ],
  },
  {
    id: 'uwb-survival',
    title: 'UWB電子サバイバルゲーム',
    description:
      'UWB測位・姿勢推定・画像処理を用い、弾を使わず安全に遊べる対戦型電子サバゲー。リアルな弾道計算と被弾判定に加え、観戦・リプレイ機能を備える。',
    detailedDescription: `
    従来のサバゲーが抱える「遊べる場所が少ない」「痛い」「子供が遊べない」「ズルができる」といった課題を解消するために開発した、電子的な被弾判定システムを用いたサバイバルゲーム。
銃型デバイスにはUWB測位、IMUによる姿勢推定、銃口カメラによる映像取得を搭載し、メッシュネットワークを通じてサーバーに送信。
サーバー側でリアルな弾道計算と被弾判定を行い、詳細な被弾箇所確認や観戦・リプレイ機能も提供する。
場所を選ばず、安全かつ公平に遊べるだけでなく、イベントによる地域活性化、運動機会の提供、STEM教育の実践にもつながる。
教育用途としては、VPLを用いたゲームルールや銃性能のカスタマイズを可能にし、遊びを通したアクティブラーニングを促進する。`,
    year: '2025',
    month: 4,
    team: 5,
    program: '北海道情報大学 学生チャレンジプログラム',
    isOngoing: true,
    tags: ['位置推定', 'リアルタイム対戦', 'UWB', 'Unity', 'OpenCV', 'Raspberry Pi'],
    highlights: [],
    image: '/projects/project-placeholder-3.svg',
    github: null,
  },
  {
    id: 'taruwoshiru',
    title: '酒造樽のトレーサビリティ管理システム',
    description:
      '北海道産ミズナラ樽の受け渡しを管理し、トレーサビリティを担保するシステム。樽詰めや取り出しの履歴も管理できる。',
    detailedDescription: `
    国産ウイスキー需要の高まりとともに注目される北海道産ミズナラ樽の価値を高めるため、製造後の受け渡しや樽詰め・取り出しの履歴を一元管理するWebシステム。
前に何が入っていた樽かという情報はウイスキーの品質や風味に直結するため、この履歴を担保することで樽の価値を保証する。
ミチタル株式会社との共同開発案件。`,
    year: '2025',
    month: 4,
    team: 5,
    program: 'ミチタル株式会社',
    isOngoing: false,
    tags: ['React', 'Django'],
    highlights: [],
    image: '/projects/taruwoshiru.png',
    modalImage: '/projects/taruwoshiru-modal.png',
    github: null,
  },
  {
    id: 'machopri',
    title: 'マチョプリ！- 3D身体撮影システム',
    description:
      '3Dスキャンで筋トレ成果を記録し、3D Gaussian Splattingで立体的かつ“マチョ盛り”に可視化する。',
    detailedDescription: `
    筋トレのモチベーション向上を目的に、40台のWebカメラを配置したブース型撮影機で全身を同時撮影し、3D Gaussian Splattingで立体再構築する。
新雪プログラム採択案件。`,
    year: '2024',
    month: 10,
    team: 4,
    program: '新雪プログラム',
    isOngoing: false,
    tags: ['3DGS', 'NeRF Studio', 'Celery', 'Bodypix', 'FastAPI', 'Raspberry Pi'],
    highlights: ['新雪プログラム 2024年度 採択'],
    image: '/projects/machopuri.png',
    modalImage: '/projects/machopuri-modal.png',
    github: null,
  },
  {
    id: 'hiu-syokken',
    title: '食券自動発行システム',
    description: '学食の混雑緩和を目的としたQRコード式食券自動発行システム。',
    detailedDescription: `
    授業の過程で作成したシステムで、他の学生がメンテしやすいように生HTMLにLitを組み込んだわかりやすい実装にこだわった。
レシートプリンタとNode.jsを連携させ、QRコード読み取り後すぐに印刷できる。`,
    year: '2024',
    team: 6,
    isOngoing: false,
    tags: ['Express', 'Lit', 'MariaDB', 'Axum'],
    highlights: [],
    image: '/projects/hiusyokken.png',
    modalImage: '/projects/hiusyokken-modal.png',
    github: null,
    features: ['食券を購入する機能', 'QRコードを読み取り、食券を発行する機能'],
  },
  {
    id: 'gps-reminder',
    title: 'gpsでリマインドしてくれる日用品残量チェッカー',
    description:
      '位置情報を活用し、必要な日用品を「買えるその瞬間」にリマインドする。100Program 5期でオーディエンス賞最多受賞。',
    detailedDescription: `
    ユーザーの現在地と日用品の消耗度をもとに、購入可能な店舗が近いときだけリマインドを送るスマホアプリ。
日用品がなくなった際、多くの人はネットですぐに購入するのではなく、“ついで”に買おうとする。
しかし、その多くは買い忘れてしまうため、結果的に買い損ねてしまう。
そこで、GPSとスケジューリングを組み合わせ、買い忘れを防ぐ仕組みを実装した。
100Program 5期でファイナリストおよび最多オーディエンス賞を受賞。`,
    year: '2024',
    month: 3,
    team: 3,
    program: '100Program',
    isOngoing: false,
    tags: ['Capacitor', 'Next.js', 'GPS'],
    highlights: ['100Program ファイナリスト', 'オーディエンス賞最多'],
    image: '/projects/gpsremind.png',
    modalImage: '/projects/gpsremind-modal.png',
    github: null,
    features: ['日用品の消耗度の自動計算', '必要な日用品を売っている店舗が近づいたらリマインド'],
  },
  {
    id: 'wakaran-sns',
    title: 'ワイらのための「わからない」を楽しむSNS',
    description: '成果発表型ではなく“わからない”を共有して安心できるSNS。',
    detailedDescription: `質問サイトや成果共有SNSでは拾いきれない「説明しづらい疑問」や「学びの途中の不安」を安心して投稿できるSNS。
投稿には「わかる投稿」「わからない投稿」などの種類を設定でき、ユーザー同士で共感や意見交換ができる。
100Program 5期ファイナリスト案件。`,
    year: '2024',
    month: 3,
    team: 3,
    program: '100Program',
    isOngoing: false,
    tags: ['Next.js', 'PostgreSQL'],
    highlights: ['100Program ファイナリスト'],
    image: '/projects/wakaransns.png',
    modalImage: '/projects/wakaransns-modal.png',
    github: null,
    features: [
      'わからない投稿 / スーパーわからない投稿',
      'わかる投稿 / スーパーわかる投稿',
      'わからない分析',
    ],
  },
  {
    id: 'fallendead',
    title: 'FallenDead',
    description: '1,000体のゾンビが襲いかかるモードと、銃でのPvPを実装した統合版Minecraftサーバー',
    detailedDescription: `最大1,000体のゾンビがプレイヤーを襲うサバイバルモードと、マップ上3拠点を奪い合う2チーム制PvPを実装したMinecraftサーバー。
PocketMine-MP用の独自プラグインを開発し、30人以上の同時接続に対応。
A*アルゴリズムによるゾンビ経路探索が重かったため、ルート短縮やスタックゾンビ削除のためのロケットランチャーゾンビを実装し、ゲーム性とパフォーマンスを両立させた。
初めてのプロジェクトで、サーバーの立ち上げからプラグイン開発、運営までを経験。`,
    year: '2020-2023',
    isOngoing: false,
    tags: ['Minecraft', 'PocketMine-MP', 'SQLite', 'Linux'],
    highlights: [],
    image: '/projects/fallendead.png',
    modalImage: '/projects/fallendead-modal.png',
    github: 'https://github.com/FallenDeadNetwork',
    features: [
      '1,000体のゾンビから逃げ延び、一定時間生存を目指すモード',
      'マップ上の3つの領域を、2つのチームで占領するPvP',
    ],
  },
] as const;

// ================================================================
// セクション5: Skills (src/components/Skills.tsx, SkillsAndExperience.tsx)
// ================================================================
export const skillCategories = [
  {
    title: 'Languages',
    icon: '/skill-icon.svg',
    skills: [
      { name: 'Python', years: 3 },
      { name: 'TypeScript', years: 3 },
      { name: 'JavaScript', years: 4 },
      { name: 'PHP', years: 5 },
      { name: 'Go', years: 1 },
      { name: 'Java', years: 1 },
    ],
  },
  {
    title: 'Frontend',
    icon: '/skill-icon.svg',
    skills: [
      { name: 'React', years: 3 },
      { name: 'Next.js', years: 2 },
      { name: 'Vue.js', years: 1 },
      { name: 'A-Frame', years: 1 },
      { name: 'lit', years: 1 },
    ],
  },
  {
    title: 'Backend',
    icon: '/skill-icon.svg',
    skills: [
      { name: 'FastAPI', years: 3 },
      { name: 'Express', years: 2 },
      { name: 'Laravel', years: 3 },
      { name: 'Django', years: 1 },
      { name: 'Slim', years: 2 },
    ],
  },
  {
    title: 'Database',
    icon: '/skill-icon.svg',
    skills: [
      { name: 'PostgreSQL', years: 2 },
      { name: 'MySQL', years: 3 },
      { name: 'Redis', years: 2 },
      { name: 'Neo4j', years: 1 },
      { name: 'Meilisearch', years: 1 },
    ],
  },
  {
    title: 'DevOps',
    icon: '/skill-icon.svg',
    skills: [
      { name: 'Docker', years: 3 },
      { name: 'Git', years: 4 },
      { name: 'Kubernetes', years: 1 },
      { name: 'GCP', years: 1 },
      { name: 'Cloudflare', years: 2 },
      { name: 'Grafana', years: 1 },
      { name: 'Datadog', years: 1 },
    ],
  },
  {
    title: 'Others',
    icon: '/skill-icon.svg',
    skills: [
      { name: 'RAG', years: 2 },
      { name: 'Sentence-Transformers', years: 2 },
      { name: 'OpenCV', years: 2 },
      { name: 'Gaussian Splatting', years: 1 },
    ],
  },
] as const;

// ================================================================
// セクション6: Experience (src/components/Experience.tsx, SkillsAndExperience.tsx)
// ================================================================
export const experience = {
  work: [
    {
      title: '株式会社infiniteloop',
      role: '長期インターン',
      period: '2023年〜現在',
    },
    {
      title: '株式会社コロプラ',
      role: '2 Weeks インターン',
      period: '2025年',
    },
    {
      title: 'プログラミングスクール',
      role: '講師',
      period: '2024年〜現在',
    },
  ],
  awards: [
    {
      title: '未踏IT人材発掘・育成事業',
      role: '採択',
      period: '2025年',
    },
    {
      title: '新雪プログラム',
      role: '採択・修了',
      period: '2024年',
    },
    {
      title: '東北大学基金 ともプロ！',
      role: '採択',
      period: '2024年',
    },
    {
      title: '北海道情報大学 学生チャレンジプログラム',
      role: '採択',
      period: '2025年',
    },
    {
      title: '北海道情報大学 ビジネスプレゼンテーションコンテスト',
      role: 'アイディア賞',
      period: '2024年',
    },
    {
      title: '100Program 5期',
      role: '2チーム同時ファイナリスト',
      period: '2024年',
    },
  ],
  activities: [
    {
      title: '100Program 8期',
      role: 'アラムナイメンター',
      period: '2025年',
    },
    {
      title: 'PocketMine-MPサーバ運営',
      role: '管理者・プラグイン開発者',
      period: '2019年〜2024年',
    },
  ],
} as const;

// ================================================================
// セクション7: Contact (src/components/Contact.tsx)
// ================================================================
// Contactセクションはcontact情報とUIテキストを使用

// ================================================================
// UIテキスト定義（サイト依存のテキスト）
// ================================================================
export const uiTexts = {
  // Experience section text
  experience: {
    title: 'Experience & Activities',
    subtitle: 'インターン、採択プログラム、受賞歴など',
    categories: {
      work: 'Work Experience',
      awards: 'Awards & Programs',
      activities: 'Activities',
    },
  },

  // Contact section text
  contact: {
    title: 'Get In Touch',
    subtitle: 'プロジェクトのご相談、技術的な質問、その他お気軽にご連絡ください',
    cardTitle: 'Contact Information',
    cardDescription: '以下のチャンネルからお気軽にご連絡ください',
    footer: {
      text: '興味深いプロジェクトやコラボレーションの機会があればぜひお声がけください！',
      highlights: null,
    },
  },
} as const;
