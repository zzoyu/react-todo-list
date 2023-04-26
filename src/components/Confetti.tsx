import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import Particle from "../Particle";

export interface ConfettiRef {
  addParticles: (title?: string) => void;
}

const Confetti = forwardRef(function Confetti({}, ref) {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const particles = useRef<Particle[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = () => {
    const ctx = canvasRef.current!.getContext("2d");

    if (!ctx || particles.current.length === 0) {
      setIsRunning(false);
      return;
    }
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.current.forEach((p, index) => {
      p.draw(ctx);

      if (p.move()) {
        // remove
        removeParticleFromList(index);
      }
    });

    requestAnimationFrame(draw);
  };

  const removeParticleFromList = (index: number) => {
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
      console.log("canvas", canvasRef.current);
      onresize = () => {
        canvasRef.current!.width = window.innerWidth;
        canvasRef.current!.height = window.innerHeight;
      };
      draw();
    }
  }, [canvasRef]);

  useEffect(() => {
    console.log("particles", particles);
  }, [particles]);

  const addParticles = (title?: string) => {
    const count = 15;
    const tempParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const x =
        Math.random() * window.innerWidth * 0.9 + window.innerWidth * 0.05;
      const y = Math.random() * window.innerHeight * 0.5;

      tempParticles.push(Particle.buildRandomParticleTo(x, y));
    }
    for (let i = 0; i < 5; i++) {
      // x is between 5% and 95% of the screen width

      const x =
        Math.random() * window.innerWidth * 0.9 + window.innerWidth * 0.05;
      const y = Math.random() * window.innerHeight * 0.5;

      tempParticles.push(Particle.buildRandomParticleTo(x, y, title));
    }
    particles.current = [...particles.current, ...tempParticles];
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
