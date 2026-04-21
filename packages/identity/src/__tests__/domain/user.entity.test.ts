import { describe, it, expect } from "vitest";
import { Bio, DisplayName, User } from "../../domain/index.js";
import { UserRegisteredEvent } from "../../events/index.js";

describe("User", () => {
  const newUser = () =>
    User.create({
      accountID: "account-123",
      displayName: DisplayName.reconstitute("User One"),
      bio: Bio.reconstitute("Hello, world!")
    });

  it("should create a user", () => {
    const user = newUser();
    expect(user.id).toBeDefined();
    expect(user.accountID).toBe("account-123");
    expect(user.displayName.value).toBe("User One");
    expect(user.bio.value).toBe("Hello, world!");

    const events = user.getAndClearEvents;
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(UserRegisteredEvent);
  });

  it("should update the display name of a user", () => {
    const user = newUser();

    user.updateDisplayName(DisplayName.reconstitute("User One Updated"));
    expect(user.displayName.value).toBe("User One Updated");

    const events = user.getAndClearEvents;
    expect(events).toHaveLength(2);
    expect(events[1].constructor.name).toBe("UserUpdatedEvent");
  });

  it("should update the bio of a user", () => {
    const user = newUser();

    user.updateBio(Bio.reconstitute("Updated Bio"));
    expect(user.bio.value).toBe("Updated Bio");

    const events = user.getAndClearEvents;
    expect(events).toHaveLength(2);
    expect(events[1].constructor.name).toBe("UserUpdatedEvent");
  });
});
