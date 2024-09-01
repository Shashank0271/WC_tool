export interface Command {
  commandType: CommandType;
  filePath?: string;
}

export enum CommandType {
  READ_BYTES = "-c",
  READ_LINES = "-l",
  READ_WORDS = "-w",
  READ_CHARS = "-m",
  DEFAULT = "",
}
