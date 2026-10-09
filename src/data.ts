export type Person = {
  name:string; room:string; dob:string; id:string; email:string;
  relative:string; neighbor:string; phrase:string; vehicle:string; plate:string; color:string;
};
export type Visitor = Person & { anomaly:boolean; clue:string; micro:string };
export const residents:Person[] = [
 {name:"Maya Chen",room:"101",dob:"1998-03-14",id:"FAFE-101-8842",email:"maya.chen@northgate.local",relative:"Evan Chen",neighbor:"Jon Bell",phrase:"Back before midnight. Always.",vehicle:"White hatchback",plate:"NG-101",color:"#8ad3ff"},
 {name:"Daniel Carter",room:"203",dob:"1994-11-02",id:"FAFE-203-7719",email:"daniel.carter@northgate.local",relative:"Nora Carter",neighbor:"Park Kim",phrase:"Coffee first. Questions later.",vehicle:"Black sedan",plate:"NG-203",color:"#ffcc76"},
 {name:"Lena Ortiz",room:"207",dob:"1999-07-19",id:"FAFE-207-5521",email:"lena.ortiz@northgate.local",relative:"Marisol Ortiz",neighbor:"Ilya Petrov",phrase:"I hate being late.",vehicle:"Red compact",plate:"NG-207",color:"#ff8bb5"},
 {name:"Ilya Petrov",room:"209",dob:"1987-01-27",id:"FAFE-209-4910",email:"ilya.petrov@northgate.local",relative:"Tomas Petrov",neighbor:"Sana Ali",phrase:"The left elevator sticks.",vehicle:"Blue van",plate:"NG-209",color:"#a5ffbe"},
 {name:"Sana Ali",room:"301",dob:"2001-10-31",id:"FAFE-301-6612",email:"sana.ali@northgate.local",relative:"Amina Ali",neighbor:"Theo Marsh",phrase:"Do not touch my plants.",vehicle:"Silver coupe",plate:"NG-301",color:"#d0a5ff"},
 {name:"Theo Marsh",room:"304",dob:"1993-06-05",id:"FAFE-304-1905",email:"theo.marsh@northgate.local",relative:"Clara Marsh",neighbor:"Ruth Vale",phrase:"I can hear the pipes at night.",vehicle:"Green wagon",plate:"NG-304",color:"#9ba8ff"},
 {name:"Ruth Vale",room:"312",dob:"1989-12-09",id:"FAFE-312-7330",email:"ruth.vale@northgate.local",relative:"June Vale",neighbor:"Owen Reed",phrase:"Call me Ruth. Never Rebecca.",vehicle:"Gray pickup",plate:"NG-312",color:"#f6a1a1"},
 {name:"Owen Reed",room:"402",dob:"1996-02-23",id:"FAFE-402-8451",email:"owen.reed@northgate.local",relative:"Mara Reed",neighbor:"—",phrase:"I take the stairs for exercise.",vehicle:"Motorbike",plate:"NG-402",color:"#ffe28a"}
];
export const nightEvents = [
 "RADIO STATIC: something is following the car.",
 "LOW FUEL: the needle drops faster than expected.",
 "TIRE WARNING: pressure is falling.",
 "NO SIGNAL: GPS marks a road that does not exist.",
 "FIGURE ON ROAD: it stops when headlights hit it."
];
const clues = ["ID NUMBER MISMATCH","ROOM NUMBER MISMATCH","RELATIVE RECORD MISSING","NEIGHBOR RECORD MISMATCH","TIMELINE INCONSISTENCY","MICROCODE MISMATCH"];
export function makeVisitor(index:number):Visitor {
 const p=residents[index%residents.length], anomaly=Math.random()<.36;
 const clue=anomaly?clues[Math.floor(Math.random()*clues.length)]:"NONE";
 const v:Visitor={...p,anomaly,clue,micro:"NG-31-B"};
 if(clue==="ID NUMBER MISMATCH")v.id=v.id.slice(0,-1)+String((Number(v.id.slice(-1))+1)%10);
 if(clue==="ROOM NUMBER MISMATCH")v.room=String(Number(v.room)+1);
 if(clue==="RELATIVE RECORD MISSING")v.relative="MISSING RECORD";
 if(clue==="NEIGHBOR RECORD MISMATCH")v.neighbor="ROOM 000";
 if(clue==="TIMELINE INCONSISTENCY")v.phrase="I was never here before.";
 if(clue==="MICROCODE MISMATCH")v.micro="NG-31-A";
 return v;
}
export function esc(s:string):string {
 return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"} as Record<string,string>)[c]);
}
export function timeText(n:number):string {
 return String(Math.floor(n/60)%24).padStart(2,"0")+":"+String(n%60).padStart(2,"0");
}
export function beep(freq=440,duration=.08):void {
 try { const a=new AudioContext(),o=a.createOscillator(),g=a.createGain(); o.frequency.value=freq; g.gain.value=.02; o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+duration);o.onended=()=>void a.close(); } catch {}
}