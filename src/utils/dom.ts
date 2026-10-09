import { esc } from "./format";
export { esc };
export function setText(selector:string,text:string,root:ParentNode=document):void {
  const element=root.querySelector<HTMLElement>(selector);
  if(!element) throw new Error("Required UI element not found: "+selector);
  element.textContent=text;
}
export function onClick(selector:string,handler:(event:MouseEvent)=>void,root:ParentNode=document):void {
  const element=root.querySelector<HTMLElement>(selector);
  if(!element) throw new Error("Required UI element not found: "+selector);
  element.addEventListener("click",handler);
}