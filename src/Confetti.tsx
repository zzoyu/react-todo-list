import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

// type union of particle types
const particleTypes = ["🎉", "🎀", "💖", "🎊", "💸", "🎁", "💰"];

class Particle {
  static buildRandomParticle() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const type =
      particleTypes[Math.floor(Math.random() * particleTypes.length)];
    const degree = Math.random() * 360;
    const radius = Math.random() * 30 + 10;
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    return new Particle(x, y, radius, degree, color, type);
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

export interface ConfettiRef {
  addParticles: () => void;
}

const Confetti = forwardRef(({}, ref) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sampleParticle = Particle.buildRandomParticle();
  let ctx: CanvasRenderingContext2D;

  const draw = () => {
    if (!canvasRef.current || particles.length === 0) return;
    ctx = canvasRef.current!.getContext("2d")!;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((p) => {
      if (!p.move()) {
        setParticles(particles.filter((particle) => particle !== p));
      }
      p.draw(ctx);
    });

    requestAnimationFrame(draw);
  };

  // update the canvas until the particles are all gone.
  useEffect(() => {
    if (isRunning) {
      draw();
    }
  }, [isRunning]);

  const addParticles = () => {
    particles.push(Particle.buildRandomParticle());
    particles.push(Particle.buildRandomParticle());
    particles.push(Particle.buildRandomParticle());
    particles.push(Particle.buildRandomParticle());
    particles.push(Particle.buildRandomParticle());
    particles.push(Particle.buildRandomParticle());
    setParticles(particles);
    setIsRunning(true);
  };

  useImperativeHandle(ref, () => ({
    addParticles,
  }));

  return (
    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
  );
});

export default Confetti;
