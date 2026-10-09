import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import "./style.css";

type Resident = {name:string;room:string;id:string;relative:string;neighbor:string;micro:string;color:string};
type Visitor = Resident & {anomaly:boolean;clue:string};
const roster:Resident[]=[
{name:"Maya Chen",room:"101",id:"FAFE-101-8842",relative:"Evan Chen",neighbor:"Jon Bell",micro:"NG-31-B",color:"#78b6ca"},
{name:"Daniel Carter",room:"203",id:"FAFE-203-7719",relative:"Nora Carter",neighbor:"Park Kim",micro:"NG-28-C",color:"#c9a46d"},
{name:"Lena Ortiz",room:"207",id:"FAFE-207-5521",relative:"Marisol Ortiz",neighbor:"Ilya Petrov",micro:"NG-42-D",color:"#c986a3"},
{name:"Ilya Petrov",room:"209",id:"FAFE-209-4910",relative:"Tomas Petrov",neighbor:"Sana Ali",micro:"NG-11-A",color:"#83ad8a"},
{name:"Sana Ali",room:"301",id:"FAFE-301-6612",relative:"Amina Ali",neighbor:"Theo Marsh",micro:"NG-31-A",color:"#ad98d1"},
{name:"Theo Marsh",room:"304",id:"FAFE-304-1905",relative:"Clara Marsh",neighbor:"Ruth Vale",micro:"NG-22-B",color:"#8c9bd3"},
{name:"Ruth Vale",room:"312",id:"FAFE-312-7330",relative:"June Vale",neighbor:"Owen Reed",micro:"NG-14-C",color:"#d5a3a3"},
{name:"Owen Reed",room:"402",id:"FAFE-402-8451",relative:"Mara Reed",neighbor:"—",micro:"NG-08-D",color:"#d1c08a"}
];
const $=<T extends HTMLElement>(id:string)=>document.getElementById(id) as T;
const root=$("game3d");
const scene=new THREE.Scene();scene.background=new THREE.Color("#070e15");scene.fog=new THREE.FogExp2("#09131c",.035);
const camera=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,.1,90);camera.position.set(0,1.65,5.4);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance"});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;root.prepend(renderer.domElement);
const controls=new PointerLockControls(camera,renderer.domElement);
const hemi=new THREE.HemisphereLight("#b7d5e4","#10131b",1.4);scene.add(hemi);
const key=new THREE.DirectionalLight("#a6d9ed",2.1);key.position.set(-3,7,4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key);
const lampLight=new THREE.PointLight("#e5ad6a",26,7,2);lampLight.position.set(-1.5,2.4,-1);scene.add(lampLight);
const redLight=new THREE.PointLight("#d63b42",8,3,2);redLight.position.set(3,2.2,-3);scene.add(redLight);
const mats={
floor:new THREE.MeshStandardMaterial({color:"#222b30",roughness:.88}),
wall:new THREE.MeshStandardMaterial({color:"#293b43",roughness:.9}),
dark:new THREE.MeshStandardMaterial({color:"#10191f",roughness:.68}),
wood:new THREE.MeshStandardMaterial({color:"#5d3b27",roughness:.68}),
edge:new THREE.MeshStandardMaterial({color:"#91623d",roughness:.55}),
screen:new THREE.MeshStandardMaterial({color:"#07191f",emissive:"#124956",emissiveIntensity:1.5,metalness:.2,roughness:.25}),
cyan:new THREE.MeshStandardMaterial({color:"#68d8e9",emissive:"#218da1",emissiveIntensity:1.4}),
red:new THREE.MeshStandardMaterial({color:"#d64b47",emissive:"#7a1015",emissiveIntensity:1.3}),
paper:new THREE.MeshStandardMaterial({color:"#d7ddce",roughness:.85}),
coat:new THREE.MeshStandardMaterial({color:"#172e34",roughness:.9}),
skin:new THREE.MeshStandardMaterial({color:"#a96e4c",roughness:.92}),
plant:new THREE.MeshStandardMaterial({color:"#2b6944",roughness:.9}),
metal:new THREE.MeshStandardMaterial({color:"#77878b",metalness:.7,roughness:.35})
};
const interactables:{object:THREE.Object3D;name:string;action:()=>void}[]=[];
function box(name:string,pos:THREE.Vector3|[number,number,number],size:[number,number,number],material:THREE.Material,cast=true,receive=true){
 const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size),material);mesh.name=name;mesh.position.set(...(pos instanceof THREE.Vector3?pos.toArray():pos));mesh.castShadow=cast;mesh.receiveShadow=receive;scene.add(mesh);return mesh;
}
function cyl(name:string,pos:[number,number,number],r:number,h:number,material:THREE.Material,segments=16){
 const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,segments),material);mesh.name=name;mesh.position.set(...pos);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);return mesh;
}
function sphere(name:string,pos:[number,number,number],scale:[number,number,number],material:THREE.Material,segments=12){
 const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,segments,Math.max(6,Math.floor(segments*.65))),material);mesh.name=name;mesh.position.set(...pos);mesh.scale.set(...scale);mesh.castShadow=true;scene.add(mesh);return mesh;
}
function label(text:string,pos:[number,number,number],color="#8de9f4",size=.13){
 const canvas=document.createElement("canvas");canvas.width=512;canvas.height=128;const ctx=canvas.getContext("2d")!;
 ctx.clearRect(0,0,512,128);ctx.font="bold 48px monospace";ctx.fillStyle=color;ctx.fillText(text,12,78);
 const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;
 const plane=new THREE.Mesh(new THREE.PlaneGeometry(size*4,size),new THREE.MeshBasicMaterial({map:tex,transparent:true,side:THREE.DoubleSide,depthWrite:false}));
 plane.position.set(...pos);scene.add(plane);return plane;
}
// A compact, walkable security booth. Every prop is a real Three.js mesh.
box("floor",[0,-.12,0],[10,.24,9],mats.floor);
box("back-wall",[0,2.1,-4.45],[10,4.2,.18],mats.wall);
box("left-wall",[-4.95,2.1,0],[.18,4.2,9],mats.wall);
box("right-wall",[4.95,2.1,0],[.18,4.2,9],mats.wall);
box("ceiling",[0,4.2,0],[10,.12,9],mats.dark);
box("secure-door-frame",[1.1,1.45,-4.28],[1.55,2.9,.28],mats.dark);
box("secure-door",[1.1,1.42,-4.08],[1.35,2.7,.13],mats.wood);
box("door-window",[1.1,2.05,-3.99],[.65,.5,.035],mats.screen);
box("door-handle",[1.63,1.25,-3.96],[.06,.28,.06],mats.metal);
box("desk-top",[0,1.05,-.5],[3.9,.16,1.45],mats.wood);
box("desk-front",[0,.61,.15],[3.7,.72,.13],mats.edge);
for(const x of [-1.65,1.65])box("desk-leg",[x,.42,-.5],[.22,.84,1.18],mats.wood);
box("monitor-shell",[0,1.72,-1.05],[1.35,.92,.16],mats.dark);
box("monitor-glass",[0,1.72,-.955],[1.2,.75,.025],mats.screen,false);
label("NORTHGATE // 998",[-.56,1.82,-.93],"#77e3f2",.14);
box("keyboard",[0,1.16,-.02],[.8,.06,.28],mats.dark);
for(let i=0;i<12;i++)box("keyboard-key",[-.34+(i%6)*.135,1.2,-.1+Math.floor(i/6)*.1],[.08,.015,.05],i%4===0?mats.cyan:mats.edge,false);
const phone=box("emergency-phone",[1.05,1.19,-.35],[.52,.12,.42],mats.dark);
box("phone-display",[1.05,1.258,-.35],[.3,.018,.12],mats.red,false);
for(let i=0;i<12;i++)cyl("phone-key",[.89+(i%3)*.16,1.275,-.46+Math.floor(i/3)*.07],.022,.018,mats.paper,12);
const handset=box("phone-handset",[1.05,1.35,-.23],[.45,.075,.07],mats.metal);
sphere("phone-earpiece-left",[.84,1.35,-.23],[.075,.065,.075],mats.dark);
sphere("phone-earpiece-right",[1.26,1.35,-.23],[.075,.065,.075],mats.dark);
label("998",[.8,1.43,-.02],"#ff7671",.11);
const id=box("resident-id",[-.8,1.18,-.25],[.7,.045,.45],mats.paper);
box("id-photo",[-1.02,1.208,-.23],[.14,.012,.18],mats.coat,false);
for(let i=0;i<3;i++)box("id-line",[-.79,1.21,-.17+i*.07],[.28-i*.03,.012,.025],mats.dark,false);
const magnifier=new THREE.Group();magnifier.name="magnifier";
const lens=new THREE.Mesh(new THREE.TorusGeometry(.16,.025,8,24),mats.metal);lens.position.set(-1.45,1.24,-.45);magnifier.add(lens);
const lensGlass=new THREE.Mesh(new THREE.CircleGeometry(.15,24),new THREE.MeshPhysicalMaterial({color:"#71d8e9",transparent:true,opacity:.25,roughness:.12,metalness:.25}));lensGlass.position.set(-1.45,1.24,-.46);magnifier.add(lensGlass);
const handle=box("magnifier-handle",[-1.34,1.15,-.45],[.07,.3,.07],mats.metal);magnifier.add(handle);scene.add(magnifier);
const lamp=cyl("desk-lamp-base",[-1.55,1.18,-1.05],.18,.06,mats.metal,24);
cyl("desk-lamp-stem",[-1.55,1.48,-1.05],.035,.56,mats.metal);
sphere("desk-lamp-shade",[-1.55,1.79,-1.05],[.22,.12,.2],mats.edge);
const pot=cyl("plant-pot",[-3.35,.3,-2.3],.23,.52,mats.edge,8);
for(let i=0;i<7;i++){const a=i*2.399;const leaf=sphere("plant-leaf",[-3.35+Math.cos(a)*.15,.7+(i%3)*.07,-2.3+Math.sin(a)*.15],[.07,.25,.07],mats.plant,8);leaf.rotation.z=Math.cos(a)*.65;leaf.rotation.x=Math.sin(a)*.65;}
box("cabinet",[-3.5,.65,-.3],[.9,1.3,.85],mats.wood);
for(let i=0;i<3;i++){box("drawer",[-3.5,.3+i*.34,.145],[.76,.24,.035],mats.edge);box("drawer-pull",[-3.5,.3+i*.34,.18],[.2,.035,.035],mats.metal);}
box("operator-chair-seat",[0,.72,1.55],[.75,.16,.72],mats.coat);
box("operator-chair-back",[0,1.22,1.9],[.75,.82,.14],mats.coat);
cyl("operator-chair-pole",[0,.37,1.55],.065,.55,mats.metal);
for(let i=0;i<5;i++){const a=i*Math.PI*2/5;box("chair-base-leg",[Math.cos(a)*.34,.12,1.55+Math.sin(a)*.34],[.48,.05,.07],mats.metal);}
box("wall-sign",[-2.9,2.85,-4.32],[1.65,.78,.08],mats.dark);
label("AUTHORIZED ONLY",[-3.58,2.9,-4.26],"#e7c98c",.1);
const cameraProp=box("security-camera",[4.7,3.25,-3.8],[.3,.16,.22],mats.dark);
sphere("security-camera-lens",[4.52,3.23,-3.67],[.055,.055,.035],mats.cyan);
const warning=cyl("warning-beacon",[3.4,2.8,-3.8],.11,.2,mats.red,16);
// A low-poly resident stands outside the desk. Click to inspect.
const visitorGroup=new THREE.Group();visitorGroup.name="resident-character";scene.add(visitorGroup);visitorGroup.position.set(1.1,0,-3.2);
const body=new THREE.Mesh(new THREE.BoxGeometry(.62,.75,.35),mats.coat);body.position.y=1.25;body.castShadow=true;visitorGroup.add(body);
const head=sphere("visitor-head",[0,1.83,0],[.24,.29,.24],mats.skin);visitorGroup.add(head);
const neck=cyl("visitor-neck",[0,1.57,0],.085,.17,mats.skin,10);visitorGroup.add(neck);
for(const side of [-1,1]){
 const leg=box("visitor-leg",[side*.17,.62,0],[.2,.55,.23],mats.dark);visitorGroup.add(leg);
 const shoe=box("visitor-shoe",[side*.17,.31,.09],[.24,.14,.36],mats.dark);visitorGroup.add(shoe);
 const arm=box("visitor-arm",[side*.42,1.28,0],[.17,.57,.2],mats.coat);arm.rotation.z=side*.08;visitorGroup.add(arm);
 const hand=sphere("visitor-hand",[side*.43,.96,0],[.075,.09,.075],mats.skin);visitorGroup.add(hand);
 const eye=sphere("visitor-eye",[side*.09,1.88,.218],[.028,.025,.018],mats.paper,8);visitorGroup.add(eye);
}
label("VISITOR / CHECK ID",[.35,2.3,-3.0],"#9de7f2",.11);
for(const [x,z] of [[-3,-3],[3,-3],[-3,2],[3,2]] as [number,number][])box("floor-light",[x,.012,z],[.55,.018,.55],mats.dark,false);
for(const [x,z] of [[-3,-3],[3,-3],[-3,2],[3,2]] as [number,number][])box("floor-light-core",[x,.025,z],[.3,.01,.3],mats.cyan,false);

