export type CommandProps<T> = {
  payload: T;
  metadata?: {
    timestamp: Date;
    userId?: string;
  };
};

export abstract class BaseCommand<T> {
  public readonly payload: T;
  public readonly metadata: {
    timestamp: Date;
    userId?: string;
  };

  constructor(props: CommandProps<T>) {
    this.payload = props.payload;
    this.metadata = {
      timestamp: props.metadata?.timestamp ?? new Date(),
      userId: props.metadata?.userId
    };
  }
}
