import type { User } from "../domain/user.entity.js";
import type { Repository } from "@base/domain/repository.base";
import type { Nickname } from "../domain/value-objects/nickname.value-object.ts";
import type { Result } from "@base/domain/result";
import type { EntityNotFoundError } from "@base/domain/error";

/**
 * Specialized repository interface for managing User.
 * Extends the base Repository with user-specific lookup capabilities.
 */
export type UserRepository = {
  findByNickname(nickname: Nickname): Promise<Result<User, EntityNotFoundError>>;
} & Repository<User>;
