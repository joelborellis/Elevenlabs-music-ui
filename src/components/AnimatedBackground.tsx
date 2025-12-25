import { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * AnimatedBackground component
 * Creates subtle animated monochrome shapes in the background using GSAP.
 * Uses refs for DOM manipulation, no global querying.
 */
export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const shapes = shapesRef.current;
    
    // Animate each shape with unique parameters
    shapes.forEach((shape, index) => {
      const duration = 15 + Math.random() * 10;
      const delay = index * 2;
      
      // Floating animation
      gsap.to(shape, {
        y: () => `${-50 + Math.random() * 100}px`,
        x: () => `${-30 + Math.random() * 60}px`,
        rotation: () => Math.random() * 360,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay,
      });

      // Opacity pulse
      gsap.to(shape, {
        opacity: () => 0.02 + Math.random() * 0.03,
        duration: duration / 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay + Math.random() * 2,
      });
    });

    return () => {
      shapes.forEach((shape) => {
        gsap.killTweensOf(shape);
      });
    };
  }, []);

  const shapeData = [
    { size: 300, top: '10%', left: '5%', borderRadius: '40%' },
    { size: 200, top: '60%', left: '80%', borderRadius: '50%' },
    { size: 400, top: '40%', left: '60%', borderRadius: '30%' },
    { size: 150, top: '80%', left: '20%', borderRadius: '45%' },
    { size: 250, top: '20%', left: '70%', borderRadius: '35%' },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {shapeData.map((shape, index) => (
        <div
          key={index}
          ref={(el) => {
            if (el) shapesRef.current[index] = el;
          }}
          className="absolute border border-border/20"
          style={{
            width: shape.size,
            height: shape.size,
            top: shape.top,
            left: shape.left,
            borderRadius: shape.borderRadius,
            opacity: 0.03,
          }}
        />
      ))}
    </div>
  );
}
