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
import { projects } from '@/masterdata/profile';
import ScrollAnimation from './ScrollAnimation';

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
            これまでに取り組んだプロジェクトの一部を紹介します。
          </p>
        </div>
      </ScrollAnimation>

      <ScrollAnimation animation="fadeUp" stagger={0.1} delay={0.2}>
        <div className="mx-auto grid gap-6 mt-12 md:grid-cols-2 lg:grid-cols-3">
          {[...projects]
            .sort((a, b) => {
              // First sort by ongoing status (ongoing first)
              if (a.isOngoing !== b.isOngoing) {
                return a.isOngoing ? -1 : 1;
              }
              // Then sort by year (newest first)
              const yearA = parseInt(a.year.split('-')[0]);
              const yearB = parseInt(b.year.split('-')[0]);
              return yearB - yearA;
            })
            .map((project, index) => (
              <Card
                key={project.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="overflow-hidden flex flex-col cursor-pointer transition-shadow relative"
              >
                {/* Ongoing indicator */}
                {project.isOngoing && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className="flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                      <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                      <span>進行中</span>
                    </div>
                  </div>
                )}
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
                    {project.program && (
                      <Badge className="text-xs">
                        {project.program}
                        {project.status && ` ${project.status}`}
                      </Badge>
                    )}
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
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
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
