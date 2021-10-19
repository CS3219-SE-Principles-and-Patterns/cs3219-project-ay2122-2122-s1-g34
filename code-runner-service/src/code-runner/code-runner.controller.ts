import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

import { CodeRunnerService } from "./code-runner.service";

@Controller()
export class CodeRunnerController {
  constructor(private readonly codeRunnerService: CodeRunnerService) {}

  @MessagePattern("runCode")
  runCode(data: string) {
    return this.codeRunnerService.runCode(data);
  }
}
