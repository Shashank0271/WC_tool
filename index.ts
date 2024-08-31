// ccwc -l <filename>
// 2     3    4

import { exit } from "process";
import { CommandType, Command } from "./command.ts";
import { ComputeFile } from "./computeFile.ts";

const input: Array<string> = process.argv;

if (input[2] !== "ccwc" || input.length < 5) {
  console.error("invalid command");
  exit(0);
}

const flags: Array<string> = ["-c", "-l", "-w", "-m"];

try {
  if (flags.includes(input[3] as string)) {
    const command: Command = {
      commandType: findCommandType(input),
      filePath: input[4] as string,
    };

    const computeFile = new ComputeFile(command.filePath);
    await computeFile.readFileContent();

    switch (command.commandType) {
      case CommandType.READ_BYTES:
        const bytes = await computeFile.calculateBytes();
        console.log(bytes + " " + command.filePath);
        break;

      case CommandType.READ_LINES:
        const lines = await computeFile.calculateLines();
        console.log(lines + " " + command.filePath);
        break;

      case CommandType.READ_CHARS:
        const characters = await computeFile.calculateWords();
        console.log(characters + " " + command.filePath);
        break;

      case CommandType.READ_WORDS:
        const words = await computeFile.calculateWords();
        console.log(words + " " + command.filePath);
        break;
    }
  }
} catch (e: any) {
  console.log(e.toString());
}

function findCommandType(input: Array<string>): CommandType {
  switch (input[3]) {
    case CommandType.READ_BYTES:
      return CommandType.READ_BYTES;
    case CommandType.READ_CHARS:
      return CommandType.READ_CHARS;
    case CommandType.READ_LINES:
      return CommandType.READ_LINES;
    case CommandType.READ_WORDS:
      return CommandType.READ_WORDS;
  }
  return CommandType.DEFAULT;
}
