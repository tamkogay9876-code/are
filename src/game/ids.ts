export function alterCheckDigit(id:string):string {
  if(!id.length)return id;
  const tail=id.slice(-1);
  const replacement=String((Number(tail)+1)%10);
  return id.slice(0,-1)+replacement;
}
export function isMicrocodeValid(micro:string):boolean {
  return micro==="NG-31-B";
}