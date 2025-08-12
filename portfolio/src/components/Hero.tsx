import { gsap } from 'gsap';
import { GraduationCap, Mail } from 'lucide-react';
import { lazy, Suspense, useEffect, useRef } from 'react';
import { FaGithub, FaXTwitter } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { personalInfo } from '@/masterdata/profile';

// Lazy load the 3D background component
const BackgroundScene = lazy(() => import('./BackgroundScene'));

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLDivElement | null)[]>([]);
  const programsRef = useRef<HTMLDivElement>(null);

  // Typed setter function for text refs
  const setTextRef = (index: number) => (el: HTMLParagraphElement | null) => {
    textRefs.current[index] = el;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([avatarRef.current, titleRef.current, ...textRefs.current, ...buttonRefs.current], {
        opacity: 0,
        y: 20,
      });

      // Program logos appear immediately without animation
      gsap.set(programsRef.current, {
        opacity: 1,
        y: 0,
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
        <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center py-20">
          <div className="flex max-w-3xl flex-col items-center text-center">
            {/* Avatar */}
            <img
              ref={avatarRef}
              src="/user-icon.jpg"
              alt={`${personalInfo.name.nickname} Avatar`}
              className="mb-8 h-32 w-32 rounded-full border-4 border-border object-cover shadow-lg"
            />

            {/* Name and title */}
            <h1
              ref={titleRef}
              className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            >
              {personalInfo.name.nickname}
            </h1>

            <p ref={setTextRef(0)} className="mb-2 text-lg text-muted-foreground">
              {personalInfo.name.ja} / {personalInfo.name.en}
            </p>

            {/* University info */}
            <p ref={setTextRef(1)} className="mb-6 flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="h-4 w-4" />
              <span>
                {personalInfo.university} {personalInfo.department} {personalInfo.grade}年
              </span>
            </p>

            {/* Bio */}
            <p
              ref={setTextRef(2)}
              className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {personalInfo.bio.short}
              <span className="ml-1 opacity-80">{personalInfo.bio.long}</span>
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
                  href={personalInfo.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <FaGithub className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href={personalInfo.contact.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                >
                  <FaXTwitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={`mailto:${personalInfo.contact.email}`} aria-label="Email">
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Program Logos Cards - positioned at right top */}
          <div
            ref={programsRef}
            className="absolute -right-4 sm:-right-6 lg:-right-8 top-8 hidden lg:block"
          >
            <div className="flex flex-col items-end gap-1">
              <p className="text-xs text-muted-foreground/60 px-3 pb-1">Achievements</p>
              <div className="flex flex-row gap-2">
                {personalInfo.programs.map((program) => (
                  <a
                    key={program.id}
                    href={program.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden transition-all duration-500 hover:-translate-y-1"
                  >
                    <div
                      className="relative p-2.5
                    bg-black/[0.02] dark:bg-white/[0.02] backdrop-blur-md border border-black/[0.03] dark:border-white/[0.05] rounded-xl
                    hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:border-black/[0.06] dark:hover:border-white/10
                    transition-all duration-300"
                    >
                      <img
                        src={program.logo}
                        alt={program.name}
                        className="h-12 w-12 object-contain"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
