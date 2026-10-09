import * as THREE from "three";
import { residents, type Person } from "../data/residents";
import { createPixelPortraitSprite } from "./pixel-character";
import "./style.css";

type Visitor = Person & { anomaly:boolean; clue:string };
type Interactive = { object:THREE.Object3D; action:()=>void };

const $=<T extends HTMLElement>(id:string)=>document.getElementById(id) as T;
const root=$("game3d");
const scene=new THREE.Scene();
scene.background=new THREE.Color("#171621");
scene.fog=new THREE.Fog("#171621",14,28);
const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,70);
camera.position.set(0,2.55,7.9);
camera.lookAt(0,1.55,-1.9);

// Render internally at a deliberately small resolution; CSS enlarges it with nearest-neighbour sampling.
const renderer=new THREE.WebGLRenderer({antialias:false,powerPreference:"high-performance"});
renderer.setPixelRatio(1);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.NoToneMapping;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.domElement.className="pixel-scene";
renderer.domElement.style.imageRendering="pixelated";
root.prepend(renderer.domElement);

function resize():void {
  const scale=Math.max(.8,Math.min(3,innerWidth/320,innerHeight/180));
  const w=Math.max(320,Math.round(innerWidth/scale));
  const h=Math.max(180,Math.round(innerHeight/scale));
  renderer.setSize(w,h,false);
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
}
resize();
window.addEventListener("resize",resize);

const ambient=new THREE.HemisphereLight("#d5c9ce","#241c2b",1.2);scene.add(ambient);
const key=new THREE.DirectionalLight("#e7d2bc",1.25);key.position.set(-3,7,4);key.castShadow=true;scene.add(key);
const deskLamp=new THREE.PointLight("#f2bd80",1.5,7);deskLamp.position.set(-1.5,2.35,-.8);scene.add(deskLamp);
const warningLight=new THREE.PointLight("#d34450",.65,4);warningLight.position.set(2.5,2,-3.4);scene.add(warningLight);

const material=(color:string,roughness=1,extra:Partial<THREE.MeshStandardMaterialParameters>={})=>new THREE.MeshStandardMaterial({color,roughness,flatShading:true,...extra});
const MAT={
  wall:material("#514451"),wallLight:material("#796172"),floor:material("#51434a"),
  dark:material("#292630"),black:material("#171820"),wood:material("#67443b"),
  woodLight:material("#94634f"),metal:material("#65646b",.86,{metalness:.15}),
  paper:material("#d8c8ad"),paperShade:material("#b3a48d"),
  screen:material("#172f38",.8,{emissive:"#234954",emissiveIntensity:.6}),
  screenLight:material("#74c0c2",.8,{emissive:"#2c787e",emissiveIntensity:.65}),
  red:material("#b84c52",.8,{emissive:"#57151f",emissiveIntensity:.35}),
  plant:material("#557652"),gold:material("#b29469",.8,{metalness:.18}),
  glass:material("#8dabb4",.35,{transparent:true,opacity:.35}),
  outline:material("#241d29")
};

function box(name:string,pos:[number,number,number],size:[number,number,number],mat:THREE.Material,outline=false):THREE.Mesh {
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size),mat);
  mesh.name=name;mesh.position.set(...pos);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);
  if(outline){
    const edges=new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry),new THREE.LineBasicMaterial({color:"#28212a"}));
    edges.name=name+"_ink";edges.position.copy(mesh.position);edges.rotation.copy(mesh.rotation);edges.scale.copy(mesh.scale);scene.add(edges);
  }
  return mesh;
}
function cylinder(name:string,pos:[number,number,number],r:number,h:number,mat:THREE.Material,segments=8):THREE.Mesh {
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,segments),mat);
  mesh.name=name;mesh.position.set(...pos);mesh.castShadow=true;scene.add(mesh);return mesh;
}
function sphere(name:string,pos:[number,number,number],size:[number,number,number],mat:THREE.Material):THREE.Mesh {
  const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,8,6),mat);mesh.name=name;mesh.position.set(...pos);mesh.scale.set(...size);mesh.castShadow=true;scene.add(mesh);return mesh;
}
function label(text:string,pos:[number,number,number],color="#302630"):THREE.Mesh {
  const canvas=document.createElement("canvas");canvas.width=128;canvas.height=24;
  const ctx=canvas.getContext("2d")!;ctx.imageSmoothingEnabled=false;ctx.fillStyle=color;ctx.font="bold 10px monospace";ctx.fillText(text,3,16);
  const texture=new THREE.CanvasTexture(canvas);texture.magFilter=THREE.NearestFilter;texture.minFilter=THREE.NearestFilter;texture.colorSpace=THREE.SRGBColorSpace;
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1.6,.3),new THREE.MeshBasicMaterial({map:texture,transparent:true,side:THREE.DoubleSide}));
  mesh.name="SIGN_"+text.replace(/[^A-Z0-9]+/gi,"_");mesh.position.set(...pos);scene.add(mesh);return mesh;
}

