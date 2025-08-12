import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { timeline } from '@/masterdata/profile';
import ScrollAnimation from './ScrollAnimation';

export default function Timeline() {
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const dotsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    // Animate left side items
    itemsRef.current.forEach((item, index) => {
      if (!item) return;

      gsap.fromTo(
        item,
        {
          opacity: 0,
          x: -50,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: index * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      );
    });

    // Animate right side dots
    dotsRef.current.forEach((dot, index) => {
      if (!dot) return;

      gsap.fromTo(
        dot,
        {
          scale: 0,
        },
        {
          scale: 1,
          duration: 0.5,
          delay: index * 0.15 + 0.4,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: dot,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      );
    });

    // Animate timeline line
    const line = document.querySelector('.timeline-line');
    if (line) {
      gsap.fromTo(
        line,
        { scaleY: 0, transformOrigin: 'top' },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: line,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      );
    }
  }, []);

  const getPosition = (year: string, month: number) => {
    const startYear = 2020;
    const startMonth = 1;
    const endYear = 2025;
    const endMonth = 12;

    const yearNum = parseInt(year);
    const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth);
    const eventMonths = (yearNum - startYear) * 12 + (month - startMonth);

    return (eventMonths / totalMonths) * 100;
  };

  return (
    <section className="container py-12 md:py-24 lg:py-32">
      <ScrollAnimation animation="fadeUp">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center mb-12">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
            Timeline
          </h2>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">これまでの歩み</p>
        </div>
      </ScrollAnimation>

      <div className="mx-auto max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Left side - Event list */}
          <div className="space-y-4">
            {timeline.map((event, index) => (
              <button
                key={`${event.year}-${event.month}-${index}`}
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
                type="button"
                className={`group relative flex gap-3 p-4 rounded-lg transition-all duration-300 w-full ${
                  hoveredIndex === index ? 'bg-primary/10 scale-105' : 'hover:bg-muted/50'
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setHoveredIndex(hoveredIndex === index ? null : index);
                  }
                }}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-sm transition-all duration-300 ${
                    hoveredIndex === index
                      ? 'bg-primary text-primary-foreground scale-110'
                      : 'bg-primary/20 text-primary'
                  }`}
                >
                  {event.age}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {event.year}年{event.month}月
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Right side - Visual timeline */}
          <div className="relative h-full min-h-[500px] flex items-center justify-center">
            <div className="relative w-full h-full max-w-xs mx-auto">
              {/* Timeline background */}
              <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-muted/5 rounded-xl" />

              {/* Year markers */}
              <div className="absolute top-4 left-4 right-4 flex flex-col justify-between h-[calc(100%-2rem)]">
                <span className="text-xs text-muted-foreground font-mono">2020</span>
                <span className="text-xs text-muted-foreground font-mono">2021</span>
                <span className="text-xs text-muted-foreground font-mono">2022</span>
                <span className="text-xs text-muted-foreground font-mono">2023</span>
                <span className="text-xs text-muted-foreground font-mono">2024</span>
                <span className="text-xs text-muted-foreground font-mono">2025</span>
              </div>

              {/* Timeline line */}
              <div className="timeline-line absolute left-1/2 top-8 bottom-8 w-0.5 bg-border -translate-x-1/2" />

              {/* Event dots */}
              {timeline.map((event, index) => {
                const position = getPosition(event.year, event.month);
                return (
                  <button
                    key={`${event.year}-${event.month}-${index}`}
                    ref={(el) => {
                      dotsRef.current[index] = el;
                    }}
                    type="button"
                    className="absolute left-1/2 -translate-x-1/2 cursor-pointer"
                    style={{
                      top: `${8 + position * 0.84}%`,
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setHoveredIndex(hoveredIndex === index ? null : index);
                      }
                    }}
                  >
                    {/* Dot with connecting line */}
                    <div className="relative">
                      {/* Horizontal line to label */}
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 h-px bg-primary/40 transition-all duration-300 ${
                          hoveredIndex === index ? 'w-12' : 'w-6'
                        } ${index % 2 === 0 ? '-left-6' : 'left-4'}`}
                      />

                      {/* Dot */}
                      <div
                        className={`relative flex items-center justify-center transition-all duration-300 ${
                          hoveredIndex === index ? 'scale-150' : 'hover:scale-125'
                        }`}
                      >
                        <div
                          className={`h-4 w-4 rounded-full transition-all duration-300 ${
                            hoveredIndex === index
                              ? 'bg-primary shadow-lg shadow-primary/50'
                              : 'bg-primary/60'
                          }`}
                        />
                        {hoveredIndex === index && (
                          <div className="absolute h-8 w-8 rounded-full bg-primary/20 animate-ping" />
                        )}
                      </div>
                    </div>

                    {/* Label */}
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap ${
                        index % 2 === 0 ? 'right-8 text-right' : 'left-8 text-left'
                      }`}
                    >
                      <div
                        className={`transition-all duration-300 ${
                          hoveredIndex === index ? 'opacity-100 scale-100' : 'opacity-60 scale-90'
                        }`}
                      >
                        <div className="text-xs font-medium text-foreground">{event.title}</div>
                        <div className="text-xs text-muted-foreground">{event.month}月</div>
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Progress indicator */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span>Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
