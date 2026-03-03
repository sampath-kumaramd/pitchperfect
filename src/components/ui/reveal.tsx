'use client';

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={cn(
        'opacity-0',
        isVisible && 'animate-fade-up',
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards',
      }}
    >
      {children}
    </div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  staggerMs?: number;
}

export function StaggerContainer({ children, staggerMs = 80 }: StaggerContainerProps) {
  return (
    <>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === Reveal) {
          return React.cloneElement(child, {
            delay: index * staggerMs,
          } as Partial<RevealProps>);
        }
        return child;
      })}
    </>
  );
}