// ROOM: painted mauve walls, dark floor, trim, and a framed visitor window.
// Geometry stays genuinely 3D; the camera is fixed like a desk-inspection game.
box("ENV_floor",[0,-.13,0],[10,.26,10],MAT.floor,true);
box("ENV_back_wall",[0,2.1,-4.55],[10,4.2,.18],MAT.wall,true);
box("ENV_left_wall",[-4.95,2.1,0],[.18,4.2,9.2],MAT.wall,true);
box("ENV_right_wall",[4.95,2.1,0],[.18,4.2,9.2],MAT.wall,true);
// Visitor window is staged as a framed opening in the back wall.
box("ENV_window_backing",[-.72,2.05,-4.38],[3.0,2.56,.12],MAT.wallLight,true);
box("ENV_window_inner",[-.72,2.05,-4.29],[2.72,2.28,.035],MAT.dark);
box("ENV_window_glass",[-.72,2.05,-4.20],[2.52,2.08,.02],MAT.glass);
box("ENV_window_top",[-.72,3.35,-4.08],[3.12,.16,.3],MAT.metal,true);
box("ENV_window_bottom",[-.72,.75,-4.08],[3.12,.16,.3],MAT.metal,true);
box("ENV_window_left",[-2.20,2.05,-4.08],[.16,2.48,.3],MAT.metal,true);
box("ENV_window_right",[.76,2.05,-4.08],[.16,2.48,.3],MAT.metal,true);
box("ENV_window_sill",[-.72,.66,-3.91],[3.05,.18,.5],MAT.woodLight,true);

// Original pixel character sprite, billboarded in the 3D window.
let visitorSprite=createPixelPortraitSprite("#3b596b");
visitorSprite.position.set(-.72,.83,-4.02);scene.add(visitorSprite);
const visitorShadow=box("CHAR_shadow",[-.72,.03,-3.94],[.8,.035,.15],MAT.dark);
visitorShadow.material=material("#312a35",1,{transparent:true,opacity:.5});

// Security notices and folders in the background.
box("ENV_notice_board",[3.28,2.35,-4.34],[2.35,2.1,.12],MAT.dark,true);
box("ENV_notice_paper",[3.28,2.35,-4.25],[2.05,1.82,.025],MAT.paper,true);
for(let i=0;i<5;i++)box("ENV_notice_rule",[3.18,2.95-i*.27,-4.22],[1.48,.025,.02],MAT.paperShade);
label("IDENTITY / 998",[2.65,3.11,-4.19]);
box("ENV_warning_plate",[3.25,.9,-4.29],[1.5,.47,.08],MAT.red,true);
label("CHECK TWICE",[2.61,.89,-4.23],"#f2dfbc");
box("ENV_side_door",[4.45,1.43,-2.45],[.48,2.85,.12],MAT.wood,true);
box("ENV_side_door_glass",[4.44,2.05,-2.37],[.27,.58,.025],MAT.screen);
cylinder("ENV_door_knob",[4.15,1.35,-2.32],.05,.07,MAT.gold,8);
for(let x=-4;x<=4;x+=2)box("ENV_baseboard",[x,.12,-4.42],[1.9,.18,.08],MAT.dark);

// Desk foreground: thick, angled edges make the geometry read like a low-poly diorama.
box("PRP_desk_top",[0,.99,-.05],[4.35,.18,1.7],MAT.wood,true);
box("PRP_desk_front",[0,.55,.72],[4.08,.72,.18],MAT.woodLight,true);
box("PRP_desk_left_leg",[-1.83,.40,-.02],[.22,.8,1.32],MAT.wood,true);
box("PRP_desk_right_leg",[1.83,.40,-.02],[.22,.8,1.32],MAT.wood,true);
box("PRP_desk_dark_inset",[0,.60,.815],[2.65,.42,.025],MAT.wood);
box("PRP_desk_edge_highlight",[0,1.09,.70],[4.1,.045,.08],MAT.gold);

