import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

// ScrollTriggerプラグインを登録
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
    if (!elementRef.current) return;

    const element = elementRef.current;
    const childElements = element.children;

    // GSAPコンテキストを作成して適切なクリーンアップを行う
    const ctx = gsap.context(() => {
      // アニメーション設定
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

      // 初期状態を設定
      if (stagger > 0 && childElements.length > 0) {
        gsap.set(childElements, config.from);
      } else {
        gsap.set(element, config.from);
      }

      // ScrollTriggerを使用したアニメーションを作成
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
    }, element); // この要素にコンテキストをスコープ

    // クリーンアップ関数：すべてのGSAPアニメーションとScrollTriggerを削除
    return () => {
      ctx.revert(); // このコンテキスト内で作成されたすべてのGSAPアニメーションとScrollTriggerを削除
    };
  }, [animation, delay, duration, stagger]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
