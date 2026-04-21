import { ValueObject } from "@base/domain/value-object.base";
import type { Result } from "@base/domain/result";
import { InvalidHashtagFormatError } from "../../error/invalid-hashtag-format.error.ts";

/**
 * Value object representing a single hashtag string.
 * Validates that the hashtag is alphanumeric and max 30 chars.
 */
export class HashtagVO extends ValueObject<string> {
  private static readonly HASHTAG_REGEX = /^[a-z0-9]{1,30}$/;

  private constructor(value: string) {
    super(value);
  }

  public static create(tag: string): Result<HashtagVO, InvalidHashtagFormatError> {
    const normalizedTag = tag.toLowerCase();

    if (!HashtagVO.HASHTAG_REGEX.test(normalizedTag)) {
      return {
        ok: false,
        error: new InvalidHashtagFormatError(normalizedTag)
      };
    }

    return { ok: true, value: new HashtagVO(normalizedTag) };
  }

  public static reconstitute(tag: string): HashtagVO {
    return new HashtagVO(tag);
  }
}
