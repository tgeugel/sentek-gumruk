import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import App from "./App";
import "./index.css";

function AuroraBackground() {
  return (
    <div className="aurora-bg" aria-hidden="true">
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
    </div>
  );
}

function NoiseOverlay() {
  return <div className="noise-overlay" aria-hidden="true" />;
}

function MouseGlowInit() {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const cards = document.querySelectorAll<HTMLElement>('.glow-card');
        cards.forEach(card => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty('--mouse-x', `${x}%`);
          card.style.setProperty('--mouse-y', `${y}%`);
        });
      });
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}

function Root() {
  return (
    <>
      <AuroraBackground />
      <NoiseOverlay />
      <MouseGlowInit />
      <App />
    </>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);
