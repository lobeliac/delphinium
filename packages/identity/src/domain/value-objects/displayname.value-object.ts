import { ValueObject } from "@base/domain/value-object.base";
import { InvalidDisplayNameError } from "../../error/invalid-displayname.error.ts";
import type { Result } from "@base/domain/result";

export class DisplayName extends ValueObject<string> {
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 20;

  private constructor(value: string) {
    super(value);
  }

  /**
   * Creates a new DisplayName from user input.
   * Validates length.
   */
  public static create(raw: string): Result<DisplayName, InvalidDisplayNameError> {
    if (raw.length < DisplayName.MIN_LENGTH) {
      return {
        ok: false,
        error: new InvalidDisplayNameError(
          `Display Name must be at least ${this.MIN_LENGTH} characters long`
        )
      };
    }

    if (raw.length > DisplayName.MAX_LENGTH) {
      return {
        ok: false,
        error: new InvalidDisplayNameError(
          `Display Name cannot exceed ${this.MAX_LENGTH} characters long`
        )
      };
    }

    return { ok: true, value: new DisplayName(raw) };
  }

  public static reconstitute(raw: string): DisplayName {
    return new DisplayName(raw);
  }
}
