import { Point } from "pixi.js";

export function lerp(start: number, end: number, t: number)
{
   return start + t * (end - start);
}

export function inverseLerp(start: number, end: number, value: number)
{
   return (value - start) / (end - start);
}

export function lerpColor(a:string, b:string, t:number)
{ 
   const ah = parseInt(a.replace(/#/g, ''), 16),
      ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
      bh = parseInt(b.replace(/#/g, ''), 16),
      br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
      rr = ar + t * (br - ar),
      rg = ag + t * (bg - ag),
      rb = ab + t * (bb - ab);

   return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}

export function vectorDotProduct(a: Point, b: Point): number 
{
   return a.x * b.x + a.y * b.y;
}

export function vectorLength(v: Point): number 
{
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function vectorAngleFromUp(a: Point): number
{
   const up = new Point(0, 1);
   const d = vectorDotProduct(a, up);
   const len = vectorLength(a);
   let radians = Math.acos(d / len);
   if (a.x > 1)
   {
      radians = Math.PI - radians;
   }
   return radians;
}