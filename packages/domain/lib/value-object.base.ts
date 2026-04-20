import { isNullOrUndefined } from "@base/domain/guard";

/**
 * Base class for Value Objects in a Domain-Driven Design context.
 * Value objects are immutable objects that are defined by their attributes rather than a unique identity.
 *
 * @template ValueType - The type of the underlying value being wrapped.
 */
export abstract class ValueObject<ValueType> {
  /**
   * The wrapped, immutable value.
   */
  protected readonly _value: ValueType;

  /**
   * Creates an instance of ValueObject.
   * The value is frozen to ensure immutability.
   *
   * @param value - The value to wrap.
   * @throws Error if the {@link validate} method fails.
   */
  constructor(value: ValueType) {
    this._value = Object.freeze(value);
    this.validate();
  }

  /**
   * Retrieves the underlying value.
   */
  get value(): ValueType {
    return this._value;
  }

  /**
   * Compares this value object with another for structural equality.
   * @param other - The other value object to compare against.
   * @returns True if the other object is not null/undefined and has the same value, false otherwise.
   */
  public equals(other: ValueObject<ValueType>): boolean {
    return !isNullOrUndefined(other) && this._value === other._value;
  }

  /**
   * Performs domain-specific validation on the value.
   * Must be implemented by subclasses to ensure the integrity of the value object.
   * @protected
   */
  protected abstract validate(): void;
}
