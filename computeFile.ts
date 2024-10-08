import fs from "node:fs/promises";

export class ComputeFile {
  filePath: string;
  fileContentBuffer: Buffer;
  fileContent: string = "";

  constructor(filePath?: string, fileContentBuffer?: Buffer) {
    this.filePath = filePath ? filePath : "";
    this.fileContentBuffer = fileContentBuffer
      ? fileContentBuffer
      : Buffer.alloc(0);
  }

  async readFileContent() {
    if (this.fileContentBuffer.byteLength == 0) {
      this.fileContentBuffer = await fs.readFile(this.filePath);
    }
    this.fileContent = this.fileContentBuffer.toString("utf-8");
  }

  async calculateBytes(): Promise<number> {
    return this.fileContentBuffer.byteLength;
  }

  async calculateLines(): Promise<number> {
    return this.fileContent.split("").reduce((accum, char) => {
      return accum + (char == "\n" ? 1 : 0);
    }, 0);
  }

  async calculateWords(): Promise<number> {
    return this.fileContent.trim().split(/\s+/g).length as number;
  }

  async calculateCharacters(): Promise<number> {
    return this.fileContent.length;
  }
}
