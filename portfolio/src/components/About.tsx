import { Card, CardContent } from '@/components/ui/card';
import { profile } from '@/masterdata/profile';
import ScrollAnimation from './ScrollAnimation';

export default function About() {
  return (
    <section id="about" className="container py-12 md:py-24 lg:py-32">
      <ScrollAnimation animation="fadeUp">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
            About Me
          </h2>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            {profile.about.subtitle}
          </p>
        </div>
      </ScrollAnimation>

      <ScrollAnimation animation="fadeIn" delay={0.2}>
        <div className="mx-auto mt-12 max-w-5xl">
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="space-y-6 p-0">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {profile.about.paragraphs.map((paragraph, index) => (
                  <p
                    key={paragraph.id}
                    className={`text-lg leading-relaxed ${index > 0 ? 'mt-4' : ''}`}
                  >
                    {paragraph.hasHighlight && paragraph.highlightText ? (
                      <>
                        {paragraph.text.split(paragraph.highlightText)[0]}
                        <span className="font-semibold text-primary">
                          {paragraph.highlightText}
                        </span>
                        {paragraph.text.split(paragraph.highlightText)[1]}
                      </>
                    ) : (
                      paragraph.text
                    )}
                  </p>
                ))}
              </div>

              <ScrollAnimation
                animation="scaleIn"
                stagger={0.1}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
              >
                {profile.about.highlights.map((highlight) => (
                  <Card key={highlight.title} className="text-center p-4">
                    <img
                      src={highlight.icon}
                      alt={highlight.title}
                      className="w-12 h-12 mx-auto mb-2"
                    />
                    <h3 className="font-semibold text-sm">{highlight.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{highlight.subtitle}</p>
                  </Card>
                ))}
              </ScrollAnimation>
            </CardContent>
          </Card>
        </div>
      </ScrollAnimation>
    </section>
  );
}
