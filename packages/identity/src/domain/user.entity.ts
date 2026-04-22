import { Entity } from "@base/domain/entity.base";
import type { ID } from "@base/domain/entity.base";
import type { DisplayName } from "./value-objects/displayname.value-object.ts";
import { UserRegisteredEvent } from "../events/user/user-registered.event.ts";
import type { Bio } from "./value-objects/bio.value-object.ts";
import { UserUpdatedEvent } from "../events/user/user-updated.event.js";

/** Properties defining a User Profile. */
export type UserProps = {
  accountID: ID;
  displayName: DisplayName;
  bio: Bio;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Aggregate Root representing a User Profile.
 * Manages social identity details linked to an Account.
 */
export class User extends Entity<UserProps> {
  private constructor(userID: ID, props: UserProps) {
    super(userID, props, props.createdAt ?? new Date(), props.updatedAt ?? new Date());
  }

  /**
   * Creates a new User profile and triggers a registration event.
   */
  public static create(userProps: Omit<UserProps, "createdAt" | "updatedAt">, userID?: ID): User {
    const user = new User(userID ?? crypto.randomUUID(), {
      ...userProps,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const userEvent = new UserRegisteredEvent(
      user.id,
      user.props.accountID,
      user.props.displayName
    );
    user.addDomainEvent(userEvent);
    return user;
  }

  /**
   * Reconstitutes an existing User from persistence without triggering events.
   */
  public static reconstitute(userProps: UserProps, userID: ID): User {
    return new User(userID, userProps);
  }

  /** Updates the user's display name and records the change. */
  updateDisplayName(displayName: DisplayName): void {
    this.props.displayName = displayName;
    this._updatedAt = new Date();
    this.addDomainEvent(new UserUpdatedEvent(this.id, this.props.displayName));
  }

  /** Updates the user's biography and records the change. */
  updateBio(bio: Bio): void {
    this.props.bio = bio;
    this._updatedAt = new Date();
    this.addDomainEvent(new UserUpdatedEvent(this.id, this.props.bio));
  }

  get bio(): Bio {
    return this.props.bio;
  }

  get displayName(): DisplayName {
    return this.props.displayName;
  }

  get accountID(): ID {
    return this.props.accountID;
  }
}
