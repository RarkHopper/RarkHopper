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
  isOngoing?: boolean;
  program?: string;
  status?: string;
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

  // タイトル・称号
  titles: ['未踏IT採択クリエータ', '100Program ファイナリスト'],

  // 自己紹介
  bio: {
    short: '生徒の「好き」を起点にしたプログラミング教育支援システムを開発中。',
    long: '不登校から始まり、Minecraftで見つけたプログラミングの楽しさを、次世代に伝えたい。',
    education:
      '6年間、独学でプログラミングを学び、気がつけば様々なプロジェクトにチャレンジする人に',
  },

  // 連絡先
  contact: {
    github: 'https://github.com/RarkHopper',
    discord: 'RarkHopper',
    email: 'contact@example.com',
    linkedin: 'https://linkedin.com',
  },

  // 興味・関心
  interests: [
    { icon: 'code', label: 'プログラミング', description: '新しい技術を学ぶことが大好き' },
    { icon: 'mountain', label: 'アウトドア', description: '登山やキャンプで自然を満喫' },
    { icon: 'music', label: 'リズムゲーム', description: '音ゲーで反射神経を鍛える' },
    { icon: 'heart', label: '教育支援', description: '次世代にプログラミングの楽しさを伝える' },
  ],
} as const;

// ================================================================
// セクション1: Hero (src/components/Hero.tsx)
// ================================================================
// HeroセクションはpersonalInfoのデータのみ使用

// ================================================================
// セクション2: About (src/components/About.tsx)
// ================================================================
export const aboutData = {
  subtitle: '不登校から見つけたプログラミングの楽しさを、次世代に伝えたい',
  paragraphs: [
    {
      id: 'about-p1',
      text: '小中学生時代は不登校でしたが、高校でMinecraftのプログラミングに出会い、人生が変わりました。PocketMine-MPプラグイン制作やサーバ運営を通じて、コードを書く楽しさと、それが誰かの笑顔につながる喜びを知りました。',
      hasHighlight: false,
    },
    {
      id: 'about-p2',
      text: '現在は北海道情報大学でシステム情報学を学びながら、未踏IT人材育成事業に採択され、生徒の「好き」を起点にしたプログラミング教育支援システムを開発しています。',
      hasHighlight: true,
      highlightText: '未踏IT',
    },
    {
      id: 'about-p3',
      text: '複数のインターンやハッカソンを通じて実践的なスキルを磨き、100Programでは2チーム同時ファイナリスト・オーディエンス賞最多受賞という成果を残しました。技術を通じて、かつての自分のような子どもたちに、新しい可能性を届けたいと考えています。',
      hasHighlight: false,
    },
  ],
  highlights: [
    { icon: '/pictogram-programming.svg', title: 'Programming', subtitle: '6年以上の経験' },
    { icon: '/pictogram-teaching.svg', title: 'Education', subtitle: 'プログラミング講師' },
    { icon: '/pictogram-outdoor.svg', title: '登山', subtitle: '北海道の山々' },
    { icon: '/pictogram-rhythm.svg', title: 'ベース', subtitle: '音楽も大好き' },
  ],
};

