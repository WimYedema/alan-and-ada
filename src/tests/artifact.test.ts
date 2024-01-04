import { describe, expect, it, test } from "@jest/globals";
import { Artifact } from "../core/artifact";
import { tileSize } from "../core/resources";

describe("Artifact", () => {
  it("uses tile space for positioning in construction", () => {
    let subject = new Artifact({ x: 1, y: 4, name: "test" });
    expect(subject.pos.x).toBe(1 * tileSize);
    expect(subject.pos.y).toBe(4 * tileSize);
    expect(subject.name).toBe("test");
  });
});
