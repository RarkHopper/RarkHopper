import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isGlideReady, setIsGlideReady] = useState(false);

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

  // Initialize or update Glide
  const initializeGlide = useCallback(() => {
    if (!glideRef.current || !project) {
      console.log('Cannot initialize Glide: missing ref or project');
      return;
    }

    // Calculate the target index
    const targetIndex = sortedProjects.findIndex(p => p.id === project.id);
    const initialIndex = targetIndex >= 0 ? targetIndex : 0;
    
    console.log('Initializing Glide for project:', project.id, 'at index:', initialIndex);

    // Check if slides are ready
    const slidesElement = glideRef.current.querySelector('.glide__slides');
    if (!slidesElement || slidesElement.children.length === 0) {
      console.error('Slides not ready, retrying...');
      setTimeout(() => initializeGlide(), 100);
      return;
    }

    // Destroy existing instance
    if (glideInstance.current) {
      try {
        glideInstance.current.destroy();
      } catch (e) {
        console.error('Error destroying Glide:', e);
      }
      glideInstance.current = null;
      setIsGlideReady(false);
    }

    // Create new Glide instance
    console.log('Creating Glide with startAt:', initialIndex);
    const glide = new Glide(glideRef.current, {
      type: 'slider',
      startAt: initialIndex,
      perView: 1,
      gap: 0,
      keyboard: false,
      animationDuration: 400,
      animationTimingFunc: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
    });

    // Add event listeners
    glide.on('mount.before', () => {
      console.log('Before mount - glide.index:', glide.index, 'settings.startAt:', glide.settings.startAt);
    });

    glide.on('move.after', () => {
      setCurrentIndex(glide.index);
      console.log('Slide moved to:', glide.index);
    });

    glide.on('mount.after', () => {
      console.log('Glide mounted successfully, index:', glide.index);
      setIsGlideReady(true);
      
      // Always fix the transform to use percentage
      const slidesContainer = glideRef.current?.querySelector('.glide__slides') as HTMLElement;
      if (slidesContainer) {
        console.log('Original transform:', slidesContainer.style.transform);
        
        // Calculate and apply percentage-based transform
        const translateX = -(glide.index * 100);
        slidesContainer.style.transform = `translate3d(${translateX}%, 0, 0)`;
        console.log('Fixed transform to:', slidesContainer.style.transform);
        
        // Debug: Check slide visibility
        const slides = slidesContainer.querySelectorAll('.glide__slide');
        slides.forEach((slide, idx) => {
          const slideEl = slide as HTMLElement;
          console.log(`Slide ${idx}: visible=${slideEl.offsetWidth > 0}, offsetLeft=${slideEl.offsetLeft}`);
        });
      }
      
      // Set the current index
      setCurrentIndex(glide.index);
    });
    
    // Add a run.after event to fix transform after any movement
    glide.on('run.after', () => {
      const slidesContainer = glideRef.current?.querySelector('.glide__slides') as HTMLElement;
      if (slidesContainer) {
        const translateX = -(glide.index * 100);
        slidesContainer.style.transform = `translate3d(${translateX}%, 0, 0)`;
      }
    });

    // Mount Glide
    glide.mount();
    glideInstance.current = glide;
    setCurrentIndex(initialIndex);
  }, [project, sortedProjects]);

  // Initialize Glide when modal opens with the selected project
  useEffect(() => {
    if (open && project) {
      console.log('Modal opened with project:', project.id);
      // Give DOM time to render
      const timer = setTimeout(() => {
        initializeGlide();
      }, 100);

      return () => clearTimeout(timer);
    } else if (!open && glideInstance.current) {
      // Clean up when modal closes
      try {
        glideInstance.current.destroy();
      } catch (e) {
        console.error('Error destroying Glide on close:', e);
      }
      glideInstance.current = null;
      setIsGlideReady(false);
    }
  }, [open, project, initializeGlide]);

  if (!open) {
    return null;
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsNavigating(true);
    
    if (glideInstance.current && isGlideReady) {
      glideInstance.current.go('<');
      console.log('Navigate prev');
    }
    
    setTimeout(() => setIsNavigating(false), 100);
  };
  
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsNavigating(true);
    
    if (glideInstance.current && isGlideReady) {
      glideInstance.current.go('>');
      console.log('Navigate next');
    }
    
    setTimeout(() => setIsNavigating(false), 100);
  };
  
  const handleGoTo = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsNavigating(true);
    
    if (glideInstance.current && isGlideReady) {
      glideInstance.current.go(`=${index}`);
      console.log('Navigate to:', index);
    }
    
    setTimeout(() => setIsNavigating(false), 100);
  };

  return (
    <>
      {/* Navigation controls rendered through portal */}
      {open && ReactDOM.createPortal(
        <div data-modal-navigation="true">
          {/* Navigation arrows */}
          <button 
            className="fixed top-1/2 -translate-y-1/2 left-4 lg:left-8 w-12 h-12 rounded-full bg-background border-2 shadow-2xl flex items-center justify-center hover:bg-accent transition-colors z-[100] cursor-pointer"
            aria-label="Previous project"
            onMouseDown={handlePrev}
            type="button"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            className="fixed top-1/2 -translate-y-1/2 right-4 lg:right-8 w-12 h-12 rounded-full bg-background border-2 shadow-2xl flex items-center justify-center hover:bg-accent transition-colors z-[100] cursor-pointer"
            aria-label="Next project"
            onMouseDown={handleNext}
            type="button"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots indicator */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-[100] bg-background/90 backdrop-blur px-4 py-2 rounded-full shadow-xl">
            {sortedProjects.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-primary w-6' 
                    : 'bg-muted-foreground/50 hover:bg-muted-foreground/70'
                }`}
                onMouseDown={handleGoTo(index)}
                aria-label={`Go to project ${index + 1}`}
                type="button"
              />
            ))}
          </div>
        </div>,
        document.body
      )}

      <Dialog 
        open={open} 
        onOpenChange={(newOpen) => {
          // Don't close if we're navigating
          if (isNavigating) {
            return;
          }
          onOpenChange(newOpen);
        }}
      >
        <DialogContent 
          className="max-w-[1200px] w-[90vw] max-h-[85vh] p-0 overflow-hidden"
          onPointerDownOutside={(e) => {
            // Check if the click target is one of our navigation controls
            const target = e.target as HTMLElement;
            if (target.closest('[data-modal-navigation]')) {
              e.preventDefault();
            }
          }}
        >
          <VisuallyHidden>
            <DialogTitle>プロジェクト詳細</DialogTitle>
            <DialogDescription>プロジェクトの詳細情報を表示しています</DialogDescription>
          </VisuallyHidden>
          <div ref={glideRef} className="glide relative">
            <div className="glide__track" data-glide-el="track">
              <ul className="glide__slides">
                {sortedProjects.map((proj) => (
                  <li key={proj.id} className="glide__slide">
                    <div className="grid md:grid-cols-5 gap-0 h-full max-h-[85vh] overflow-y-auto">
                      {/* Left side - Image */}
                      <div className="md:col-span-2 relative h-[300px] md:h-full bg-muted">
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