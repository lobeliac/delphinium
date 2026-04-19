import { Entity } from "@base/domain/entity.base";
import { DomainEvent } from "@base/domain/eventbus";
import { describe, it, expect } from "vitest";

class MockEntity extends Entity<{ name: string }> {
  constructor(id: string, props: { name: string }) {
    super(id, props, new Date(), new Date());
  }

  public updateProp(_name: string) {
    const old = this.props["name"];
    this.props["name"] = _name;
    (this as any).addDomainEvent(new MockEvent(this.id, old, _name));
  }
}

class MockEvent extends DomainEvent {
  public readonly prev: string;
  public readonly next: string;
  constructor(entityId: string, prev: string, next: string) {
    super(entityId);
    this.prev = prev;
    this.next = next;
  }
}

describe("Domain Base Package", () => {
  describe("Entity Base", () => {
    it("should manage domain events correctly", () => {
      const entity = new MockEntity("123", { name: "test" });
      entity.updateProp("new name");

      const events = entity.getAndClearEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toHaveProperty("next");

      expect(entity.getAndClearEvents).toHaveLength(0);
    });
  });
});
