import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Code,
  ExternalLink,
  Github,
  Trophy,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { Project } from '@/masterdata/profile';
import { projects } from '@/masterdata/profile';
import OngoingIndicator from './OngoingIndicator';

interface ProjectModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProjectModal({ project, open, onOpenChange }: ProjectModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sort projects same way as in Projects component
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      if (a.isOngoing !== b.isOngoing) {
        return a.isOngoing ? -1 : 1;
      }
      const yearA = parseInt(a.year.split('-')[0]);
      const yearB = parseInt(b.year.split('-')[0]);
      return yearB - yearA;
    });
  }, []);

  // Preload adjacent images when modal opens
  useEffect(() => {
    if (open && sortedProjects.length > 0) {
      const preloadImage = (project: Project) => {
        if (project.modalImage || project.image) {
          const img = new Image();
          img.src = project.modalImage || project.image || '';
        }
      };

      // Preload current, previous, and next images
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : sortedProjects.length - 1;
      const nextIndex = currentIndex < sortedProjects.length - 1 ? currentIndex + 1 : 0;

      preloadImage(sortedProjects[currentIndex]);
      preloadImage(sortedProjects[prevIndex]);
      preloadImage(sortedProjects[nextIndex]);
    }
  }, [open, currentIndex, sortedProjects]);

  // Update current index when project or open state changes
  useEffect(() => {
    if (open && project) {
      const index = sortedProjects.findIndex((p) => p.id === project.id);
      if (index >= 0) {
        setCurrentIndex(index);
      }
    }
  }, [open, project, sortedProjects]);

  if (!open) {
    return null;
  }

  const currentProject = sortedProjects[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const newIndex = currentIndex > 0 ? currentIndex - 1 : sortedProjects.length - 1;
    setCurrentIndex(newIndex);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const newIndex = currentIndex < sortedProjects.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
  };

  const handleGoTo = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setCurrentIndex(index);
  };

  return (
    <>
      {/* Navigation controls rendered through portal */}
      {open &&
        ReactDOM.createPortal(
          <div data-modal-navigation="true" style={{ pointerEvents: 'auto' }}>
            {/* Navigation arrows */}
            <button
              className="fixed top-1/2 -translate-y-1/2 left-4 lg:left-8 w-12 h-12 rounded-full bg-background border-2 shadow-2xl flex items-center justify-center hover:bg-accent transition-colors z-[9999] cursor-pointer"
              aria-label="Previous project"
              onClick={handlePrev}
              style={{ pointerEvents: 'auto' }}
              type="button"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              className="fixed top-1/2 -translate-y-1/2 right-4 lg:right-8 w-12 h-12 rounded-full bg-background border-2 shadow-2xl flex items-center justify-center hover:bg-accent transition-colors z-[9999] cursor-pointer"
              aria-label="Next project"
              onClick={handleNext}
              style={{ pointerEvents: 'auto' }}
              type="button"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots indicator */}
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-[9999] bg-background/90 backdrop-blur px-4 py-2 rounded-full shadow-xl">
              {sortedProjects.map((project, index) => (
                <button
                  key={`${project.id}-dot`}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-primary w-6'
                      : 'bg-muted-foreground/50 hover:bg-muted-foreground/70'
                  }`}
                  onClick={handleGoTo(index)}
                  aria-label={`Go to project ${index + 1}`}
                  type="button"
                />
              ))}
            </div>
          </div>,
          document.body,
        )}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="w-[90vw] h-[75vh] max-w-[1400px] p-0 overflow-hidden"
          onPointerDownOutside={(e) => {
            const target = e.target as HTMLElement;

            // Check if the click is on our navigation controls
            if (target.closest('[data-modal-navigation]')) {
              e.preventDefault();
              return;
            }
          }}
        >
          <VisuallyHidden>
            <DialogTitle>プロジェクト詳細</DialogTitle>
            <DialogDescription>プロジェクトの詳細情報を表示しています</DialogDescription>
          </VisuallyHidden>

          {currentProject && (
            <div className="grid md:grid-cols-5 gap-0 h-full">
              {/* Left side - Image */}
              <div className="md:col-span-2 relative h-[300px] md:h-full bg-muted">
                {currentProject.modalImage || currentProject.image ? (
                  <img
                    src={currentProject.modalImage || currentProject.image}
                    alt={currentProject.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Code className="w-20 h-20 opacity-20" />
                  </div>
                )}
                {currentProject.isOngoing && (
                  <div className="absolute top-4 left-4">
                    <OngoingIndicator />
                  </div>
                )}
              </div>

              {/* Right side - Content */}
              <div className="md:col-span-3 p-6 lg:p-8 space-y-5 overflow-y-auto">
                {/* Header */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">{currentProject.title}</h2>
                  <p className="text-base text-muted-foreground">{currentProject.description}</p>
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{currentProject.year}</span>
                  </div>
                  {currentProject.program && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Trophy className="w-4 h-4" />
                      <span>{currentProject.program}</span>
                    </div>
                  )}
                  {currentProject.team && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{currentProject.team}人チーム</span>
                    </div>
                  )}
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-5">
                  {/* Highlights and Tech Stack Row */}
                  <div className="grid lg:grid-cols-2 gap-5">
                    {/* Highlights */}
                    {currentProject.highlights && currentProject.highlights.length > 0 && (
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                          <Trophy className="w-4 h-4" />
                          主な成果
                        </h3>
                        <ul className="space-y-2">
                          {currentProject.highlights.map((highlight) => (
                            <li key={highlight} className="flex items-start gap-2 text-sm">
                              <span className="text-primary mt-0.5">•</span>
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
                        {currentProject.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Detailed Description */}
                  {currentProject.detailedDescription && (
                    <div>
                      <h3 className="font-semibold mb-2 text-sm">詳細説明</h3>
                      <div className="text-sm text-muted-foreground space-y-2">
                        {currentProject.detailedDescription.split('\n').map((paragraph, idx) => (
                          <p key={`para-${currentProject.id}-${idx}`}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features and Challenges Grid */}
                  <div className="grid lg:grid-cols-2 gap-5">
                    {/* Key Features */}
                    {currentProject.features && currentProject.features.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2 text-sm">主な機能</h3>
                        <ul className="space-y-1.5">
                          {currentProject.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2 text-sm">
                              <span className="text-primary mt-0.5">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Challenges */}
                    {currentProject.challenges && currentProject.challenges.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2 text-sm">チャレンジ</h3>
                        <div className="space-y-2">
                          {currentProject.challenges.map((challenge, idx) => (
                            <div key={`challenge-${currentProject.id}-${idx}`} className="text-sm">
                              <div className="font-medium text-xs text-primary mb-0.5">課題</div>
                              <div className="text-xs text-muted-foreground mb-1">
                                {challenge.problem}
                              </div>
                              <div className="font-medium text-xs text-primary mb-0.5">解決策</div>
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
                    {currentProject.github && (
                      <Button asChild size="sm">
                        <a href={currentProject.github} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          GitHubで見る
                        </a>
                      </Button>
                    )}
                    {currentProject.demo && (
                      <Button asChild variant="outline" size="sm">
                        <a href={currentProject.demo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          デモを見る
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
