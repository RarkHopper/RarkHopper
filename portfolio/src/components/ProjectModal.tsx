import { useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import Glide from '@glidejs/glide';
import { Calendar, ChevronLeft, ChevronRight, Code, ExternalLink, Github, Trophy, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { projects } from '@/masterdata/profile';
import type { Project } from '@/masterdata/profile';

// Import Glide styles
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@/styles/glide-modal.css';

interface ProjectModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProjectModal({ 
  project, 
  open, 
  onOpenChange,
}: ProjectModalProps) {
  const glideRef = useRef<HTMLDivElement>(null);
  const glideInstance = useRef<Glide | null>(null);

  // Sort projects same way as in Projects component
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.isOngoing !== b.isOngoing) {
      return a.isOngoing ? -1 : 1;
    }
    const yearA = parseInt(a.year.split('-')[0]);
    const yearB = parseInt(b.year.split('-')[0]);
    return yearB - yearA;
  });

  // Find initial index with useMemo to avoid recalculation
  const initialIndex = useMemo(() => {
    if (!project) return 0;
    const index = sortedProjects.findIndex(p => p.id === project.id);
    console.log('ProjectModal: Finding index for', project.id, '-> index:', index);
    return index >= 0 ? index : 0;
  }, [project, sortedProjects]);

  useEffect(() => {
    if (!glideRef.current || !open) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Initialize Glide
      glideInstance.current = new Glide(glideRef.current!, {
        type: 'slider',
        startAt: initialIndex >= 0 ? initialIndex : 0,
        perView: 1,
        gap: 0,
        keyboard: true,
        animationDuration: 400,
        animationTimingFunc: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
      });

      glideInstance.current.mount();
    }, 100);

    return () => {
      clearTimeout(timer);
      glideInstance.current?.destroy();
      glideInstance.current = null;
    };
  }, [open, initialIndex]); // Use initialIndex to properly track changes

  if (!open) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('handlePrev clicked, glideInstance:', glideInstance.current);
    if (glideInstance.current) {
      glideInstance.current.go('<');
    }
  };
  
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('handleNext clicked, glideInstance:', glideInstance.current);
    if (glideInstance.current) {
      glideInstance.current.go('>');
    }
  };
  
  const handleGoTo = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('handleGoTo clicked, index:', index, 'glideInstance:', glideInstance.current);
    if (glideInstance.current) {
      glideInstance.current.go(`=${index}`);
    }
  };

  return (
    <>
      {/* Navigation controls rendered outside Dialog through portal */}
      {open && ReactDOM.createPortal(
        <>
          {/* Navigation arrows */}
          <button 
            className="fixed top-1/2 -translate-y-1/2 left-4 lg:left-8 w-12 h-12 rounded-full bg-background border-2 shadow-2xl flex items-center justify-center hover:bg-accent transition-colors z-[60] cursor-pointer"
            aria-label="Previous project"
            onClick={handlePrev}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            className="fixed top-1/2 -translate-y-1/2 right-4 lg:right-8 w-12 h-12 rounded-full bg-background border-2 shadow-2xl flex items-center justify-center hover:bg-accent transition-colors z-[60] cursor-pointer"
            aria-label="Next project"
            onClick={handleNext}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots indicator */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-[60] bg-background/90 backdrop-blur px-4 py-2 rounded-full shadow-xl">
            {sortedProjects.map((_, index) => (
              <button
                key={index}
                className="glide__bullet w-2.5 h-2.5 rounded-full bg-muted-foreground/50 transition-all hover:bg-primary/70"
                onClick={handleGoTo(index)}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        </>,
        document.body
      )}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[1200px] w-[90vw] max-h-[85vh] p-0 overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>プロジェクト詳細</DialogTitle>
            <DialogDescription>プロジェクトの詳細情報を表示しています</DialogDescription>
          </VisuallyHidden>
          <div ref={glideRef} className="glide relative">
            <div className="glide__track" data-glide-el="track">
              <ul className="glide__slides">
                {sortedProjects.map((proj) => (
                  <li key={proj.id} className="glide__slide">
                    <div className="grid md:grid-cols-5 gap-0 max-h-[85vh] overflow-y-auto">
                      {/* Left side - Image */}
                      <div className="md:col-span-2 relative h-full min-h-[300px] bg-muted">
                        {proj.image ? (
                          <img
                            src={proj.image}
                            alt={proj.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Code className="w-20 h-20 opacity-20" />
                          </div>
                        )}
                        {proj.isOngoing && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-primary/90 backdrop-blur">
                              <div className="h-2 w-2 rounded-full bg-white animate-pulse mr-1" />
                              進行中
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Right side - Content */}
                      <div className="md:col-span-3 p-6 lg:p-8 space-y-5">
                        {/* Header */}
                        <div>
                          <h2 className="text-2xl font-bold mb-2">
                            {proj.title}
                          </h2>
                          <p className="text-base text-muted-foreground">
                            {proj.description}
                          </p>
                        </div>

                        {/* Meta Information */}
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{proj.year}</span>
                          </div>
                          {proj.program && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Trophy className="w-4 h-4" />
                              <span>
                                {proj.program}
                                {proj.status && ` - ${proj.status}`}
                              </span>
                            </div>
                          )}
                          {proj.team && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users className="w-4 h-4" />
                              <span>{proj.team}人チーム</span>
                            </div>
                          )}
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid gap-5">
                          {/* Highlights and Tech Stack Row */}
                          <div className="grid lg:grid-cols-2 gap-5">
                            {/* Highlights */}
                            {proj.highlights && proj.highlights.length > 0 && (
                              <div className="bg-muted/30 p-4 rounded-lg">
                                <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                                  <Trophy className="w-4 h-4" />
                                  主な成果
                                </h3>
                                <ul className="space-y-2">
                                  {proj.highlights.map((highlight, index) => (
                                    <li key={index} className="flex items-center gap-2 text-sm">
                                      <span className="text-primary">✨</span>
                                      <span>{highlight}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Technologies */}
                            <div className="bg-muted/30 p-4 rounded-lg">
                              <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                                <Code className="w-4 h-4" />
                                使用技術
                              </h3>
                              <div className="flex flex-wrap gap-1.5">
                                {proj.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Detailed Description */}
                          {proj.detailedDescription && (
                            <div>
                              <h3 className="font-semibold mb-2 text-sm">詳細説明</h3>
                              <div className="text-sm text-muted-foreground space-y-2">
                                {proj.detailedDescription.split('\n').map((paragraph, index) => (
                                  <p key={index}>{paragraph}</p>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Features and Challenges Grid */}
                          <div className="grid lg:grid-cols-2 gap-5">
                            {/* Key Features */}
                            {proj.features && proj.features.length > 0 && (
                              <div>
                                <h3 className="font-semibold mb-2 text-sm">主な機能</h3>
                                <ul className="space-y-1.5">
                                  {proj.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm">
                                      <span className="text-primary mt-0.5">•</span>
                                      <span>{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Challenges */}
                            {proj.challenges && proj.challenges.length > 0 && (
                              <div>
                                <h3 className="font-semibold mb-2 text-sm">技術的な挑戦</h3>
                                <div className="space-y-2">
                                  {proj.challenges.map((challenge, index) => (
                                    <div key={index} className="text-sm">
                                      <div className="font-medium text-xs text-primary mb-0.5">
                                        課題
                                      </div>
                                      <div className="text-xs text-muted-foreground mb-1">
                                        {challenge.problem}
                                      </div>
                                      <div className="font-medium text-xs text-primary mb-0.5">
                                        解決策
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {challenge.solution}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3 pt-2">
                            {proj.github && (
                              <Button asChild size="sm">
                                <a href={proj.github} target="_blank" rel="noopener noreferrer">
                                  <Github className="mr-2 h-4 w-4" />
                                  GitHubで見る
                                </a>
                              </Button>
                            )}
                            {proj.demo && (
                              <Button asChild variant="outline" size="sm">
                                <a href={proj.demo} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  デモを見る
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}