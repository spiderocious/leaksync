'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms, applied via CSS transition-delay. */
  delay?: number;
}

/**
 * IntersectionObserver-gated one-shot reveal. Pure CSS transition,
 * honors prefers-reduced-motion via globals.css.
 */
export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties | undefined = delay
    ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties)
    : undefined;

  return (
    <div ref={ref} className={`reveal ${visible ? 'is-revealed' : ''} ${className}`} style={style}>
      {children}
    </div>
  );
}
