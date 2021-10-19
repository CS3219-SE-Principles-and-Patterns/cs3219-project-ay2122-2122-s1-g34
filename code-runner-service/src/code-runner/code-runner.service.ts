import { Injectable } from "@nestjs/common";
import { VM } from "vm2";

@Injectable()
export class CodeRunnerService {
  private readonly vm: VM;

  constructor() {
    const timeout = 1000 * 10; // 10 second timeout
    this.vm = new VM({ timeout, eval: false, wasm: false, fixAsync: true });
  }

  runCode(code: string) {
    return this.vm.run(code);
  }
}
