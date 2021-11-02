import { Injectable } from "@nestjs/common";
import * as child from "child_process";
import { join } from "path";

@Injectable()
export class CodeRunnerService {
  runCode(code: string) {
    return new Promise((resolve) => {
      const process = child.fork(join(__dirname, "runner.js"));
      process.send(code);

      process.on("message", (message) => {
        resolve(message);
      });

      process.on("exit", () => {
        resolve("An unspecified error has occurred.");
      });
    });
  }
}
