// ccwc -l <filename>
// 2     3    4
import process, { exit, stdin } from "process";
import { CommandType, Command } from "./command";
import { ComputeFile } from "./computeFile";

(async () => {
  const flags: Array<string> = ["-c", "-l", "-w", "-m"];
  const input: Array<string> = process.argv;

  if (input[2] !== "ccwc") {
    console.error("invalid command");
    exit(0);
  }

  if (input.length == 3) {
    //nothing after ccwc -> we read from console
    const fileContentBuffer: Buffer = await readFromConsole();

    const computeFile: ComputeFile = new ComputeFile(
      undefined,
      fileContentBuffer
    );

    await computeFile.readFileContent();

    const fileLines = await computeFile.calculateLines();
    const fileWords = await computeFile.calculateWords();
    const fileBytes = await computeFile.calculateBytes();

    console.log(fileLines + " " + fileWords + " " + fileBytes);
    exit(0);
  } else if (input.length == 4 && flags.includes(input[3] as string)) {
    //the next can be either a flag or filename
    //ccwc <filename> has been handled in switch block
    const fileContentBuffer: Buffer = await readFromConsole();
    const computeFile: ComputeFile = new ComputeFile(
      undefined,
      fileContentBuffer
    );

    await computeFile.readFileContent();

    const command: Command = {
      commandType: findCommandType(input),
    };

    await computeOutput(command, computeFile);
    exit(0);
  }

  try {
    let command: Command;
    if (flags.includes(input[3] as string)) {
      command = {
        commandType: findCommandType(input),
        filePath: input[4] as string,
      };
    } else {
      command = {
        commandType: CommandType.DEFAULT,
        filePath: input[3] as string,
      };
    }

    const computeFile = new ComputeFile(command.filePath);
    await computeFile.readFileContent();

    await computeOutput(command, computeFile);
  } catch (e: any) {
    console.log(e.toString());
  }
})();

async function computeOutput(
  command: Command,
  computeFile: ComputeFile
): Promise<void> {
  switch (command.commandType) {
    case CommandType.READ_BYTES:
      const bytes = await computeFile.calculateBytes();
      console.log(bytes + " " + (command.filePath ? command.filePath : ""));
      break;

    case CommandType.READ_LINES:
      const lines = await computeFile.calculateLines();
      console.log(lines + " " + (command.filePath ? command.filePath : ""));
      break;

    case CommandType.READ_CHARS:
      const characters = await computeFile.calculateWords();
      console.log(
        characters + " " + (command.filePath ? command.filePath : "")
      );
      break;

    case CommandType.READ_WORDS:
      const words = await computeFile.calculateWords();
      console.log(words + " " + (command.filePath ? command.filePath : ""));
      break;

    case CommandType.DEFAULT:
      const fileLines = await computeFile.calculateLines();
      const fileWords = await computeFile.calculateWords();
      const fileBytes = await computeFile.calculateBytes();
      console.log(
        fileLines + " " + fileWords + " " + fileBytes + " " + command.filePath
      );
  }
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

function readFromConsole(): Promise<Buffer> {
  return new Promise<Buffer>(async (resolve, reject) => {
    let fileContent: Buffer = Buffer.alloc(0);

    stdin.on("data", (chunk: Buffer) => {
      fileContent = Buffer.concat([fileContent, chunk]);
    });

    stdin.on("end", () => {
      resolve(fileContent);
    });

    stdin.on("error", (err: Error) => {
      console.error(err.message);
      reject();
    });
  });
}
