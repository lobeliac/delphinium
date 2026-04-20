import type { BaseCommand } from "@base/domain/command.base";
import type { CommandHandler } from "@base/domain/command-handler";

export class CommandBus {
  private readonly handlers = new Map<
    new (...args: any[]) => BaseCommand<any>,
    CommandHandler<any, any>
  >();

  register<TCommand extends BaseCommand<any>, TResult>(
    commandClass: new (...args: any[]) => TCommand,
    handler: CommandHandler<TCommand, TResult>
  ): void {
    this.handlers.set(commandClass, handler);
  }

  async execute<TCommand extends BaseCommand<any>, TResult>(command: TCommand): Promise<TResult> {
    const handler = this.handlers.get(command.constructor as new (...args: any[]) => TCommand);
    if (!handler) {
      throw new Error(`No handler registered for command ${command.constructor.name}`);
    }
    const typedHandler = handler as CommandHandler<TCommand, TResult>;

    return typedHandler.handle(command);
  }
}
