import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

import { RunCodeDto } from "./dto/run-code.dto";

@Injectable()
export class CodeRunnerService {
  constructor(@Inject("CODE_RUNNER_SERVICE") private natsClient: ClientProxy) {}

  runCode(runCodeDto: RunCodeDto) {
    return firstValueFrom(this.natsClient.send("runCode", runCodeDto.code));
  }
}
