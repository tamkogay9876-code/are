export type RandomSource = () => number;
export function chance(probability:number, random:RandomSource=Math.random):boolean {
  return random() < Math.max(0,Math.min(1,probability));
}
export function randomIndex(length:number, random:RandomSource=Math.random):number {
  if (!Number.isInteger(length) || length <= 0) throw new RangeError("length must be a positive integer");
  return Math.min(length-1,Math.floor(random()*length));
}
export function pick<T>(items:readonly T[], random:RandomSource=Math.random):T {
  if (!items.length) throw new RangeError("Cannot pick from an empty collection");
  return items[randomIndex(items.length,random)];
}