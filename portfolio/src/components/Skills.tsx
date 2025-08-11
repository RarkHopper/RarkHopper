import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { skillCategories } from '@/masterdata/profile';
import ScrollAnimation from './ScrollAnimation';

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

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState(0);
  const categoryRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    // Animate category tabs
    categoryRefs.current.forEach((cat, index) => {
      if (!cat) return;
      gsap.fromTo(
        cat,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: index * 0.1,
          ease: 'power2.out',
        },
      );
    });
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: activeCategory is needed to re-trigger animation on tab change
  useEffect(() => {
    // Animate skill bars when category changes
    const bars = document.querySelectorAll('.skill-bar');

    bars.forEach((bar, index) => {
      const element = bar as HTMLElement;
      const targetWidth = element.getAttribute('data-width');

      gsap.fromTo(
        element,
        { width: 0 },
        {
          width: targetWidth,
          duration: 0.8,
          delay: index * 0.03,
          ease: 'power2.out',
        },
      );
    });
  }, [activeCategory]);

  return (
    <section id="skills" className="container py-12 md:py-24 lg:py-32">
      <ScrollAnimation animation="fadeUp">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center mb-8">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
            Technical Skills
          </h2>
        </div>
      </ScrollAnimation>

      <div className="mx-auto mt-12 max-w-3xl">
        {/* Category tabs */}
        <ScrollAnimation animation="fadeUp" delay={0.2}>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {skillCategories.map((category, index) => (
              <Button
                key={category.title}
                ref={(el) => {
                  categoryRefs.current[index] = el;
                }}
                variant={activeCategory === index ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(index)}
                className="transition-all"
              >
                {category.title}
                <span className="ml-2 text-xs opacity-70">({category.skills.length})</span>
              </Button>
            ))}
          </div>
        </ScrollAnimation>

        {/* Skills display */}
        <ScrollAnimation animation="fadeIn">
          <div className="bg-card rounded-lg p-6 border">
            <div className="space-y-4">
              {skillCategories[activeCategory].skills.map((skill) => (
                <div key={skill.name} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-xs text-muted-foreground">{skill.years}年</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`skill-bar h-full rounded-full ${getSkillColor(skill.years)}`}
                      data-width={getSkillWidth(skill.years)}
                      style={{ width: '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