interactables.push({object:phone,name:"Emergency telephone",action:()=>call998()});
interactables.push({object:id,name:"Resident identity card",action:()=>inspectID()});
interactables.push({object:visitorGroup,name:"Incoming resident",action:()=>toast("Compare the visitor with the verified records.")});
interactables.push({object:monitorProp(),name:"Security terminal",action:()=>toast("TERMINAL: Resident directory loaded. Check ID, relative, neighbor and microcode.")});
function monitorProp(){return scene.getObjectByName("monitor-glass")!;}

let visitor:Visitor;let visitorIndex=0;let clockMinutes=360;let trust=50;let shiftStarted=false;let isMagnifying=false;let walkSpeed=3.1;
const keys=new Set<string>();const raycaster=new THREE.Raycaster();const mouse=new THREE.Vector2();let toastTimer=0;
function toast(message:string){$("toast").textContent=message;$("toast").classList.add("visible");clearTimeout(toastTimer);toastTimer=window.setTimeout(()=>$("toast").classList.remove("visible"),2600);}
function addEvidence(message:string){const line=document.createElement("p");line.className="log-entry";line.textContent="["+String(Math.floor(clockMinutes/60)%24).padStart(2,"0")+":"+String(clockMinutes%60).padStart(2,"0")+"] "+message;$("evidence").prepend(line);while($("evidence").children.length>6)$("evidence").lastElementChild?.remove();}
function updateVisitorUI(){
 $("visitor-name").textContent=visitor.name;$("visitor-room").textContent="ROOM "+visitor.room;$("visitor-avatar").textContent=visitor.name.split(" ").map(v=>v[0]).join("");
 $("id-record").textContent=visitor.id;$("relative-record").textContent=visitor.relative;$("neighbor-record").textContent=visitor.neighbor;$("micro-record").textContent=visitor.micro;$("magnifier-code").textContent=visitor.micro;
}
function newVisitor(){const r=roster[visitorIndex%roster.length];visitor={...r,anomaly:Math.random()<.38,clue:""};if(visitor.anomaly){const clues=["id","relative","neighbor","micro"];visitor.clue=clues[Math.floor(Math.random()*clues.length)];if(visitor.clue==="id")visitor.id=visitor.id.slice(0,-1)+String((Number(visitor.id.slice(-1))+1)%10);if(visitor.clue==="relative")visitor.relative="RECORD NOT FOUND";if(visitor.clue==="neighbor")visitor.neighbor="ROOM 000";if(visitor.clue==="micro")visitor.micro="NG-99-X";}
 updateVisitorUI();visitorGroup.traverse(o=>{if(o instanceof THREE.Mesh&&o.material===mats.coat)o.material=visitor.anomaly?new THREE.MeshStandardMaterial({color:"#35232b",roughness:.9}):mats.coat;});}
