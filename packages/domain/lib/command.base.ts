/**
 * Represents the standard structure for command data.
 *
 * @template T The type of the payload containing the command's actual data.
 */
export type CommandProps<T> = {
  /** The primary data required to execute the command. */
  payload: T;
  /** Optional contextual information about the command execution. */
  metadata?: {
    /** The date and time when the command was initiated. */
    timestamp: Date;
    /** The identifier of the user who initiated the command. */
    userId?: string;
  };
};

/**
 * Abstract base class for all commands in the system.
 * Commands represent an intent to change the state of the system.
 *
 * @template T The type of the payload held by this command.
 */
export abstract class BaseCommand<T> {
  /** The core data required to process this command. */
  public readonly payload: T;

  /**
   * Contextual metadata used for auditing, tracing, and security.
   * These properties are immutable once the command is instantiated.
   */
  public readonly metadata: {
    timestamp: Date;
    userId?: string;
  };

  /**
   * Initializes a new instance of a command.
   *
   * @param props - The command properties, including payload and optional metadata.
   * If no timestamp is provided in metadata, the current date/time is used.
   */
  constructor(props: CommandProps<T>) {
    this.payload = props.payload;
    this.metadata = {
      timestamp: props.metadata?.timestamp ?? new Date(),
      userId: props.metadata?.userId
    };
  }
}
