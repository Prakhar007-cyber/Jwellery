"use client";

import { useEffect, useRef, useState } from "react";

/*
  Subtle custom cursor (desktop only).
  A small dot follows the pointer with a slight lag. Over elements
  marked with `data-cursor="view"` it grows into a "VIEW" label;
  `data-cursor="drag"` shows "DRAG". Disabled on touch devices.
*/
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Skip entirely on touch / coarse-pointer devices.
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    document.documentElement.classList.add("custom-cursor-active");

    const dot = dotRef.current!;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let curX = x;
    let curY = y;

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      setVisible(true);

      // Detect the nearest element that declares a cursor intent.
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]");
      setLabel(el ? (el.getAttribute("data-cursor") === "drag" ? "DRAG" : "VIEW") : null);
    };

    // Smooth follow loop.
    let frame = 0;
    const render = () => {
      curX += (x - curX) * 0.18;
      curY += (y - curY) * 0.18;
      dot.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    window.addEventListener("mousemove", move);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", move);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[300] hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s" }}
    >
      <div
        className={`grid place-items-center rounded-full border border-espresso/40 bg-ivory/30 backdrop-blur-[1px] transition-all duration-300 ${
          label ? "h-16 w-16" : "h-3 w-3"
        }`}
      >
        {label && <span className="eyebrow text-[0.55rem] text-espresso">{label}</span>}
      </div>
    </div>
  );
}
