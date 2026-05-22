"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
};

/**
 * Revela su contenido (fade + slide) la primera vez que entra en viewport.
 * Respeta prefers-reduced-motion vía CSS (.reveal en globals.css).
 */
export function Reveal({ children, as: Tag = "div", className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return createElement(
    Tag,
    {
      ref,
      className: `reveal ${visible ? "is-visible" : ""} ${className}`,
      style: { transitionDelay: `${delay}ms` },
    } as Record<string, unknown>,
    children,
  );
}
