import { timeText } from "../utils/format";
export function appendEvidence(entries:string[],text:string,minutes:number,limit=30):void {
  entries.push("["+timeText(minutes)+"] "+text);
  if(entries.length>limit)entries.splice(0,entries.length-limit);
}