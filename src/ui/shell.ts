import { timeText } from "../utils/format";
import type { Phase } from "../game/types";
const phaseLabels:Record<Phase,string> = {
  menu:"SECURE HOUSING",
  day:"DAY SHIFT",
  night:"NIGHT INVESTIGATION",
  interrogation:"CLASS-X INTERROGATION",
  ending:"CASE CLOSED"
};
export function renderShell(root:HTMLElement,phase:Phase,minutes:number,logo:string):void {
  const clock=phase==="ending"?"END":timeText(minutes);
  root.innerHTML='<div class="crt"><header><img class="brand-mark" src="'+logo+'" alt=""><b>ARE YOU LYING?</b><span id="clock">'+clock+'</span><span id="phase">'+phaseLabels[phase]+'</span></header><main id="screen"></main></div>';
}