# Ending matrix

The current ending selection is deterministic and intentionally compact.

| Condition | Ending |
|---|---|
| Police suspicion reaches 25 | False Security |
| At least one anomaly was admitted | The Wrong Person Entered |
| At least two innocent residents were rejected | Too Paranoid |
| Trust is at least 55 | F.A.F.E Recruit |
| Otherwise | Shift Complete — The Case Remains Open |

The first matching condition wins. Update `src/game/ending.ts` and its tests when balancing the ending order.