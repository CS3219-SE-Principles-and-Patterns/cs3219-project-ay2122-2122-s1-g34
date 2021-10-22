import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiHeader } from "@nestjs/swagger";

import { AuthGuard } from "../common/guards/auth.guard";
import { CodeRunnerService } from "./code-runner.service";
import { RunCodeDto } from "./dto/run-code.dto";

@Controller({ path: "code-runner", version: "1" })
@ApiHeader({ name: "token" })
@UseGuards(AuthGuard)
export class CodeRunnerController {
  constructor(private readonly codeRunnerService: CodeRunnerService) {}

  @Post()
  runCode(@Body() runCodeDto: RunCodeDto) {
    return this.codeRunnerService.runCode(runCodeDto);
  }
}
