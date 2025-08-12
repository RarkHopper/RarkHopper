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
      '生徒の興味に基づいて教材を動的に生成・再構成するシステム。RAG構成とナレッジグラフを活用し、興味に基づいた学習体験を実現',
    year: '2025',
    month: 6,
    program: '未踏IT',
    isOngoing: true,
    tags: ['EdTech', 'FastAPI', 'Neo4j', 'Meilisearch', 'React', 'RAG'],
    highlights: ['未踏IT 2025年度 採択'],
    image: '/projects/mitoupj.png',
    github: null,
    team: 2,
    detailedDescription: `従来のプログラミング教育が抱える「画一的なカリキュラム」「生徒の興味との乖離」という課題を解決するため、AIを活用した教育支援システムを開発中。
    
生徒一人ひとりの興味や理解度に合わせて、リアルタイムで教材を生成・最適化することで、より効果的で楽しいプログラミング学習体験を実現します。`,
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
      'UWBと画像認識を組み合わせた対戦型ゲーム。リアルタイムでプレイヤーの位置を追跡し、弾を使わずに場所を問わないレジャー化を実現',
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
      '北海道のミズナラを使ったの国産樽の流通を管理し、樽のトレーサビリティを高めるシステム',
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
      '筋トレの成果を3Dスキャンで記録・可視化。3D Gaussian Splattingによる人体の"マチョ盛り"で誰でもマッチョに',
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
    description:
      '学食での混雑を避けるための、QR掲示型の食券発見システム',
    year: '2024',
    team: 6,
    status: '開発終了',
    isOngoing: false,
    tags: ['Express', 'Lit', 'MariaDB', 'Axum'],
    highlights: [],
    image: '/projects/hiusyokken.png',
    modalImage: '/projects/hiusyokken-modal.png',
    features: [
      '食券を購入する機能',
      'QRコードを読み取り、食券を発行する機能',
    ],
  },
  {
    id: 'gps-reminder',
    title: 'gpsでリマインドしてくれる日用品残量チェッカー',
    description:
      '位置情報を活用し、必要な日用品を「買えるその瞬間」にリマインドする。100Program 5期でオーディエンス賞最多受賞。',
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
    features: [
      '日用品の消耗度の自動計算',
      '必要な日用品を売っている店舗が近づいたらリマインド',
    ],
  },
  {
    id: 'wakaran-sns',
    title: 'ワイらのための「わからない」を楽しむSNS',
    description:
      '「わからない」といった疑問や悩みを共有できるSNS。成果型のSNSよりも、あえて弱いところをシェアすることで安心できる環境を作る。',
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
    description:
      '1,000体のゾンビが襲いかかるモードと、銃でのPvPを実装した統合版Minecraftサーバー',
    year: '2020-2023',
    status: '開発終了',
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
      period: '2022年〜現在',
    },
    {
      title: '株式会社コロプラ',
      role: '2 Weeks インターン',
      period: '2023年',
    },
    {
      title: 'プログラミングスクール',
      role: '講師',
      period: '2023年〜現在',
    },
  ],
  awards: [
    {
      title: '未踏IT人材育成事業',
      role: '採択',
      period: '2025年',
    },
    {
      title: '100Program 5期',
      role: '2チーム同時ファイナリスト',
      period: '2024年',
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
