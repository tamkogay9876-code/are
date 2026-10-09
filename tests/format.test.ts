import { describe, expect, it } from "vitest";
import { esc, timeText, clamp } from "../src/utils/format";
describe("formatting helpers", () => {
  it("escapes HTML-special characters", () => {
    expect(esc('<tag "x">')).toBe("&lt;tag &quot;x&quot;&gt;");
  });
  it("formats minutes as a 24-hour clock", () => {
    expect(timeText(360)).toBe("06:00");
    expect(timeText(1440)).toBe("00:00");
  });
  it("clamps values to a requested range", () => {
    expect(clamp(-1,0,100)).toBe(0);
    expect(clamp(101,0,100)).toBe(100);
  });
});