import { SAVE_KEY } from "../core/constants";
export function writeSave(snapshot:unknown):void {
  try { localStorage.setItem(SAVE_KEY,JSON.stringify(snapshot)); } catch (error) {
    console.warn("Could not save game state.",error);
  }
}
export function readSave<T>():T|null {
  try {
    const raw=localStorage.getItem(SAVE_KEY);
    return raw?JSON.parse(raw) as T:null;
  } catch (error) {
    console.warn("Saved game data is invalid.",error);
    return null;
  }
}
export function hasSave():boolean {
  try { return localStorage.getItem(SAVE_KEY)!==null; } catch { return false; }
}
export function clearSave():void {
  try { localStorage.removeItem(SAVE_KEY); } catch (error) {
    console.warn("Could not clear saved game.",error);
  }
}