import { injectable, inject } from "inversify";
import type { CommandHandler } from "@base/domain/command-handler";
import type { EventBus } from "@base/domain/event";
import type { RegisterAccountCommand } from "@slice/identity/commands";
import type { AccountRepository, UserRepository } from "@slice/identity/repository";
import { Account, User, Bio, Password } from "@slice/identity/domain";
import type { CryptoService } from "../../services/crypto.service.ts";

export const TYPES = {
  AccountRepository: Symbol.for("AccountRepository"),
  UserRepository: Symbol.for("UserRepository"),
  EventBus: Symbol.for("EventBus"),
  CryptoService: Symbol.for("CryptoService")
};

@injectable()
export class RegisterAccountCommandHandler implements CommandHandler<RegisterAccountCommand> {
  private readonly accountRepo: AccountRepository;
  private readonly userRepo: UserRepository;
  private readonly eventBus: EventBus;
  private readonly cryptoService: CryptoService;

  constructor(
    @inject(TYPES.AccountRepository) accountRepo: AccountRepository,
    @inject(TYPES.UserRepository) userRepo: UserRepository,
    @inject(TYPES.EventBus) eventBus: EventBus,
    @inject(TYPES.CryptoService) cryptoService: CryptoService
  ) {
    this.accountRepo = accountRepo;
    this.userRepo = userRepo;
    this.eventBus = eventBus;
    this.cryptoService = cryptoService;
  }

  async handle(command: RegisterAccountCommand): Promise<void> {
    const { nickname, password, displayName } = command.payload;

    // Hash the password
    const passwordHashString = await this.cryptoService.hashPassword(password.value);

    // We reconstitute a new Password VO with the hashed value to store it
    const hashedPassword = Password.reconstitute(passwordHashString);

    // 1. Create the Account entity
    const account = Account.create({ nickname, password: hashedPassword });

    // 2. Create the User entity associated with the account
    // For a new user, we can default the bio to empty.
    const emptyBioResult = Bio.create("");
    if (!emptyBioResult.ok) {
      throw emptyBioResult.error;
    }

    const user = User.create({
      accountID: account.id,
      displayName,
      bio: emptyBioResult.value
    });

    // 3. Persist to database
    // Note: Without a Unit of Work, we save them sequentially.
    await this.accountRepo.save(account);
    await this.userRepo.save(user);

    // 4. Publish Domain Events
    for (const event of account.getAndClearEvents) {
      await this.eventBus.publish(event);
    }

    for (const event of user.getAndClearEvents) {
      await this.eventBus.publish(event);
    }
  }
}
