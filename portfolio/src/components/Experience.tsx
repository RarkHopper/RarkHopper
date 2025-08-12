import { Briefcase, Rocket, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { experience, uiTexts } from '@/masterdata/profile';
import ScrollAnimation from './ScrollAnimation';

const experiences = [
  {
    category: uiTexts.experience.categories.work,
    icon: <Briefcase className="w-5 h-5" />,
    iconSrc: '/briefcase-icon.svg',
    items: experience.work,
  },
  {
    category: uiTexts.experience.categories.awards,
    icon: <Trophy className="w-5 h-5" />,
    iconSrc: '/trophy-icon.svg',
    items: experience.awards,
  },
  {
    category: uiTexts.experience.categories.activities,
    icon: <Rocket className="w-5 h-5" />,
    iconSrc: '/rocket-icon.svg',
    items: experience.activities,
  },
];

export default function Experience() {
  return (
    <section id="experience" className="container py-12 md:py-24 lg:py-32">
      <ScrollAnimation animation="fadeUp">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
            {uiTexts.experience.title}
          </h2>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            {uiTexts.experience.subtitle}
          </p>
        </div>
      </ScrollAnimation>

      <ScrollAnimation animation="fadeUp" delay={0.2}>
        <div className="mx-auto mt-12 max-w-7xl">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {experiences.flatMap((category) =>
              category.items.map((item, _itemIndex) => (
                <Card
                  key={`${category.category}-${item.title}`}
                  className="h-full flex flex-col relative overflow-hidden"
                >
                  {/* Category indicator */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 to-primary/20" />
                  <div className="absolute top-2 right-2">
                    {category.category === uiTexts.experience.categories.work && (
                      <Briefcase className="w-4 h-4 text-muted-foreground/50" />
                    )}
                    {category.category === uiTexts.experience.categories.awards && (
                      <Trophy className="w-4 h-4 text-muted-foreground/50" />
                    )}
                    {category.category === uiTexts.experience.categories.activities && (
                      <Rocket className="w-4 h-4 text-muted-foreground/50" />
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold pr-6">{item.title}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      <span className="font-medium">{item.role}</span>
                      <span className="text-muted-foreground/70"> • {item.period}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col"></CardContent>
                </Card>
              )),
            )}
          </div>
        </div>
      </ScrollAnimation>
    </section>
  );
}
