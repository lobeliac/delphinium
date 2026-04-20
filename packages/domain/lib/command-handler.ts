import type { BaseCommand } from "@base/domain/command.base";

/**
 * CommandHandler defines the contract for a component capable of processing a Command.
 *
 * @template TCommand The specific type of command this handler is designed to process.
 *                    It must extend BaseCommand and be compatible with the TResult.
 * @template TResult The type of the result produced by the handler upon successful execution.
 */
export type CommandHandler<TCommand extends BaseCommand<TResult>, TResult> = {
  /**
   * Executes the business logic associated with the provided command.
   *
   * @param command - The command instance containing the input data for the operation.
   * @returns A promise that resolves to the result of the command execution.
   */
  handle(command: TCommand): Promise<TResult>;
};
