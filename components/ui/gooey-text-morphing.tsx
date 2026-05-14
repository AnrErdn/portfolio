"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GooeyTextProps {
  texts: string[];
  morphTime?: number;
  cooldownTime?: number;
  className?: string;
  textClassName?: string;
}

export function GooeyText({
  texts,
  morphTime = 1,
  cooldownTime = 0.25,
  className,
  textClassName,
}: GooeyTextProps) {
  const text1Ref = React.useRef<HTMLSpanElement>(null);
  const text2Ref = React.useRef<HTMLSpanElement>(null);
  const uid = React.useId().replace(/:/g, "");
  const filterId = `gooey-${uid}`;

  React.useEffect(() => {
    let textIndex = 0;
    let phase: "cooldown" | "morph" = "cooldown";
    let elapsed = 0;

    const applyMorph = (fraction: number) => {
      if (!text1Ref.current || !text2Ref.current) return;
      // fraction 0→1: text2 fades out, text1 fades in
      const blur2 = Math.min(8 / Math.max(fraction, 0.001) - 8, 100);
      text2Ref.current.style.filter = `blur(${blur2}px)`;
      text2Ref.current.style.opacity = String(Math.pow(fraction, 0.4));
      const inv = 1 - fraction;
      const blur1 = Math.min(8 / Math.max(inv, 0.001) - 8, 100);
      text1Ref.current.style.filter = `blur(${blur1}px)`;
      text1Ref.current.style.opacity = String(Math.pow(inv, 0.4));
    };

    const showText2 = () => {
      if (!text1Ref.current || !text2Ref.current) return;
      text2Ref.current.style.filter = "";
      text2Ref.current.style.opacity = "1";
      text1Ref.current.style.filter = "";
      text1Ref.current.style.opacity = "0";
    };

    const loadTexts = () => {
      if (!text1Ref.current || !text2Ref.current) return;
      // text2 = current (visible), text1 = next (will morph in)
      text2Ref.current.textContent = texts[textIndex % texts.length];
      text1Ref.current.textContent = texts[(textIndex + 1) % texts.length];
    };

    loadTexts();
    showText2();

    // Track phase boundaries as absolute timestamps so we're immune to
    // any dt/clock throttling in background tabs or iframes
    let phaseStart = performance.now();

    const id = setInterval(() => {
      const now = performance.now();
      elapsed = (now - phaseStart) / 1000;

      if (phase === "cooldown") {
        if (elapsed >= cooldownTime) {
          textIndex = (textIndex + 1) % texts.length;
          loadTexts();
          phase = "morph";
          phaseStart = now;
          elapsed = 0;
        }
      } else {
        const fraction = Math.min(elapsed / morphTime, 1);
        if (fraction >= 1) {
          if (text1Ref.current && text2Ref.current) {
            text2Ref.current.textContent = text1Ref.current.textContent;
          }
          showText2();
          phase = "cooldown";
          phaseStart = now;
          elapsed = 0;
        } else {
          applyMorph(1 - fraction);
        }
      }
    }, 16);

    return () => clearInterval(id);
  }, [texts, morphTime, cooldownTime]);

  return (
    <div className={cn("relative", className)}>
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true" focusable="false">
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>

      {/* CSS grid stacks both spans on top of each other without absolute positioning */}
      <div className="grid" style={{ filter: `url(#${filterId})` }}>
        <span
          ref={text1Ref}
          className={cn("col-start-1 row-start-1 select-none", textClassName)}
          style={{ opacity: 0 }}
        />
        <span
          ref={text2Ref}
          className={cn("col-start-1 row-start-1 select-none", textClassName)}
        />
      </div>
    </div>
  );
}
