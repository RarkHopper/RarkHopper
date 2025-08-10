import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeUp' | 'fadeIn' | 'scaleIn' | 'slideInLeft' | 'slideInRight';
  delay?: number;
  duration?: number;
  stagger?: number;
}

export default function ScrollAnimation({
  children,
  className = '',
  animation = 'fadeUp',
  delay = 0,
  duration = 0.8,
  stagger = 0,
}: ScrollAnimationProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register ScrollTrigger plugin inside useEffect
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    if (!elementRef.current) return;

    const element = elementRef.current;
    const childElements = element.children;

    // Animation configurations
    const animations = {
      fadeUp: {
        from: { opacity: 0, y: 50 },
        to: { opacity: 1, y: 0 },
      },
      fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      scaleIn: {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1 },
      },
      slideInLeft: {
        from: { opacity: 0, x: -100 },
        to: { opacity: 1, x: 0 },
      },
      slideInRight: {
        from: { opacity: 0, x: 100 },
        to: { opacity: 1, x: 0 },
      },
    };

    const config = animations[animation];

    // Set initial state
    if (stagger > 0 && childElements.length > 0) {
      gsap.set(childElements, config.from);
    } else {
      gsap.set(element, config.from);
    }

    // Create animation with ScrollTrigger
    const scrollTriggerConfig = {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none reset',
    };

    if (stagger > 0 && childElements.length > 0) {
      gsap.to(childElements, {
        ...config.to,
        duration,
        delay,
        stagger,
        ease: 'power3.out',
        scrollTrigger: scrollTriggerConfig,
      });
    } else {
      gsap.to(element, {
        ...config.to,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: scrollTriggerConfig,
      });
    }

    // Cleanup
    return () => {
      // Kill all ScrollTrigger instances related to this element
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element || trigger.trigger?.parentElement === element) {
          trigger.kill();
        }
      });

      // Refresh ScrollTrigger after cleanup
      ScrollTrigger.refresh();
    };
  }, [animation, delay, duration, stagger]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
