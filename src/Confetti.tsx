import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

// type union of particle types
const particleTypes = [
  "참잘했어요",
  "니가짱이야",
  "👍",
  "가보자고",
  "🎉",
  "🎀",
  "💖",
  "🎊",
  "💸",
  "히트다히트",
  "💰",
];

class Particle {
  currentRadius: number;
  isClockwise: boolean;

  static buildRandomParticleTo(x: number, y: number) {
    const type =
      particleTypes[Math.floor(Math.random() * particleTypes.length)];
    const degree = Math.random() * 360;
    const radius = Math.random() * 30 + 20;
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    const speed = 2;
    return new Particle(x, y, radius, degree, color, type, speed);
  }
  constructor(
    public x: number,
    public y: number,
    public radius: number,
    public degree: number,
    public color: string,
    public type: string,
    public speed: number
  ) {
    this.x = x;
    this.y = y;
    this.currentRadius = radius;
    this.radius = radius;
    this.degree = degree;
    this.color = color;
    this.type = type;
    this.speed = speed;
    this.isClockwise = Math.random() > 0.5;
  }

  // 삭제할지 말지를 결정하는 함수
  move(): boolean {
    if (this.isClockwise) this.degree -= this.speed;
    else this.degree += this.speed;
    this.y += this.speed;

    // boundary check
    if (this.y < 0 || this.y - this.currentRadius * 2 > window.innerHeight)
      return true;
    return false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(this.x - (this.currentRadius * this.type.length) / 2, this.y);
    ctx.rotate(this.degree * (Math.PI / 180));
    ctx.fillStyle = this.color;
    ctx.font = `${this.currentRadius}px serif`;
    ctx.fillText(this.type, -this.currentRadius, this.currentRadius);
    ctx.restore();
  }
}

export interface ConfettiRef {
  addParticles: () => void;
}

const Confetti = forwardRef(function Conffeti({}, ref) {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const particles = useRef<Particle[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = () => {
    // console.log("draw", particles.current.length);
    const ctx = canvasRef.current!.getContext("2d");
    // console.log(ctx);

    if (!ctx || particles.current.length === 0) {
      setIsRunning(false);
      return;
    }
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // console.log("draw", particles);

    particles.current.forEach((p, index) => {
      p.draw(ctx);

      if (p.move()) {
        // remove
        removeParticleFromList(index);
        // console.log("removed");
      }
    });

    requestAnimationFrame(draw);
  };

  const removeParticleFromList = (index: number) => {
    // setParticles([...particles.splice(index, 1)]); // change this line using filter
    particles.current.splice(index, 1);

    if (particles.current.length === 0) {
      canvasRef.current!.getContext("2d")?.clearRect(0, 0, 0, 0);
      setIsRunning(false);
    }
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
      draw();
    }
  }, [canvasRef]);

  useEffect(() => {
    console.log("particles", particles);
  }, [particles]);

  const addParticles = () => {
    const count = 15;
    const tempParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const x =
        Math.random() * window.innerWidth * 0.9 + window.innerWidth * 0.05;
      const y = Math.random() * window.innerHeight * 0.5;

      tempParticles.push(Particle.buildRandomParticleTo(x, y));
    }
    // setParticles([...particles, ...tempParticles]);
    particles.current = [...particles.current, ...tempParticles];
    setIsRunning(true);
    console.log("added");
  };

  useImperativeHandle(ref, () => ({
    addParticles,
  }));

  return (
    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
  );
});

export default Confetti;
