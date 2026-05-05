import { useEffect, useRef } from "react";

export default function GoldenCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    document.body.classList.add("golden-cursor-active");

    const dot = dotRef.current;
    const ring = ringRef.current;
    let x = -100, y = -100;
    let rx = -100, ry = -100;
    let raf;

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
    };

    const animate = () => {
      dot.style.transform = `translate(${x}px, ${y}px)`;
      rx += (x - rx) * 0.12;
      ry += (y - ry) * 0.12;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(animate);
    };

    const onEnter = () => ring.classList.add("expanded");
    const onLeave = () => ring.classList.remove("expanded");

    const targets = document.querySelectorAll("a, button, [role='button'], input, textarea");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove("golden-cursor-active");
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
