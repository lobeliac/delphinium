import type { BaseCommand } from "./command.base.js";

export type CommandHandler<TCommand extends BaseCommand<TResult>, TResult> = {
  handle(command: TCommand): Promise<TResult>;
};
