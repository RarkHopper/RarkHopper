import { Briefcase, Rocket, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ScrollAnimation from './ScrollAnimation';

const experiences = [
  {
    category: 'Work Experience',
    icon: <Briefcase className="w-5 h-5" />,
    iconSrc: '/briefcase-icon.svg',
    items: [
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
  },
  {
    category: 'Awards & Programs',
    icon: <Trophy className="w-5 h-5" />,
    iconSrc: '/trophy-icon.svg',
    items: [
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
  },
  {
    category: 'Activities',
    icon: <Rocket className="w-5 h-5" />,
    iconSrc: '/rocket-icon.svg',
    items: [
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
  },
];

export default function Experience() {
  return (
    <section id="experience" className="container py-12 md:py-24 lg:py-32">
      <ScrollAnimation animation="fadeUp">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
            Experience & Activities
          </h2>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            インターン、採択プログラム、受賞歴など
          </p>
        </div>
      </ScrollAnimation>

      <div className="mx-auto mt-12 max-w-5xl space-y-8">
        {experiences.map((category, index) => (
          <ScrollAnimation key={category.category} animation="slideInLeft" delay={index * 0.1}>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={category.iconSrc} alt={category.category} className="w-8 h-8" />
                <h3 className="text-xl font-semibold">{category.category}</h3>
              </div>
              <div className="space-y-4">
                {category.items.map((item) => (
                  <Card key={`${category.category}-${item.title}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {item.role} • {item.period}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollAnimation>
        ))}
      </div>
    </section>
  );
}
