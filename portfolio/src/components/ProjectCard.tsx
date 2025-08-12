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
import type { Project } from '@/masterdata/profile';
import OngoingIndicator from './OngoingIndicator';

interface ProjectCardProps {
  project: Project;
  onProjectClick: (project: Project) => void;
  className?: string;
  contentClassName?: string;
}

export default function ProjectCard({
  project,
  onProjectClick,
  className = '',
  contentClassName = '',
}: ProjectCardProps) {
  return (
    <Card
      className={`overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative p-0 h-full ${className}`}
      onClick={() => onProjectClick(project)}
    >
      {/* Image with Ongoing indicator */}
      <div className="relative aspect-video bg-muted flex-shrink-0">
        {project.image && (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
        {project.isOngoing && (
          <div className="absolute top-3 right-3">
            <OngoingIndicator />
          </div>
        )}
      </div>
      <div className={`p-6 flex flex-col flex-1 justify-between ${contentClassName}`}>
        <div>
          <CardHeader className="p-0 pb-3">
            <div className="flex items-start justify-between mb-2">
              <Badge variant="outline" className="text-xs">
                {project.year}
              </Badge>
              {project.program && <Badge className="text-xs">{project.program}</Badge>}
            </div>
            <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
            <CardDescription className="text-sm mt-2 line-clamp-3">
              {project.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-3">
            {project.highlights && project.highlights.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {project.highlights.slice(0, 2).map((highlight) => (
                  <Badge
                    key={highlight}
                    variant="outline"
                    className="text-xs border-primary/50 text-primary"
                  >
                    {highlight}
                  </Badge>
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
        </div>
        <CardFooter className="p-0 pt-4">
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onProjectClick(project);
            }}
          >
            詳細を見る
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
