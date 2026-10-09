import * as THREE from "three";

const palette = {
  outline: "#211d29",
  hair: "#322631",
  hairLight: "#62434a",
  skin: "#e0ad87",
  skinShadow: "#b97867",
  skinLight: "#f4c9a0",
  eye: "#28212b",
  shirt: "#395a64",
  shirtLight: "#5f8790",
  shirtShadow: "#263942",
  accent: "#d7bd86"
};

function block(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string):void {
  ctx.fillStyle=color;
  ctx.fillRect(x,y,w,h);
}

/** Makes an original, low-resolution portrait texture for a billboard character. */
export function createPixelPortrait(coatColor:string):THREE.CanvasTexture {
  const canvas=document.createElement("canvas");
  canvas.width=48;canvas.height=72;
  const ctx=canvas.getContext("2d",{alpha:true})!;
  ctx.imageSmoothingEnabled=false;
  const p={...palette,shirt:coatColor};
  // Coat and shoulders first; every mark lands on the small pixel grid.
  block(ctx,5,51,38,21,p.outline);
  block(ctx,7,52,34,20,p.shirtShadow);
  block(ctx,10,49,28,23,p.shirt);
  block(ctx,18,47,12,20,p.shirtLight);
  block(ctx,22,49,4,15,p.accent);
  block(ctx,15,42,18,12,p.skinShadow);
  block(ctx,17,42,14,9,p.skin);
  // Hair silhouette, ears and face.
  block(ctx,11,14,26,28,p.outline);
  block(ctx,13,13,22,27,p.skinShadow);
  block(ctx,14,15,20,23,p.skin);
  block(ctx,15,16,17,5,p.skinLight);
  block(ctx,10,10,28,12,p.outline);
  block(ctx,12,8,24,12,p.hair);
  block(ctx,10,12,5,22,p.hair);
  block(ctx,33,11,5,22,p.hair);
  block(ctx,15,9,7,5,p.hairLight);
  block(ctx,24,8,8,6,p.hairLight);
  block(ctx,12,20,5,9,p.skinShadow);
  block(ctx,32,20,5,9,p.skinShadow);
  block(ctx,14,14,20,4,p.hair);
  block(ctx,15,16,5,5,p.hairLight);
  block(ctx,22,15,9,4,p.hair);
  // Brows, eyes, nose and mouth are intentionally chunky.
  block(ctx,15,23,7,2,p.outline);
  block(ctx,26,23,7,2,p.outline);
  block(ctx,16,25,5,4,p.eye);
  block(ctx,27,25,5,4,p.eye);
  block(ctx,17,25,2,2,"#f4e7d7");
  block(ctx,28,25,2,2,"#f4e7d7");
  block(ctx,22,28,4,5,p.skinShadow);
  block(ctx,20,33,9,2,p.outline);
  block(ctx,22,35,6,2,"#7e3e49");
  block(ctx,19,38,11,2,p.skinLight);
  // A tiny lapel and ID pin read clearly at native resolution.
  block(ctx,13,53,8,8,p.shirtLight);
  block(ctx,28,54,5,5,p.shirtShadow);
  block(ctx,31,55,2,2,p.accent);
  const texture=new THREE.CanvasTexture(canvas);
  texture.magFilter=THREE.NearestFilter;
  texture.minFilter=THREE.NearestFilter;
  texture.generateMipmaps=false;
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.needsUpdate=true;
  return texture;
}

export function createPixelPortraitSprite(coatColor:string):THREE.Sprite {
  const texture=createPixelPortrait(coatColor);
  const material=new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false});
  const sprite=new THREE.Sprite(material);
  sprite.name="CHAR_pixel_portrait";
  sprite.scale.set(1.45,2.18,1);
  sprite.center.set(.5,0);
  sprite.castShadow=false;
  return sprite;
}