// Terminal with chunky pixel lettering.
box("PRP_monitor_flare",[0,1.66,-.76],[1.45,.91,.20],MAT.dark,true);
box("PRP_monitor_bezel",[0,1.66,-.645],[1.29,.75,.03],MAT.woodLight);
box("PRP_monitor_glass",[0,1.67,-.62],[1.17,.63,.025],MAT.screen);
label("NORTHGATE / 998",[-.66,1.83,-.59],"#9bd3cf");
for(let i=0;i<4;i++)box("PRP_monitor_line",[-.32,1.55-i*.09,-.585],[.46-(i%2)*.12,.025,.012],MAT.screenLight);
cylinder("PRP_monitor_stand",[0,1.20,-.72],.07,.35,MAT.metal,8);
box("PRP_monitor_base",[0,1.16,-.72],[.56,.05,.26],MAT.metal);
box("PRP_keyboard",[0,1.105,.12],[.93,.07,.32],MAT.dark,true);
for(let i=0;i<18;i++)box("PRP_keyboard_key",[-.40+(i%9)*.10,1.15,.025+Math.floor(i/9)*.13],[.065,.018,.06],i%7===0?MAT.screenLight:MAT.woodLight);

// Telephone 998. This is a mesh-built prop, not a flat icon.
const phone=box("PRP_phone_base",[1.30,1.12,-.12],[.62,.14,.48],MAT.dark,true);
box("PRP_phone_face",[1.30,1.205,-.12],[.49,.025,.34],MAT.woodLight);
box("PRP_phone_display",[1.30,1.225,-.05],[.27,.018,.08],MAT.red);
label("998",[1.13,1.23,-.015],"#f9d9bb");
for(let i=0;i<12;i++)cylinder("PRP_phone_key",[1.14+(i%3)*.16,1.235,-.22+Math.floor(i/3)*.07],.022,.02,MAT.paper,8);
box("PRP_phone_handset",[1.30,1.34,-.32],[.47,.075,.08],MAT.metal,true);
sphere("PRP_phone_earpiece_l",[1.08,1.34,-.32],[.085,.08,.075],MAT.dark);
sphere("PRP_phone_earpiece_r",[1.52,1.34,-.32],[.085,.08,.075],MAT.dark);

// ID card and magnifier.
const id=box("PRP_resident_ID",[-1.03,1.11,-.18],[.78,.045,.52],MAT.paper,true);
box("PRP_id_photo",[-1.28,1.14,-.12],[.15,.012,.23],MAT.wood);
for(let i=0;i<4;i++)box("PRP_id_line",[-.98,1.14,-.32+i*.10],[.30-(i%2)*.08,.012,.02],MAT.dark);
box("PRP_id_barcode",[-.99,1.14,-.39],[.35,.012,.025],MAT.dark);
const lens=new THREE.Mesh(new THREE.TorusGeometry(.17,.035,5,12),MAT.gold);lens.name="PRP_magnifier_ring";lens.position.set(-1.72,1.14,-.28);scene.add(lens);
const lensGlass=new THREE.Mesh(new THREE.CircleGeometry(.145,12),new THREE.MeshBasicMaterial({color:"#82c5cd",transparent:true,opacity:.32}));lensGlass.position.set(-1.72,1.14,-.295);scene.add(lensGlass);
box("PRP_magnifier_handle",[-1.57,1.01,-.26],[.065,.27,.07],MAT.gold,true);

