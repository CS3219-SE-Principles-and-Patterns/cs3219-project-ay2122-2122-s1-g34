import { Controller } from '@nestjs/common';
import { CodeRunnerService } from './code-runner.service';

@Controller()
export class CodeRunnerController {
  constructor(private readonly codeRunnerService: CodeRunnerService) {}
}
