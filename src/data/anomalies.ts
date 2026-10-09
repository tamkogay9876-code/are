export const anomalyKinds = [
  "ID NUMBER MISMATCH",
  "ROOM NUMBER MISMATCH",
  "RELATIVE RECORD MISSING",
  "NEIGHBOR RECORD MISMATCH",
  "TIMELINE INCONSISTENCY",
  "BEHAVIORAL ANOMALY",
  "MICROCODE MISMATCH"
] as const;
export type AnomalyKind = typeof anomalyKinds[number];
export const ANOMALY_CHANCE_BASE = 0.36;
export const anomalyDescription:Record<AnomalyKind,string> = {
  "ID NUMBER MISMATCH":"The printed number differs from the verified resident record.",
  "ROOM NUMBER MISMATCH":"The claimed room is not the room assigned in the database.",
  "RELATIVE RECORD MISSING":"The named relative does not appear in the approved record.",
  "NEIGHBOR RECORD MISMATCH":"The claimed neighbor does not match the floor directory.",
  "TIMELINE INCONSISTENCY":"The resident gives a phrase or timeline that conflicts with known history.",
  "BEHAVIORAL ANOMALY":"The visitor's behavior deviates from the resident's usual pattern.",
  "MICROCODE MISMATCH":"The microcode on the presented ID is inconsistent."
};