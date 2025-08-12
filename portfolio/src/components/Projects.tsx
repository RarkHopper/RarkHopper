import { useState } from 'react';
import type { Project } from '@/masterdata/profile';
import { projects } from '@/masterdata/profile';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
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

      <div className="relative mx-auto mt-12 z-10">
        {/* Mobile: Horizontal scrollable container */}
        <div className="lg:hidden relative">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {sortedProjects.map((project) => (
              <div key={project.id} className="flex-none w-[320px] md:w-[360px] snap-center h-full">
                <ProjectCard project={project} onProjectClick={handleProjectClick} />
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 bg-gradient-to-l from-background via-background/80 to-transparent w-20 h-full pointer-events-none md:hidden" />
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-background via-background/80 to-transparent w-20 h-full pointer-events-none md:hidden" />
        </div>

        {/* Desktop grid view for better overview */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-3 gap-6 auto-rows-fr">
            {sortedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onProjectClick={handleProjectClick} />
            ))}
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      <ProjectModal project={selectedProject} open={modalOpen} onOpenChange={setModalOpen} />
    </section>
  );
}
