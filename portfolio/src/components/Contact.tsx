import { Mail } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { personalInfo, uiTexts } from '@/masterdata/profile';
import ScrollAnimation from './ScrollAnimation';

export default function Contact() {
  return (
    <section id="contact" className="relative container py-12 md:py-24 lg:py-32">
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      <ScrollAnimation animation="fadeUp">
        <div className="relative mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center z-10">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
            {uiTexts.contact.title}
          </h2>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            {uiTexts.contact.subtitle}
          </p>
        </div>
      </ScrollAnimation>

      <ScrollAnimation animation="scaleIn" delay={0.2}>
        <div className="relative mx-auto mt-12 max-w-2xl z-10">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>{uiTexts.contact.cardTitle}</CardTitle>
              <CardDescription>{uiTexts.contact.cardDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                <Button asChild size="lg" className="w-full">
                  <a
                    href={personalInfo.contact.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <FaXTwitter className="h-5 w-5" />X (Twitter): @rRarkHopper
                  </a>
                </Button>

                <Button asChild size="lg" variant="outline" className="w-full">
                  <a
                    href={`mailto:${personalInfo.contact.email}`}
                    className="flex items-center justify-center gap-2"
                  >
                    <Mail className="h-5 w-5" />
                    Email
                  </a>
                </Button>
              </div>

              <div className="pt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {uiTexts.contact.footer.text.split(uiTexts.contact.footer.highlightText)[0]}
                  <span className="font-semibold text-primary">
                    {uiTexts.contact.footer.highlightText}
                  </span>
                  {uiTexts.contact.footer.text.split(uiTexts.contact.footer.highlightText)[1]}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollAnimation>
    </section>
  );
}
