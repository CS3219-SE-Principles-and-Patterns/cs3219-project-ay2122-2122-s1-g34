import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

import { AuthGuard } from "../common/guards/auth.guard";
import { CodeRunnerService } from "./code-runner.service";
import { RunCodeDto } from "./dto/run-code.dto";

@Controller({ path: "code-runner", version: "1" })
@ApiHeader({ name: "token" })
@ApiResponse({ status: 401, description: "Unauthorized" })
@ApiResponse({ status: 403, description: "Forbidden" })
@UseGuards(AuthGuard)
export class CodeRunnerController {
  constructor(private readonly codeRunnerService: CodeRunnerService) {}

  @Post()
  @ApiCreatedResponse({
    description: "Code was successfully executed",
    schema: { type: "string", example: `"Hello world!"` },
  })
  @ApiOperation({ summary: "Allows user to execute JavaScript code" })
  runCode(@Body() runCodeDto: RunCodeDto) {
    return this.codeRunnerService.runCode(runCodeDto);
  }
}
