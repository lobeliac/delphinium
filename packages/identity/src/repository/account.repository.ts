import type { Repository } from "@base/domain/repository.base";
import type { Account } from "../domain/account.entity.ts";

/** Specialized repository interface for managing Account. */
export type AccountRepository = {} & Repository<Account>;
