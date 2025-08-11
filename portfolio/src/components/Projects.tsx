import { useState } from 'react';
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
import ProjectModalSimple from './ProjectModalSimple';
import ScrollAnimation from './ScrollAnimation';
import '@/styles/scrollbar.css';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleProjectClick = (project: Project) => {
    console.log('Projects: Opening modal for', project.id, project.title);
    console.log('Project object:', project);
    console.log('SortedProjects order:', sortedProjects.map(p => p.id));
    setSelectedProject(project);
    setModalOpen(true);
  };

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
          {/* Mobile: Horizontal scrollable container */}
          <div className="lg:hidden relative">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {sortedProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="flex-none w-[320px] md:w-[360px] snap-center"
                >
                  <ScrollAnimation animation="fadeUp" delay={0.1 * index}>
                    <Card
                      className="overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative p-0 h-full"
                      onClick={() => handleProjectClick(project)}
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
                              handleProjectClick(project);
                            }}
                          >
                            詳細を見る
                          </Button>
                        </CardFooter>
                      </div>
                    </Card>
                  </ScrollAnimation>
                </div>
              ))}
            </div>
            
            {/* Scroll indicator */}
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 bg-gradient-to-l from-background via-background/80 to-transparent w-20 h-full pointer-events-none md:hidden" />
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-background via-background/80 to-transparent w-20 h-full pointer-events-none md:hidden" />
          </div>

          {/* Desktop grid view for better overview */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-3 gap-6">
              {sortedProjects.map((project, index) => (
                <ScrollAnimation key={project.id} animation="fadeUp" delay={0.1 * index}>
                  <Card
                    className="overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative p-0 h-full"
                    onClick={() => handleProjectClick(project)}
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
                            handleProjectClick(project);
                          }}
                        >
                          詳細を見る
                        </Button>
                      </CardFooter>
                    </div>
                  </Card>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </div>
      </ScrollAnimation>

      {/* Project Detail Modal */}
      <ProjectModalSimple 
        project={selectedProject}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  );
}