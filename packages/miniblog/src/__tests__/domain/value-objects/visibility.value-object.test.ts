import { describe, it, expect } from "vitest";
import {
  MiniblogVisibilityEnum,
  MiniblogVisibilityVO
} from "../../../domain/value-objects/index.ts";

describe("MiniblogVisibilityVO", () => {
  it("should create a visibility value object", () => {
    const visibility = MiniblogVisibilityVO.create(MiniblogVisibilityEnum.PUBLIC);
    expect(visibility.value).toBe(MiniblogVisibilityEnum.PUBLIC);
  });
});
