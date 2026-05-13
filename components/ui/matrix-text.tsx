"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface LetterState {
  char: string;
  isMatrix: boolean;
  isSpace: boolean;
}

interface MatrixTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  /** Controlled trigger — fires animation when flips to true. */
  trigger?: boolean;
  initialDelay?: number;
  letterAnimationDuration?: number;
  letterInterval?: number;
  /** If set, the animation repeats every N milliseconds after it finishes. */
  repeatInterval?: number;
}

export function MatrixText({
  text,
  className,
  style,
  trigger,
  initialDelay = 0,
  letterAnimationDuration = 400,
  letterInterval = 80,
  repeatInterval,
}: MatrixTextProps) {
  const [letters, setLetters] = useState<LetterState[]>(() =>
    text.split("").map((char) => ({
      char,
      isMatrix: false,
      isSpace: char === " ",
    }))
  );

  const isAnimating = useRef(false);
  const hasRun      = useRef(false);

  const getRandomChar = useCallback(
    () => (Math.random() > 0.5 ? "1" : "0"),
    []
  );

  const runAnimation = useCallback(() => {
    if (isAnimating.current) return;
    if (!repeatInterval && hasRun.current) return;
    isAnimating.current = true;
    hasRun.current = true;

    let currentIndex = 0;

    const step = () => {
      if (currentIndex >= text.length) {
        isAnimating.current = false;
        if (repeatInterval) {
          setTimeout(runAnimation, repeatInterval);
        }
        return;
      }

      const idx = currentIndex;
      setLetters((prev) => {
        const next = [...prev];
        if (!next[idx].isSpace) {
          next[idx] = { ...next[idx], char: getRandomChar(), isMatrix: true };
        }
        return next;
      });

      setTimeout(() => {
        setLetters((prev) => {
          const next = [...prev];
          next[idx] = { ...next[idx], char: text[idx], isMatrix: false };
          return next;
        });
      }, letterAnimationDuration);

      currentIndex++;
      setTimeout(step, letterInterval);
    };

    step();
  }, [text, getRandomChar, letterAnimationDuration, letterInterval, repeatInterval]);

  // Controlled trigger (hero phase)
  useEffect(() => {
    if (trigger === undefined) return;
    if (!trigger) return;
    const t = setTimeout(runAnimation, initialDelay);
    return () => clearTimeout(t);
  }, [trigger, initialDelay, runAnimation]);

  // Auto-start when no trigger prop supplied
  useEffect(() => {
    if (trigger !== undefined) return;
    const t = setTimeout(runAnimation, initialDelay);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span
      className={cn("inline", className)}
      style={style}
      aria-label={text}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          animate={letter.isMatrix ? "matrix" : "normal"}
          variants={{
            matrix: {
              color: "#A3FF47",
              textShadow: "0 0 16px rgba(163,255,71,0.7)",
            },
            normal: {
              color: "inherit",
              textShadow: "none",
            },
          }}
          transition={{ duration: 0.08, ease: "easeInOut" }}
          style={{ display: "inline" }}
        >
          {letter.isSpace ? " " : letter.char}
        </motion.span>
      ))}
    </span>
  );
}
