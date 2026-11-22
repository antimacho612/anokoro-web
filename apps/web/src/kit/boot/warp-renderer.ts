import { createRandom } from "@anokoro/modem-sound";
import type { FragmentAsset, FragmentToken, PlannedFragment } from "./boot-fragments.ts";
import { eraPalette, rgba, type EraPalette } from "./era-palette.ts";
import type { OutlineFrame } from "./reveal-plan.ts";

export interface WarpFrame {
  elapsedMs: number;
  dtMs: number;
  speed: number;
  year: number;
  arrivalProgressRatio: number;
}

const STAR_COUNT = 260;
const FRAME_COUNT = 9;
const MAX_DPR = 2;
const MONO = '"BIZ UDGothic", "MS Gothic", "Osaka-Mono", "Noto Sans Mono CJK JP", monospace';
const SPEED_LAG_MS = 90;

const frac = (x: number): number => x - Math.floor(x);

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export class WarpRenderer {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly starAngle = new Float32Array(STAR_COUNT);
  private readonly starRadius = new Float32Array(STAR_COUNT);
  private readonly starDepth = new Float32Array(STAR_COUNT);
  private readonly spawnedAt = new Map<number, number>();
  private travel = 0;
  private speed = 0;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private readonly canvas: HTMLCanvasElement;
  private readonly fragments: readonly PlannedFragment[];
  private readonly images: ReadonlyMap<FragmentAsset, HTMLImageElement>;

  constructor(
    canvas: HTMLCanvasElement,
    fragments: readonly PlannedFragment[],
    images: ReadonlyMap<FragmentAsset, HTMLImageElement>,
    seed: number,
  ) {
    this.canvas = canvas;
    this.fragments = fragments;
    this.images = images;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas の 2D コンテキストを取得できません");
    this.ctx = ctx;
    const random = createRandom(seed ^ 0x5eed);
    for (let i = 0; i < STAR_COUNT; i++) {
      this.starAngle[i] = random() * Math.PI * 2;
      this.starRadius[i] = 0.12 + random() * 0.88;
      this.starDepth[i] = random();
    }
    this.resize();
  }

  resize(): void {
    this.dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
  }

  drawWarp(frame: WarpFrame): void {
    const { ctx } = this;
    const palette = eraPalette(frame.year);
    this.speed += (frame.speed - this.speed) * (1 - Math.exp(-frame.dtMs / SPEED_LAG_MS));
    const speed = Math.min(1, this.speed);
    this.travel += (frame.dtMs / 1000) * (0.05 + 1.65 * this.speed);
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.drawBackground(palette, speed);
    this.drawFrames(palette, speed);
    this.drawStars(palette, speed);
    this.drawFragments(palette, frame);
  }

  drawOutlines(outlines: readonly OutlineFrame[]): void {
    const { ctx } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);
    for (const { rect, alpha } of outlines) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = `rgb(0 0 0 / ${alpha * 0.5})`;
      ctx.strokeRect(rect.x + 1, rect.y + 1, rect.width, rect.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = `rgb(255 255 255 / ${alpha})`;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    }
  }

  private get halfDiagonal(): number {
    return Math.hypot(this.width, this.height) / 2;
  }

  private drawBackground(palette: EraPalette, speed: number): void {
    const { ctx, width, height } = this;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    const glow = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      this.halfDiagonal * 0.75,
    );
    glow.addColorStop(0, rgba(palette.glow, 0.1 + 0.45 * speed));
    glow.addColorStop(0.35, rgba(palette.glow, 0.05 + 0.12 * speed));
    glow.addColorStop(1, "rgb(0 0 0 / 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }

  private drawFrames(palette: EraPalette, speed: number): void {
    if (speed <= 0.01) return;
    const { ctx } = this;
    const scale = this.halfDiagonal * 0.09;
    const presence = smoothstep(0, 0.1, speed) * Math.min(1, 0.4 + speed);
    for (let j = 0; j < FRAME_COUNT; j++) {
      const depth = frac(j / FRAME_COUNT - this.travel * 0.55);
      if (depth < 0.04) continue;
      const alpha = presence * (1 - depth) * smoothstep(0.04, 0.16, depth) * 0.6;
      const w = (1.3 * scale) / depth;
      const h = (1.0 * scale) / depth;
      ctx.save();
      ctx.translate(this.width / 2, this.height / 2);
      ctx.rotate(depth * 0.5 + this.travel * 0.25);
      ctx.lineWidth = Math.min(10, 1.2 / depth);
      ctx.strokeStyle = rgba(palette.frame, alpha);
      ctx.fillStyle = rgba(palette.title, alpha * 0.7);
      ctx.beginPath();
      if (palette.rounded) ctx.roundRect(-w, -h, w * 2, h * 2, h * 0.08);
      else ctx.rect(-w, -h, w * 2, h * 2);
      ctx.stroke();
      ctx.fillRect(-w, -h, w * 2, h * 0.14);
      ctx.restore();
    }
  }

  private drawStars(palette: EraPalette, speed: number): void {
    const { ctx } = this;
    const cx = this.width / 2;
    const cy = this.height / 2;
    const scale = this.halfDiagonal * 0.06;
    const trail = 0.004 + 0.08 * speed;
    ctx.lineCap = "round";
    for (let i = 0; i < STAR_COUNT; i++) {
      const depth = frac(this.starDepth[i]! - this.travel);
      if (depth < 0.012) continue;
      const angle = this.starAngle[i]!;
      const r = this.starRadius[i]! * scale;
      const near = r / depth;
      const far = r / (depth + trail);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const alpha = (1 - depth) ** 1.3;
      ctx.strokeStyle = i % 3 === 0 ? rgba(palette.glow, alpha) : `rgb(255 255 255 / ${alpha})`;
      ctx.lineWidth = 0.6 + 1.8 * (1 - depth);
      ctx.beginPath();
      ctx.moveTo(cx + cos * far, cy + sin * far);
      ctx.lineTo(cx + cos * near, cy + sin * near);
      ctx.stroke();
    }
  }

  private drawFragments(palette: EraPalette, frame: WarpFrame): void {
    const { ctx } = this;
    const cx = this.width / 2;
    const cy = this.height / 2;
    const scale = this.halfDiagonal * 0.28;
    const unit = Math.max(12, Math.min(this.width, this.height) / 40);
    const leave = 1 - smoothstep(0, 0.5, frame.arrivalProgressRatio);
    this.fragments.forEach((fragment, index) => {
      if (fragment.atMsFromBoot > frame.elapsedMs) return;
      let spawned = this.spawnedAt.get(index);
      if (spawned === undefined) {
        spawned = this.travel;
        this.spawnedAt.set(index, spawned);
      }
      const depth = 1 - (this.travel - spawned) * 0.45;
      if (depth < 0.12) return;
      const alpha = smoothstep(1, 0.86, depth) * smoothstep(0.12, 0.3, depth) * leave;
      if (alpha <= 0) return;
      const offset = ((0.55 + fragment.radiusRatio * 0.6) * scale) / depth;
      const size = Math.min(unit * 4, (unit * 0.9) / depth);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(
        cx + Math.cos(fragment.angleRad) * offset,
        cy + Math.sin(fragment.angleRad) * offset,
      );
      ctx.rotate(fragment.tilt);
      this.drawToken(fragment.token, size, palette);
      ctx.restore();
    });
  }

  private drawToken(token: FragmentToken, size: number, palette: EraPalette): void {
    const { ctx } = this;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    switch (token.kind) {
      case "code": {
        ctx.font = `bold ${size}px ${MONO}`;
        ctx.shadowColor = rgba(palette.glow, 0.9);
        ctx.shadowBlur = size * 0.5;
        ctx.fillStyle = rgba(palette.text, 1);
        ctx.fillText(token.text, 0, 0);
        return;
      }
      case "line": {
        ctx.font = `bold ${size * 0.8}px ${MONO}`;
        const w = ctx.measureText(token.text).width + size;
        ctx.fillStyle = rgba(palette.frame, 0.9);
        ctx.beginPath();
        ctx.roundRect(-w / 2, -size * 0.65, w, size * 1.3, size * 0.3);
        ctx.fill();
        ctx.fillStyle = "#111";
        ctx.fillText(token.text, 0, 0);
        return;
      }
      case "resolution": {
        ctx.font = `bold ${size * 0.8}px ${MONO}`;
        const w = ctx.measureText(token.text).width + size * 1.2;
        const h = w * 0.62;
        ctx.strokeStyle = rgba(palette.text, 0.95);
        ctx.lineWidth = Math.max(1, size * 0.08);
        ctx.strokeRect(-w / 2, -h / 2, w, h);
        ctx.beginPath();
        ctx.moveTo(-w * 0.15, h / 2 + size * 0.5);
        ctx.lineTo(w * 0.15, h / 2 + size * 0.5);
        ctx.moveTo(0, h / 2);
        ctx.lineTo(0, h / 2 + size * 0.5);
        ctx.stroke();
        ctx.fillStyle = rgba(palette.text, 1);
        ctx.fillText(token.text, 0, 0);
        return;
      }
      case "counter": {
        ctx.font = `bold ${size}px ${MONO}`;
        const w = ctx.measureText(token.text).width + size * 0.6;
        ctx.fillStyle = "#000";
        ctx.fillRect(-w / 2, -size * 0.7, w, size * 1.4);
        ctx.strokeStyle = "#777";
        ctx.lineWidth = Math.max(1, size * 0.06);
        ctx.strokeRect(-w / 2, -size * 0.7, w, size * 1.4);
        ctx.fillStyle = "#4dff6a";
        ctx.shadowColor = "#4dff6a";
        ctx.shadowBlur = size * 0.4;
        ctx.fillText(token.text, 0, 0);
        return;
      }
      case "image": {
        const image = this.images.get(token.asset);
        if (!image?.complete || image.naturalWidth === 0) return;
        const h = size * 2.4;
        const w = (image.naturalWidth / image.naturalHeight) * h;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(image, -w / 2, -h / 2, w, h);
        return;
      }
    }
  }
}
