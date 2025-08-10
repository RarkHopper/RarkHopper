import { gsap } from 'gsap';
import { Briefcase, Code, Rocket, Trophy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { experience, experienceText, skillCategories } from '@/masterdata/profile';
import ScrollAnimation from './ScrollAnimation';

const experiences = [
  {
    category: experienceText.categories.work,
    icon: <Briefcase className="w-4 h-4" />,
    items: experience.work,
  },
  {
    category: experienceText.categories.awards,
    icon: <Trophy className="w-4 h-4" />,
    items: experience.awards,
  },
  {
    category: experienceText.categories.activities,
    icon: <Rocket className="w-4 h-4" />,
    items: experience.activities,
  },
];

const getSkillWidth = (years: number) => {
  // Max 5 years = 100%
  const percentage = Math.min((years / 5) * 100, 100);
  return `${percentage}%`;
};

const getSkillColor = (years: number) => {
  if (years >= 4) return 'bg-primary';
  if (years >= 2) return 'bg-primary/60';
  return 'bg-primary/30';
};

export default function SkillsAndExperience() {
  const [activeSkillCategory, setActiveSkillCategory] = useState(0);
  const skillRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Animate skill bars when category changes
    skillRefs.current.forEach((skill, index) => {
      if (!skill) return;

      const bar = skill.querySelector('.skill-bar');
      if (!bar) return;

      gsap.fromTo(
        bar,
        { width: 0 },
        {
          width: bar.getAttribute('data-width'),
          duration: 0.8,
          delay: index * 0.03,
          ease: 'power2.out',
        },
      );
    });
  }, []);

  return (
    <section className="relative container py-12 md:py-24 lg:py-32">
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      <ScrollAnimation animation="fadeUp">
        <div className="relative mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center mb-12 z-10">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
            Skills & Experience
          </h2>
        </div>
      </ScrollAnimation>

      <div className="relative mx-auto max-w-7xl z-10">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Skills Section */}
          <ScrollAnimation animation="fadeUp" delay={0.1}>
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Code className="w-5 h-5" />
                <h3 className="text-xl font-semibold">Technical Skills</h3>
              </div>

              {/* Skill category tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {skillCategories.map((category, index) => (
                  <Button
                    key={category.title}
                    variant={activeSkillCategory === index ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveSkillCategory(index)}
                    className="text-xs"
                  >
                    {category.title}
                  </Button>
                ))}
              </div>

              {/* Skills list with progress bars */}
              <Card className="h-[400px] overflow-y-auto">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {skillCategories[activeSkillCategory].skills.map((skill, skillIndex) => (
                      <div
                        key={skill.name}
                        ref={(el) => {
                          skillRefs.current[skillIndex] = el;
                        }}
                        className="group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-xs text-muted-foreground">{skill.years}年</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`skill-bar h-full rounded-full transition-all ${getSkillColor(skill.years)}`}
                            data-width={getSkillWidth(skill.years)}
                            style={{ width: 0 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollAnimation>

          {/* Experience Section */}
          <ScrollAnimation animation="fadeUp" delay={0.2}>
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-5 h-5" />
                <h3 className="text-xl font-semibold">Experience & Activities</h3>
              </div>

              <div className="space-y-6">
                {experiences.map((category, categoryIndex) => (
                  <div key={category.category} className={categoryIndex > 0 ? '' : ''}>
                    <div className="space-y-2">
                      {category.items.map((item) => (
                        <div
                          key={`${category.category}-${item.title}`}
                          className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                        >
                          <div className="shrink-0">{category.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium truncate">{item.title}</span>
                              <span className="text-xs text-muted-foreground">{item.period}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">{item.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
