import { Injectable } from "@nestjs/common";
import { VM } from "vm2";

@Injectable()
export class CodeRunnerService {
  runCode(code: string) {
    const timeout = 1000 * 10; // 10 second timeout
    const vm = new VM({
      timeout,
      eval: false,
      wasm: false,
      fixAsync: true,
    });

    try {
      const result = vm.run(code);
      if (result === undefined) {
        return "undefined";
      } else {
        return JSON.stringify(result, null, 2);
      }
    } catch (e) {
      return e.message;
    }
  }
}
