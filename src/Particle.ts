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

export default class Particle {
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
