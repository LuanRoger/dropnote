"use client";

import { useEffect, useRef } from "react";

export function ViewportContainer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const vh = window.innerHeight;
        containerRef.current.style.height = `${vh}px`;
      }
    };

    updateHeight();

    window.addEventListener("resize", updateHeight);
    window.addEventListener("orientationchange", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("orientationchange", updateHeight);
    };
  }, []);

  return (
    <div
      className="p-2"
      ref={containerRef}
      style={{
        height: "100dvh",
      }}
    >
      {children}
    </div>
  );
}