// Other familiar desk props.
cylinder("PRP_lamp_base",[-1.75,1.12,-.91],.17,.05,MAT.metal,8);
cylinder("PRP_lamp_stem",[-1.75,1.41,-.91],.035,.55,MAT.gold,8);
sphere("PRP_lamp_shade",[-1.75,1.69,-.91],[.22,.12,.18],MAT.woodLight);
box("PRP_case_folder",[1.9,1.11,-.42],[.45,.035,.55],MAT.paper,true);
box("PRP_case_label",[1.9,1.135,-.42],[.26,.01,.09],MAT.red);
cylinder("PRP_alarm_button",[2.0,1.18,-.03],.13,.12,MAT.red,12);
cylinder("PRP_alarm_button_cap",[2.0,1.25,-.03],.09,.045,MAT.red,12);
cylinder("PRP_plant_pot",[-3.25,.35,-1.6],.23,.48,MAT.woodLight,8);
for(let i=0;i<7;i++){const a=i*2.399;const leaf=sphere("PRP_plant_leaf",[-3.25+Math.cos(a)*.15,.68+(i%3)*.08,-1.6+Math.sin(a)*.15],[.075,.24,.075],MAT.plant);leaf.rotation.z=Math.cos(a)*.45;leaf.rotation.x=Math.sin(a)*.45;}
box("PRP_calendar_frame",[3.35,1.3,-4.18],[1.1,.6,.06],MAT.dark,true);
box("PRP_calendar_paper",[3.35,1.3,-4.13],[.97,.49,.025],MAT.paper);
label("NORTHGATE  /  OCT",[2.91,1.34,-4.10]);

// Camera and semantic hotspots.
const interactives:Interactive[]=[];
function addHotspot(obj:THREE.Object3D,action:()=>void){interactives.push({object:obj,action});}
let visitor:Visitor;
let visitorIndex=0;
let clockMinutes=360;
let trust=50;
let shiftStarted=false;
let magnified=false;
let phase:"day"|"night"="day";
let flare=1;
let fuel=100;
let tires=100;
const raycaster=new THREE.Raycaster();
const pointer=new THREE.Vector2();

