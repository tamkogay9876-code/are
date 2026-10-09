export function esc(s:string):string {
  return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"} as Record<string,string>)[c]);
}
export function timeText(minutes:number):string {
  const wrapped=((Math.floor(minutes)%1440)+1440)%1440;
  return String(Math.floor(wrapped/60)).padStart(2,"0")+":"+String(wrapped%60).padStart(2,"0");
}
export function clamp(value:number,min:number,max:number):number {
  return Math.min(max,Math.max(min,value));
}