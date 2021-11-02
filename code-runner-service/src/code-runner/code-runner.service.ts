import { Injectable } from "@nestjs/common";
import { fork } from "child_process";
import { join } from "path";

@Injectable()
export class CodeRunnerService {
  runCode(code: string) {
    return new Promise((resolve) => {
      const child = fork(join(__dirname, "runner.js"));
      child.send(code);

      child.on("message", (message) => {
        resolve(message);
      });

      child.on("exit", () => {
        resolve("An unspecified error has occurred.");
      });
    });
  }
}
