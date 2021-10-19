import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";

import { CodeRunnerService } from "./code-runner.service";

@WebSocketGateway()
export class CodeRunnerGateway {
  constructor(private readonly codeRunnerService: CodeRunnerService) {}

  @SubscribeMessage("runCode")
  runCode(@MessageBody() data: string) {
    return this.codeRunnerService.runCode(data);
  }
}
