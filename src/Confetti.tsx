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
  currentRadius: number;

  static buildRandomParticleTo(x: number, y: number) {
    const type =
      particleTypes[Math.floor(Math.random() * particleTypes.length)];
    const degree = Math.random() * 360;
    const radius = Math.random() * 10 + 5;
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
    this.currentRadius = radius / 2;
    this.radius = radius;
    this.degree = degree;
    this.color = color;
    this.type = type;
  }

  // 삭제할지 말지를 결정하는 함수
  move(): boolean {
    // move the particle based on the degree and gets down by gravity
    this.x += Math.cos((this.degree * Math.PI) / 180);
    this.y += Math.sin((this.degree * Math.PI) / 180);

    // falling down by gravity
    this.degree += 0.5;

    if (this.currentRadius <= this.radius) this.currentRadius += 0.1;

    // add speed
    this.y += 0.5;

    // boundary check
    if (
      this.x > window.innerWidth + this.radius ||
      this.x < -this.radius ||
      this.y > window.innerHeight + this.radius ||
      this.y < -this.radius
    )
      return true;
    return false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.font = `${this.currentRadius * 2}px serif`;
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

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
  }, []);

  const addParticles = () => {
    const count = Math.floor(Math.random() * 10 + 10);

    const x = Math.random() * window.innerWidth * 0.8;
    const y = Math.random() * window.innerHeight * 0.8;

    for (let i = 0; i < count; i++)
      particles.push(Particle.buildRandomParticleTo(x, y));
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
