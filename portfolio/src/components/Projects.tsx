import { gsap } from 'gsap';
import { Github } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ScrollAnimation from './ScrollAnimation';

const projects = [
  {
    id: 1,
    title: '未踏IT：プログラミング教育支援システム',
    description:
      '生徒の興味に基づいて教材を動的に生成・再構成するシステム。RAG構成とナレッジグラフを活用し、パーソナライズされた学習体験を提供。',
    image: '/project-placeholder-1.svg',
    tags: ['Python', 'FastAPI', 'RAG', 'Neo4j', 'React'],
    year: '2025',
    status: '開発中',
    highlights: ['未踏IT採択', 'コンテキスト制御RAG', '教材ナレッジグラフ化'],
    githubUrl: 'https://github.com/RarkHopper',
  },
  {
    id: 2,
    title: 'マチョプリ！- 3D身体撮影システム',
    description:
      '筋トレの成果を3Dスキャンで記録・可視化。Gaussian Splattingを用いて身体の変化を立体的に表示し、モチベーション維持を支援。',
    image: '/project-placeholder-2.svg',
    tags: ['Gaussian Splatting', 'Python', 'OpenCV', '3D Reconstruction'],
    year: '2024',
    status: '新雪プログラム採択/修了',
    highlights: ['3D可視化', 'モチベーション支援'],
    githubUrl: 'https://github.com/RarkHopper',
  },
  {
    id: 3,
    title: 'UWB電子サバイバルゲーム',
    description:
      '室内位置推定（UWB）と画像認識を組み合わせた対戦型ゲーム。リアルタイムでプレイヤーの位置を追跡し、AR的な演出を実現。',
    image: '/project-placeholder-3.svg',
    tags: ['UWB', 'Unity', 'C#', 'OpenCV', 'Python'],
    year: '2025',
    status: '学生チャレンジプログラム採択',
    highlights: ['室内位置推定', 'リアルタイム対戦'],
    githubUrl: 'https://github.com/RarkHopper',
  },
  {
    id: 4,
    title: 'GPS日用品リマインダー',
    description:
      '位置情報を活用し、帰路で必要な日用品の購入を通知するシステム。100Program 5期でオーディエンス賞最多受賞。',
    image: '/project-placeholder-1.svg',
    tags: ['React Native', 'Node.js', 'GPS', 'Push通知'],
    year: '2024',
    status: '100Program ファイナリスト',
    highlights: ['オーディエンス賞最多', 'IoT連携'],
    githubUrl: 'https://github.com/RarkHopper',
  },
  {
    id: 5,
    title: '「わからない」を楽しむSNS',
    description:
      '不確実な事柄や疑問を共有し、議論を楽しむSNS。多様な視点を集めることで新たな発見を促進。',
    image: '/project-placeholder-2.svg',
    tags: ['Next.js', 'PostgreSQL', 'Prisma', 'TypeScript'],
    year: '2024',
    status: '100Program ファイナリスト',
    highlights: ['コミュニティ設計', 'UI/UX'],
    githubUrl: 'https://github.com/RarkHopper',
  },
  {
    id: 6,
    title: 'PocketMine-MPサーバ運営',
    description:
      '5年間のMinecraftサーバ運営。独自プラグイン開発とコミュニティ管理を通じて、プログラミングスキルを実践的に習得。',
    image: '/project-placeholder-3.svg',
    tags: ['PHP', 'PocketMine-MP', 'MySQL', 'Linux'],
    year: '2019-2024',
    status: '5年間運営',
    highlights: ['独自プラグイン開発', 'コミュニティ運営'],
    githubUrl: 'https://github.com/RarkHopper',
  },
];

export default function Projects() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    cardsRef.current.forEach((card) => {
      if (!card) return;

      const handleMouseEnter = () => {
        gsap.to(card, {
          y: -5,
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        });

        // Animate the image inside
        const img = card.querySelector('img');
        if (img) {
          gsap.to(img, {
            scale: 1.1,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        });

        // Reset image
        const img = card.querySelector('img');
        if (img) {
          gsap.to(img, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      };

      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    });
  }, []);

  return (
    <section id="projects" className="container py-12 md:py-24 lg:py-32">
      <ScrollAnimation animation="fadeUp">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
            Featured Projects
          </h2>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Here are some of my recent projects that showcase my skills and passion for development.
          </p>
        </div>
      </ScrollAnimation>

      <ScrollAnimation animation="fadeUp" stagger={0.1} delay={0.2}>
        <div className="mx-auto grid gap-6 mt-12 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Card
              key={project.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="overflow-hidden flex flex-col cursor-pointer transition-shadow"
            >
              {project.image && (
                <div className="aspect-video bg-muted overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform"
                  />
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {project.year}
                  </Badge>
                  {project.status && <Badge className="text-xs">{project.status}</Badge>}
                </div>
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <CardDescription className="text-sm mt-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {project.highlights && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.highlights.map((highlight) => (
                      <span key={highlight} className="text-xs text-primary font-medium">
                        ✨ {highlight}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{project.tags.length - 4}
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Button size="sm" variant="outline" asChild className="w-full">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollAnimation>
    </section>
  );
}
