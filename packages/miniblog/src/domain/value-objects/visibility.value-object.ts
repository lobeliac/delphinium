import { ValueObject } from "@base/domain/value-object.base";

/**
 * Enum representing the possible visibility states for a miniblog. (TypeScript doesn't like enum type anymore, check --erasableSyntax)
 */
const MiniblogVisibilityEnum = {
  /** Visible to everyone */
  PUBLIC: 1,
  /** Visible only to the owner */
  PRIVATE: 2,
  /** Restricted or hidden from view */
  HIDDEN: 3
} as const;

export type MiniblogVisibility =
  (typeof MiniblogVisibilityEnum)[keyof typeof MiniblogVisibilityEnum];

/**
 * Value object representing the visibility status of a miniblog.
 */
export class MiniblogVisibilityVO extends ValueObject<MiniblogVisibility> {
  protected constructor(visibility: MiniblogVisibility) {
    super(visibility);
  }

  /**
   * Creates a new instance of MiniblogVisibilityVO.
   * @param visibility The visibility state (PUBLIC, PRIVATE, or HIDDEN).
   */
  public static create(visibility: MiniblogVisibility): MiniblogVisibilityVO {
    return new MiniblogVisibilityVO(visibility);
  }
}
