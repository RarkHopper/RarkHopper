import { gsap } from 'gsap';
import { GraduationCap, Mail } from 'lucide-react';
import { lazy, Suspense, useEffect, useRef } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { profile } from '@/masterdata/profile';

// Lazy load the 3D background component
const BackgroundScene = lazy(() => import('./BackgroundScene'));

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
        y: 20,
      });

      // Timeline animation
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Stagger animations
      tl.to(avatarRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      })
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          '-=0.3',
        )
        .to(
          textRefs.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
          },
          '-=0.3',
        )
        .to(
          buttonRefs.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
          },
          '-=0.2',
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative overflow-hidden">
      {/* 3D Background Scene */}
      <Suspense
        fallback={
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />
          </div>
        }
      >
        <BackgroundScene />
      </Suspense>

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/80 to-background/60" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-20">
          <div className="flex max-w-3xl flex-col items-center text-center">
            {/* Avatar */}
            <img
              ref={avatarRef}
              src="/user-icon.jpg"
              alt={`${profile.name.nickname} Avatar`}
              className="mb-8 h-32 w-32 rounded-full border-4 border-border object-cover shadow-lg"
            />

            {/* Name and title */}
            <h1
              ref={titleRef}
              className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            >
              {profile.name.nickname}
            </h1>

            <p
              ref={(el) => {
                textRefs.current[0] = el;
              }}
              className="mb-2 text-lg text-muted-foreground"
            >
              {profile.name.ja} / {profile.name.en}
            </p>

            {/* University info */}
            <div
              ref={(el) => {
                textRefs.current[1] = el as HTMLParagraphElement;
              }}
              className="mb-6 flex items-center gap-2 text-muted-foreground"
            >
              <GraduationCap className="h-4 w-4" />
              <span>
                {profile.university} {profile.department} {profile.grade}年
              </span>
            </div>

            {/* Bio */}
            <p
              ref={(el) => {
                textRefs.current[2] = el;
              }}
              className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {profile.bio.short}
              <span className="ml-1 opacity-80">{profile.bio.long}</span>
            </p>

            {/* CTA Buttons */}
            <div
              ref={(el) => {
                buttonRefs.current[0] = el;
              }}
              className="mb-8 flex flex-col gap-4 sm:flex-row"
            >
              <Button size="lg" asChild>
                <a href="#projects">View My Projects</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#contact">Contact Me</a>
              </Button>
            </div>

            {/* Social Links */}
            <div
              ref={(el) => {
                buttonRefs.current[1] = el;
              }}
              className="flex gap-1"
            >
              <Button variant="ghost" size="icon" asChild>
                <a
                  href={profile.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <FaGithub className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href={profile.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={`mailto:${profile.contact.email}`} aria-label="Email">
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
