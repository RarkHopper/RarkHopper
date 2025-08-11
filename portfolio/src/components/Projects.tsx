import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Glide from '@glidejs/glide';
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
import type { Project } from '@/masterdata/profile';
import ProjectModal from './ProjectModal';
import ScrollAnimation from './ScrollAnimation';

// Import Glide styles
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@/styles/glide-custom.css';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const glideRef = useRef<HTMLDivElement>(null);
  const glideInstance = useRef<Glide | null>(null);

  // Sort projects
  const sortedProjects = [...projects].sort((a, b) => {
    // First sort by ongoing status (ongoing first)
    if (a.isOngoing !== b.isOngoing) {
      return a.isOngoing ? -1 : 1;
    }
    // Then sort by year (newest first)
    const yearA = parseInt(a.year.split('-')[0]);
    const yearB = parseInt(b.year.split('-')[0]);
    return yearB - yearA;
  });

  useEffect(() => {
    if (!glideRef.current) return;

    // Initialize Glide
    glideInstance.current = new Glide(glideRef.current, {
      type: 'carousel',
      startAt: 0,
      perView: 3,
      focusAt: 'center',
      gap: 30,
      autoplay: 5000,
      hoverpause: true,
      animationDuration: 600,
      animationTimingFunc: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
      dragThreshold: 50,
      swipeThreshold: 80,
      touchRatio: 0.5,
      perTouch: 1,
      breakpoints: {
        1024: {
          perView: 2,
          gap: 20,
        },
        640: {
          perView: 1,
          gap: 15,
        },
      },
    });

    glideInstance.current.mount();

    return () => {
      glideInstance.current?.destroy();
    };
  }, []);

  return (
    <section id="projects" className="relative container py-12 md:py-24 lg:py-32">
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      <ScrollAnimation animation="fadeUp">
        <div className="relative mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center z-10">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
            Featured Projects
          </h2>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            これまでに取り組んだプロジェクトの一部を紹介します。
          </p>
        </div>
      </ScrollAnimation>

      <ScrollAnimation animation="fadeUp" delay={0.2}>
        <div className="relative mx-auto mt-12 z-10">
          <div ref={glideRef} className="glide">
            <div className="glide__track" data-glide-el="track">
              <ul className="glide__slides">
                {sortedProjects.map((project) => (
                  <li key={project.id} className="glide__slide">
                    <Card
                      className="overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] relative p-0 h-full"
                      onClick={() => {
                        setSelectedProject(project);
                        setModalOpen(true);
                      }}
                    >
                      {/* Image with Ongoing indicator */}
                      <div className="relative aspect-video bg-muted">
                        {project.image && (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        {project.isOngoing && (
                          <div className="absolute top-3 right-3">
                            <div className="flex items-center gap-1 bg-primary/90 backdrop-blur text-primary-foreground px-2.5 py-1.5 rounded-full text-xs font-medium">
                              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                              <span>進行中</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <CardHeader className="p-0 pb-3">
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
                          <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                          <CardDescription className="text-sm mt-2 line-clamp-3">
                            {project.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 pt-3">
                          {project.highlights && project.highlights.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {project.highlights.slice(0, 2).map((highlight) => (
                                <span key={highlight} className="text-xs text-primary font-medium">
                                  ✨ {highlight}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {project.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {project.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{project.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="p-0 pt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProject(project);
                              setModalOpen(true);
                            }}
                          >
                            詳細を見る
                          </Button>
                        </CardFooter>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation arrows */}
            <div className="glide__arrows" data-glide-el="controls">
              <button 
                className="glide__arrow glide__arrow--left absolute top-1/2 -translate-y-1/2 left-0 w-12 h-12 rounded-full bg-background/80 backdrop-blur border shadow-lg flex items-center justify-center hover:bg-background transition-colors"
                data-glide-dir="<"
                aria-label="Previous project"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                className="glide__arrow glide__arrow--right absolute top-1/2 -translate-y-1/2 right-0 w-12 h-12 rounded-full bg-background/80 backdrop-blur border shadow-lg flex items-center justify-center hover:bg-background transition-colors"
                data-glide-dir=">"
                aria-label="Next project"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bullets */}
            <div className="glide__bullets flex justify-center gap-2 mt-8" data-glide-el="controls[nav]">
              {sortedProjects.map((_, index) => (
                <button
                  key={index}
                  className="glide__bullet w-2 h-2 rounded-full bg-muted-foreground/30 transition-all data-[glide-dir]:bg-primary data-[glide-dir]:w-8"
                  data-glide-dir={`=${index}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </ScrollAnimation>

      {/* Project Detail Modal */}
      <ProjectModal 
        project={selectedProject}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  );
}