function advance(){visitorIndex++;clockMinutes=Math.min(1439,360+visitorIndex*118);$("clock").textContent=String(Math.floor(clockMinutes/60)).padStart(2,"0")+":"+String(clockMinutes%60).padStart(2,"0");newVisitor();}
function decide(allow:boolean){if(!shiftStarted)return;const correct=(allow&&!visitor.anomaly)||(!allow&&visitor.anomaly);trust=Math.max(0,Math.min(100,trust+(correct?4:-9)));$("trust-value").textContent=trust+"%";$("trust-bar").style.width=trust+"%";addEvidence(visitor.name+" — "+(allow?"ALLOW":"DENY")+" — "+(correct?"DECISION MATCHED":"DECISION FAILED"));toast(correct?(allow?"Identity accepted. Entry authorized.":"Anomaly kept outside. Good catch."):"That decision contradicts the verified record.");advance();}
function call998(){if(!shiftStarted)return;addEvidence("998 called. F.A.F.E. unit dispatched for "+visitor.name+".");toast("F.A.F.E. dispatch acknowledged. Verifying visitor…");window.setTimeout(()=>{if(visitor.anomaly){trust=Math.min(100,trust+3);toast("F.A.F.E. confirmed an anomaly. Building secured.");}else{trust=Math.max(0,trust-8);toast("F.A.F.E. found no anomaly. False report recorded.");} $("trust-value").textContent=trust+"%";$("trust-bar").style.width=trust+"%";advance();},900);}
function inspectID(){isMagnifying=!isMagnifying;$("magnifier").classList.toggle("visible",isMagnifying);toast(isMagnifying?"Magnifier engaged. Check the microcode.":"Magnifier stowed.");}
function start(){shiftStarted=true;$("start-overlay").classList.add("hidden");newVisitor();controls.lock();toast("Shift started. Check the records before deciding.");}
$("start-game").addEventListener("click",start);
$("allow").addEventListener("click",()=>decide(true));$("deny").addEventListener("click",()=>decide(false));$("call998").addEventListener("click",call998);$("inspect").addEventListener("click",inspectID);
renderer.domElement.addEventListener("click",()=>{if(shiftStarted&&!controls.isLocked)controls.lock();});
controls.addEventListener("lock",()=>{$("controls-state").textContent="LOOK MODE ACTIVE";});
controls.addEventListener("unlock",()=>{$("controls-state").textContent="CLICK THE SCENE TO LOOK AROUND";});
window.addEventListener("keydown",e=>{keys.add(e.code);if(e.repeat)return;if(e.code==="KeyA")decide(true);if(e.code==="KeyD")decide(false);if(e.code==="KeyF")call998();if(e.code==="KeyI")inspectID();});
window.addEventListener("keyup",e=>keys.delete(e.code));
renderer.domElement.addEventListener("pointerdown",e=>{if(!shiftStarted||!controls.isLocked)return;mouse.x=(e.clientX/innerWidth)*2-1;mouse.y=-(e.clientY/innerHeight)*2+1;raycaster.setFromCamera(mouse,camera);const hits=raycaster.intersectObjects(interactables.map(x=>x.object),true);if(hits.length){let hit:THREE.Object3D|null=hits[0].object;while(hit&&!interactables.some(x=>x.object===hit))hit=hit.parent;const item=interactables.find(x=>x.object===hit);item?.action();}});
window.addEventListener("contextmenu",e=>e.preventDefault());
window.addEventListener("mousedown",e=>{if(e.button===2&&shiftStarted)inspectID();});
window.addEventListener("resize",()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
const clock=new THREE.Clock();const move=new THREE.Vector3();const forward=new THREE.Vector3();const right=new THREE.Vector3();
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);if(controls.isLocked){forward.set(0,0,-1).applyQuaternion(camera.quaternion);forward.y=0;forward.normalize();right.set(1,0,0).applyQuaternion(camera.quaternion);right.y=0;right.normalize();move.set(0,0,0);if(keys.has("KeyW"))move.add(forward);if(keys.has("KeyS"))move.sub(forward);if(keys.has("KeyD"))move.add(right);if(keys.has("KeyA"))move.sub(right);if(move.lengthSq())move.normalize().multiplyScalar(walkSpeed*dt);camera.position.add(move);camera.position.x=THREE.MathUtils.clamp(camera.position.x,-4.5,4.5);camera.position.z=THREE.MathUtils.clamp(camera.position.z,-4.0,4.0);camera.position.y=1.65;}
 const t=performance.now()*.001;lampLight.intensity=24+Math.sin(t*2.7)*1.2;redLight.intensity=7+Math.sin(t*4)*1.1;visitorGroup.position.y=Math.sin(t*1.2)*.012;renderer.render(scene,camera);}
animate();newVisitor();
