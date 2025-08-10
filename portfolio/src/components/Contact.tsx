import { Github, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ScrollAnimation from './ScrollAnimation';

export default function Contact() {
  return (
    <section id="contact" className="container py-12 md:py-24 lg:py-32">
      <ScrollAnimation animation="fadeUp">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
            Get In Touch
          </h2>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            プロジェクトのご相談、技術的な質問、その他お気軽にご連絡ください
          </p>
        </div>
      </ScrollAnimation>

      <ScrollAnimation animation="scaleIn" delay={0.2}>
        <div className="mx-auto mt-12 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>以下のチャンネルからお気軽にご連絡ください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                <Button asChild size="lg" className="w-full">
                  <a
                    href="https://github.com/RarkHopper"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <Github className="h-5 w-5" />
                    GitHub: @RarkHopper
                  </a>
                </Button>

                <Button asChild size="lg" variant="outline" className="w-full">
                  <a
                    href="https://discord.com/users/RarkHopper"
                    className="flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="h-5 w-5" />
                    Discord: RarkHopper
                  </a>
                </Button>

                <Button asChild size="lg" variant="outline" className="w-full">
                  <a
                    href="mailto:contact@example.com"
                    className="flex items-center justify-center gap-2"
                  >
                    <Mail className="h-5 w-5" />
                    Email
                  </a>
                </Button>
              </div>

              <div className="pt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  現在、<span className="font-semibold text-primary">未踏IT</span>
                  のプロジェクトに注力していますが、
                  <br />
                  興味深いプロジェクトやコラボレーションの機会があれば
                  <br />
                  ぜひお声がけください！
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollAnimation>
    </section>
  );
}