// ================================================================
// セクション3: Timeline (src/components/Timeline.tsx)
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
    description: 'マチョプリ！プロジェクト採択',
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
    title: '未踏IT：プログラミング教育支援システム',
    description:
      '生徒の興味に基づいて教材を動的に生成・再構成するシステム。RAG構成とナレッジグラフを活用し、パーソナライズされた学習体験を提供。',
    year: '2025',
    month: 6,
    status: '開発中',
    program: '未踏IT',
    isOngoing: true,
    tags: ['Python', 'FastAPI', 'RAG', 'Neo4j', 'React'],
    highlights: ['未踏IT採択', 'コンテキスト制御RAG', '教材ナレッジグラフ化'],
    image: '/project-placeholder-1.svg',
    github: 'https://github.com/RarkHopper',
    team: 2,
    detailedDescription: `従来のプログラミング教育が抱える「画一的なカリキュラム」「生徒の興味との乖離」という課題を解決するため、AIを活用した教育支援システムを開発中。
    
生徒一人ひとりの興味や理解度に合わせて、リアルタイムで教材を生成・最適化することで、より効果的で楽しいプログラミング学習体験を実現します。`,
    features: [
      '生徒の興味分析システム',
      'RAG構成による動的教材生成',
      'ナレッジグラフベースの学習パス最適化',
      'リアルタイムフィードバック機能',
      '教師向けダッシュボード',
    ],
    challenges: [
      {
        problem: '多様な生徒の興味に対応する教材生成の精度',
        solution: 'RAG構成とファインチューニングを組み合わせた高精度な生成システムの実装',
      },
      {
        problem: '教材の教育的品質の担保',
        solution: 'ナレッジグラフを活用した学習順序の最適化と教育専門家によるレビュー',
      },
    ],
  },
  {
    id: 'uwb-survival',
    title: 'UWB電子サバイバルゲーム',
    description:
      '室内位置推定（UWB）と画像認識を組み合わせた対戦型ゲーム。リアルタイムでプレイヤーの位置を追跡し、AR的な演出を実現。',
    year: '2025',
    month: 4,
    status: '開発中',
    program: '学生チャレンジプログラム',
    isOngoing: true,
    tags: ['UWB', 'Unity', 'C#', 'OpenCV', 'Python'],
    highlights: ['室内位置推定', 'リアルタイム対戦'],
    image: '/project-placeholder-3.svg',
    github: 'https://github.com/RarkHopper',
  },
  {
    id: 'machopri',
    title: 'マチョプリ！- 3D身体撮影システム',
    description:
      '筋トレの成果を3Dスキャンで記録・可視化。Gaussian Splattingを用いて身体の変化を立体的に表示し、モチベーション維持を支援。',
    year: '2024',
    month: 10,
    status: '修了',
    program: '新雪プログラム',
    isOngoing: false,
    tags: ['Gaussian Splatting', 'Python', 'OpenCV', '3D Reconstruction'],
    highlights: ['3D可視化', 'モチベーション支援'],
    image: '/project-placeholder-2.svg',
    github: 'https://github.com/RarkHopper',
  },
  {
    id: 'gps-reminder',
    title: 'GPS日用品リマインダー',
    description:
      '位置情報を活用し、帰路で必要な日用品の購入を通知するシステム。100Program 5期でオーディエンス賞最多受賞。',
    year: '2024',
    month: 3,
    status: 'ファイナリスト',
    program: '100Program',
    isOngoing: false,
    tags: ['React Native', 'Node.js', 'GPS', 'Push通知'],
    highlights: ['オーディエンス賞最多', 'IoT連携'],
    image: '/project-placeholder-1.svg',
    github: 'https://github.com/RarkHopper',
  },
  {
    id: 'unknown-sns',
    title: '「わからない」を楽しむSNS',
    description:
      '不確実な事柄や疑問を共有し、議論を楽しむSNS。多様な視点を集めることで新たな発見を促進。',
    year: '2024',
    month: 3,
    status: 'ファイナリスト',
    program: '100Program',
    isOngoing: false,
    tags: ['Next.js', 'PostgreSQL', 'Prisma', 'TypeScript'],
    highlights: ['コミュニティ設計', 'UI/UX'],
    image: '/project-placeholder-2.svg',
    github: 'https://github.com/RarkHopper',
  },
  {
    id: 'pocketmine',
    title: 'PocketMine-MPサーバ運営',
    description:
      '5年間のMinecraftサーバ運営。独自プラグイン開発とコミュニティ管理を通じて、プログラミングスキルを実践的に習得。',
    year: '2019-2024',
    status: '5年間運営',
    isOngoing: false,
    tags: ['PHP', 'PocketMine-MP', 'MySQL', 'Linux'],
    highlights: ['独自プラグイン開発', 'コミュニティ運営'],
    image: '/project-placeholder-3.svg',
    github: 'https://github.com/RarkHopper',
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
      { name: 'C#', years: 2 },
      { name: 'Go', years: 1 },
      { name: 'Java', years: 1 },
    ],
  },
  {
    title: 'Frontend',
    icon: '/skill-icon.svg',
    skills: [
      { name: 'React', years: 3 },
      { name: 'Next.js', years: 3 },
      { name: 'Vue.js', years: 2 },
      { name: 'Svelte', years: 1 },
      { name: 'Tailwind CSS', years: 3 },
      { name: 'A-Frame', years: 1 },
      { name: 'Phaser', years: 1 },
    ],
  },
  {
    title: 'Backend',
    icon: '/skill-icon.svg',
    skills: [
      { name: 'FastAPI', years: 2 },
      { name: 'Express', years: 3 },
      { name: 'Laravel', years: 2 },
      { name: 'Django', years: 1 },
      { name: 'Slim', years: 2 },
      { name: 'PostgreSQL', years: 3 },
      { name: 'Redis', years: 2 },
    ],
  },
  {
    title: 'Database',
    icon: '/skill-icon.svg',
    skills: [
      { name: 'PostgreSQL', years: 3 },
      { name: 'MySQL', years: 2 },
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
      { name: 'Git', years: 5 },
      { name: 'Kubernetes', years: 1 },
      { name: 'GCP', years: 2 },
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
      { name: 'FAISS', years: 1 },
      { name: 'Ollama', years: 1 },
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
      role: 'エンジニアインターン',
      period: '2022年〜現在',
      description: 'フルスタック開発、インフラ構築、システム設計に従事',
      tags: ['Docker', 'Kubernetes', 'TypeScript'],
    },
    {
      title: '株式会社コロプラ',
      role: 'インターン',
      period: '2023年',
      description: 'ゲーム開発プロジェクトに参加',
      tags: ['Unity', 'C#'],
    },
    {
      title: 'プログラミングスクール',
      role: '講師',
      period: '2023年〜現在',
      description: '小中高生向けプログラミング教育',
      tags: ['教育', 'メンタリング'],
    },
  ],
  awards: [
    {
      title: '未踏IT人材育成事業',
      role: '採択クリエータ',
      period: '2025年',
      description: '生徒の興味に基づいた教材を動的に生成するプログラミング教育支援システム',
      tags: ['AI', 'EdTech', 'RAG'],
    },
    {
      title: '100Program 5期',
      role: '2チーム同時ファイナリスト',
      period: '2024年',
      description: 'オーディエンス賞最多受賞',
      tags: ['プロダクト開発', 'チーム開発'],
    },
    {
      title: '新雪プログラム',
      role: '採択・修了',
      period: '2024年',
      description: 'マチョプリ！筋トレの努力を可視化する3D身体撮影システム',
      tags: ['3D', 'Gaussian Splatting'],
    },
    {
      title: '東北大学基金 ともプロ！',
      role: '採択',
      period: '2024年',
      description: '位置情報を活用した日用品リマインダーアプリ',
      tags: ['GPS', 'IoT'],
    },
    {
      title: '北海道情報大学 学生チャレンジプログラム',
      role: '採択',
      period: '2025年',
      description: 'UWB及び画像認識による電子サバイバルゲーム',
      tags: ['UWB', '画像認識'],
    },
  ],
  activities: [
    {
      title: '100Program 8期',
      role: 'アラムナイメンター',
      period: '2025年',
      description: '後輩チームの活動支援',
      tags: ['メンタリング', 'コミュニティ'],
    },
    {
      title: 'PocketMine-MPサーバ運営',
      role: '管理者・開発者',
      period: '2019年〜2024年',
      description: '5年間のサーバ運営とプラグイン開発',
      tags: ['PHP', 'コミュニティ運営'],
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
      text: '現在、未踏ITのプロジェクトに注力していますが、興味深いプロジェクトやコラボレーションの機会があればぜひお声がけください！',
      highlightText: '未踏IT',
    },
  },
} as const;
