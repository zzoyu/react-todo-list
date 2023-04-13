import { useEffect, useRef, useState } from "react";

// type union of particle types
const particleTypes = ["🎉", "🎀", "💖", "🎊", "💸", "🎁", "💰"];

class Particle {
  static buildRandomParticle() {
    const type =
      particleTypes[Math.floor(Math.random() * particleTypes.length)];
    const degree = Math.random() * 360;
    const radius = Math.random() * 3 + 1;
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    return new Particle(0, 0, radius, degree, color, type);
  }
  constructor(
    public x: number,
    public y: number,
    public radius: number,
    public degree: number,
    public color: string,
    public type: string
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.degree = degree;
    this.color = color;
    this.type = type;
  }

  move(): boolean {
    this.x += Math.cos(this.degree * (Math.PI / 180));
    this.y += Math.sin(this.degree * (Math.PI / 180));

    this.degree += Math.random() * 10 - 5;

    this.radius -= 0.01;

    if (this.radius < 0) {
      this.radius = 0;
    }

    return this.radius > 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.font = `${this.radius * 2}px serif`;
    ctx.fillText(this.type, this.x, this.y);
    ctx.restore();
  }
}

export default function Confetti(isDoneEventFired: boolean) {
  const [isRunning, setIsRunning] = useState<boolean>(isDoneEventFired);
  const [particles, setParticles] = useState<Particle[]>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isRunning) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const particles = Array.from({ length: 100 }).map(() =>
            Particle.buildRandomParticle()
          );
          setParticles(particles);
        }
      }

      const interval = setInterval(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const newParticles = particles?.filter((p) => p.move());
            setParticles(newParticles);

            newParticles?.forEach((p) => p.draw(ctx));
          }
        }
      }, 1000 / 60);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  return (
    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
  );
}
