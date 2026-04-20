import type { BaseCommand } from "@base/domain/command.base";
import type { CommandHandler } from "@base/domain/command-handler";

/**
 * CommandBus is responsible for routing Commands to their corresponding CommandHandlers.
 * It facilitates the decoupling of the sender of a command from its receiver.
 */
export class CommandBus {
  /**
   * Internal registry mapping Command constructors to their specific handlers.
   * We use 'any' for the handler type internally because TypeScript cannot
   * map specific key types to specific value types in a single Map.
   */
  private readonly handlers = new Map<
    new (...args: any[]) => BaseCommand<any>,
    CommandHandler<any, any>
  >();

  /**
   * Registers a handler for a specific Command class.
   *
   * @template TCommand The specific type of Command being registered.
   * @template TResult The expected return type of the handler.
   * @param commandClass The constructor of the command.
   * @param handler The instance of the handler that implements CommandHandler<TCommand, TResult>.
   */
  register<TCommand extends BaseCommand<any>, TResult>(
    commandClass: new (...args: any[]) => TCommand,
    handler: CommandHandler<TCommand, TResult>
  ): void {
    this.handlers.set(commandClass, handler);
  }

  /**
   * Executes a command by finding its registered handler and invoking it.
   *
   * @template TCommand The type of command being executed.
   * @template TResult The expected return type of the command execution.
   * @param command The command instance to execute.
   * @returns A promise resolving to the result of the command handler.
   * @throws Error if no handler is registered for the provided command.
   */
  async execute<TCommand extends BaseCommand<any>, TResult>(command: TCommand): Promise<TResult> {
    const handler = this.handlers.get(command.constructor as new (...args: any[]) => TCommand);
    if (!handler) {
      throw new Error(`No handler registered for command ${command.constructor.name}`);
    }
    /**
     * We cast the handler to CommandHandler<TCommand, TResult> here.
     * This is safe because the 'register' method enforces the relationship
     * between the command class and its handler type at compile time.
     * This cast also satisfies the 'no-unsafe-return' ESLint rule.
     */
    const typedHandler = handler as CommandHandler<TCommand, TResult>;

    return typedHandler.handle(command);
  }
}
