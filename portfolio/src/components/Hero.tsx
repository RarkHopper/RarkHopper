import { gsap } from 'gsap';
import { Github, Linkedin, Mail } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { profile } from '@/masterdata/profile';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([avatarRef.current, titleRef.current, ...textRefs.current, ...buttonRefs.current], {
        opacity: 0,
        y: 30,
      });

      // Set initial scale for avatar
      gsap.set(avatarRef.current, {
        scale: 0.8,
      });

      // Timeline animation
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Avatar animation with scale effect
      tl.to(avatarRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.7)',
      })
        .to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.2,
        })
        .to(
          textRefs.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
          },
          '-=0.5',
        )
        .to(
          buttonRefs.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
          },
          '-=0.3',
        );

      // Floating animation for gradient text
      gsap.to('.gradient-text', {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12 md:py-24 lg:py-32"
    >
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
        <img
          ref={avatarRef}
          src="/user-avatar.svg"
          alt={`${profile.name.nickname} Avatar`}
          className="w-24 h-24 md:w-32 md:h-32 mb-4 rounded-full shadow-xl"
        />
        <h1
          ref={titleRef}
          className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl lg:text-5xl xl:text-6xl"
        >
          Hi, I'm{' '}
          <span className="gradient-text bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {profile.name.nickname}
          </span>
        </h1>
        <p
          ref={(el) => {
            textRefs.current[0] = el;
          }}
          className="text-lg font-medium text-foreground mb-2"
        >
          {profile.name.ja} / {profile.name.en}
        </p>
        <p
          ref={(el) => {
            textRefs.current[1] = el;
          }}
          className="max-w-[750px] text-lg text-muted-foreground sm:text-xl"
        >
          {profile.university} {profile.department} {profile.grade}年
        </p>
        <p
          ref={(el) => {
            textRefs.current[2] = el;
          }}
          className="max-w-[850px] text-base text-muted-foreground mt-2"
        >
          {profile.bio.short}
          <br className="hidden sm:inline" />
          {profile.bio.long}
        </p>

        <div
          ref={(el) => {
            buttonRefs.current[0] = el;
          }}
          className="flex flex-wrap gap-4 mt-6"
        >
          <Button asChild size="lg">
            <a href="#projects">View My Work</a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="#contact">Get In Touch</a>
          </Button>
        </div>

        <div
          ref={(el) => {
            buttonRefs.current[1] = el;
          }}
          className="flex gap-4 mt-8"
        >
          <Button variant="ghost" size="icon" asChild>
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a
              href={profile.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href={`mailto:${profile.contact.email}`} aria-label="Email">
              <Mail className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
