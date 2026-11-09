/** Where background work writes its log lines: the app's logger, or JSON lines in a task. */
export interface LogSink {
  info(details: object, message: string): void;
  warn(details: object, message: string): void;
  error(details: object, message: string): void;
}
