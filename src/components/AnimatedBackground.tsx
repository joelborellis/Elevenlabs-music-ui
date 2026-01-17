import { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * AnimatedBackground component
 * Creates an artistic, analog-inspired background with floating shapes,
 * vinyl record motifs, and warm organic elements.
 */
export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement[]>([]);
  const linesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const shapes = shapesRef.current;
    const lines = linesRef.current;

    // Animate floating shapes
    shapes.forEach((shape, index) => {
      const duration = 20 + Math.random() * 15;
      const delay = index * 1.5;

      // Floating animation with gentle rotation
      gsap.to(shape, {
        y: () => `${-40 + Math.random() * 80}px`,
        x: () => `${-25 + Math.random() * 50}px`,
        rotation: () => -15 + Math.random() * 30,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay,
      });

      // Opacity pulse
      gsap.to(shape, {
        opacity: () => 0.03 + Math.random() * 0.04,
        duration: duration / 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay + Math.random() * 3,
      });
    });

    // Animate decorative lines
    lines.forEach((line, index) => {
      const duration = 12 + Math.random() * 8;
      const delay = index * 2;

      gsap.to(line, {
        scaleX: () => 0.8 + Math.random() * 0.4,
        opacity: () => 0.02 + Math.random() * 0.03,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: delay,
      });
    });

    return () => {
      shapes.forEach((shape) => gsap.killTweensOf(shape));
      lines.forEach((line) => gsap.killTweensOf(line));
    };
  }, []);

  // Organic shape definitions - vinyl/record inspired
  const shapeData = [
    // Large vinyl-like circles
    { size: 400, top: '5%', left: '-5%', type: 'vinyl', opacity: 0.04 },
    { size: 300, top: '60%', left: '85%', type: 'vinyl', opacity: 0.03 },

    // Abstract organic shapes
    { size: 250, top: '25%', left: '70%', type: 'blob', opacity: 0.035 },
    { size: 180, top: '75%', left: '10%', type: 'blob', opacity: 0.03 },
    { size: 350, top: '40%', left: '45%', type: 'blob', opacity: 0.025 },

    // Smaller accent circles
    { size: 100, top: '15%', left: '30%', type: 'circle', opacity: 0.04 },
    { size: 80, top: '85%', left: '60%', type: 'circle', opacity: 0.035 },
    { size: 120, top: '50%', left: '5%', type: 'circle', opacity: 0.03 },
  ];

  // Decorative line data
  const lineData = [
    { width: '40%', top: '20%', left: '10%', rotation: -5 },
    { width: '30%', top: '45%', left: '55%', rotation: 8 },
    { width: '25%', top: '70%', left: '25%', rotation: -3 },
    { width: '35%', top: '88%', left: '60%', rotation: 12 },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* Gradient backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 10%, hsl(var(--primary) / 0.03) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 80% 80%, hsl(var(--accent) / 0.025) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 50% 50%, hsl(var(--secondary) / 0.02) 0%, transparent 60%)
          `,
        }}
      />

      {/* Floating shapes */}
      {shapeData.map((shape, index) => (
        <div
          key={`shape-${index}`}
          ref={(el) => {
            if (el) shapesRef.current[index] = el;
          }}
          className="absolute"
          style={{
            width: shape.size,
            height: shape.size,
            top: shape.top,
            left: shape.left,
            opacity: shape.opacity,
          }}
        >
          {shape.type === 'vinyl' && (
            <div className="w-full h-full rounded-full border border-border/30 relative">
              {/* Vinyl grooves */}
              <div className="absolute inset-[15%] rounded-full border border-border/20" />
              <div className="absolute inset-[30%] rounded-full border border-border/20" />
              <div className="absolute inset-[45%] rounded-full border border-border/20" />
              {/* Center */}
              <div className="absolute inset-[40%] rounded-full bg-primary/10" />
            </div>
          )}

          {shape.type === 'blob' && (
            <div
              className="w-full h-full"
              style={{
                borderRadius: '60% 40% 50% 50% / 50% 60% 40% 50%',
                border: '1px solid hsl(var(--border) / 0.25)',
                background: `linear-gradient(135deg, hsl(var(--primary) / 0.02) 0%, transparent 100%)`,
              }}
            />
          )}

          {shape.type === 'circle' && (
            <div
              className="w-full h-full rounded-full"
              style={{
                border: '1px solid hsl(var(--accent) / 0.3)',
                background: `radial-gradient(circle at 30% 30%, hsl(var(--accent) / 0.05) 0%, transparent 70%)`,
              }}
            />
          )}
        </div>
      ))}

      {/* Decorative lines - tape deck inspired */}
      {lineData.map((line, index) => (
        <div
          key={`line-${index}`}
          ref={(el) => {
            if (el) linesRef.current[index] = el;
          }}
          className="absolute h-px"
          style={{
            width: line.width,
            top: line.top,
            left: line.left,
            transform: `rotate(${line.rotation}deg)`,
            opacity: 0.04,
            background: `linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.5) 20%, hsl(var(--accent) / 0.5) 80%, transparent 100%)`,
          }}
        />
      ))}

      {/* Corner accents */}
      <div
        className="absolute top-0 left-0 w-32 h-32"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary) / 0.03) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-48 h-48"
        style={{
          background: 'linear-gradient(-45deg, hsl(var(--accent) / 0.025) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
