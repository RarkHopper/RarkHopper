import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ScrollAnimation from './ScrollAnimation';

const skillCategories = [
  {
    title: 'Languages',
    icon: '/skill-icon.svg',
    iconEmoji: '💻',
    skills: [
      { name: 'Python', level: 'Advanced' },
      { name: 'TypeScript', level: 'Advanced' },
      { name: 'JavaScript', level: 'Advanced' },
      { name: 'PHP', level: 'Advanced' },
      { name: 'C#', level: 'Intermediate' },
      { name: 'Go', level: 'Intermediate' },
      { name: 'Java', level: 'Basic' },
    ],
  },
  {
    title: 'Frontend',
    icon: '/skill-icon.svg',
    iconEmoji: '🎨',
    skills: [
      { name: 'React', level: 'Advanced' },
      { name: 'Next.js', level: 'Advanced' },
      { name: 'Vue.js', level: 'Intermediate' },
      { name: 'Svelte', level: 'Intermediate' },
      { name: 'Tailwind CSS', level: 'Advanced' },
      { name: 'A-Frame', level: 'Intermediate' },
      { name: 'Phaser', level: 'Intermediate' },
    ],
  },
  {
    title: 'Backend',
    icon: '/skill-icon.svg',
    iconEmoji: '⚙️',
    skills: [
      { name: 'FastAPI', level: 'Advanced' },
      { name: 'Express', level: 'Advanced' },
      { name: 'Laravel', level: 'Intermediate' },
      { name: 'Django', level: 'Intermediate' },
      { name: 'Slim', level: 'Intermediate' },
      { name: 'PostgreSQL', level: 'Advanced' },
      { name: 'Redis', level: 'Intermediate' },
    ],
  },
  {
    title: 'AI & Data',
    icon: '/skill-icon.svg',
    iconEmoji: '🤖',
    skills: [
      { name: 'RAG', level: 'Advanced' },
      { name: 'Sentence-Transformers', level: 'Advanced' },
      { name: 'FAISS', level: 'Intermediate' },
      { name: 'Neo4j', level: 'Intermediate' },
      { name: 'Ollama', level: 'Intermediate' },
      { name: 'OpenCV', level: 'Intermediate' },
      { name: 'Gaussian Splatting', level: 'Basic' },
    ],
  },
  {
    title: 'DevOps & Tools',
    icon: '/skill-icon.svg',
    iconEmoji: '🚀',
    skills: [
      { name: 'Docker', level: 'Advanced' },
      { name: 'Kubernetes', level: 'Intermediate' },
      { name: 'Git', level: 'Advanced' },
      { name: 'GCP', level: 'Intermediate' },
      { name: 'Cloudflare', level: 'Intermediate' },
      { name: 'Grafana', level: 'Basic' },
      { name: 'Datadog', level: 'Basic' },
    ],
  },
  {
    title: 'Search & DB',
    icon: '/skill-icon.svg',
    iconEmoji: '🔍',
    skills: [
      { name: 'Meilisearch', level: 'Intermediate' },
      { name: 'PostgreSQL', level: 'Advanced' },
      { name: 'MySQL', level: 'Intermediate' },
      { name: 'Neo4j', level: 'Intermediate' },
      { name: 'Redis', level: 'Intermediate' },
      { name: 'FAISS', level: 'Intermediate' },
    ],
  },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Advanced':
      return 'default';
    case 'Intermediate':
      return 'secondary';
    case 'Basic':
      return 'outline';
    default:
      return 'outline';
  }
};

export default function Skills() {
  const badgesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    badgesRef.current.forEach((container) => {
      if (!container) return;

      const badges = container.querySelectorAll('.skill-badge');

      badges.forEach((badge, _index) => {
        badge.addEventListener('mouseenter', () => {
          gsap.to(badge, {
            scale: 1.1,
            y: -2,
            duration: 0.2,
            ease: 'power2.out',
          });
        });

        badge.addEventListener('mouseleave', () => {
          gsap.to(badge, {
            scale: 1,
            y: 0,
            duration: 0.2,
            ease: 'power2.out',
          });
        });
      });
    });
  }, []);

  return (
    <section id="skills" className="container py-12 md:py-24 lg:py-32">
      <ScrollAnimation animation="fadeUp">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
            Technical Skills
          </h2>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            6年以上の開発経験で培った幅広い技術スタック
          </p>
        </div>
      </ScrollAnimation>

      <ScrollAnimation animation="fadeUp" stagger={0.1} delay={0.2}>
        <div className="mx-auto mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, categoryIndex) => (
            <Card key={category.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src={category.icon} alt={category.title} className="w-8 h-8 inline-block" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  ref={(el) => {
                    badgesRef.current[categoryIndex] = el;
                  }}
                  className="flex flex-wrap gap-2"
                >
                  {category.skills.map((skill) => (
                    <Badge
                      key={skill.name}
                      variant={getLevelColor(skill.level)}
                      className="text-xs skill-badge cursor-pointer transition-transform"
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollAnimation>

      <div className="mx-auto mt-8 max-w-3xl text-center">
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">資格:</span> 基本情報技術者試験（2022年取得）
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <span className="font-semibold">得意分野:</span>{' '}
              フルスタック開発、RAGシステム構築、教育システム開発、リアルタイム通信
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
