import "./style.css";
import { esc, timeText, beep } from "./data";
import {
 state, hasSave, restore, startShift, save, note, decide, call998,
 drive, checkRadio, fireShotgun, arriveHQ, finishInterrogation
} from "./game";

const app = document.querySelector<HTMLDivElement>("#app")!;

function frame():void {
 app.innerHTML='<div class="crt"><header><b>ARE YOU LYING?</b><span id="clock"></span><span id="phase"></span></header><main id="screen"></main></div>';
 const clock=document.querySelector("#clock"),phase=document.querySelector("#phase");
 if(clock)clock.textContent=state.phase==="ending"?"END":timeText(state.phase==="night"||state.phase==="interrogation"?1440+state.nightMinutes:state.clock);
 if(phase)phase.textContent=state.phase==="menu"?"SECURE HOUSING":state.phase==="day"?"DAY SHIFT":state.phase==="night"?"NIGHT INVESTIGATION":state.phase==="interrogation"?"CLASS-X INTERROGATION":"CASE CLOSED";
}
function render():void {
 if(state.phase==="menu")return menu();
 if(state.phase==="day")return renderDay();
 if(state.phase==="night")return renderNight();
 if(state.phase==="interrogation")return renderInterrogation();
 renderEnding();
}
function menu():void {
 frame();document.querySelector("#phase")!.textContent="SECURE HOUSING";
 document.querySelector("#screen")!.innerHTML='<section class="menu"><div class="menu-card"><div class="muted">NORTHGATE RESIDENTIAL CONTROL</div><h1 class="title">ARE YOU LYING?</h1><p class="note">CHECK THE ID. CHECK THE STORY. CHECK YOURSELF.</p><button id="start" class="btn">START SHIFT</button>'+(hasSave()?'<button id="continue" class="btn">CONTINUE</button>':"")+'<button id="reset" class="btn">RESET SAVE</button><p class="note">v0.1 prototype · hold right mouse button over the ID to magnify</p></div></section>';
 document.querySelector("#start")!.addEventListener("click",()=>{startShift();render();});
 document.querySelector("#continue")?.addEventListener("click",()=>{if(restore())render();else{startShift();render();}});
 document.querySelector("#reset")!.addEventListener("click",()=>{localStorage.removeItem("are-you-lying-v0.1-save");location.reload();});
}
function renderDay():void {
 frame();const v=state.current;if(!v){state.phase="menu";return menu();}
 document.querySelector("#screen")!.innerHTML='<div class="grid"><section class="panel"><h3>INCOMING RESIDENT</h3><div class="visitor"><div class="portrait" style="color:'+esc(v.color)+'">'+esc(v.name.split(" ").map(x=>x[0]).join(""))+'</div><div><div class="row"><span class="label">NAME</span><span class="value">'+esc(v.name)+'</span></div><div class="row"><span class="label">ROOM</span><span class="value">'+esc(v.room)+'</span></div><div class="row"><span class="label">PHRASE</span><span class="value">"'+esc(v.phrase)+'"</span></div><div class="row"><span class="label">VEHICLE</span><span class="value">'+esc(v.vehicle)+' / '+esc(v.plate)+'</span></div><p class="note">Compare the story and the records. A single detail may be the clue.</p><div class="actions"><button id="allow" class="btn good">ALLOW</button><button id="deny" class="btn bad">DENY</button><button id="call" class="btn">CALL 998</button></div></div></div></section><section class="panel"><h3>IDENTITY DOCUMENT <span class="muted">(RIGHT MOUSE TO ZOOM)</span></h3><div id="doc" class="doc"><b>NORTHGATE RESIDENT ID</b><hr><div class="row"><span class="label">NAME</span><span class="value">'+esc(v.name)+'</span></div><div class="row"><span class="label">DOB</span><span class="value">'+esc(v.dob)+'</span></div><div class="row"><span class="label">ROOM</span><span class="value">'+esc(v.room)+'</span></div><div class="row"><span class="label">ID NO.</span><span class="value">'+esc(v.id)+'</span></div><div class="row"><span class="label">MICROCODE</span><span class="value">'+v.micro+'</span></div></div></section><section class="panel"><h3>DATABASE / CROSS-CHECK</h3><div class="row"><span class="label">EMAIL</span><span class="value">'+esc(v.email)+'</span></div><div class="row"><span class="label">RELATIVE</span><span class="value">'+esc(v.relative)+'</span></div><div class="row"><span class="label">RIGHT NEIGHBOR</span><span class="value">'+esc(v.neighbor)+'</span></div><h3 style="margin-top:14px">QUESTIONS</h3><div class="questions"><button class="btn q" data-q="relative">Who is your closest relative?</button><button class="btn q" data-q="neighbor">Name the neighbor on your right.</button><button class="btn q" data-q="phrase">What do you usually say at home?</button></div><div id="reply" class="note">No question asked.</div></section><section class="panel"><h3>SHIFT STATUS</h3><div class="stats"><div class="stat"><span class="label">CORRECT</span><b>'+state.score.correct+'</b></div><div class="stat"><span class="label">MISTAKES</span><b>'+state.score.mistakes+'</b></div><div class="stat"><span class="label">TRUST</span><b>'+state.score.trust+'</b></div><div class="stat"><span class="label">SUSPICION</span><b>'+state.score.suspicion+'</b></div></div><p class="note">'+esc(state.message)+'</p><button id="board" class="btn">EVIDENCE BOARD</button></section><section class="panel" style="grid-column:span 2"><h3>EVIDENCE LOG</h3><div class="evidence">'+(state.evidence.map(x=>"<div>"+esc(x)+"</div>").join("")||"No evidence yet.")+'</div></section></div>';
 const doc=document.querySelector<HTMLDivElement>("#doc")!;doc.oncontextmenu=e=>e.preventDefault();doc.addEventListener("mousedown",e=>{if(e.button===2){doc.classList.add("magnify");beep(700,.06);}});window.addEventListener("mouseup",()=>doc.classList.remove("magnify"));
 document.querySelector("#allow")!.addEventListener("click",()=>{decide(true);render();});
 document.querySelector("#deny")!.addEventListener("click",()=>{decide(false);render();});
 document.querySelector("#call")!.addEventListener("click",()=>{call998();render();window.setTimeout(render,700);});
 document.querySelector("#board")!.addEventListener("click",renderBoard);
 document.querySelectorAll<HTMLButtonElement>(".q").forEach(b=>b.addEventListener("click",()=>{const q=b.dataset.q||"";const a=q==="relative"?v.relative:q==="neighbor"?v.neighbor:v.phrase;document.querySelector("#reply")!.textContent='Reply: "'+a+'".';note(v.name+": "+a);save();beep(360);}));
}
function renderBoard():void {
 frame();document.querySelector("#screen")!.innerHTML='<section class="panel"><h3>CASE BOARD</h3><p class="note">All clues collected during this shift.</p><div class="evidence">'+(state.evidence.map(x=>"<div>"+esc(x)+"</div>").join("")||"Empty.")+'</div><button id="back" class="btn">BACK TO SHIFT</button><button id="savecase" class="btn">SAVE CASE</button></section>';
 document.querySelector("#back")!.addEventListener("click",renderDay);document.querySelector("#savecase")!.addEventListener("click",()=>{save();renderBoard();});
}
function renderNight():void {
 frame();document.querySelector("#screen")!.innerHTML='<div class="night"><section class="panel"><h3>NIGHT DRIVE — ROUTE TO POLICE HQ</h3><div class="road"></div><div class="actions"><button id="drive" class="btn">DRIVE 10 MIN</button><button id="radio" class="btn">CHECK RADIO</button><button id="flare" class="btn">USE SHOTGUN ('+state.ammo+')</button></div><p class="note">'+esc(state.message)+'</p></section><aside class="panel"><h3>NIGHT STATUS</h3><div class="stats"><div class="stat">FUEL<b>'+state.fuel+'%</b></div><div class="stat">TIRES<b>'+state.tires+'%</b></div><div class="stat">AMMO<b>'+state.ammo+'</b></div><div class="stat">TIME<b>'+timeText(1440+state.nightMinutes)+'</b></div></div><button id="hq" class="btn good">ARRIVE AT HQ</button></aside></div>';
 document.querySelector("#drive")!.addEventListener("click",()=>{drive();render();});
 document.querySelector("#radio")!.addEventListener("click",()=>{checkRadio();render();});
 document.querySelector("#flare")!.addEventListener("click",()=>{fireShotgun();render();});
 document.querySelector("#hq")!.addEventListener("click",()=>{arriveHQ();render();});
}
function renderInterrogation():void {
 frame();document.querySelector("#screen")!.innerHTML='<section class="panel"><h3>F.A.F.E / CLASS-X INTERROGATION</h3><div class="visitor"><div class="doc" style="background:#111;color:#ddd;border-color:#566a78"><b>CLASS-X / FILE 000</b><hr><p>SUBJECT: UNKNOWN</p><p>ALIAS: THE PATIENT</p><p>WARNING: SUBJECT MAY MIRROR YOUR LANGUAGE.</p></div><div><p class="note">The subject watches through the glass.</p><button class="btn qx" data-q="name">What is your name?</button><button class="btn qx" data-q="why">Why do you imitate them?</button><button class="btn qx" data-q="me">What do you know about me?</button><div id="xreply" class="note"></div><button id="finish" class="btn good">END INTERROGATION</button></div></div></section>';
 document.querySelectorAll<HTMLButtonElement>(".qx").forEach(b=>b.addEventListener("click",()=>{const q=b.dataset.q||"";const a=q==="name"?"You already know my name.":q==="why"?"I imitate what you remember.":"Your file says you work here. It does not say you are from here.";document.querySelector("#xreply")!.textContent='SUBJECT: "'+a+'"';note("CLASS-X: "+a);save();}));
 document.querySelector("#finish")!.addEventListener("click",()=>{finishInterrogation();render();});
}
function renderEnding():void {
 frame();document.querySelector("#screen")!.innerHTML='<section class="ending"><div class="muted">NORTHGATE // CASE DISPOSITION</div><h1>'+esc(state.ending)+'</h1><p class="note">Correct decisions: '+state.score.correct+'</p><p class="note">Mistakes: '+state.score.mistakes+'</p><p class="note">Anomalies admitted: '+state.score.admitted+'</p><p class="note">Innocents rejected: '+state.score.rejected+'</p><p class="note">Police suspicion: '+state.score.suspicion+'</p><div class="actions"><button id="again" class="btn">NEW SHIFT</button><button id="menu" class="btn">MAIN MENU</button></div></section>';
 document.querySelector("#again")!.addEventListener("click",()=>{startShift();render();});document.querySelector("#menu")!.addEventListener("click",()=>{state.phase="menu";render();});
}
render();