function toast(message:string):void{
  const node=$("toast");node.textContent=message;node.classList.add("visible");
  window.setTimeout(()=>node.classList.remove("visible"),2300);
}
function timeString(n:number):string{return String(Math.floor(n/60)%24).padStart(2,"0")+":"+String(n%60).padStart(2,"0");}
function log(message:string):void{
  const entry=document.createElement("p");entry.className="log-entry";
  entry.textContent="["+timeString(clockMinutes)+"] "+message;
  $("evidence").prepend(entry);while($("evidence").children.length>5)$("evidence").lastElementChild?.remove();
}
function buildVisitor(index:number):Visitor{
  const p=residents[index%residents.length];
  const anomaly=Math.random()<Math.min(.58,.28+index*.025);
  const v:Visitor={...p,anomaly,clue:"NONE"};
  if(anomaly){
    const choices=["ID NUMBER MISMATCH","RELATIVE NOT IN DATABASE","NEIGHBOR RECORD MISMATCH","MICROCODE ANOMALY"];
    v.clue=choices[Math.floor(Math.random()*choices.length)];
    if(v.clue===choices[0])v.id=v.id.slice(0,-1)+String((Number(v.id.slice(-1))+1)%10);
    else if(v.clue===choices[1])v.relative="NO VERIFIED RECORD";
    else if(v.clue===choices[2])v.neighbor="ROOM 000";
    else v.micro="NG-99-X";
  }
  return v;
}
function updateVisitor():void{
  $("visitor-name").textContent=visitor.name;
  $("visitor-room").textContent="UNIT "+visitor.room;
  $("visitor-avatar").textContent=visitor.name.split(" ").map(n=>n[0]).join("");
  $("id-record").textContent=visitor.id;
  $("relative-record").textContent=visitor.relative;
  $("neighbor-record").textContent=visitor.neighbor;
  $("micro-record").textContent=visitor.micro;
  $("magnifier-code").textContent=visitor.micro;
  visitorSprite.material=visitorSprite.material as THREE.SpriteMaterial;
  const oldMat=visitorSprite.material as THREE.SpriteMaterial;
  const newSprite=createPixelPortraitSprite(visitor.color);
  visitorSprite.material=newSprite.material;
  visitorSprite.scale.copy(newSprite.scale);visitorSprite.center.copy(newSprite.center);
  // Release the texture from the previous resident to avoid leaking GPU resources.
  oldMat.map?.dispose();oldMat.dispose();
}
function setTrust(amount:number):void{
  trust=THREE.MathUtils.clamp(trust+amount,0,100);
  $("trust-value").textContent=trust+"%";$("trust-bar").style.width=trust+"%";
}
function showNightPanel():void{
  phase="night";$("phase-title").textContent="A road with no signal.";
  $("status-copy").textContent="The police station is three hours away. The radio has started whispering.";
  $("records").innerHTML='<div><span>FUEL</span><b id="fuel-record">100%</b></div><div><span>TIRES</span><b id="tire-record">100%</b></div><div><span>DISTRESS FLARE</span><b id="flare-record">1 flare</b></div><div><span>ROUTE</span><b>POLICE HQ</b></div>';
  $("action-buttons").innerHTML='<button id="drive" class="primary">DRIVE 10 MIN <kbd>W</kbd></button><button id="radio" class="danger">CHECK RADIO <kbd>R</kbd></button><button id="flare" class="wide">USE EMERGENCY FLARE <kbd>F</kbd></button><button id="hq" class="wide ghost">ARRIVE AT HQ <kbd>H</kbd></button>';
  const nightMat=material("#080b17");
  scene.background=new THREE.Color("#080b17");scene.fog=new THREE.Fog("#080b17",7,20);
  deskLamp.intensity=.15;warningLight.intensity=.2;
  // The scene remains fixed-camera; the outside/window becomes a stylized night vignette.
  visitorSprite.visible=false;
  box("NIGHT_window_dark",[-.72,2.05,-4.16],[2.45,2.0,.025],nightMat);
  for(let i=0;i<9;i++)box("NIGHT_distant_building",[ -4.4+i*1.1, .65+(i%3)*.35,-4.0],[.62,1.3+(i%3)*.7,.06],nightMat);
  $("drive").addEventListener("click",driveStep);
  $("radio").addEventListener("click",radioStep);
  $("flare").addEventListener("click",useFlare);
  $("hq").addEventListener("click",arriveHQ);
}
function advance():void{
  visitorIndex++;
  if(visitorIndex>=9){showNightPanel();log("00:00. Shift closed. Route files to police HQ.");return;}
  clockMinutes=Math.min(1439,360+visitorIndex*115);$("clock").textContent=timeString(clockMinutes);
  visitor=buildVisitor(visitorIndex);updateVisitor();log("Next visitor arrived.");toast("Next visitor is waiting.");
}
function decision(allow:boolean):void{
  if(!shiftStarted||phase!=="day")return;
  const correct=(allow&&!visitor.anomaly)||(!allow&&visitor.anomaly);
  setTrust(correct?4:-10);
  log(visitor.name+" — "+(allow?"ENTRY ALLOWED":"ENTRY DENIED")+" — "+(correct?"DECISION CORRECT":"DECISION WRONG"));
  toast(correct?(allow?"Identity accepted. Entry permitted.":"Anomaly stopped at the door."):"The records contradict your decision.");
  advance();
}
function call998():void{
  if(!shiftStarted||phase!=="day")return;
  const reported=visitor;
  log("998 dialled. F.A.F.E. dispatched for "+reported.name+".");
  toast("F.A.F.E. response acknowledged…");
  $("call998").setAttribute("disabled","true");
  window.setTimeout(()=>{
    $("call998").removeAttribute("disabled");
    if(reported.anomaly){setTrust(3);toast("F.A.F.E. confirmed the discrepancy.");log("F.A.F.E. confirmed anomaly: "+reported.clue+".");}
    else{setTrust(-8);toast("False report. No discrepancy detected.");log("F.A.F.E. reported a false call.");}
    advance();
  },650);
}
function inspectID():void{
  magnified=!magnified;$("magnifier").classList.toggle("visible",magnified);
  toast(magnified?"ID magnifier active. Compare the microcode.":"Magnifier closed.");
}
function driveStep():void{
  if(phase!=="night")return;
  clockMinutes+=10;fuel=Math.max(0,fuel-5);if(Math.random()<.22)tires=Math.max(0,tires-18);
  $("clock").textContent=timeString(1440+clockMinutes-1440);
  $("fuel-record").textContent=fuel+"%";$("tire-record").textContent=tires+"%";
  const events=["RADIO STATIC: something is pacing the car.","The road sign names a town that does not exist.","Your headlights catch a figure standing in the lane.","The GPS route redraws itself behind you."];
  const event=events[Math.floor(Math.random()*events.length)];log(event);toast(event);
  if(fuel===0||tires===0){toast(fuel===0?"Engine stopped in the dark.":"A tire has failed.");$("status-copy").textContent="The vehicle is stranded. Decide whether to risk the road or proceed to the station.";}
  if(clockMinutes>=1620){arriveHQ();}
}
function radioStep():void{log("RADIO: '998? There is no unit by that name tonight.'");setTrust(-1);toast("A voice on the radio sounds like you.");}
function useFlare():void{if(phase!=="night")return;if(flare<=0){toast("No emergency flares left.");return;}flare=0;$("flare-record").textContent="0 flares";log("Emergency flare lights the road and briefly obscures the figure.");toast("The flare lights the road. A silhouette retreats into the dark.");}flare=0;$("flare-record").textContent="0 flares";log("An emergency flare lights the road. The figure retreats.");toast("The flash lights up the road. Something moves beyond it.");}
function arriveHQ():void{
  phase="night";$("phase-title").textContent="Class-X interview pending.";
  $("status-copy").textContent="You reached the police station. The subject is waiting behind reinforced glass.";
  $("action-buttons").innerHTML='<button id="ask-name" class="primary">ASK THEIR NAME</button><button id="ask-copy" class="danger">ASK WHY THEY COPY PEOPLE</button><button id="finish" class="wide ghost">END INTERROGATION</button>';
  $("ask-name").addEventListener("click",()=>{log('CLASS-X: "You already know my name."');toast("Subject: You already know my name.");});
  $("ask-copy").addEventListener("click",()=>{log('CLASS-X: "I copy what you remember."');toast("Subject: I copy what you remember.");});
  $("finish").addEventListener("click",()=>{toast("Case filed. Northgate shift complete.");$("phase-title").textContent="CASE FILED";$("status-copy").textContent="The shift is over. The records remain incomplete.";});
}
function startShift():void{
  shiftStarted=true;$("start-overlay").classList.add("hidden");visitorIndex=0;clockMinutes=360;trust=50;
  $("clock").textContent="06:00";$("trust-value").textContent="50%";$("trust-bar").style.width="50%";
  visitor=buildVisitor(0);updateVisitor();log("Shift started. Compare the record before making a decision.");toast("Northgate security desk online.");
}
addHotspot(phone,call998);addHotspot(id,inspectID);addHotspot(visitorSprite,()=>toast("A visitor is waiting. Compare their story and ID."));
$("start-game").addEventListener("click",startShift);
$("allow").addEventListener("click",()=>decision(true));
$("deny").addEventListener("click",()=>decision(false));
$("call998").addEventListener("click",call998);
$("inspect").addEventListener("click",inspectID);
$("start-overlay").addEventListener("transitionend",()=>{if($("start-overlay").classList.contains("hidden"))$("start-overlay").style.display="none";});
renderer.domElement.addEventListener("pointermove",e=>{
  pointer.x=(e.clientX/innerWidth)*2-1;pointer.y=-(e.clientY/innerHeight)*2+1;
  raycaster.setFromCamera(pointer,camera);
  const hits=raycaster.intersectObjects(interactives.map(i=>i.object),true);
  renderer.domElement.style.cursor=hits.length?"pointer":"default";
});
renderer.domElement.addEventListener("click",e=>{
  if(!shiftStarted)return;
  pointer.x=(e.clientX/innerWidth)*2-1;pointer.y=-(e.clientY/innerHeight)*2+1;
  raycaster.setFromCamera(pointer,camera);
  const hits=raycaster.intersectObjects(interactives.map(i=>i.object),true);
  if(hits.length){
    let object:THREE.Object3D|null=hits[0].object;
    while(object&&!interactives.some(i=>i.object===object))object=object.parent;
    interactives.find(i=>i.object===object)?.action();
  }
});
window.addEventListener("keydown",e=>{
  if(e.repeat)return;
  if(e.code==="KeyA")decision(true);if(e.code==="KeyD")decision(false);
  if(e.code==="KeyF"){phase==="day"?call998():useFlare();}
  if(e.code==="KeyI")inspectID();if(e.code==="KeyW"&&phase==="night")driveStep();
  if(e.code==="KeyR"&&phase==="night")radioStep();if(e.code==="KeyH"&&phase==="night")arriveHQ();
});
let flicker=0;
function animate():void{
  requestAnimationFrame(animate);flicker+=.03;
  deskLamp.intensity=phase==="night"?.15:1.45+Math.sin(flicker*2)*.06;
  warningLight.intensity=phase==="night"?.1:.55+Math.sin(flicker*4)*.16;
  renderer.render(scene,camera);
}
animate();
