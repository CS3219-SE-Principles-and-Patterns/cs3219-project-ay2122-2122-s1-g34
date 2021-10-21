import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class CodeRunnerService {
  constructor(@Inject("CODE_RUNNER_SERVICE") private natsClient: ClientProxy) {}

  runCode(code: string) {
    return firstValueFrom(this.natsClient.send("runCode", code));
  }
}