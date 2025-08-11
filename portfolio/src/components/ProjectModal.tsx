import { Calendar, Code, ExternalLink, Github, Trophy, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Project } from '@/masterdata/profile';

interface ProjectModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProjectModal({ project, open, onOpenChange }: ProjectModalProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-[90vw] lg:w-[1400px] max-h-[85vh] overflow-y-auto p-0">
        <div className="grid md:grid-cols-5 gap-0">
          {/* Left side - Image */}
          <div className="md:col-span-2 relative h-full min-h-[300px] bg-muted">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Code className="w-20 h-20 opacity-20" />
              </div>
            )}
            {project.isOngoing && (
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
              <DialogTitle className="text-2xl font-bold mb-2">
                {project.title}
              </DialogTitle>
              <DialogDescription className="text-base">
                {project.description}
              </DialogDescription>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{project.year}</span>
              </div>
              {project.program && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Trophy className="w-4 h-4" />
                  <span>
                    {project.program}
                    {project.status && ` - ${project.status}`}
                  </span>
                </div>
              )}
              {project.team && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{project.team}人チーム</span>
                </div>
              )}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-5">
              {/* Highlights and Tech Stack Row */}
              <div className="grid lg:grid-cols-2 gap-5">
                {/* Highlights */}
                {project.highlights && project.highlights.length > 0 && (
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                      <Trophy className="w-4 h-4" />
                      主な成果
                    </h3>
                    <ul className="space-y-2">
                      {project.highlights.map((highlight, index) => (
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
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Detailed Description */}
              {project.detailedDescription && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm">詳細説明</h3>
                  <div className="text-sm text-muted-foreground space-y-2">
                    {project.detailedDescription.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Features and Challenges Grid */}
              <div className="grid lg:grid-cols-2 gap-5">
                {/* Key Features */}
                {project.features && project.features.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-sm">主な機能</h3>
                    <ul className="space-y-1.5">
                      {project.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Challenges */}
                {project.challenges && project.challenges.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-sm">技術的な挑戦</h3>
                    <div className="space-y-2">
                      {project.challenges.map((challenge, index) => (
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
                {project.github && (
                  <Button asChild size="sm">
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      GitHubで見る
                    </a>
                  </Button>
                )}
                {project.demo && (
                  <Button asChild variant="outline" size="sm">
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      デモを見る
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}