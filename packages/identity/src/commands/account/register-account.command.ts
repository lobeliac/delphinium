import { BaseCommand } from "@base/domain/command.base";
import type { DisplayName, Nickname, Password } from "../../domain/value-objects/index.ts";

/**
 * Data required to register a new account.
 */
type RegisterAccountPayload = {
  /** The unique nickname chosen by the user. */
  nickname: Nickname;
  /** The password for the new account. */
  password: Password;
  /** The user's preferred display name. */
  displayName: DisplayName;
};

/**
 * Command responsible for initiating the account registration process.
 */
export class RegisterAccountCommand extends BaseCommand<RegisterAccountPayload> {
  /**
   * Creates an instance of RegisterAccountCommand.
   * @param props - The payload containing user registration details.
   */
  constructor(props: RegisterAccountPayload) {
    super({ payload: props });
  }
}
