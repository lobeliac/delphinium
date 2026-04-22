import type { Repository } from "@base/domain/repository.base";
import type { Account } from "../domain/account.entity.ts";
import type { AccountNotFoundError } from "../error/account-not-found.error.ts";
import type { Result } from "@base/domain/result";
import type { Nickname } from "../domain/index.ts";

/** Specialized repository interface for managing Account. */
export type AccountRepository = {
  findByNickname(nickname: Nickname): Promise<Result<Account, AccountNotFoundError>>;
} & Repository<Account>;
