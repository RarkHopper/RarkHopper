import { Github, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { contactText, profile } from '@/masterdata/profile';
import ScrollAnimation from './ScrollAnimation';

export default function Contact() {
  return (
    <section id="contact" className="container py-12 md:py-24 lg:py-32">
      <ScrollAnimation animation="fadeUp">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
            {contactText.title}
          </h2>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            {contactText.subtitle}
          </p>
        </div>
      </ScrollAnimation>

      <ScrollAnimation animation="scaleIn" delay={0.2}>
        <div className="mx-auto mt-12 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>{contactText.cardTitle}</CardTitle>
              <CardDescription>{contactText.cardDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                <Button asChild size="lg" className="w-full">
                  <a
                    href={profile.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <Github className="h-5 w-5" />
                    GitHub: @{profile.name.nickname}
                  </a>
                </Button>

                <Button asChild size="lg" variant="outline" className="w-full">
                  <a
                    href={`https://discord.com/users/${profile.contact.discord}`}
                    className="flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="h-5 w-5" />
                    Discord: {profile.contact.discord}
                  </a>
                </Button>

                <Button asChild size="lg" variant="outline" className="w-full">
                  <a
                    href={`mailto:${profile.contact.email}`}
                    className="flex items-center justify-center gap-2"
                  >
                    <Mail className="h-5 w-5" />
                    Email
                  </a>
                </Button>
              </div>

              <div className="pt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {contactText.footer.text.split(contactText.footer.highlightText)[0]}
                  <span className="font-semibold text-primary">
                    {contactText.footer.highlightText}
                  </span>
                  {contactText.footer.text.split(contactText.footer.highlightText)[1]}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollAnimation>
    </section>
  );
}
