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
  addParticles: () => void;
}

const Confetti = forwardRef(function Confetti({}, ref) {
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
